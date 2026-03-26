const Charity = require('../models/Charity');

/**
 * GET /api/charities
 * Get all active charities.
 */
const getAllCharities = async (req, res) => {
  try {
    const charities = await Charity.find({ isActive: true }).sort({ name: 1 });
    res.json(charities);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * GET /api/charities/:id
 * Get a single charity by ID.
 */
const getCharityById = async (req, res) => {
  try {
    const charity = await Charity.findById(req.params.id);
    if (!charity) return res.status(404).json({ message: 'Charity not found' });
    res.json(charity);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * POST /api/charities
 * Admin: Create a new charity.
 */
const createCharity = async (req, res) => {
  try {
    const { name, description, imageUrl, website, category } = req.body;
    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required' });
    }
    const charity = await Charity.create({ name, description, imageUrl, website, category });
    res.status(201).json(charity);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * PUT /api/charities/:id
 * Admin: Update a charity.
 */
const updateCharity = async (req, res) => {
  try {
    const charity = await Charity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!charity) return res.status(404).json({ message: 'Charity not found' });
    res.json(charity);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * DELETE /api/charities/:id
 * Admin: Soft-delete a charity (mark as inactive).
 */
const deleteCharity = async (req, res) => {
  try {
    const charity = await Charity.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!charity) return res.status(404).json({ message: 'Charity not found' });
    res.json({ message: 'Charity deactivated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * GET /api/charities/admin/all
 * Admin: Get all charities including inactive ones.
 */
const getAllCharitiesAdmin = async (req, res) => {
  try {
    const charities = await Charity.find().sort({ name: 1 });
    res.json(charities);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getAllCharities, getCharityById, createCharity, updateCharity, deleteCharity, getAllCharitiesAdmin };
