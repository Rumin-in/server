import express from 'express';
import cors from 'cors';
import corsOptions from './config/cors.js';
import helmet from 'helmet';

const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());


// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

export default app;
