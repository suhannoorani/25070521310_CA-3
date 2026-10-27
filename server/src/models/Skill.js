import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Skill title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Code & Tech',
        'Design & Creative',
        'Academics & Math',
        'Languages',
        'Music & Arts',
        'Business & Career',
        'Other',
      ],
      default: 'Code & Tech',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    skillWanted: {
      type: String,
      required: [true, 'Skill requested in exchange is required'],
      trim: true,
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
      default: 'All Levels',
    },
    format: {
      type: String,
      enum: ['Online / Video Call', 'Campus In-Person', 'Flexible'],
      default: 'Online / Video Call',
    },
    sessionLength: {
      type: String,
      default: '45 mins',
    },
    college: {
      type: String,
      default: 'University Campus',
    },
    tags: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      default: 5.0,
    },
    swapsCompleted: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Skill = mongoose.model('Skill', skillSchema);
