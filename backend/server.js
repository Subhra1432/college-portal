const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingVars = requiredEnvVars.filter((v) => !process.env[v]);
if (missingVars.length > 0) {
  console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
  process.exit(1);
}

// Initialize express app
const app = express();

// Middleware
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',')
  : ['http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many authentication attempts, please try again later.' },
});

app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter);

// Routes
const authRoutes = require('./routes/auth.routes');
const studentRoutes = require('./routes/student.routes');
const teacherRoutes = require('./routes/teacher.routes');
const messageRoutes = require('./routes/message.routes');
const noticeRoutes = require('./routes/notice.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const paymentRoutes = require('./routes/payment.routes');
const resultRoutes = require('./routes/result.routes');
const assignmentRoutes = require('./routes/assignment.routes');

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/assignments', assignmentRoutes);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'));
  });
}

// Global error handling middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('Database Connection Error:', err.message);
    process.exit(1);
  }
};

// Run server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Connect to database
connectDB();