const Student = require('../models/student.model');

// Get results for the authenticated student
exports.getResults = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id })
      .populate('results.courses.course', 'courseCode name credits');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found',
      });
    }

    res.status(200).json({
      success: true,
      data: student.results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// Upload results (Teacher)
exports.uploadResults = async (req, res) => {
  try {
    const { studentId, semester, courses, cgpa, status } = req.body;

    if (!studentId || !semester || !courses) {
      return res.status(400).json({
        success: false,
        message: 'studentId, semester, and courses are required',
      });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    // Find existing result for this semester or create new
    const existingIndex = student.results.findIndex(
      (r) => r.semester === semester
    );

    if (existingIndex >= 0) {
      student.results[existingIndex].courses = courses;
      student.results[existingIndex].cgpa = cgpa || 0;
      student.results[existingIndex].status = status || 'Incomplete';
    } else {
      student.results.push({ semester, courses, cgpa: cgpa || 0, status: status || 'Incomplete' });
    }

    await student.save();

    res.status(201).json({
      success: true,
      message: 'Results uploaded successfully',
      data: student.results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// Get results for a specific semester
exports.getSemesterResults = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id })
      .populate('results.courses.course', 'courseCode name credits');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found',
      });
    }

    const semesterNum = parseInt(req.params.semester, 10);
    const semesterResult = student.results.find((r) => r.semester === semesterNum);

    if (!semesterResult) {
      return res.status(404).json({
        success: false,
        message: 'Results not found for this semester',
      });
    }

    res.status(200).json({
      success: true,
      data: semesterResult,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};
