const path = require('path');
const Winner = require('../models/Winner');

/**
 * GET /api/winners/my
 * Get the current user's winning history.
 */
const getMyWinnings = async (req, res) => {
  try {
    const winners = await Winner.find({ userId: req.user._id })
      .populate('drawId', 'month year numbers')
      .sort({ createdAt: -1 });
    res.json(winners);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * GET /api/winners
 * Admin: Get all winners with user and draw info.
 */
const getAllWinners = async (req, res) => {
  try {
    const winners = await Winner.find()
      .populate('userId', 'name email')
      .populate('drawId', 'month year numbers')
      .sort({ createdAt: -1 });
    res.json(winners);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * PUT /api/winners/:id/approve
 * Admin: Approve a winner's claim.
 */
const approveWinner = async (req, res) => {
  try {
    const winner = await Winner.findByIdAndUpdate(
      req.params.id,
      { adminApproved: 'approved' },
      { new: true }
    );
    if (!winner) return res.status(404).json({ message: 'Winner not found' });
    res.json({ message: 'Winner approved', winner });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * PUT /api/winners/:id/reject
 * Admin: Reject a winner's claim.
 */
const rejectWinner = async (req, res) => {
  try {
    const winner = await Winner.findByIdAndUpdate(
      req.params.id,
      { adminApproved: 'rejected' },
      { new: true }
    );
    if (!winner) return res.status(404).json({ message: 'Winner not found' });
    res.json({ message: 'Winner rejected', winner });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * PUT /api/winners/:id/pay
 * Admin: Mark a winner as paid.
 */
const markPaid = async (req, res) => {
  try {
    const winner = await Winner.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: 'paid' },
      { new: true }
    );
    if (!winner) return res.status(404).json({ message: 'Winner not found' });
    res.json({ message: 'Payment marked as paid', winner });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * POST /api/winners/:id/proof
 * User: Upload proof for a winning claim.
 * Uses multer for file upload (configured in routes).
 */
const uploadProof = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const winner = await Winner.findById(req.params.id);
    if (!winner) return res.status(404).json({ message: 'Winner record not found' });

    // Check that this winner belongs to the current user
    if (winner.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Store the file path
    winner.proofUrl = `/uploads/${req.file.filename}`;
    await winner.save();

    res.json({ message: 'Proof uploaded successfully', proofUrl: winner.proofUrl });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getMyWinnings, getAllWinners, approveWinner, rejectWinner, markPaid, uploadProof };
