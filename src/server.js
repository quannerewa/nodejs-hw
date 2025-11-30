import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import helmet from 'helmet';
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRoutes from './routes/notesRoutes.js';

const app = express();

// start
const PORT = process.env.PORT ?? 3000;

// standart middleware
app.use(logger);
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(notesRoutes);

// routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Notes API 🚀',
    availableRoutes: ['/notes', '/notes/:noteId']
  });
});


// 404 неіснуючі маршрути
app.use(notFoundHandler);
// error handler
app.use(errorHandler);

//  start & conect to db
await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
