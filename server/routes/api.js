import express from 'express';
import { db } from '../db.js';
import { saveContactMessage } from '../mail.js';
import { SITE_CONFIG_BOOTSTRAP } from '../siteConfigBootstrap.js';

export const apiRouter = express.Router();

const parseJSON = (v, fallback) => {
    try { return JSON.parse(v || ''); } catch { return fallback; }
};

apiRouter.post('/contact', async (req, res) => {
    const {
        name = '',
        email = '',
        message = '',
        company = '',
        phone = '',
        service = '',
        budget = '',
        website = ''
    } = req.body || {};

    if (website) return res.json({ ok: true, message: 'Thanks.' });
    if (!name.trim() || !email.trim() || !message.trim()) {
        return res.status(400).json({ ok: false, message: 'Name, email, and message are required.' });
    }

    try {
        saveContactMessage(
            {
                name,
                email,
                company,
                phone,
                service,
                budget,
                message
            },
            {
                userAgent: req.get('user-agent') || '',
                ipAddress: req.ip || req.socket?.remoteAddress || ''
            }
        );

        return res.json({
            ok: true,
            message: 'Thanks. Your message has been received.'
        });
    } catch (error) {
        console.error('[contact] mailbox save failed', {
            error: error?.message || String(error),
            submittedAt: new Date().toISOString(),
            name,
            email
        });

        return res.status(502).json({
            ok: false,
            message: 'Unable to receive your message right now. Please try again shortly.'
        });
    }
});

apiRouter.get('/site', (_req, res) => {
    const row = db.prepare(`
      SELECT payload_json
      FROM site_settings
      WHERE setting_key = ?
    `).get('default');

    res.json(parseJSON(row?.payload_json, SITE_CONFIG_BOOTSTRAP));
});

apiRouter.get('/blog', (_req, res) => {
    const posts = db.prepare(`
    SELECT slug, title, excerpt, cover_image, author, published_at, updated_at
    FROM posts
    WHERE status = 'published'
    ORDER BY datetime(COALESCE(published_at, updated_at)) DESC
  `).all().map(row => ({
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt,
        date: (row.published_at || row.updated_at || '').slice(0, 10),
      author: row.author || 'Buzzworthy',
        image: row.cover_image,
        tags: ['Blog']
    }));

    res.json({
        hero: { image: 'https://picsum.photos/seed/buzzworthy-blog-hero/467/300.webp' },
        intro: {
            title: 'Articles with better framing',
            lead: 'A cleaner blog index should feel more like a publication and less like a random card grid.'
        },
        posts
    });
});

apiRouter.get('/blog/:slug', (req, res) => {
    const row = db.prepare(`
    SELECT * FROM posts
    WHERE slug = ? AND status = 'published'
  `).get(req.params.slug);

    if (!row) return res.status(404).json({ error: 'Not found' });

    res.json({
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt,
        date: (row.published_at || row.updated_at || '').slice(0, 10),
        author: row.author || 'Buzzworthy',
        image: row.cover_image,
        tags: ['Blog'],
        content: parseJSON(row.content_json, [])
    });
});

apiRouter.get('/helpdesk', (_req, res) => {
    const topics = db.prepare(`
    SELECT t.slug, t.title, t.description, COUNT(a.id) AS count
    FROM helpdesk_topics t
    LEFT JOIN helpdesk_articles a
      ON a.topic_id = t.id AND a.status = 'published'
    GROUP BY t.id
    ORDER BY t.sort_order ASC, t.title ASC
  `).all();

    const rows = db.prepare(`
    SELECT a.slug, a.title, t.title AS topic
    FROM helpdesk_articles a
    LEFT JOIN helpdesk_topics t ON t.id = a.topic_id
    WHERE a.status = 'published'
    ORDER BY datetime(COALESCE(a.published_at, a.updated_at)) DESC
  `).all();

    res.json({
        hero: {
            eyebrow: 'Helpdesk',
            title: 'How can we help?',
            lead: 'Search FAQs, browse support topics, and open individual help articles.',
            image: 'https://picsum.photos/seed/buzzworthy-helpdesk/467/300.webp'
        },
        topics,
        popular: rows.slice(0, 3),
        mostViewed: rows.slice(0, 3)
    });
});

apiRouter.get('/helpdesk/topic/:slug', (req, res) => {
    const topic = db.prepare(`
    SELECT id, slug, title, description
    FROM helpdesk_topics
    WHERE slug = ?
  `).get(req.params.slug);

    if (!topic) return res.status(404).json({ error: 'Not found' });

    const articles = db.prepare(`
    SELECT slug, title, excerpt, published_at, updated_at
    FROM helpdesk_articles
    WHERE topic_id = ? AND status = 'published'
    ORDER BY datetime(COALESCE(published_at, updated_at)) DESC
  `).all(topic.id).map(row => ({
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt,
        date: (row.published_at || row.updated_at || '').slice(0, 10)
    }));

    res.json({
        slug: topic.slug,
        title: topic.title,
        description: topic.description,
        articles
    });
});

apiRouter.get('/helpdesk/article/:slug', (req, res) => {
    const row = db.prepare(`
    SELECT a.*, t.slug AS topic_slug
    FROM helpdesk_articles a
    LEFT JOIN helpdesk_topics t ON t.id = a.topic_id
    WHERE a.slug = ? AND a.status = 'published'
  `).get(req.params.slug);

    if (!row) return res.status(404).json({ error: 'Not found' });

    res.json({
        slug: row.slug,
        topic: row.topic_slug || '',
        title: row.title,
        excerpt: row.excerpt,
        date: (row.published_at || row.updated_at || '').slice(0, 10),
        tags: parseJSON(row.tags_json, []),
        content: parseJSON(row.content_json, [])
    });
});

apiRouter.get('/pages/:slug', (req, res) => {
    const page = db.prepare(`
    SELECT id, slug, title, page_type, status, seo_title, seo_description
    FROM pages
    WHERE slug = ? AND status = 'published'
  `).get(req.params.slug);

    if (!page) return res.status(404).json({ error: 'Not found' });

    const sections = db.prepare(`
    SELECT id, section_type, sort_order, props_json
    FROM page_sections
    WHERE page_id = ?
    ORDER BY sort_order ASC, id ASC
  `).all(page.id);

    res.json({
        slug: page.slug,
        title: page.title,
        page_type: page.page_type,
        seo_title: page.seo_title,
        seo_description: page.seo_description,
        sections
    });
});

apiRouter.get('/content-pages/:slug', (req, res) => {
    const row = db.prepare(`
      SELECT payload_json
      FROM content_pages
      WHERE slug = ?
    `).get(req.params.slug);

    if (!row) return res.status(404).json({ error: 'Not found' });

    res.json(parseJSON(row.payload_json, {}));
});

apiRouter.get('/works', (_req, res) => {
    const projects = db.prepare(`
    SELECT slug, title, category, summary, hero_image, metrics_json
    FROM works
    WHERE status = 'published'
    ORDER BY title ASC
  `).all().map(row => ({
        slug: row.slug,
        title: row.title,
        category: row.category,
        image: row.hero_image,
        summary: row.summary,
        metrics: JSON.parse(row.metrics_json || '[]')
    }));

    res.json({
        hero: {
            eyebrow: 'Selected work',
            title: 'Previous projects, presented as a browsable gallery.',
            lead: 'Use this page to show recent work, visual direction, project categories, and short business context without forcing users into a heavy case-study flow.',
            image: 'https://picsum.photos/seed/deepdigital-works-hero/467/300.webp'
        },
        intro: {
            title: 'Interactive project gallery',
            lead: 'Each project can be filtered by category and opened in a lightweight viewer.'
        },
        filters: ['All', ...new Set(projects.map(p => p.category).filter(Boolean))],
        projects,
        cta: {
            title: 'Want a deeper case study section later?',
            body: 'This gallery can evolve into full case studies with before-and-after pages, metrics, process notes, and testimonial blocks.'
        }
    });
});

apiRouter.get('/works/:slug', (req, res) => {
    const row = db.prepare(`
    SELECT *
    FROM works
    WHERE slug = ? AND status = 'published'
  `).get(req.params.slug);

    if (!row) return res.status(404).json({ error: 'Not found' });

    res.json({
        slug: row.slug,
        title: row.title,
        category: row.category,
        excerpt: row.summary,
        image: row.hero_image,
        tags: [row.category].filter(Boolean),
        metrics: JSON.parse(row.metrics_json || '[]'),
        content: JSON.parse(row.content_json || '[]')
    });
});