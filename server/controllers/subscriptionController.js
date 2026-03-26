const Subscription = require('../models/Subscription');

/**
 * GET /api/subscriptions/my
 * Get the current user's active subscription.
 */
const getMySubscription = async (req, res) => {
  try {
    const sub = await Subscription.findOne({
      userId: req.user._id,
      status: 'active',
    });
    res.json(sub || { status: 'none' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * POST /api/subscriptions
 * Create or renew a subscription.
 * This is a MOCK payment system simulating Stripe.
 */
const createSubscription = async (req, res) => {
  try {
    const { plan } = req.body;

    if (!['monthly', 'yearly'].includes(plan)) {
      return res.status(400).json({ message: 'Plan must be "monthly" or "yearly"' });
    }

    // Cancel any existing active subscription
    await Subscription.updateMany(
      { userId: req.user._id, status: 'active' },
      { status: 'cancelled' }
    );

    // Calculate end date based on plan
    const startDate = new Date();
    const endDate = new Date();
    if (plan === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    // Mock payment details (simulates Stripe)
    const amount = plan === 'monthly' ? 9.99 : 99.99;
    const paymentId = `mock_pay_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    const subscription = await Subscription.create({
      userId: req.user._id,
      plan,
      status: 'active',
      startDate,
      endDate,
      amount,
      paymentId,
    });

    res.status(201).json({
      subscription,
      payment: {
        id: paymentId,
        amount,
        currency: 'USD',
        status: 'succeeded',
        message: 'Mock payment processed successfully',
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * PUT /api/subscriptions/:id/cancel
 * Cancel an active subscription.
 */
const cancelSubscription = async (req, res) => {
  try {
    const sub = await Subscription.findById(req.params.id);
    if (!sub) return res.status(404).json({ message: 'Subscription not found' });

    // Only the owner or admin can cancel
    if (sub.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    sub.status = 'cancelled';
    await sub.save();
    res.json({ message: 'Subscription cancelled', subscription: sub });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * GET /api/subscriptions
 * Admin: Get all subscriptions.
 */
const getAllSubscriptions = async (req, res) => {
  try {
    const subs = await Subscription.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(subs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getMySubscription, createSubscription, cancelSubscription, getAllSubscriptions };
