import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { adminRouter } from './routes/admin.js';
import { apiRouter } from './routes/api.js';
import { db } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendRoot = path.resolve(__dirname, '..');

const app = express();
const PORT = process.env.PORT || 3000;

function hasAdminRoute(pathname) {
  return adminRouter.stack?.some(layer => layer.route?.path === pathname) || false;
}

function hasMailboxTable() {
  const row = db
    .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'contact_messages'")
    .get();
  return Boolean(row);
}

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

const server = app.listen(PORT, () => {
  console.log(`Buzzworthy server running at http://localhost:${PORT}`);
  console.log(`[boot] admin mailbox route: ${hasAdminRoute('/mailbox') ? 'enabled' : 'missing'}`);
  console.log(`[boot] mailbox table: ${hasMailboxTable() ? 'ready' : 'missing'}`);
});

server.on('error', err => {
  console.error(`[boot] server failed to start on port ${PORT}: ${err.message}`);
});