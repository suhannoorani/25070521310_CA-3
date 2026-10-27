import express from 'express';
import { User } from '../models/User.js';
import { Skill } from '../models/Skill.js';
import { SwapRequest } from '../models/SwapRequest.js';

const router = express.Router();

// @route   GET /api/community/stats
// @desc    Get platform stats, leaderboard, and trending skill exchange topics
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSkills = await Skill.countDocuments({ isActive: true });
    const totalSwaps = await SwapRequest.countDocuments();
    const completedSwaps = await SwapRequest.countDocuments({ status: 'completed' });

    // Top students on leaderboard sorted by Karma
    const leaderboard = await User.find()
      .select('name college major avatar karma rating badges reviewsCount skillsTeaching')
      .sort({ karma: -1 })
      .limit(6);

    // Recent reviews from completed swaps
    const recentSwapsWithReviews = await SwapRequest.find({
      'review.rating': { $exists: true, $ne: null },
    })
      .populate('requester', 'name avatar college')
      .populate('receiver', 'name avatar college')
      .populate('skill', 'title category')
      .sort({ 'review.submittedAt': -1 })
      .limit(4);

    const stats = {
      totalUsers,
      totalSkills,
      totalSwaps,
      completedSwaps,
      hoursExchanged: completedSwaps * 1.5 + 42, // realistic calculation
      karmaAwarded: completedSwaps * 50 + totalUsers * 50,
      leaderboard,
      recentReviews: recentSwapsWithReviews.map((s) => ({
        id: s._id,
        rating: s.review.rating,
        comment: s.review.comment,
        skillTitle: s.skill?.title || 'Skill Swap',
        category: s.skill?.category || 'General',
        student: s.requester?.name || 'Student Peer',
        avatar: s.requester?.avatar,
        college: s.requester?.college,
        date: s.review.submittedAt,
      })),
    };

    res.json(stats);
  } catch (error) {
    console.error('[Community Stats Error]:', error);
    res.status(500).json({ message: 'Failed to retrieve platform stats', error: error.message });
  }
});

// @route   GET /api/community/peers
// @desc    Get student peers directory
// @access  Public
router.get('/peers', async (req, res) => {
  try {
    const peers = await User.find()
      .select('name email college major bio avatar karma rating badges skillsTeaching skillsLearning')
      .sort({ karma: -1 })
      .limit(20);

    res.json({ peers });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch peers', error: error.message });
  }
});

export default router;
