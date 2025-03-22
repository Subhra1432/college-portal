const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide assignment title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide assignment description'],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
    },
    dueDate: {
      type: Date,
      required: [true, 'Please provide assignment due date'],
    },
    totalMarks: {
      type: Number,
      required: [true, 'Please provide total marks'],
      min: 1,
    },
    attachments: [
      {
        type: String,
      },
    ],
    submissions: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Student',
          required: true,
        },
        submissionDate: {
          type: Date,
          default: Date.now,
        },
        files: [
          {
            type: String,
          },
        ],
        marks: {
          type: Number,
          default: 0,
        },
        feedback: {
          type: String,
        },
        isLate: {
          type: Boolean,
          default: false,
        },
        status: {
          type: String,
          enum: ['submitted', 'graded', 'returned'],
          default: 'submitted',
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create index on course for faster queries
assignmentSchema.index({ course: 1, dueDate: 1 });

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment; 