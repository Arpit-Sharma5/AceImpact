const Draw = require('../models/Draw');
const Score = require('../models/Score');
const Winner = require('../models/Winner');

/**
 * POST /api/draws/run
 * Admin: Run a new monthly draw.
 * Supports two modes: 'random' and 'algorithm'.
 * - Random: generates 5 random numbers between 1-45
 * - Algorithm: picks numbers based on frequency of user scores
 */
const runDraw = async (req, res) => {
  try {
    const { month, year, mode, totalPool } = req.body;

    if (!month || !year || !mode) {
      return res.status(400).json({ message: 'Month, year, and mode are required' });
    }

    // Check if draw already exists for this month/year
    const existing = await Draw.findOne({ month, year });
    if (existing) {
      return res.status(400).json({ message: 'A draw already exists for this month/year' });
    }

    let numbers;

    if (mode === 'random') {
      // Mode 1: Random number generator – pick 5 unique random numbers 1-45
      numbers = generateRandomNumbers();
    } else if (mode === 'algorithm') {
      // Mode 2: Algorithm based on frequency of user scores
      numbers = await generateAlgorithmNumbers();
    } else {
      return res.status(400).json({ message: 'Mode must be "random" or "algorithm"' });
    }

    // Create the draw
    const draw = await Draw.create({
      month,
      year,
      numbers: numbers.sort((a, b) => a - b), // Sort ascending
      mode,
      status: 'pending',
      totalPool: totalPool || 1000,
    });

    res.status(201).json(draw);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Generate 5 unique random numbers between 1 and 45.
 */
function generateRandomNumbers() {
  const nums = new Set();
  while (nums.size < 5) {
    nums.add(Math.floor(Math.random() * 45) + 1);
  }
  return Array.from(nums);
}

/**
 * Generate 5 numbers based on the frequency of scores in the database.
 * More frequently occurring scores have a higher chance of being picked.
 */
async function generateAlgorithmNumbers() {
  const allScores = await Score.find({}, 'score');

  if (allScores.length < 5) {
    // Fallback to random if not enough data
    return generateRandomNumbers();
  }

  // Count frequency of each score value
  const frequency = {};
  allScores.forEach(s => {
    frequency[s.score] = (frequency[s.score] || 0) + 1;
  });

  // Create weighted pool – scores that appear more often get more entries
  const pool = [];
  Object.entries(frequency).forEach(([num, count]) => {
    for (let i = 0; i < count; i++) {
      pool.push(parseInt(num));
    }
  });

  // Pick 5 unique numbers from the weighted pool
  const picked = new Set();
  let attempts = 0;
  while (picked.size < 5 && attempts < 1000) {
    const idx = Math.floor(Math.random() * pool.length);
    picked.add(pool[idx]);
    attempts++;
  }

  // Fill remaining with random if needed
  while (picked.size < 5) {
    picked.add(Math.floor(Math.random() * 45) + 1);
  }

  return Array.from(picked);
}

/**
 * PUT /api/draws/:id/publish
 * Admin: Publish a draw and automatically determine winners.
 * Matches user scores against draw numbers.
 * Prize distribution: 5 matches = 40%, 4 matches = 35%, 3 matches = 25%
 */
const publishDraw = async (req, res) => {
  try {
    const draw = await Draw.findById(req.params.id);
    if (!draw) return res.status(404).json({ message: 'Draw not found' });
    if (draw.status === 'published') return res.status(400).json({ message: 'Draw already published' });

    draw.status = 'published';
    await draw.save();

    // Find all users' scores and match against draw numbers
    // Get unique user IDs
    const allScores = await Score.find().populate('userId', 'name email');

    // Group scores by user
    const userScoresMap = {};
    allScores.forEach(s => {
      if (!s.userId) return;
      const uid = s.userId._id.toString();
      if (!userScoresMap[uid]) userScoresMap[uid] = [];
      userScoresMap[uid].push(s.score);
    });

    const winners = [];
    const totalPool = draw.totalPool || 1000;

    // Check each user's scores against draw numbers
    for (const [userId, scores] of Object.entries(userScoresMap)) {
      const matched = scores.filter(s => draw.numbers.includes(s));
      const matchCount = matched.length;

      if (matchCount >= 3) {
        // Calculate prize based on match count
        let prizePercentage = 0;
        if (matchCount === 5) prizePercentage = 0.4;      // 40% – jackpot
        else if (matchCount === 4) prizePercentage = 0.35; // 35%
        else if (matchCount === 3) prizePercentage = 0.25; // 25%

        const prize = totalPool * prizePercentage;

        const winner = await Winner.create({
          userId,
          drawId: draw._id,
          matchCount,
          matchedNumbers: matched,
          prize,
        });
        winners.push(winner);
      }
    }

    // If no one matched 5, add to jackpot rollover
    const has5Match = winners.some(w => w.matchCount === 5);
    if (!has5Match) {
      draw.jackpotRollover += totalPool * 0.4;
      await draw.save();
    }

    res.json({
      message: 'Draw published successfully',
      draw,
      winnersFound: winners.length,
      winners,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * GET /api/draws
 * Get all draws, newest first.
 */
const getAllDraws = async (req, res) => {
  try {
    const draws = await Draw.find().sort({ createdAt: -1 });
    res.json(draws);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * GET /api/draws/:id
 * Get a single draw by ID.
 */
const getDrawById = async (req, res) => {
  try {
    const draw = await Draw.findById(req.params.id);
    if (!draw) return res.status(404).json({ message: 'Draw not found' });
    res.json(draw);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { runDraw, publishDraw, getAllDraws, getDrawById };
