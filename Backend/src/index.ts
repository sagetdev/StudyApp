import 'dotenv/config';
import express from 'express';
import authRoutes from './routes/auth.routes.ts';
import aiRoutes from './routes/ai.routes.ts';
import studyPackRoutes from './routes/study-pack.routes.ts';
import noteRoutes from './routes/note.routes.ts';
import { authenticateToken } from './middleware/auth.middleware';

const PORT = Number(process.env.PORT || 4000);
const app = express();

// CORS must run before the API routes so browsers can complete OPTIONS preflight requests.
const configuredFrontendOrigins = (process.env.FRONTEND_URL ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const isAllowedDevelopmentOrigin = (origin: string) => {
  try {
    const url = new URL(origin);
    const isLocalHost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
    const isPrivateLanHost =
      /^10(?:\.\d{1,3}){3}$/.test(url.hostname) ||
      /^192\.168(?:\.\d{1,3}){2}$/.test(url.hostname) ||
      /^172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2}$/.test(url.hostname);

    return process.env.NODE_ENV !== 'production' &&
      (isLocalHost || isPrivateLanHost) &&
      ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
};

app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowed = !origin ||
    configuredFrontendOrigins.includes(origin) ||
    isAllowedDevelopmentOrigin(origin);

  if (origin && allowed) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  if (req.method === 'OPTIONS') {
    if (!allowed) {
      res.status(403).end();
      return;
    }

    res.status(204).end();
    return;
  }

  next();
});

app.use(express.json({ limit: '2mb' }));

app.get('/api', (_req, res) => {
  res.json({ message: 'Welcome to the StudyApp server', status: 'Server is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/ai', authenticateToken, aiRoutes);
app.use('/api/study-packs', authenticateToken, studyPackRoutes);
app.use('/api/notes', authenticateToken, noteRoutes);

app.listen(PORT, () => {
  console.log(`StudyApp API listening on port ${PORT}`);
});
