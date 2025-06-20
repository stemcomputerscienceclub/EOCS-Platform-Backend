const Competition = require('../models/Competition');
const Question = require('../models/Question');

// @desc    Get all competitions
// @route   GET /api/competitions
// @access  Public
exports.getCompetitions = async (req, res, next) => {
  try {
    const competitions = await Competition.find()
      .select('title description startTime duration status')
      .sort('-startTime');

    res.status(200).json({
      success: true,
      count: competitions.length,
      data: competitions
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single competition
// @route   GET /api/competitions/:id
// @access  Public
exports.getCompetition = async (req, res, next) => {
  try {
    const competition = await Competition.findById(req.params.id);

    if (!competition) {
      return res.status(404).json({
        success: false,
        message: 'Competition not found'
      });
    }

    res.status(200).json({
      success: true,
      data: competition
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create competition
// @route   POST /api/competitions
// @access  Private/Admin
exports.createCompetition = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.id;
    const competition = await Competition.create(req.body);

    res.status(201).json({
      success: true,
      data: competition
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update competition
// @route   PUT /api/competitions/:id
// @access  Private/Admin
exports.updateCompetition = async (req, res, next) => {
  try {
    let competition = await Competition.findById(req.params.id);

    if (!competition) {
      return res.status(404).json({
        success: false,
        message: 'Competition not found'
      });
    }

    // Prevent modification of active or completed competitions
    if (['active', 'completed'].includes(competition.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify active or completed competitions'
      });
    }

    competition = await Competition.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: competition
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete competition
// @route   DELETE /api/competitions/:id
// @access  Private/Admin
exports.deleteCompetition = async (req, res, next) => {
  try {
    const competition = await Competition.findById(req.params.id);

    if (!competition) {
      return res.status(404).json({
        success: false,
        message: 'Competition not found'
      });
    }

    // Prevent deletion of active or completed competitions
    if (['active', 'completed'].includes(competition.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete active or completed competitions'
      });
    }

    await competition.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Join competition
// @route   POST /api/competitions/:id/join
// @access  Private
exports.joinCompetition = async (req, res, next) => {
  try {
    const competition = await Competition.findById(req.params.id);

    if (!competition) {
      return res.status(404).json({
        success: false,
        message: 'Competition not found'
      });
    }

    // Check if competition is active
    if (!competition.isActive()) {
      return res.status(400).json({
        success: false,
        message: 'Competition is not active'
      });
    }

    // Check if user can join
    if (!competition.canJoin(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'You cannot join this competition'
      });
    }

    // Add participant
    competition.participants.push({
      user: req.user.id,
      joinTime: Date.now(),
      status: 'started'
    });

    await competition.save();

    res.status(200).json({
      success: true,
      message: 'Successfully joined competition'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Submit answer
// @route   POST /api/competitions/:id/submit/:questionId
// @access  Private
exports.submitAnswer = async (req, res, next) => {
  try {
    const competition = await Competition.findById(req.params.id);
    const question = await Question.findById(req.params.questionId).select('+correctAnswer');

    if (!competition || !question) {
      return res.status(404).json({
        success: false,
        message: 'Competition or question not found'
      });
    }

    // Find participant
    const participant = competition.participants.find(
      p => p.user.toString() === req.user.id.toString()
    );

    if (!participant || participant.status !== 'started') {
      return res.status(400).json({
        success: false,
        message: 'You are not an active participant'
      });
    }

    // Validate answer
    const { isCorrect, points } = question.validateAnswer(req.body.answer);

    // Add answer to participant's answers
    participant.answers.push({
      question: question._id,
      answer: req.body.answer,
      isCorrect,
      points,
      submittedAt: Date.now()
    });

    // Update participant's score
    if (points) {
      participant.score += points;
    }

    await competition.save();

    res.status(200).json({
      success: true,
      data: {
        isCorrect,
        points
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Finish competition
// @route   POST /api/competitions/:id/finish
// @access  Private
exports.finishCompetition = async (req, res, next) => {
  try {
    const competition = await Competition.findById(req.params.id);

    if (!competition) {
      return res.status(404).json({
        success: false,
        message: 'Competition not found'
      });
    }

    // Find participant
    const participant = competition.participants.find(
      p => p.user.toString() === req.user.id.toString()
    );

    if (!participant || participant.status !== 'started') {
      return res.status(400).json({
        success: false,
        message: 'You are not an active participant'
      });
    }

    participant.status = 'completed';
    participant.submissionTime = Date.now();

    await competition.save();

    res.status(200).json({
      success: true,
      message: 'Competition completed successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get competition status
// @route   GET /api/competitions/:id/status
// @access  Private
exports.getCompetitionStatus = async (req, res, next) => {
  try {
    const competition = await Competition.findById(req.params.id);

    if (!competition) {
      return res.status(404).json({
        success: false,
        message: 'Competition not found'
      });
    }

    const participant = competition.participants.find(
      p => p.user.toString() === req.user.id.toString()
    );

    res.status(200).json({
      success: true,
      data: {
        status: competition.status,
        isActive: competition.isActive(),
        timeRemaining: competition.startTime.getTime() + competition.duration * 60000 - Date.now(),
        participantStatus: participant ? participant.status : null
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get participant progress
// @route   GET /api/competitions/:id/progress
// @access  Private
exports.getParticipantProgress = async (req, res, next) => {
  try {
    const competition = await Competition.findById(req.params.id);

    if (!competition) {
      return res.status(404).json({
        success: false,
        message: 'Competition not found'
      });
    }

    const participant = competition.participants.find(
      p => p.user.toString() === req.user.id.toString()
    );

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'Participant not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        status: participant.status,
        score: participant.score,
        answeredQuestions: participant.answers.length,
        totalQuestions: competition.questions.length,
        timeSpent: participant.submissionTime 
          ? participant.submissionTime - participant.joinTime
          : Date.now() - participant.joinTime
      }
    });
  } catch (err) {
    next(err);
  }
}; 