import express from 'express';
import { SwapRequest } from '../models/SwapRequest.js';
import { Skill } from '../models/Skill.js';
import { User } from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/swaps
// @desc    Get user's swap requests (both incoming and outgoing)
// @access  Private
router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { status } = req.query;

    const filter = {
      $or: [{ requester: userId }, { receiver: userId }],
    };

    if (status && status !== 'all') {
      filter.status = status;
    }

    const swaps = await SwapRequest.find(filter)
      .populate('requester', 'name email college major avatar rating badges karma')
      .populate('receiver', 'name email college major avatar rating badges karma')
      .populate('skill', 'title category level format sessionLength')
      .sort({ updatedAt: -1 });

    res.json({ swaps });
  } catch (error) {
    console.error('[Swap API Error]:', error);
    res.status(500).json({ message: 'Failed to retrieve swap requests', error: error.message });
  }
});

// @route   GET /api/swaps/:id
// @desc    Get single swap details and room messages
// @access  Private
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const swap = await SwapRequest.findById(req.params.id)
      .populate('requester', 'name email college major avatar rating badges karma')
      .populate('receiver', 'name email college major avatar rating badges karma')
      .populate('skill');

    if (!swap) {
      return res.status(404).json({ message: 'Swap request not found.' });
    }

    const isParticipant =
      swap.requester._id.toString() === req.user._id.toString() ||
      swap.receiver._id.toString() === req.user._id.toString();

    if (!isParticipant) {
      return res.status(403).json({ message: 'Access denied. You are not a participant in this swap.' });
    }

    res.json({ swap });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve swap details', error: error.message });
  }
});

// @route   POST /api/swaps
// @desc    Initiate a new skill swap request
// @access  Private
router.post('/', requireAuth, async (req, res) => {
  try {
    const { skillId, receiverId, skillOffered, skillRequested, proposedTopic, message, scheduledDate, scheduledTime } =
      req.body;

    if (!skillId || !receiverId || !skillOffered || !skillRequested) {
      return res.status(400).json({
        message: 'skillId, receiverId, skillOffered, and skillRequested are required.',
      });
    }

    if (receiverId === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot request a skill swap with yourself!' });
    }

    const newSwap = new SwapRequest({
      requester: req.user._id,
      receiver: receiverId,
      skill: skillId,
      skillOffered: skillOffered.trim(),
      skillRequested: skillRequested.trim(),
      proposedTopic: proposedTopic ? proposedTopic.trim() : 'Peer Exchange Session',
      message: message ? message.trim() : 'Hello! I would love to do a peer skill swap with you.',
      scheduledDate: scheduledDate || 'TBD',
      scheduledTime: scheduledTime || 'TBD',
      meetingLink: `https://meet.skillswap.edu/room-${Math.random().toString(36).substring(2, 9)}`,
      status: 'pending',
      messages: [
        {
          sender: req.user._id,
          senderName: req.user.name,
          text: message || 'Skill swap initiated! Looking forward to learning together.',
        },
      ],
    });

    await newSwap.save();

    const populatedSwap = await SwapRequest.findById(newSwap._id)
      .populate('requester', 'name email college major avatar rating badges karma')
      .populate('receiver', 'name email college major avatar rating badges karma')
      .populate('skill', 'title category level');

    res.status(201).json({
      message: 'Swap request sent successfully! The peer has been notified.',
      swap: populatedSwap,
    });
  } catch (error) {
    console.error('[Create Swap Error]:', error);
    res.status(500).json({ message: 'Failed to create swap request', error: error.message });
  }
});

// @route   PATCH /api/swaps/:id/status
// @desc    Accept, decline, or cancel a swap request
// @access  Private
router.patch('/:id/status', requireAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const swap = await SwapRequest.findById(req.params.id);

    if (!swap) {
      return res.status(404).json({ message: 'Swap request not found.' });
    }

    // Only receiver can accept or decline
    if (['accepted', 'declined'].includes(status)) {
      if (swap.receiver.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Only the recipient can accept or decline this swap.' });
      }
    }

    swap.status = status;

    if (status === 'accepted') {
      swap.messages.push({
        sender: req.user._id,
        senderName: req.user.name,
        text: `Awesome! I accepted the swap request. Let's schedule our exchange session!`,
      });
    }

    await swap.save();

    const populatedSwap = await SwapRequest.findById(swap._id)
      .populate('requester', 'name email college major avatar rating badges karma')
      .populate('receiver', 'name email college major avatar rating badges karma')
      .populate('skill', 'title category level');

    res.json({
      message: `Swap request ${status}!`,
      swap: populatedSwap,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update swap status', error: error.message });
  }
});

// @route   POST /api/swaps/:id/messages
// @desc    Add a message to the swap exchange room
// @access  Private
router.post('/:id/messages', requireAuth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Message text cannot be empty.' });
    }

    const swap = await SwapRequest.findById(req.params.id);
    if (!swap) {
      return res.status(404).json({ message: 'Swap not found.' });
    }

    const isParticipant =
      swap.requester.toString() === req.user._id.toString() ||
      swap.receiver.toString() === req.user._id.toString();

    if (!isParticipant) {
      return res.status(403).json({ message: 'You are not a participant in this swap.' });
    }

    const messageObj = {
      sender: req.user._id,
      senderName: req.user.name,
      text: text.trim(),
    };

    swap.messages.push(messageObj);
    await swap.save();

    res.status(201).json({
      message: 'Message sent!',
      messages: swap.messages,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to post message', error: error.message });
  }
});

// @route   PATCH /api/swaps/:id/complete
// @desc    Mark swap complete & award Karma points to both peers
// @access  Private
router.patch('/:id/complete', requireAuth, async (req, res) => {
  try {
    const swap = await SwapRequest.findById(req.params.id);
    if (!swap) return res.status(404).json({ message: 'Swap not found.' });

    swap.status = 'completed';
    await swap.save();

    // Reward both peers with +25 Karma
    await User.findByIdAndUpdate(swap.requester, { $inc: { karma: 25 } });
    await User.findByIdAndUpdate(swap.receiver, { $inc: { karma: 25 } });
    await Skill.findByIdAndUpdate(swap.skill, { $inc: { swapsCompleted: 1 } });

    res.json({
      message: 'Swap completed! Both peers received +25 Karma points!',
      swap,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to complete swap', error: error.message });
  }
});

// @route   POST /api/swaps/:id/review
// @desc    Submit endorsement review and star rating
// @access  Private
router.post('/:id/review', requireAuth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Valid rating between 1 and 5 is required.' });
    }

    const swap = await SwapRequest.findById(req.params.id);
    if (!swap) return res.status(404).json({ message: 'Swap not found.' });

    swap.review = {
      rating: Number(rating),
      comment: comment || 'Great peer learning experience!',
      submittedAt: new Date(),
    };
    await swap.save();

    // Update receiver's average rating
    const targetUserId =
      swap.requester.toString() === req.user._id.toString() ? swap.receiver : swap.requester;
    const targetUser = await User.findById(targetUserId);
    if (targetUser) {
      const currentReviews = targetUser.reviewsCount || 0;
      const currentAvg = targetUser.rating || 5.0;
      const newAvg = (currentAvg * currentReviews + Number(rating)) / (currentReviews + 1);
      targetUser.rating = Math.round(newAvg * 10) / 10;
      targetUser.reviewsCount = currentReviews + 1;
      await targetUser.save();
    }

    res.json({ message: 'Review submitted successfully!', swap });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit review', error: error.message });
  }
});

export default router;
