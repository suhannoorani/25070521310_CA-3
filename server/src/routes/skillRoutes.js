import express from 'express';
import { Skill } from '../models/Skill.js';
import { User } from '../models/User.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/skills
// @desc    Get skill listings with filters & search
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, search, level, format, college } = req.query;
    const filter = { isActive: true };

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (level && level !== 'All') {
      filter.level = level;
    }

    if (format && format !== 'All') {
      filter.format = format;
    }

    if (college && college !== 'All') {
      filter.college = new RegExp(college, 'i');
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skillWanted: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const skills = await Skill.find(filter)
      .populate('user', 'name email college major avatar rating badges karma')
      .sort({ createdAt: -1 });

    res.json({ skills, count: skills.length });
  } catch (error) {
    console.error('[Skill API Error]:', error);
    res.status(500).json({ message: 'Failed to retrieve skills', error: error.message });
  }
});

// @route   GET /api/skills/:id
// @desc    Get skill by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id).populate(
      'user',
      'name email college major bio avatar rating reviewsCount badges karma'
    );
    if (!skill) {
      return res.status(404).json({ message: 'Skill listing not found.' });
    }
    res.json({ skill });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve skill', error: error.message });
  }
});

// @route   POST /api/skills
// @desc    Create a new skill offering
// @access  Private
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, category, description, skillWanted, level, format, sessionLength, tags } = req.body;

    if (!title || !description || !skillWanted) {
      return res.status(400).json({ message: 'Title, description, and skillWanted are required.' });
    }

    const newSkill = new Skill({
      title: title.trim(),
      category: category || 'Code & Tech',
      description: description.trim(),
      skillWanted: skillWanted.trim(),
      level: level || 'All Levels',
      format: format || 'Online / Video Call',
      sessionLength: sessionLength || '45 mins',
      college: req.user.college || 'Campus Member',
      user: req.user._id,
      tags: Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t) => t.trim()) : [],
    });

    await newSkill.save();

    // Reward user with 10 karma points for sharing knowledge
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { karma: 10 },
      $addToSet: { skillsTeaching: title.trim() },
    });

    const populatedSkill = await Skill.findById(newSkill._id).populate(
      'user',
      'name email college major avatar rating badges karma'
    );

    res.status(201).json({
      message: 'Skill offered successfully! +10 Karma earned.',
      skill: populatedSkill,
    });
  } catch (error) {
    console.error('[Create Skill Error]:', error);
    res.status(500).json({ message: 'Failed to create skill listing', error: error.message });
  }
});

// @route   DELETE /api/skills/:id
// @desc    Delete user's own skill
// @access  Private
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill listing not found.' });
    }

    if (skill.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete this skill.' });
    }

    await Skill.findByIdAndDelete(req.params.id);
    res.json({ message: 'Skill listing deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete skill', error: error.message });
  }
});

export default router;
