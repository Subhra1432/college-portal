const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    employeeId: {
      type: String,
      required: [true, 'Please provide employee ID'],
      unique: true,
    },
    designation: {
      type: String,
      required: [true, 'Please provide designation'],
      enum: [
        'Assistant Professor',
        'Associate Professor',
        'Professor',
        'Head of Department',
        'Dean',
        'Director',
      ],
    },
    qualification: {
      type: String,
      required: [true, 'Please provide qualification'],
    },
    experience: {
      type: Number,
      required: [true, 'Please provide experience in years'],
      default: 0,
    },
    specialization: {
      type: String,
      required: [true, 'Please provide specialization'],
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
    isHOD: {
      type: Boolean,
      default: false,
    },
    classesTaught: [
      {
        course: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Course',
        },
        semester: {
          type: Number,
          required: true,
        },
        batch: {
          type: String,
          required: true,
        },
        schedule: {
          day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          },
          startTime: {
            type: String,
          },
          endTime: {
            type: String,
          },
          room: {
            type: String,
          },
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher; 