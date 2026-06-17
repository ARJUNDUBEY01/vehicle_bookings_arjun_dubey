const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { globalLimiter } = require('./middlewares/rateLimiter.middleware');
const errorHandler = require('./middlewares/error.middleware');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const socket = require('./config/socket');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate Limiting
app.use(globalLimiter);

// Root welcome route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Vehicle Bookings API is running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      bookings: '/api/v1/bookings',
      stats: '/api/v1/stats',
      search: '/api/v1/search',
      health: '/api/v1/health',
      docs: '/api-docs'
    }
  });
});

// Routes
const authRoutes = require('./routes/auth.routes');
const bookingRoutes = require('./routes/booking.routes');
const statsRoutes = require('./routes/stats.routes');
const searchRoutes = require('./routes/search.routes');

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/stats', statsRoutes);
app.use('/api/v1/search', searchRoutes);

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health Check
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime(), timestamp: Date.now() });
});

app.get('/api/v1/version', (req, res) => {
  res.status(200).json({ version: '1.0.0' });
});

// Handle undefined routes
app.use('*', (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.statusCode = 404;
  next(error);
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Only start the server when running locally (not on Vercel)
if (process.env.VERCEL !== '1') {
  const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });

  // Initialize Socket.io
  const io = socket.init(server);
  io.on('connection', (client) => {
    console.log('Client connected to socket.io');
  });
}

// Export for Vercel serverless
module.exports = app;
