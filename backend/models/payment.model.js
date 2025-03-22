const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'Please provide payment amount'],
      min: 0,
    },
    type: {
      type: String,
      enum: ['tuition', 'examination', 'hostel', 'library', 'other'],
      required: [true, 'Please provide payment type'],
    },
    semester: {
      type: Number,
      required: [true, 'Please provide semester'],
      min: 1,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: [true, 'Please provide payment due date'],
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    paymentMethod: {
      type: String,
      enum: ['credit card', 'debit card', 'net banking', 'UPI', 'cash', 'other'],
      required: [true, 'Please provide payment method'],
    },
    receiptNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    description: {
      type: String,
    },
    fineAmount: {
      type: Number,
      default: 0,
    },
    isDiscounted: {
      type: Boolean,
      default: false,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create index on student for faster queries
paymentSchema.index({ student: 1, semester: 1 });
paymentSchema.index({ status: 1, dueDate: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment; 