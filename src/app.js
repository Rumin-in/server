import express from 'express';
import cors from 'cors';
import corsOptions from './config/cors.js';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

// Import routes
import authRoutes from './routes/auth.routes.js';
import roomRoutes from './routes/room.routes.js';
import landlordRoutes from './routes/landlord.routes.js';
import renterRoutes from './routes/renter.routes.js';
import adminRoutes from './routes/admin.routes.js';
import WalletAndCoupanRoutes from './routes/walletAndCoupan.routes.js';

const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cookieParser());


// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/landlord', landlordRoutes);
app.use('/api/renter', renterRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/walletAndCoupan', WalletAndCoupanRoutes);

export default app;
