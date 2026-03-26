const User = require('../models/User');
const Score = require('../models/Score');
const Subscription = require('../models/Subscription');

/**
 * GET /api/users
 * Admin: Get all users with their subscription status.
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .populate('selectedCharity', 'name')
      .sort({ createdAt: -1 });

    // Attach subscription status to each user
    const usersWithSub = await Promise.all(
      users.map(async (user) => {
        const sub = await Subscription.findOne({ userId: user._id, status: 'active' });
        const scoreCount = await Score.countDocuments({ userId: user._id });
        return {
          ...user.toObject(),
          subscriptionStatus: sub ? sub.status : 'none',
          subscriptionPlan: sub ? sub.plan : null,
          scoreCount,
        };
      })
    );

    res.json(usersWithSub);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * PUT /api/users/:id
 * Admin: Update a user's profile.
 */
const updateUser = async (req, res) => {
  try {
    const { name, email, role, charityPercentage } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (charityPercentage) user.charityPercentage = charityPercentage;

    await user.save();
    res.json({ message: 'User updated', user: { ...user.toObject(), password: undefined } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * DELETE /api/users/:id
 * Admin: Delete a user and their associated data.
 */
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Remove associated data
    await Score.deleteMany({ userId: user._id });
    await Subscription.deleteMany({ userId: user._id });
    await User.findByIdAndDelete(user._id);

    res.json({ message: 'User and associated data deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * PUT /api/users/profile
 * User: Update own profile (charity selection & percentage).
 */
const updateProfile = async (req, res) => {
  try {
    const { selectedCharity, charityPercentage, name } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (selectedCharity) user.selectedCharity = selectedCharity;
    if (charityPercentage !== undefined) {
      if (charityPercentage < 10) {
        return res.status(400).json({ message: 'Minimum charity contribution is 10%' });
      }
      user.charityPercentage = charityPercentage;
    }

    await user.save();
    const updated = await User.findById(user._id).select('-password').populate('selectedCharity', 'name');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getAllUsers, updateUser, deleteUser, updateProfile };
