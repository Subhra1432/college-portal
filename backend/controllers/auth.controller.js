const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const Student = require('../models/student.model');
const Teacher = require('../models/teacher.model');

// Helper function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Register new user
exports.register = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      registrationNumber, 
      password, 
      role, 
      department,
      // Student specific fields
      rollNumber,
      batch,
      semester,
      // Teacher specific fields
      employeeId,
      designation,
      qualification,
      experience,
      specialization,
      isHOD
    } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ 
      $or: [
        { email },
        { registrationNumber }
      ] 
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email or registration number',
      });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      registrationNumber,
      password,
      role,
      department,
    });

    // If user is a student, create student profile
    if (role === 'student') {
      // Check if roll number already exists
      const studentExists = await Student.findOne({ rollNumber });
      if (studentExists) {
        await User.findByIdAndDelete(user._id);
        return res.status(400).json({
          success: false,
          message: 'Student already exists with this roll number',
        });
      }

      await Student.create({
        user: user._id,
        rollNumber,
        batch,
        semester,
      });
    }

    // If user is a teacher, create teacher profile
    if (role === 'teacher') {
      // Check if employee ID already exists
      const teacherExists = await Teacher.findOne({ employeeId });
      if (teacherExists) {
        await User.findByIdAndDelete(user._id);
        return res.status(400).json({
          success: false,
          message: 'Teacher already exists with this employee ID',
        });
      }

      await Teacher.create({
        user: user._id,
        employeeId,
        designation,
        qualification,
        experience,
        specialization,
        isHOD: isHOD || false,
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Return new user
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        registrationNumber: user.registrationNumber,
        role: user.role,
        department: user.department,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Check if identifier is email or registration number
    const isEmail = identifier.includes('@');

    const user = await User.findOne({
      [isEmail ? 'email' : 'registrationNumber']: identifier,
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        registrationNumber: user.registrationNumber,
        role: user.role,
        department: user.department,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Get role-specific data
    let profileData = {};
    
    if (user.role === 'student') {
      const student = await Student.findOne({ user: user._id });
      if (student) {
        profileData = {
          rollNumber: student.rollNumber,
          batch: student.batch,
          semester: student.semester,
        };
      }
    } else if (user.role === 'teacher') {
      const teacher = await Teacher.findOne({ user: user._id });
      if (teacher) {
        profileData = {
          employeeId: teacher.employeeId,
          designation: teacher.designation,
          isHOD: teacher.isHOD,
        };
      }
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        registrationNumber: user.registrationNumber,
        role: user.role,
        department: user.department,
        profilePicture: user.profilePicture,
        ...profileData,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, profilePicture } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, profilePicture },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        registrationNumber: updatedUser.registrationNumber,
        role: updatedUser.role,
        department: updatedUser.department,
        profilePicture: updatedUser.profilePicture,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
}; 