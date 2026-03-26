const mongoose = require('mongoose');

/**
 * Draw Model
 * Represents a monthly draw with 5 winning numbers (1–45).
 * Can be generated via random number generator or algorithm mode.
 * Admin publishes the draw after running it.
 */
const drawSchema = new mongoose.Schema({
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12,
  },
  year: {
    type: Number,
    required: true,
  },
  numbers: {
    type: [Number],
    validate: {
      validator: (arr) => arr.length === 5 && arr.every(n => n >= 1 && n <= 45),
      message: 'Draw must have exactly 5 numbers between 1 and 45',
    },
  },
  mode: {
    type: String,
    enum: ['random', 'algorithm'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'published'],
    default: 'pending',
  },
  // Prize pool info
  totalPool: {
    type: Number,
    default: 0,
  },
  jackpotRollover: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

// Unique constraint: only one draw per month/year
drawSchema.index({ month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Draw', drawSchema);
