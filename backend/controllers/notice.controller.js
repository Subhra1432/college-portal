const Notice = require('../models/notice.model');

// Get all notices
exports.getNotices = async (req, res) => {
  try {
    const notices = await Notice.find({ isArchived: false })
      .populate('postedBy', 'name email role')
      .sort({ pinned: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notices.length,
      data: notices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// Create a notice
exports.createNotice = async (req, res) => {
  try {
    const { title, content, department, targetAudience, pinned, expiresAt } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required',
      });
    }

    const notice = await Notice.create({
      title,
      content,
      postedBy: req.user.id,
      department,
      targetAudience,
      pinned,
      expiresAt,
    });

    const populatedNotice = await Notice.findById(notice._id)
      .populate('postedBy', 'name email role');

    res.status(201).json({
      success: true,
      data: populatedNotice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// Get a specific notice
exports.getNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id)
      .populate('postedBy', 'name email role');

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found',
      });
    }

    res.status(200).json({
      success: true,
      data: notice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};
