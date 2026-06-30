import express from 'express';
import multer from 'multer';
import { authenticateJWT, requireAdmin } from '../middleware/auth.js';
import Competition from '../models/Competition.js';
import Question from '../models/Question.js';
import { User } from '../models/User.js';
import Participation from '../models/Participation.js';
import ActivityLog from '../models/ActivityLog.js';
import { calculateRemainingTime, utcToLocal } from '../utils/timeUtils.js';
import { sampleQuestions } from '../data/sampleQuestions.js';
import { config } from '../config/index.js';
import { execFile } from 'child_process';
import { uploadRecording, getPresignedUploadUrl, configureCors, uploadSnapshot, uploadAudioChunk } from '../services/doSpaces.js';

const router = express.Router();

// Get competition config
router.get('/config', authenticateJWT, async (req, res) => {
  try {
    // Get competition config from environment variables
    const now = new Date();
    
    // Parse the competition start time from environment variable and convert to local time
    let startTime;
    if (process.env.COMPETITION_START_TIME) {
      startTime = new Date(process.env.COMPETITION_START_TIME);
    } else {
      // Default: 5 minutes ago (for testing)
      startTime = new Date(now.getTime() - 1000 * 60 * 5);
    }
    
    // Calculate entrance deadline based on environment variable or default
    const entranceTimeSeconds = parseInt(process.env.COMPETITION_ENTRANCE_TIME || '1800', 10); // Default: 30 minutes
    const entranceDeadline = new Date(startTime.getTime() + entranceTimeSeconds * 1000);
    
    // Calculate competition length from environment variable or default
    const competitionLength = parseInt(process.env.COMPETITION_LENGTH || '300', 10); // Default: 5 minutes
    
    // Calculate absolute end time
    const absoluteEndTime = new Date(startTime.getTime() + competitionLength * 1000);
    
    let status = 'upcoming';
    if (now >= startTime && now < entranceDeadline) {
      status = 'in_progress_can_enter';
    } else if (now >= entranceDeadline && now < absoluteEndTime) {
      status = 'in_progress_no_entry';
    } else if (now >= absoluteEndTime) {
      status = 'ended';
    }
    
    // Debug info
    const timeUntilStart = Math.floor((startTime - now) / 1000);
    const timeUntilEntranceEnd = Math.floor((entranceDeadline - now) / 1000);
    const timeUntilEnd = Math.floor((absoluteEndTime - now) / 1000);
    
    // Return all times in UTC ISO format
    return res.json({
      success: true,
      data: {
        startTime: startTime.toISOString(),
        entranceDeadline: entranceDeadline.toISOString(),
        absoluteEndTime: absoluteEndTime.toISOString(),
        competitionLength,
        status,
        currentServerTime: now.toISOString(),
        debug: {
          timeUntilStart,
          timeUntilEntranceEnd,
          timeUntilEnd,
          serverTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          serverOffset: -new Date().getTimezoneOffset()
        }
      }
    });
  } catch (error) {
    console.error('Error getting competition config:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user competition status
router.get('/status', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    const competitionLength = parseInt(process.env.COMPETITION_LENGTH || '300', 10);
    
    // Check for completed participation first
    const completedParticipation = await Participation.findOne({
      user: userId,
      status: 'completed'
    });
    
    if (completedParticipation) {
      return res.json({
        status: 'completed',
        startTime: completedParticipation.startTime,
        endTime: completedParticipation.endTime,
        timeRemaining: 0
      });
    }
    
    // Then check for active participation
    const participation = await Participation.findOne({
      user: userId,
      status: 'active'
    });
    
    if (participation) {
      return res.json({
        status: 'active',
        startTime: participation.startTime,
        endTime: participation.endTime || new Date(participation.startTime.getTime() + competitionLength * 1000),
        timeRemaining: participation.timeRemaining || competitionLength
      });
    }
    
    return res.json({ status: 'not_started' });
  } catch (error) {
    console.error('Error getting user status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Start competition
router.post('/start', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    const competitionLength = parseInt(process.env.COMPETITION_LENGTH || '300', 10);

    // Check if user has already completed or is participating
    const existingParticipation = await Participation.findOne({
      user: userId,
      $or: [{ status: 'active' }, { status: 'completed' }]
    });

    if (existingParticipation) {
      if (existingParticipation.status === 'completed') {
        return res.status(403).json({ 
          message: 'You have already completed the competition. Multiple attempts are not allowed.',
          completed: true,
          participation: existingParticipation
        });
      } else {
        return res.status(400).json({ 
          message: 'You already have an active competition session.',
          active: true,
          participation: existingParticipation
        });
      }
    }

    // Create new participation
    const participation = new Participation({
      user: userId,
      startTime: new Date(),
      status: 'active',
      timeRemaining: competitionLength
    });

    await participation.save();

    const subjectMap = { phys: 'Physics', chem: 'Chemistry', math: 'Mathematics', bio: 'Biology', cs: 'Computer Science' };
    const difficultyMap = { e: 'Easy', m: 'Moderate', a: 'Advanced' };

    const questions = sampleQuestions.map(q => {
      const parts = q._id.split('_');
      const subject = subjectMap[parts[0]] || 'General';
      const difficulty = difficultyMap[parts[1]?.[0]] || 'Unknown';
      return {
        _id: q._id,
        text: q.text,
        type: q.type,
        subject,
        difficulty,
        options: q.type === 'mcq' ? q.options : undefined,
        language: q.language,
        starterCode: q.starterCode,
        points: q.points,
        testCases: q.testCases ? q.testCases.map(tc => ({ input: tc.input })) : undefined
      };
    });

    return res.json({
      message: 'Competition started successfully',
      participation: {
        id: participation._id,
        startTime: participation.startTime,
        timeRemaining: participation.timeRemaining
      },
      questions
    });
  } catch (error) {
    console.error('Error starting competition:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Get competition progress
router.get('/progress', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    const competitionLength = parseInt(process.env.COMPETITION_LENGTH || '300', 10);
    
    // Check if user has already completed a participation
    const completedParticipation = await Participation.findOne({
      user: userId,
      status: 'completed'
    });

    if (completedParticipation) {
      return res.json({ 
        status: 'completed',
        participation: completedParticipation
      });
    }

    // Find active participation
    let participation = await Participation.findOne({
      user: userId,
      status: 'active'
    });

    if (!participation) {
      return res.json({ status: 'not_started' });
    }
    
    // Calculate remaining time
    const now = new Date();
    const endTime = participation.endTime || new Date(participation.startTime.getTime() + competitionLength * 1000);
    const timeRemaining = Math.max(0, Math.floor((endTime - now) / 1000));
    
    // Only return timeRemaining of 0 if the competition has actually ended
    const effectiveTimeRemaining = now >= endTime ? 0 : timeRemaining;

    return res.json({
      status: 'active',
      startTime: participation.startTime,
      endTime: endTime,
      timeRemaining: effectiveTimeRemaining,
      answers: participation.answers || []
    });
  } catch (error) {
    console.error('Error getting competition progress:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Submit an answer
router.post('/submit/:questionId', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    const { questionId } = req.params;
    const { answer, type } = req.body;
    
    // Check if user has already completed
    const completedParticipation = await Participation.findOne({
      user: userId,
      status: 'completed'
    });

    if (completedParticipation) {
      return res.status(403).json({ 
        message: 'You have already completed the competition. Multiple attempts are not allowed.',
        completed: true
      });
    }

    // Find active participation
    let participation = await Participation.findOne({
      user: userId,
      status: 'active'
    });
    
    if (!participation) {
      return res.status(404).json({ message: 'No active competition found' });
    }

    // Validate the answer based on question type
    const question = sampleQuestions.find(q => q._id === questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Normalize the answer based on question type
    let normalizedAnswer = answer;
    if (type === 'mcq' || type === 'text') {
      normalizedAnswer = String(answer).trim();
    }

    // Don't save empty answers
    if (normalizedAnswer === undefined || normalizedAnswer === null || normalizedAnswer === '') {
      return res.status(400).json({ message: 'Answer cannot be empty' });
    }
    
    // Update the answer
    const answerIndex = participation.answers.findIndex(a => a.question === questionId);
    
    if (answerIndex !== -1) {
      participation.answers[answerIndex].answer = normalizedAnswer;
      participation.answers[answerIndex].submittedAt = new Date();
    } else {
      participation.answers.push({
        question: questionId,
        answer: normalizedAnswer,
        submittedAt: new Date()
      });
    }
    
    await participation.save();
    
    return res.json({ 
      message: 'Answer submitted successfully',
      questionId,
      answer: normalizedAnswer,
      submittedAt: new Date()
    });
  } catch (error) {
    console.error('Error submitting answer:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Log suspicious activity
router.post('/log-activity', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, timestamp, details, warningCount } = req.body;
    
    // Get the user's active participation
    const participation = await Participation.findOne({ 
      user: userId,
      status: 'active'
    });
    
    // Create activity log
    const activityLog = new ActivityLog({
      user: userId,
      participation: participation ? participation._id : null,
      type,
      timestamp: timestamp || new Date(),
      details,
      warningCount,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
    
    await activityLog.save();
    
    // If there are too many warnings, auto-submit the exam
    if (warningCount && warningCount > 3 && participation) {
      participation.status = 'completed';
      participation.endTime = new Date();
      participation.notes = `Auto-submitted due to ${warningCount} suspicious activity warnings`;
      await participation.save();
    }
    
    return res.json({ message: 'Activity logged' });
  } catch (error) {
    console.error('Error logging activity:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Get competition results
router.get('/results', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    const competitionLength = parseInt(process.env.COMPETITION_LENGTH || '300', 10);
    
    // Find active or completed participation
    const participation = await Participation.findOne({
      user: userId,
      $or: [{ status: 'active' }, { status: 'completed' }]
    });
    
    if (!participation) {
      return res.status(404).json({ message: 'No competition results found' });
    }
    
    // Get all questions
    const questions = sampleQuestions;
    
    // Create a map of answers for quick lookup
    const answersMap = {};
    if (Array.isArray(participation.answers)) {
      participation.answers.forEach(answer => {
        if (answer && answer.question) {
          answersMap[answer.question] = {
            answer: answer.answer,
            submittedAt: answer.submittedAt
          };
        }
      });
    }
    
    // Map questions with user answers
    const results = questions.map(question => {
      const answer = answersMap[question._id] || {};
      const answerValue = answer.answer || '';

      // For MCQ questions, verify that the answer is one of the options
      let normalizedAnswer = answerValue;
      if (question.type === 'mcq' && Array.isArray(question.options)) {
        normalizedAnswer = question.options.includes(answerValue) ? answerValue : '';
      }

      return {
        questionId: question._id,
        questionText: question.text,
        yourAnswer: normalizedAnswer,
        submittedAt: answer.submittedAt,
        type: question.type,
        points: question.points,
        options: question.type === 'mcq' ? question.options : undefined
      };
    });

    // Calculate actual answered count
    const answeredCount = results.filter(result => 
      result.yourAnswer && result.yourAnswer.trim() !== ''
    ).length;

    // Calculate time spent
    const endTime = participation.endTime || new Date();
    const timeSpent = Math.floor((endTime - participation.startTime) / (1000 * 60)); // in minutes

    // Log the results for debugging
    console.log('Processed results:', {
      totalQuestions: questions.length,
      answeredQuestions: answeredCount,
      answers: results.map(r => ({
        questionId: r.questionId,
        type: r.type,
        answer: r.yourAnswer
      }))
    });

    return res.json({
      totalQuestions: questions.length,
      questions: questions,
      userAnswers: results,
      answeredQuestions: answeredCount,
      startTime: participation.startTime,
      endTime: participation.endTime || new Date(participation.startTime.getTime() + competitionLength * 1000),
      submissionTime: participation.updatedAt || new Date(),
      status: participation.status,
      timeSpent: timeSpent
    });
  } catch (error) {
    console.error('Error fetching results:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Finish competition
router.post('/finish', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    const { answers, submissionMethod } = req.body;
    
    // Find the user's active participation
    const participation = await Participation.findOne({ 
      user: userId,
      status: 'active'
    });
    
    if (!participation) {
      return res.status(404).json({ message: 'No active competition found' });
    }
    
    // If answers array is provided, upsert all entries (answered + unanswered)
    if (Array.isArray(answers) && answers.length > 0) {
      for (const { questionId, answer } of answers) {
        const answerIndex = participation.answers.findIndex(a => a.question === questionId);
        const answerValue = answer ?? '';
        if (answerIndex !== -1) {
          participation.answers[answerIndex].answer = answerValue;
          participation.answers[answerIndex].submittedAt = new Date();
        } else {
          participation.answers.push({
            question: questionId,
            answer: answerValue,
            submittedAt: new Date()
          });
        }
      }
    }
    
    // Update participation status to completed
    participation.status = 'completed';
    participation.endTime = new Date();
    participation.notes = submissionMethod || 'normal';
    await participation.save();
    
    return res.json({ 
      message: 'Competition completed successfully',
      endTime: participation.endTime
    });
  } catch (error) {
    console.error('Error finishing competition:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Run user code (sandboxed execution)
router.post('/run-code', authenticateJWT, async (req, res) => {
  const { code, input } = req.body;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ message: 'Code is required' });
  }

  const maxOutput = 10240;
  const timeout = 10000;

  try {
    const stdout = await new Promise((resolve, reject) => {
      execFile('python3', ['-c', code], {
        timeout,
        maxBuffer: maxOutput,
        input: input || '',
        env: { ...process.env, PYTHONUNBUFFERED: '1' }
      }, (err, out, errOut) => {
        if (err) {
          if (err.killed) return reject(new Error('timed out'));
          return reject(err);
        }
        resolve({ stdout: out, stderr: errOut });
      });
    });

    return res.json(stdout);
  } catch (err) {
    const message = err.code === 'ENOENT' ? 'Python3 not found on server'
      : err.message === 'timed out' ? 'Execution timed out (10s limit)'
      : 'Error executing code';
    return res.status(500).json({ message });
  }
});

// Development reset endpoint (admin only)
router.post('/dev/reset', authenticateJWT, requireAdmin, async (req, res) => {
  try {
    // Reset all participations
    await Participation.deleteMany({});
    
    // Reset all activity logs
    await ActivityLog.deleteMany({});

    // Reset user competition data
    await User.updateMany({}, {
      $unset: {
        lastParticipation: "",
        competitionStatus: ""
      }
    });

    return res.json({
      success: true,
      message: 'Competition data has been reset'
    });
  } catch (error) {
    console.error('Error resetting competition:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 500 * 1024 * 1024 } });

router.post('/upload-recording', authenticateJWT, upload.single('recording'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No recording file provided' });
    }
    const recordingType = req.body.type || 'unknown';
    const userId = req.user.id;
    const timestamp = Date.now();
    const ext = '.webm';
    const filename = `${userId}-${recordingType}-${timestamp}${ext}`;

    const { url, key } = await uploadRecording(req.file.buffer, filename, req.file.mimetype);
    console.log(`Recording uploaded to DO Spaces: ${key} (${recordingType}, ${req.file.size} bytes)`);

    return res.json({ success: true, url, key, size: req.file.size });
  } catch (error) {
    console.error('Error uploading recording:', error);
    return res.status(500).json({ success: false, error: 'Failed to upload recording' });
  }
});

// Get pre-signed upload URL for direct browser-to-Spaces upload
router.get('/upload-url', authenticateJWT, async (req, res) => {
  try {
    const recordingType = req.query.type || 'unknown';
    const userId = req.user.id;
    const timestamp = Date.now();
    const filename = `${userId}-${recordingType}-${timestamp}.webm`;

    const { url, key } = await getPresignedUploadUrl(filename);
    return res.json({ success: true, url, key });
  } catch (error) {
    console.error('Error generating upload URL:', error);
    return res.status(500).json({ success: false, error: 'Failed to generate upload URL' });
  }
});

// Configure DO Spaces CORS (admin only, one-time setup)
router.post('/setup-spaces-cors', authenticateJWT, requireAdmin, async (req, res) => {
  try {
    const allowedOrigins = [
      process.env.CLIENT_URL || 'http://localhost:3000',
      'http://localhost:5173',
    ];
    await configureCors(allowedOrigins);
    return res.json({ success: true, message: 'DO Spaces CORS configured', origins: allowedOrigins });
  } catch (error) {
    console.error('Error configuring Spaces CORS:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Upload proctoring snapshot image
router.post('/upload-snapshot', authenticateJWT, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image provided' });
    }

    const email = req.user.email;
    const timestamp = Date.now();
    const { key } = await uploadSnapshot(req.file.buffer, email, timestamp);

    console.log(`Snapshot uploaded to DO Spaces: ${key} (${req.file.size} bytes)`);
    return res.json({ success: true, key });
  } catch (error) {
    console.error('Error uploading snapshot:', error);
    return res.status(500).json({ success: false, error: 'Failed to upload snapshot' });
  }
});

// Upload proctoring audio chunk
router.post('/upload-audio', authenticateJWT, upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No audio provided' });
    }

    const email = req.user.email;
    const timestamp = Date.now();
    const { key } = await uploadAudioChunk(req.file.buffer, email, timestamp);

    console.log(`Audio uploaded to DO Spaces: ${key} (${req.file.size} bytes)`);
    return res.json({ success: true, key });
  } catch (error) {
    console.error('Error uploading audio:', error);
    return res.status(500).json({ success: false, error: 'Failed to upload audio' });
  }
});

export default router; 