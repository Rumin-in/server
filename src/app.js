import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import roomRoutes from './routes/room.routes.js';
import landlordRoutes from './routes/landlord.routes.js';
import renterRoutes from './routes/renter.routes.js';
import adminRoutes from './routes/admin.routes.js';
import WalletAndCoupanRoutes from './routes/walletAndCoupan.routes.js';

// Load environment variables
dotenv.config({ path: './.env' });

// Initialize express
const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://rumin-five.vercel.app', "https://rumin.in", "https://www.rumin.in/"],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/landlord', landlordRoutes);
app.use('/api/renter', renterRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/walletAndCoupan', WalletAndCoupanRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Welcome to the Room Rental Service API 🚀');
});

// Start server
const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    console.log('✅ Database connected successfully');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  });
