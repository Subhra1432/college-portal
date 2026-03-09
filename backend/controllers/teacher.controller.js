const Teacher = require('../models/teacher.model');

// Get all teachers (Admin)
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().populate('user', 'name email department registrationNumber');
    res.status(200).json({
      success: true,
      count: teachers.length,
      data: teachers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// Get teacher profile
exports.getProfile = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ user: req.user.id })
      .populate('user', 'name email department registrationNumber profilePicture')
      .populate('courses', 'courseCode name credits semester');

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher profile not found',
      });
    }

    res.status(200).json({
      success: true,
      data: teacher,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// Get teacher courses
exports.getCourses = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ user: req.user.id })
      .populate('courses', 'courseCode name description credits department semester');

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher profile not found',
      });
    }

    res.status(200).json({
      success: true,
      data: teacher.courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};
