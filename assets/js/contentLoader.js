import { resolveRoute } from './router.js';

export async function loadJSON(path) {
  const res = await fetch(path, { credentials: 'include' });

  if (!res.ok) {
    throw new Error(`Failed to load ${path} (${res.status})`);
  }

  return res.json();
}

export async function loadSiteContent(page) {
  const { slug } = resolveRoute();
  const sitePromise = loadJSON('/api/site');
  let pagePromise;

  if (page === 'blog') {
    pagePromise = loadJSON('/api/blog');
  } else if (page === 'post') {
    if (!slug) throw new Error('Missing blog slug.');
    pagePromise = loadJSON(`/api/blog/${slug}`);
  } else if (page === 'helpdesk') {
    pagePromise = loadJSON('/api/helpdesk');
  } else if (page === 'topic') {
    if (!slug) throw new Error('Missing topic slug.');
    pagePromise = loadJSON(`/api/helpdesk/topic/${slug}`);
  } else if (page === 'article') {
    if (!slug) throw new Error('Missing article slug.');
    pagePromise = loadJSON(`/api/helpdesk/article/${slug}`);
  } else if (page === 'works') {
    pagePromise = loadJSON('/api/works');
  } else if (page === 'work') {
    if (!slug) throw new Error('Missing work slug.');
    pagePromise = loadJSON(`/api/works/${slug}`);
  }

  const dbPageSlugs = new Set([
    'about',
    'services',
    'works',
    'marketing',
    'development',
    'web-design',
    'seo-optimisation',
    'ecommerce',
    'branding'
  ]);

  if (!pagePromise && dbPageSlugs.has(page)) {
    pagePromise = loadJSON(`/api/pages/${page}`);
  }

  if (!pagePromise) {
    const filePageMap = {
      home: '/content/pages/home.json',
      contact: '/content/pages/contact.json',
      'build-from-scratch': '/content/pages/build-from-scratch.json'
    };

    const path = filePageMap[page] || filePageMap.home;
    pagePromise = loadJSON(path);
  }

  const [site, pageContent] = await Promise.all([sitePromise, pagePromise]);
  return { site, pageContent };
}