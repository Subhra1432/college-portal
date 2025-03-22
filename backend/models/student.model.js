const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rollNumber: {
      type: String,
      required: [true, 'Please provide roll number'],
      unique: true,
    },
    batch: {
      type: String,
      required: [true, 'Please provide batch year'],
    },
    semester: {
      type: Number,
      required: [true, 'Please provide current semester'],
      min: 1,
      max: 10,
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
    attendance: [
      {
        course: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Course',
        },
        present: {
          type: Number,
          default: 0,
        },
        total: {
          type: Number,
          default: 0,
        },
        percentage: {
          type: Number,
          default: 0,
        },
      },
    ],
    results: [
      {
        semester: {
          type: Number,
          required: true,
        },
        courses: [
          {
            course: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Course',
            },
            internalMarks: {
              type: Number,
              default: 0,
            },
            externalMarks: {
              type: Number,
              default: 0,
            },
            totalMarks: {
              type: Number,
              default: 0,
            },
            grade: {
              type: String,
              enum: ['A+', 'A', 'B+', 'B', 'C', 'D', 'F', 'I'],
              default: 'I',
            },
          },
        ],
        cgpa: {
          type: Number,
          default: 0,
        },
        status: {
          type: String,
          enum: ['Pass', 'Fail', 'Incomplete'],
          default: 'Incomplete',
        },
      },
    ],
    payments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
      },
    ],
    assignments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model('Student', studentSchema);

module.exports = Student; 