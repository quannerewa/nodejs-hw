import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import { errors } from 'celebrate';

import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import notesRoutes from './routes/notesRoutes.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

// middleware
app.use(logger);
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// роутинг
app.use('/auth', authRoutes);
app.use('/notes', notesRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Notes API 🚀',
    availableRoutes: ['/auth/register', '/auth/login', '/notes'],
  });
});

// 404
app.use(notFoundHandler);

// celebrate errors
app.use(errors());

// error handler
app.use(errorHandler);

// start server
await connectMongoDB();
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
