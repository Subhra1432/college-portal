const Student = require('../models/student.model');
const User = require('../models/user.model');

// Get all students (Admin and Teachers)
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('user', 'name email department registrationNumber');
    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// Get student profile
exports.getProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id })
      .populate('user', 'name email department registrationNumber profilePicture')
      .populate('courses', 'courseCode name credits semester');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found',
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// Get student courses
exports.getCourses = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id })
      .populate('courses', 'courseCode name description credits department semester');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found',
      });
    }

    res.status(200).json({
      success: true,
      data: student.courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};
