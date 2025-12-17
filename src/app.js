import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import roomRoutes from './routes/room.routes.js';
import hostelRoutes from './routes/hostel.routes.js';
import landlordRoutes from './routes/landlord.routes.js';
import renterRoutes from './routes/renter.routes.js';
import adminRoutes from './routes/admin.routes.js';
import WalletAndCoupanRoutes from './routes/walletAndCoupan.routes.js';

// Load environment variables
dotenv.config({ path: './.env' });

// Initialize express
const app = express();

// Manual CORS middleware - more reliable than cors package with reverse proxies
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:5173',
    'https://rumin-five.vercel.app',
    'https://rumin.in',
    'https://www.rumin.in'
  ];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests immediately
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Body parsers with increased limits for file uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/hostels', hostelRoutes);
app.use('/api/landlord', landlordRoutes);
app.use('/api/renter', renterRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/walletAndCoupan', WalletAndCoupanRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Welcome to the Room Rental Service API 🚀');
});

// Global error handler - MUST be after all routes
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Start server
const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    console.log('✅ Database connected successfully');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Access the API at https://api.rumin.in`);
    });
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  });
