/**
 * Seed Script – Populates the database with:
 * 1. An admin user (admin@aceimpact.com / admin123)
 * 2. Sample charities
 *
 * Run with: node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Charity = require('./models/Charity');

const charities = [
  {
    name: 'Golf for Good',
    description: 'Bringing golf to underprivileged communities. We provide equipment, coaching, and access to golf courses for young people who otherwise wouldn\'t have the opportunity to play.',
    imageUrl: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400',
    website: 'https://example.com/golfforgood',
    category: 'Youth Development',
  },
  {
    name: 'Green Fairways Foundation',
    description: 'Dedicated to environmental sustainability in golf. We work with courses worldwide to implement eco-friendly practices and protect natural habitats.',
    imageUrl: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=400',
    website: 'https://example.com/greenfairways',
    category: 'Environment',
  },
  {
    name: 'Swing for Health',
    description: 'Using golf as a tool for physical and mental health rehabilitation. Our programs help veterans, seniors, and people recovering from injuries.',
    imageUrl: 'https://images.unsplash.com/photo-1592919505780-303950717480?w=400',
    website: 'https://example.com/swingforhealth',
    category: 'Health',
  },
  {
    name: 'Tee It Forward',
    description: 'Making golf accessible for people with disabilities. We design adaptive equipment and run inclusive tournaments that celebrate everyone\'s abilities.',
    imageUrl: 'https://images.unsplash.com/photo-1622819584099-e04ccb14e8a7?w=400',
    website: 'https://example.com/teeitforward',
    category: 'Accessibility',
  },
  {
    name: 'Junior Links Academy',
    description: 'Scholarship programs for talented young golfers from low-income families. We cover tournament fees, coaching, and travel expenses.',
    imageUrl: 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400',
    website: 'https://example.com/juniorlinks',
    category: 'Education',
  },
  {
    name: 'Fairway to Hope',
    description: 'Using golf charity events to raise funds for cancer research. Every birdie counts in the fight against cancer.',
    imageUrl: 'https://images.unsplash.com/photo-1530028828-25e8270793c5?w=400',
    website: 'https://example.com/fairwaytohope',
    category: 'Health',
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Charity.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@aceimpact.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log(`Admin created: ${admin.email} (password: admin123)`);

    // Create sample user
    const user = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'user123',
      role: 'user',
    });
    console.log(`User created: ${user.email} (password: user123)`);

    // Create charities
    const created = await Charity.insertMany(charities);
    console.log(`${created.length} charities created`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\nLogin credentials:');
    console.log('  Admin: admin@aceimpact.com / admin123');
    console.log('  User:  john@example.com / user123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
