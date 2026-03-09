const Assignment = require('../models/assignment.model');

// Get assignments
exports.getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate('course', 'courseCode name')
      .populate('teacher', 'user')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// Create an assignment (Teacher)
exports.createAssignment = async (req, res) => {
  try {
    const { title, description, course, dueDate, totalMarks } = req.body;

    if (!title || !description || !course || !dueDate || !totalMarks) {
      return res.status(400).json({
        success: false,
        message: 'title, description, course, dueDate, and totalMarks are required',
      });
    }

    const assignment = await Assignment.create({
      title,
      description,
      course,
      teacher: req.user.id,
      dueDate,
      totalMarks,
    });

    res.status(201).json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// Submit an assignment (Student)
exports.submitAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found',
      });
    }

    const { content, attachments } = req.body;

    // Check if already submitted
    const existingSubmission = assignment.submissions.find(
      (s) => s.student.toString() === req.user.id
    );

    if (existingSubmission) {
      return res.status(400).json({
        success: false,
        message: 'Assignment already submitted',
      });
    }

    assignment.submissions.push({
      student: req.user.id,
      content,
      attachments,
      submittedAt: new Date(),
    });

    await assignment.save();

    res.status(200).json({
      success: true,
      message: 'Assignment submitted successfully',
      data: assignment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// Get a specific assignment
exports.getAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('course', 'courseCode name')
      .populate('teacher', 'user');

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found',
      });
    }

    res.status(200).json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};
