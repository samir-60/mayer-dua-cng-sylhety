import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes';
import { errorHandler } from './middleware/errorHandler.middleware';
import { rateLimiter } from './middleware/rateLimit.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: '*', // Allow frontend dev & production
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '5mb' }));
app.use(rateLimiter(120, 60000)); // 120 reqs / min

// Mount API routes
app.use('/api', apiRouter);

// Global Error Handler
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`\n====================================================`);
    console.log(`[ONLINE] MAYER DUA CNG SIMULATOR BACKEND ONLINE`);
    console.log(`Server listening on: http://localhost:${PORT}`);
    console.log(`Health endpoint:     http://localhost:${PORT}/api/health`);
    console.log(`====================================================\n`);
  });
}

export default app;
