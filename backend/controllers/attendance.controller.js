const Student = require('../models/student.model');

// Get attendance for the authenticated student
exports.getAttendance = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id })
      .populate('attendance.course', 'courseCode name');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found',
      });
    }

    res.status(200).json({
      success: true,
      data: student.attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// Upload attendance (Teacher)
exports.uploadAttendance = async (req, res) => {
  try {
    const { studentId, courseId, present, total } = req.body;

    if (!studentId || !courseId || present === undefined || !total) {
      return res.status(400).json({
        success: false,
        message: 'studentId, courseId, present, and total are required',
      });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    // Find or create attendance record for this course
    const existingIndex = student.attendance.findIndex(
      (a) => a.course && a.course.toString() === courseId
    );

    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    if (existingIndex >= 0) {
      student.attendance[existingIndex].present = present;
      student.attendance[existingIndex].total = total;
      student.attendance[existingIndex].percentage = percentage;
    } else {
      student.attendance.push({ course: courseId, present, total, percentage });
    }

    await student.save();

    res.status(201).json({
      success: true,
      message: 'Attendance uploaded successfully',
      data: student.attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// Get attendance for a specific course
exports.getCourseAttendance = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id })
      .populate('attendance.course', 'courseCode name');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found',
      });
    }

    const courseAttendance = student.attendance.find(
      (a) => a.course && a.course._id.toString() === req.params.id
    );

    if (!courseAttendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found for this course',
      });
    }

    res.status(200).json({
      success: true,
      data: courseAttendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};
