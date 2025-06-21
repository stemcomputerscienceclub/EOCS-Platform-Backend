import express from 'express';
import { authenticateJWT, requireAdmin } from '../middleware/auth.js';
import Competition from '../models/Competition.js';
import Question from '../models/Question.js';
import { User } from '../models/User.js';
import Participation from '../models/Participation.js';
import ActivityLog from '../models/ActivityLog.js';
import { calculateRemainingTime, utcToLocal } from '../utils/timeUtils.js';
import { sampleQuestions } from '../data/sampleQuestions.js';
import { config } from '../config/index.js';

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
    
    // For demo, just check if there's a participation entry
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

    // Get questions
    const questions = sampleQuestions.map(q => ({
      _id: q._id,
      text: q.text,
      type: q.type,
      options: q.type === 'mcq' ? q.options : undefined,
      language: q.language,
      starterCode: q.starterCode,
      points: q.points,
      testCases: q.testCases ? q.testCases.map(tc => ({ input: tc.input })) : undefined
    }));

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
    
    // Find the user's active participation
    const participation = await Participation.findOne({ 
      user: userId,
      status: 'active'
    });
    
    if (!participation) {
      return res.status(404).json({ message: 'No active competition found' });
    }
    
    // Update participation status to completed
    participation.status = 'completed';
    participation.endTime = new Date();
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

export default router; 