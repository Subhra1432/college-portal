const Payment = require('../models/payment.model');
const Student = require('../models/student.model');

// Get payments for the authenticated student
exports.getPayments = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found',
      });
    }

    const payments = await Payment.find({ student: student._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// Make a payment
exports.makePayment = async (req, res) => {
  try {
    const { amount, paymentType, semester, dueDate, paymentMethod, description } = req.body;

    if (!amount || !paymentType || !semester || !dueDate || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'amount, paymentType, semester, dueDate, and paymentMethod are required',
      });
    }

    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found',
      });
    }

    const payment = await Payment.create({
      student: student._id,
      amount,
      type: paymentType,
      semester,
      dueDate,
      paymentMethod,
      description,
      status: 'completed',
      transactionId: `TXN${Date.now()}`,
      receiptNumber: `RCP${Date.now()}`,
    });

    // Add payment reference to student
    student.payments.push(payment._id);
    await student.save();

    res.status(201).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// Get payment receipt
exports.getReceipt = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('student');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};
