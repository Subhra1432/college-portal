const Message = require('../models/message.model');

// Get user messages
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user.id }, { recipient: req.user.id }],
    })
      .populate('sender', 'name email')
      .populate('recipient', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { recipient, content } = req.body;

    if (!recipient || !content) {
      return res.status(400).json({
        success: false,
        message: 'Recipient and content are required',
      });
    }

    const message = await Message.create({
      sender: req.user.id,
      recipient,
      content,
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name email')
      .populate('recipient', 'name email');

    res.status(201).json({
      success: true,
      data: populatedMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// Get a specific message
exports.getMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)
      .populate('sender', 'name email')
      .populate('recipient', 'name email');

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    // Verify user is sender or recipient
    if (
      message.sender._id.toString() !== req.user.id &&
      message.recipient._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this message',
      });
    }

    // Mark as read if user is the recipient
    if (message.recipient._id.toString() === req.user.id && !message.isRead) {
      message.isRead = true;
      message.readAt = new Date();
      await message.save();
    }

    res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};
