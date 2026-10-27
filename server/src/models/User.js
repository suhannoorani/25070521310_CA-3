import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    college: {
      type: String,
      required: [true, 'University or College name is required'],
      default: 'State University',
      trim: true,
    },
    major: {
      type: String,
      default: 'Computer Science',
      trim: true,
    },
    bio: {
      type: String,
      default: 'Passionate student eager to exchange skills, build projects, and collaborate!',
    },
    avatar: {
      type: String,
      default: '',
    },
    karma: {
      type: Number,
      default: 50,
    },
    skillsTeaching: {
      type: [String],
      default: [],
    },
    skillsLearning: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      default: 5.0,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
    badges: {
      type: [String],
      default: ['Verified Student', 'Peer Explorer'],
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password helper
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model('User', userSchema);
