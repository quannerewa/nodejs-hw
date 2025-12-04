import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import { errors } from 'celebrate';
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

import notesRoutes from './routes/notesRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

// start
const PORT = process.env.PORT ?? 3000;

// standard middleware
app.use(logger);
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// routes
app.use('/auth', authRoutes);
app.use('/notes', notesRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Notes API 🚀',
    availableRoutes: ['/auth/register', '/auth/login', '/notes'],
  });
});

// 404 неіснуючі маршрути
app.use(notFoundHandler);

// celebrate errors middleware
app.use(errors());

// error handler
app.use(errorHandler);

// start & connect to db
await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
