const mongoose = require('mongoose');

/**
 * Subscription Model
 * Tracks whether a user has an active monthly or yearly subscription.
 * Used to restrict access to features if the subscription is inactive.
 */
const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  plan: {
    type: String,
    enum: ['monthly', 'yearly'],
    required: [true, 'Plan type is required'],
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'cancelled'],
    default: 'active',
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: true,
  },
  // Mock payment info (simulates Stripe)
  paymentId: {
    type: String,
    default: null,
  },
  amount: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

// Index for quick user subscription lookup
subscriptionSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('Subscription', subscriptionSchema);
