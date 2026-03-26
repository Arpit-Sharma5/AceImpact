const mongoose = require('mongoose');

/**
 * Charity Model
 * Represents a charity organization that users can donate to.
 * Tracks the total amount raised through the platform.
 */
const charitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Charity name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  imageUrl: {
    type: String,
    default: '',
  },
  website: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    default: 'General',
  },
  totalRaised: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Charity', charitySchema);
