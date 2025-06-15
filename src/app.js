import express from 'express';
import cors from 'cors';
import corsOptions from './config/cors.js';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

// Import routes
import authRoutes from './routes/auth.routes.js';
import roomRoutes from './routes/room.routes.js';
import landlordRoutes from './routes/landlord.routes.js';

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

export default app;
