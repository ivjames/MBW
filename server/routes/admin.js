import express from 'express';
import { db, nowIso, slugify } from '../db.js';
import { createSession, requireAdmin, validateLogin } from '../adminAuth.js';

export const adminRouter = express.Router();

const esc = (v = '') =>
    String(v)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;');

function page(title, body) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${title}</title>
<style>
:root{--bg:#090b10;--surface:#111722;--line:#263043;--text:#edf2ff;--muted:#9bacce;--accent:#f7e30b}
*{box-sizing:border-box}body{margin:0;background:linear-gradient(180deg,#06070b,#0b1018);color:var(--text);font-family:Inter,system-ui,sans-serif}
a{text-decoration:none;color:inherit}.wrap{max-width:1200px;margin:0 auto;padding:24px}.grid{display:grid;grid-template-columns:240px 1fr;gap:24px}
.sidebar,.panel,.card{background:rgba(17,23,34,.94);border:1px solid var(--line);border-radius:22px}.sidebar{padding:16px;height:fit-content}.panel,.card{padding:18px}
.stack{display:flex;flex-direction:column;gap:14px}.top{display:flex;justify-content:space-between;gap:16px;align-items:center;margin-bottom:22px}
.btn,button{padding:10px 14px;border-radius:999px;border:1px solid var(--line);background:rgba(255,255,255,.03);color:var(--text);cursor:pointer}
.btn-primary{background:var(--accent);color:#111;border-color:rgba(247,227,11,.45);font-weight:800}
input,textarea,select{width:100%;padding:12px 14px;border-radius:14px;border:1px solid var(--line);background:#0d121a;color:var(--text)}
textarea{min-height:220px;resize:vertical;font-family:ui-monospace,SFMono-Regular,monospace}.table{width:100%;border-collapse:collapse}
.table th,.table td{padding:12px 10px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}.table th{color:var(--muted);font-size:12px;text-transform:uppercase}
.muted{color:var(--muted)}.actions{display:flex;gap:10px;flex-wrap:wrap}.h1{margin:0;font-size:34px;letter-spacing:-.05em}
@media (max-width:900px){.grid{grid-template-columns:1fr}}
</style>
</head>
<body><div class="wrap">${body}</div></body></html>`;
}

function shell(title, content) {
    return page(
        title,
        `<div class="top">
      <div>
        <h1 class="h1">Buzzworthy Admin</h1>
        <div class="muted">SQLite-backed admin for posts and helpdesk content</div>
      </div>
      <div class="actions">
        <a class="btn" href="/">Public Site</a>
        <a class="btn" href="/admin/logout">Logout</a>
      </div>
    </div>
    <div class="grid">
      <aside class="sidebar stack">
        <a class="btn" href="/admin">Overview</a>
        <a class="btn" href="/admin/pages">Pages</a>
        <a class="btn" href="/admin/posts">Posts</a>
        <a class="btn" href="/admin/topics">Topics</a>
        <a class="btn" href="/admin/articles">Articles</a>
      </aside>
      <main class="panel stack">${content}</main>
    </div>`
    );
}

adminRouter.get('/login', (_req, res) => {
    res.send(page('Admin Login', `
    <div class="card" style="max-width:420px;margin:8vh auto 0">
      <h1 class="h1">Admin Login</h1>
      <form class="stack" method="post" action="/admin/login">
        <input name="username" placeholder="Username" />
        <input name="password" type="password" placeholder="Password" />
        <button class="btn-primary" type="submit">Sign In</button>
      </form>
    </div>
  `));
});

adminRouter.post('/login', (req, res) => {
    const { username = '', password = '' } = req.body || {};
    if (!validateLogin(username, password)) {
        return res.status(401).send(page('Admin Login', `
      <div class="card" style="max-width:420px;margin:8vh auto 0">
        <div class="muted">Invalid credentials.</div>
      </div>
    `));
    }

    res.cookie('dd_admin', createSession(username), {
        httpOnly: true,
        sameSite: 'lax'
    });

    res.redirect('/admin');
});

adminRouter.get('/logout', (_req, res) => {
    res.clearCookie('dd_admin');
    res.redirect('/admin/login');
});

adminRouter.use(requireAdmin);

adminRouter.get('/', (_req, res) => {
    const posts = db.prepare('SELECT COUNT(*) count FROM posts').get().count;
    const topics = db.prepare('SELECT COUNT(*) count FROM helpdesk_topics').get().count;
    const articles = db.prepare('SELECT COUNT(*) count FROM helpdesk_articles').get().count;

    res.send(shell('Overview', `
    <div class="actions">
      <div class="card"><strong>Posts</strong><div class="muted">${posts} records</div></div>
      <div class="card"><strong>Topics</strong><div class="muted">${topics} records</div></div>
      <div class="card"><strong>Articles</strong><div class="muted">${articles} records</div></div>
    </div>
  `));
});

function postForm(row = {}) {
    return `<form class="stack" method="post" action="${row.id ? `/admin/posts/${row.id}` : '/admin/posts'}">
    <input name="title" placeholder="Title" value="${esc(row.title || '')}" />
    <input name="slug" placeholder="Slug" value="${esc(row.slug || '')}" />
    <textarea name="excerpt" placeholder="Excerpt">${esc(row.excerpt || '')}</textarea>
    <input name="cover_image" placeholder="Cover image URL" value="${esc(row.cover_image || '')}" />
    <input name="author" placeholder="Author" value="${esc(row.author || 'Buzzworthy')}" />
    <select name="status">
      <option value="draft" ${row.status === 'draft' ? 'selected' : ''}>draft</option>
      <option value="published" ${row.status === 'published' ? 'selected' : ''}>published</option>
    </select>
    <textarea name="content_json">${esc(row.content_json || '[{"type":"paragraph","text":"Body copy"}]')}</textarea>
    <div class="actions">
      <button class="btn-primary" type="submit">Save</button>
      ${row.id ? `<a class="btn" href="/admin/posts/${row.id}/delete">Delete</a>` : ''}
    </div>
  </form>`;
}

function pageForm(row = {}) {
  return `<form class="stack" method="post" action="${row.id ? `/admin/pages/${row.id}` : '/admin/pages'}">
    <input name="title" placeholder="Title" value="${esc(row.title || '')}" />
    <input name="slug" placeholder="Slug" value="${esc(row.slug || '')}" />
    <select name="page_type">
      <option value="standard" ${row.page_type === 'standard' ? 'selected' : ''}>standard</option>
      <option value="landing" ${row.page_type === 'landing' ? 'selected' : ''}>landing</option>
      <option value="service" ${row.page_type === 'service' ? 'selected' : ''}>service</option>
      <option value="article" ${row.page_type === 'article' ? 'selected' : ''}>article</option>
    </select>
    <select name="status">
      <option value="draft" ${row.status === 'draft' ? 'selected' : ''}>draft</option>
      <option value="published" ${row.status === 'published' ? 'selected' : ''}>published</option>
    </select>
    <input name="seo_title" placeholder="SEO title" value="${esc(row.seo_title || '')}" />
    <textarea name="seo_description" placeholder="SEO description">${esc(row.seo_description || '')}</textarea>
    <div class="actions">
      <button class="btn-primary" type="submit">Save</button>
      ${row.id ? `<a class="btn" href="/admin/pages/${row.id}/delete">Delete</a>` : ''}
    </div>
  </form>`;
}

function sectionForm(section = {}, pageId) {
  return `<form class="stack" method="post" action="${section.id ? `/admin/sections/${section.id}` : `/admin/pages/${pageId}/sections`}">
    <select name="section_type">
      <option value="pageHero" ${section.section_type === 'pageHero' ? 'selected' : ''}>pageHero</option>
      <option value="sectionHeader" ${section.section_type === 'sectionHeader' ? 'selected' : ''}>sectionHeader</option>
      <option value="featureGrid" ${section.section_type === 'featureGrid' ? 'selected' : ''}>featureGrid</option>
      <option value="processGrid" ${section.section_type === 'processGrid' ? 'selected' : ''}>processGrid</option>
      <option value="ctaPanel" ${section.section_type === 'ctaPanel' ? 'selected' : ''}>ctaPanel</option>
      <option value="articleBody" ${section.section_type === 'articleBody' ? 'selected' : ''}>articleBody</option>
      <option value="gallery" ${section.section_type === 'gallery' ? 'selected' : ''}>gallery</option>
      <option value="logoBand" ${section.section_type === 'logoBand' ? 'selected' : ''}>logoBand</option>
    </select>
    <input name="sort_order" type="number" value="${esc(section.sort_order ?? 0)}" />
    <textarea name="props_json">${esc(section.props_json || '{}')}</textarea>
    <div class="actions">
      <button class="btn-primary" type="submit">Save</button>
      ${section.id ? `<a class="btn" href="/admin/sections/${section.id}/delete">Delete</a>` : ''}
    </div>
  </form>`;
}

adminRouter.get('/posts', (_req, res) => {
    const rows = db.prepare(`
    SELECT * FROM posts
    ORDER BY datetime(COALESCE(published_at, updated_at)) DESC
  `).all();

    res.send(shell('Posts', `
    <div class="top" style="margin:0">
      <h2>Posts</h2>
      <a class="btn-primary" href="/admin/posts/new">New Post</a>
    </div>
    <table class="table">
      <thead><tr><th>Title</th><th>Status</th><th>Slug</th><th></th></tr></thead>
      <tbody>
        ${rows.map(r => `
          <tr>
            <td><strong>${esc(r.title)}</strong><div class="muted">${esc(r.excerpt || '')}</div></td>
            <td>${esc(r.status)}</td>
            <td>${esc(r.slug)}</td>
            <td class="actions"><a class="btn" href="/admin/posts/${r.id}">Edit</a></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `));
});

adminRouter.get('/posts/new', (_req, res) =>
    res.send(shell('New Post', `<h2>New Post</h2>${postForm({ status: 'draft' })}`))
);

adminRouter.get('/posts/:id', (req, res) => {
    const row = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
    if (!row) return res.status(404).send('Not found');
    res.send(shell('Edit Post', `<h2>Edit Post</h2>${postForm(row)}`));
});

adminRouter.post('/posts', (req, res) => {
    const now = nowIso();
    const title = String(req.body.title || '').trim();

    db.prepare(`
    INSERT INTO posts (
      slug, title, excerpt, cover_image, author, status, published_at,
      content_json, created_at, updated_at
    ) VALUES (
      @slug, @title, @excerpt, @cover_image, @author, @status, @published_at,
      @content_json, @created_at, @updated_at
    )
  `).run({
        slug: slugify(req.body.slug || title),
        title,
        excerpt: req.body.excerpt || '',
        cover_image: req.body.cover_image || '',
    author: req.body.author || 'Buzzworthy',
        status: req.body.status || 'draft',
        published_at: req.body.status === 'published' ? now : null,
        content_json: req.body.content_json || '[]',
        created_at: now,
        updated_at: now
    });

    res.redirect('/admin/posts');
});

adminRouter.post('/posts/:id', (req, res) => {
    const now = nowIso();
    const title = String(req.body.title || '').trim();

    db.prepare(`
    UPDATE posts
    SET slug=@slug, title=@title, excerpt=@excerpt, cover_image=@cover_image,
        author=@author, status=@status, published_at=@published_at,
        content_json=@content_json, updated_at=@updated_at
    WHERE id=@id
  `).run({
        id: req.params.id,
        slug: slugify(req.body.slug || title),
        title,
        excerpt: req.body.excerpt || '',
        cover_image: req.body.cover_image || '',
    author: req.body.author || 'Buzzworthy',
        status: req.body.status || 'draft',
        published_at: req.body.status === 'published' ? now : null,
        content_json: req.body.content_json || '[]',
        updated_at: now
    });

    res.redirect('/admin/posts');
});

adminRouter.get('/posts/:id/delete', (req, res) => {
    db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id);
    res.redirect('/admin/posts');
});

function topicForm(row = {}) {
    return `<form class="stack" method="post" action="${row.id ? `/admin/topics/${row.id}` : '/admin/topics'}">
    <input name="title" placeholder="Title" value="${esc(row.title || '')}" />
    <input name="slug" placeholder="Slug" value="${esc(row.slug || '')}" />
    <textarea name="description" placeholder="Description">${esc(row.description || '')}</textarea>
    <input name="sort_order" type="number" value="${esc(row.sort_order ?? 0)}" />
    <div class="actions">
      <button class="btn-primary" type="submit">Save</button>
      ${row.id ? `<a class="btn" href="/admin/topics/${row.id}/delete">Delete</a>` : ''}
    </div>
  </form>`;
}

adminRouter.get('/topics', (_req, res) => {
    const rows = db.prepare(`
    SELECT t.*, COUNT(a.id) article_count
    FROM helpdesk_topics t
    LEFT JOIN helpdesk_articles a ON a.topic_id = t.id
    GROUP BY t.id
    ORDER BY t.sort_order ASC, t.title ASC
  `).all();

    res.send(shell('Topics', `
    <div class="top" style="margin:0">
      <h2>Topics</h2>
      <a class="btn-primary" href="/admin/topics/new">New Topic</a>
    </div>
    <table class="table">
      <thead><tr><th>Title</th><th>Slug</th><th>Articles</th><th></th></tr></thead>
      <tbody>
        ${rows.map(r => `
          <tr>
            <td><strong>${esc(r.title)}</strong><div class="muted">${esc(r.description || '')}</div></td>
            <td>${esc(r.slug)}</td>
            <td>${r.article_count}</td>
            <td><a class="btn" href="/admin/topics/${r.id}">Edit</a></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `));
});

adminRouter.get('/topics/new', (_req, res) =>
    res.send(shell('New Topic', `<h2>New Topic</h2>${topicForm({ sort_order: 0 })}`))
);

adminRouter.get('/topics/:id', (req, res) => {
    const row = db.prepare('SELECT * FROM helpdesk_topics WHERE id = ?').get(req.params.id);
    if (!row) return res.status(404).send('Not found');
    res.send(shell('Edit Topic', `<h2>Edit Topic</h2>${topicForm(row)}`));
});

adminRouter.post('/topics', (req, res) => {
    const now = nowIso();
    const title = String(req.body.title || '').trim();

    db.prepare(`
    INSERT INTO helpdesk_topics (slug, title, description, sort_order, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
        slugify(req.body.slug || title),
        title,
        req.body.description || '',
        Number(req.body.sort_order || 0),
        now,
        now
    );

    res.redirect('/admin/topics');
});

adminRouter.post('/topics/:id', (req, res) => {
    const now = nowIso();
    const title = String(req.body.title || '').trim();

    db.prepare(`
    UPDATE helpdesk_topics
    SET slug=?, title=?, description=?, sort_order=?, updated_at=?
    WHERE id=?
  `).run(
        slugify(req.body.slug || title),
        title,
        req.body.description || '',
        Number(req.body.sort_order || 0),
        now,
        req.params.id
    );

    res.redirect('/admin/topics');
});

adminRouter.get('/topics/:id/delete', (req, res) => {
    db.prepare('DELETE FROM helpdesk_topics WHERE id = ?').run(req.params.id);
    res.redirect('/admin/topics');
});

function articleForm(row = {}, topics = []) {
    return `<form class="stack" method="post" action="${row.id ? `/admin/articles/${row.id}` : '/admin/articles'}">
    <input name="title" placeholder="Title" value="${esc(row.title || '')}" />
    <input name="slug" placeholder="Slug" value="${esc(row.slug || '')}" />
    <select name="topic_id">
      <option value="">Select topic</option>
      ${topics.map(t => `<option value="${t.id}" ${String(row.topic_id || '') === String(t.id) ? 'selected' : ''}>${esc(t.title)}</option>`).join('')}
    </select>
    <textarea name="excerpt" placeholder="Excerpt">${esc(row.excerpt || '')}</textarea>
    <select name="status">
      <option value="draft" ${row.status === 'draft' ? 'selected' : ''}>draft</option>
      <option value="published" ${row.status === 'published' ? 'selected' : ''}>published</option>
    </select>
    <textarea name="tags_json">${esc(row.tags_json || '[]')}</textarea>
    <textarea name="content_json">${esc(row.content_json || '[{"type":"paragraph","text":"Help article body"}]')}</textarea>
    <div class="actions">
      <button class="btn-primary" type="submit">Save</button>
      ${row.id ? `<a class="btn" href="/admin/articles/${row.id}/delete">Delete</a>` : ''}
    </div>
  </form>`;
}

adminRouter.get('/articles', (_req, res) => {
    const rows = db.prepare(`
    SELECT a.*, t.title topic_title
    FROM helpdesk_articles a
    LEFT JOIN helpdesk_topics t ON t.id = a.topic_id
    ORDER BY datetime(COALESCE(a.published_at, a.updated_at)) DESC
  `).all();

    res.send(shell('Articles', `
    <div class="top" style="margin:0">
      <h2>Articles</h2>
      <a class="btn-primary" href="/admin/articles/new">New Article</a>
    </div>
    <table class="table">
      <thead><tr><th>Title</th><th>Topic</th><th>Status</th><th>Slug</th><th></th></tr></thead>
      <tbody>
        ${rows.map(r => `
          <tr>
            <td><strong>${esc(r.title)}</strong><div class="muted">${esc(r.excerpt || '')}</div></td>
            <td>${esc(r.topic_title || '')}</td>
            <td>${esc(r.status)}</td>
            <td>${esc(r.slug)}</td>
            <td><a class="btn" href="/admin/articles/${r.id}">Edit</a></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `));
});

adminRouter.get('/articles/new', (_req, res) => {
    const topics = db.prepare('SELECT * FROM helpdesk_topics ORDER BY sort_order ASC, title ASC').all();
    res.send(shell('New Article', `<h2>New Article</h2>${articleForm({ status: 'draft' }, topics)}`));
});

adminRouter.get('/articles/:id', (req, res) => {
    const row = db.prepare('SELECT * FROM helpdesk_articles WHERE id = ?').get(req.params.id);
    const topics = db.prepare('SELECT * FROM helpdesk_topics ORDER BY sort_order ASC, title ASC').all();
    if (!row) return res.status(404).send('Not found');
    res.send(shell('Edit Article', `<h2>Edit Article</h2>${articleForm(row, topics)}`));
});

adminRouter.post('/articles', (req, res) => {
    const now = nowIso();
    const title = String(req.body.title || '').trim();

    db.prepare(`
    INSERT INTO helpdesk_articles (
      slug, topic_id, title, excerpt, status, published_at,
      tags_json, content_json, created_at, updated_at
    ) VALUES (
      @slug, @topic_id, @title, @excerpt, @status, @published_at,
      @tags_json, @content_json, @created_at, @updated_at
    )
  `).run({
        slug: slugify(req.body.slug || title),
        topic_id: req.body.topic_id ? Number(req.body.topic_id) : null,
        title,
        excerpt: req.body.excerpt || '',
        status: req.body.status || 'draft',
        published_at: req.body.status === 'published' ? now : null,
        tags_json: req.body.tags_json || '[]',
        content_json: req.body.content_json || '[]',
        created_at: now,
        updated_at: now
    });

    res.redirect('/admin/articles');
});

adminRouter.post('/articles/:id', (req, res) => {
    const now = nowIso();
    const title = String(req.body.title || '').trim();

    db.prepare(`
    UPDATE helpdesk_articles
    SET slug=@slug, topic_id=@topic_id, title=@title, excerpt=@excerpt,
        status=@status, published_at=@published_at, tags_json=@tags_json,
        content_json=@content_json, updated_at=@updated_at
    WHERE id=@id
  `).run({
        id: req.params.id,
        slug: slugify(req.body.slug || title),
        topic_id: req.body.topic_id ? Number(req.body.topic_id) : null,
        title,
        excerpt: req.body.excerpt || '',
        status: req.body.status || 'draft',
        published_at: req.body.status === 'published' ? now : null,
        tags_json: req.body.tags_json || '[]',
        content_json: req.body.content_json || '[]',
        updated_at: now
    });

    res.redirect('/admin/articles');
});

adminRouter.get('/articles/:id/delete', (req, res) => {
    db.prepare('DELETE FROM helpdesk_articles WHERE id = ?').run(req.params.id);
    res.redirect('/admin/articles');
});

adminRouter.get('/pages', (_req, res) => {
  const rows = db.prepare(`
    SELECT *
    FROM pages
    ORDER BY updated_at DESC
  `).all();

  res.send(shell('Pages', `
    <div class="top" style="margin:0">
      <h2>Pages</h2>
      <a class="btn-primary" href="/admin/pages/new">New Page</a>
    </div>
    <table class="table">
      <thead><tr><th>Title</th><th>Slug</th><th>Type</th><th>Status</th><th></th></tr></thead>
      <tbody>
        ${rows.map(r => `
          <tr>
            <td><strong>${esc(r.title)}</strong></td>
            <td>${esc(r.slug)}</td>
            <td>${esc(r.page_type)}</td>
            <td>${esc(r.status)}</td>
            <td><a class="btn" href="/admin/pages/${r.id}">Edit</a></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `));
});

adminRouter.get('/pages/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM pages WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).send('Not found');

  const sections = db.prepare(`
    SELECT *
    FROM page_sections
    WHERE page_id = ?
    ORDER BY sort_order ASC, id ASC
  `).all(req.params.id);

  res.send(shell('Edit Page', `
    <h2>Edit Page</h2>
    ${pageForm(row)}
    <div class="top" style="margin:1rem 0 0">
      <h3>Sections</h3>
      <a class="btn-primary" href="/admin/pages/${row.id}/sections/new">Add Section</a>
    </div>
    <table class="table">
      <thead><tr><th>Type</th><th>Sort</th><th>Props</th><th></th></tr></thead>
      <tbody>
        ${sections.map(s => `
          <tr>
            <td>${esc(s.section_type)}</td>
            <td>${s.sort_order}</td>
            <td><code>${esc(s.props_json.slice(0, 140))}</code></td>
            <td><a class="btn" href="/admin/sections/${s.id}">Edit</a></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `));
});

adminRouter.post('/pages', (req, res) => {
  const now = nowIso();
  const title = String(req.body.title || '').trim();

  db.prepare(`
    INSERT INTO pages (slug, title, page_type, status, seo_title, seo_description, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    slugify(req.body.slug || title),
    title,
    req.body.page_type || 'standard',
    req.body.status || 'draft',
    req.body.seo_title || '',
    req.body.seo_description || '',
    now,
    now
  );

  res.redirect('/admin/pages');
});

adminRouter.post('/pages/:id', (req, res) => {
  const now = nowIso();
  const title = String(req.body.title || '').trim();

  db.prepare(`
    UPDATE pages
    SET slug=?, title=?, page_type=?, status=?, seo_title=?, seo_description=?, updated_at=?
    WHERE id=?
  `).run(
    slugify(req.body.slug || title),
    title,
    req.body.page_type || 'standard',
    req.body.status || 'draft',
    req.body.seo_title || '',
    req.body.seo_description || '',
    now,
    req.params.id
  );

  res.redirect(`/admin/pages/${req.params.id}`);
});

adminRouter.get('/pages/:id/delete', (req, res) => {
  db.prepare('DELETE FROM pages WHERE id = ?').run(req.params.id);
  res.redirect('/admin/pages');
});

adminRouter.get('/pages/:id/sections/new', (req, res) => {
  res.send(shell('New Section', `<h2>New Section</h2>${sectionForm({ sort_order: 0 }, req.params.id)}`));
});

adminRouter.post('/pages/:id/sections', (req, res) => {
  const now = nowIso();

  db.prepare(`
    INSERT INTO page_sections (page_id, section_type, sort_order, props_json, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    req.params.id,
    req.body.section_type || 'sectionHeader',
    Number(req.body.sort_order || 0),
    req.body.props_json || '{}',
    now,
    now
  );

  res.redirect(`/admin/pages/${req.params.id}`);
});

adminRouter.get('/sections/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM page_sections WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).send('Not found');

  res.send(shell('Edit Section', `<h2>Edit Section</h2>${sectionForm(row, row.page_id)}`));
});

adminRouter.post('/sections/:id', (req, res) => {
  const now = nowIso();
  const row = db.prepare('SELECT page_id FROM page_sections WHERE id = ?').get(req.params.id);

  db.prepare(`
    UPDATE page_sections
    SET section_type=?, sort_order=?, props_json=?, updated_at=?
    WHERE id=?
  `).run(
    req.body.section_type || 'sectionHeader',
    Number(req.body.sort_order || 0),
    req.body.props_json || '{}',
    now,
    req.params.id
  );

  res.redirect(`/admin/pages/${row.page_id}`);
});

adminRouter.get('/sections/:id/delete', (req, res) => {
  const row = db.prepare('SELECT page_id FROM page_sections WHERE id = ?').get(req.params.id);
  db.prepare('DELETE FROM page_sections WHERE id = ?').run(req.params.id);
  res.redirect(`/admin/pages/${row.page_id}`);
});