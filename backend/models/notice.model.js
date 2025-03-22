const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide notice title'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Please provide notice content'],
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    department: {
      type: String,
      required: false,
    },
    targetAudience: {
      type: String,
      enum: ['all', 'students', 'teachers', 'specific-department'],
      default: 'all',
    },
    attachment: {
      type: String,
    },
    pinned: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster queries
noticeSchema.index({ department: 1, targetAudience: 1 });
noticeSchema.index({ pinned: 1, createdAt: -1 });

const Notice = mongoose.model('Notice', noticeSchema);

module.exports = Notice; 