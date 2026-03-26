import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { adminRouter } from './routes/admin.js';
import { apiRouter } from './routes/api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendRoot = path.resolve(__dirname, '..');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(cookieParser());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

app.use('/assets', express.static(path.join(frontendRoot, 'assets')));
app.use(express.static(frontendRoot));

app.use('/api', apiRouter);
app.use('/admin', adminRouter);

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/admin')) return next();
  if (req.path.startsWith('/assets')) return next();
  if (req.path.includes('.') && !req.path.endsWith('.html')) return next();

  res.sendFile(path.join(frontendRoot, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Buzzworthy server running at http://localhost:${PORT}`);
});