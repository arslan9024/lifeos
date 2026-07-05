import express from 'express';
import { healthRouter } from './routes/health.js';
import { legacyRouter } from './routes/legacy.js';

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 5000;

app.use(express.json());

app.get('/', (_req, res) => {
  res.json({
    ok: true,
    service: 'lifeos-server',
    message: 'LifeOS backend is running',
  });
});

app.use('/api/health', healthRouter);
app.use('/api/legacy', legacyRouter);

app.listen(port, () => {
  console.log(`LifeOS server running on http://localhost:${port}`);
});
