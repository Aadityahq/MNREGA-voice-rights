require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { connectRedis } = require('./config/redis');
const { startCronJobs } = require('./worker/cronWorker');
const districtRoutes = require('./routes/district');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'MGNREGA Backend API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API Routes
app.use('/api', districtRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.path
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const startServer = async () => {
  try {
    console.log('\n🇮🇳 ================================================');
    console.log('   Government of India - MGNREGA Backend');
    console.log('   Starting Server...');
    console.log('================================================\n');

    // Connect to MongoDB
    await connectDB();

    // Connect to Redis
    await connectRedis();

    // Start cron jobs
    startCronJobs();

    // Start Express server
    app.listen(PORT, () => {
      console.log('\n================================================');
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 API: http://localhost:${PORT}/api`);
      console.log(`🏥 Health: http://localhost:${PORT}/health`);
      console.log(`🌐 Frontend: ${process.env.FRONTEND_URL}`);
      console.log('================================================\n');
      console.log('✅ Backend is ready to accept requests!\n');
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
