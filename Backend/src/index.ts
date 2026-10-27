import 'dotenv/config';
import express from 'express';
import authRoutes from './routes/auth.routes.ts';
import aiRoutes from './routes/ai.routes.ts';
import studyPackRoutes from './routes/study-pack.routes.ts';
import noteRoutes from './routes/note.routes.ts';
import { authenticateToken } from './middleware/auth.middleware';

const PORT = Number(process.env.PORT || 4000);
const app = express();

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
