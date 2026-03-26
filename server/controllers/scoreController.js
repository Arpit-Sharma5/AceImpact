const Score = require('../models/Score');

/**
 * GET /api/scores/my
 * Get the current user's scores, newest first.
 */
const getMyScores = async (req, res) => {
  try {
    const scores = await Score.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(scores);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * POST /api/scores
 * Add a new score. If user already has 5 scores, remove the oldest one.
 * Score must be between 1 and 45.
 */
const addScore = async (req, res) => {
  try {
    const { score, date } = req.body;

    // Validate score range
    if (!score || score < 1 || score > 45) {
      return res.status(400).json({ message: 'Score must be between 1 and 45' });
    }

    // Count existing scores for this user
    const existingScores = await Score.find({ userId: req.user._id })
      .sort({ createdAt: 1 }); // oldest first

    // If user already has 5 scores, remove the oldest one
    if (existingScores.length >= 5) {
      await Score.findByIdAndDelete(existingScores[0]._id);
    }

    // Create the new score
    const newScore = await Score.create({
      userId: req.user._id,
      score,
      date: date || Date.now(),
    });

    res.status(201).json(newScore);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * PUT /api/scores/:id
 * Admin: Edit any user's score.
 */
const updateScore = async (req, res) => {
  try {
    const { score, date } = req.body;
    const existing = await Score.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Score not found' });

    if (score !== undefined) {
      if (score < 1 || score > 45) return res.status(400).json({ message: 'Score must be 1-45' });
      existing.score = score;
    }
    if (date) existing.date = date;

    await existing.save();
    res.json(existing);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * DELETE /api/scores/:id
 * Admin: Delete a score.
 */
const deleteScore = async (req, res) => {
  try {
    const score = await Score.findByIdAndDelete(req.params.id);
    if (!score) return res.status(404).json({ message: 'Score not found' });
    res.json({ message: 'Score deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * GET /api/scores/all
 * Admin: Get all scores with user info.
 */
const getAllScores = async (req, res) => {
  try {
    const scores = await Score.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(scores);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getMyScores, addScore, updateScore, deleteScore, getAllScores };
