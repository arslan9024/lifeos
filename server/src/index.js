import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { healthRouter } from './routes/health.js';
import { legacyRouter } from './routes/legacy.js';
import { requestContext } from './middleware/requestContext.js';
import { globalErrorHandler, notFoundHandler } from './middleware/errorHandlers.js';

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 5000;

if (!Number.isFinite(port) || port <= 0) {
  throw new Error(`Invalid PORT value: ${process.env.PORT}`);
}

const allowedOrigins = (process.env.CLIENT_ORIGIN ?? 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origin not allowed: ${origin}`));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));
app.use(requestContext);

app.get('/', (_req, res) => {
  res.json({
    ok: true,
    service: 'lifeos-server',
    message: 'LifeOS backend is running',
  });
});

app.use('/api/health', healthRouter);
app.use('/api/legacy', legacyRouter);

app.use(notFoundHandler);
app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`LifeOS server running on http://localhost:${port}`);
  console.log(`[CORS] allowed origins: ${allowedOrigins.join(', ')}`);
});
