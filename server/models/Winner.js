const mongoose = require('mongoose');

/**
 * Winner Model
 * Records users who matched draw numbers with their scores.
 * Tracks how many matches they got, their prize, proof uploads,
 * admin approval status, and payment status.
 */
const winnerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  drawId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Draw',
    required: true,
  },
  matchCount: {
    type: Number,
    required: true,
    min: 3,
    max: 5,
  },
  matchedNumbers: {
    type: [Number],
    default: [],
  },
  prize: {
    type: Number,
    default: 0,
  },
  proofUrl: {
    type: String,
    default: null,
  },
  adminApproved: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending',
  },
}, { timestamps: true });

winnerSchema.index({ userId: 1, drawId: 1 });

module.exports = mongoose.model('Winner', winnerSchema);
