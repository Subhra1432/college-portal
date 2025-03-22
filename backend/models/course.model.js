const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    courseCode: {
      type: String,
      required: [true, 'Please provide course code'],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide course name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide course description'],
    },
    credits: {
      type: Number,
      required: [true, 'Please provide course credits'],
      min: 1,
    },
    department: {
      type: String,
      required: [true, 'Please provide department'],
    },
    semester: {
      type: Number,
      required: [true, 'Please provide semester'],
      min: 1,
      max: 10,
    },
    teachers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
      },
    ],
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
      },
    ],
    syllabus: {
      type: String,
      required: [true, 'Please provide syllabus'],
    },
    assessmentCriteria: {
      internalMarks: {
        type: Number,
        default: 40,
      },
      externalMarks: {
        type: Number,
        default: 60,
      },
      passingMarks: {
        type: Number,
        default: 40,
      },
    },
    batch: {
      type: String,
      required: [true, 'Please provide batch year'],
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

const Course = mongoose.model('Course', courseSchema);

module.exports = Course; 