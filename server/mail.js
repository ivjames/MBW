import { db, nowIso } from './db.js';

db.exec(`
CREATE TABLE IF NOT EXISTS contact_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  company TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  service TEXT DEFAULT '',
  budget TEXT DEFAULT '',
  message TEXT NOT NULL DEFAULT '',
  user_agent TEXT DEFAULT '',
  ip_address TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'new',
  created_at TEXT NOT NULL
);
`);

function cleanText(value = '') {
    return String(value).replace(/\r/g, '').trim();
}

export function saveContactMessage(payload = {}, meta = {}) {
    const createdAt = nowIso();

    const insert = db.prepare(`
    INSERT INTO contact_messages (
      name, email, company, phone, service, budget, message,
      user_agent, ip_address, status, created_at
    ) VALUES (
      @name, @email, @company, @phone, @service, @budget, @message,
      @user_agent, @ip_address, @status, @created_at
    )
  `);

    const result = insert.run({
        name: cleanText(payload.name),
        email: cleanText(payload.email),
        company: cleanText(payload.company),
        phone: cleanText(payload.phone),
        service: cleanText(payload.service),
        budget: cleanText(payload.budget),
        message: cleanText(payload.message),
        user_agent: cleanText(meta.userAgent),
        ip_address: cleanText(meta.ipAddress),
        status: 'new',
        created_at: createdAt
    });

    return {
        id: result.lastInsertRowid,
        createdAt
    };
}
