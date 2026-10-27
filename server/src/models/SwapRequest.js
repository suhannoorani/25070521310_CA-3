import mongoose from 'mongoose';

const swapMessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    senderName: {
      type: String,
      default: '',
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const swapRequestSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
      required: true,
    },
    skillOffered: {
      type: String,
      required: true,
      trim: true,
    },
    skillRequested: {
      type: String,
      required: true,
      trim: true,
    },
    proposedTopic: {
      type: String,
      default: 'General Skill Exchange Session',
    },
    message: {
      type: String,
      default: 'Hey! I saw your skill listing and would love to swap skills with you.',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'completed', 'cancelled'],
      default: 'pending',
    },
    scheduledDate: {
      type: String,
      default: '',
    },
    scheduledTime: {
      type: String,
      default: '',
    },
    meetingLink: {
      type: String,
      default: '',
    },
    sessionNotes: {
      type: String,
      default: 'Shared whiteboard & study notes will appear here during session.',
    },
    messages: [swapMessageSchema],
    review: {
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String, default: '' },
      submittedAt: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

export const SwapRequest = mongoose.model('SwapRequest', swapRequestSchema);
