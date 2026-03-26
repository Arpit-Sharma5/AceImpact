const mongoose = require('mongoose');

/**
 * Score Model
 * Each user can have at most 5 scores (golf scores in range 1–45).
 * Scores are associated with a specific date and ordered by creation time.
 */
const scoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  score: {
    type: Number,
    required: [true, 'Score is required'],
    min: [1, 'Score must be at least 1'],
    max: [45, 'Score must be at most 45'],
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now,
  },
}, { timestamps: true });

// Index for fast lookup of user's scores
scoreSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Score', scoreSchema);
