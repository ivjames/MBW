import { resolveRoute } from './router.js';

export async function loadJSON(path) {
  const res = await fetch(path, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error(`Failed to load ${path} (${res.status})`);
  }

  return res.json();
}

export async function loadSiteContent(page) {
  const { slug } = resolveRoute();
  const site = await loadJSON('/api/site');

  if (page === 'blog') {
    return {
      site,
      pageContent: await loadJSON('/api/blog')
    };
  }

  if (page === 'post') {
    if (!slug) throw new Error('Missing blog slug.');

    return {
      site,
      pageContent: await loadJSON(`/api/blog/${slug}`)
    };
  }

  if (page === 'helpdesk') {
    return {
      site,
      pageContent: await loadJSON('/api/helpdesk')
    };
  }

  if (page === 'topic') {
    if (!slug) throw new Error('Missing topic slug.');

    return {
      site,
      pageContent: await loadJSON(`/api/helpdesk/topic/${slug}`)
    };
  }

  if (page === 'article') {
    if (!slug) throw new Error('Missing article slug.');

    return {
      site,
      pageContent: await loadJSON(`/api/helpdesk/article/${slug}`)
    };
  }

  if (page === 'works') {
    return {
      site,
      pageContent: await loadJSON('/api/works')
    };
  }

  if (page === 'work') {
    if (!slug) throw new Error('Missing work slug.');
    return {
      site,
      pageContent: await loadJSON(`/api/works/${slug}`)
    };
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

  if (dbPageSlugs.has(page)) {
    return {
      site,
      pageContent: await loadJSON(`/api/pages/${page}`)
    };
  }

  const filePageMap = {
    home: '/content/pages/home.json',
    contact: '/content/pages/contact.json'
  };

  const path = filePageMap[page] || filePageMap.home;

  return {
    site,
    pageContent: await loadJSON(path)
  };
}