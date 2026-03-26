import crypto from 'crypto';

const cfg = () => ({
    user: process.env.ADMIN_USERNAME || 'admin',
    pass: process.env.ADMIN_PASSWORD || 'changeme',
    secret: process.env.SESSION_SECRET || 'replace-me'
});

const sign = (value, secret) =>
    crypto.createHmac('sha256', secret).update(value).digest('hex');

export const validateLogin = (u, p) => u === cfg().user && p === cfg().pass;
export const createSession = u => `${u}.${sign(u, cfg().secret)}`;

export function readSession(token = '') {
    const [u, s] = String(token).split('.');
    return u && s && sign(u, cfg().secret) === s ? u : null;
}

export function requireAdmin(req, res, next) {
    const u = readSession(req.cookies?.dd_admin || '');
    if (!u) return res.redirect('/admin/login');
    req.adminUser = u;
    next();
}