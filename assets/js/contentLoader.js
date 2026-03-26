import { resolveRoute } from './router.js';

export async function loadJSON(path) {
  const res = await fetch(path, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to load ${path} (${res.status})`);
  return res.json();
}

export async function loadSiteContent(page) {
  const { slug } = resolveRoute();
  const site = await loadJSON('/api/site');

  if (page === 'blog') {
    return { site, pageContent: await loadJSON('/api/blog') };
  }

  if (page === 'post') {
    if (!slug) throw new Error('Missing blog slug.');
    return { site, pageContent: await loadJSON(`/api/blog/${slug}`) };
  }

  if (page === 'helpdesk') {
    return { site, pageContent: await loadJSON('/api/helpdesk') };
  }

  if (page === 'topic') {
    if (!slug) throw new Error('Missing topic slug.');
    return { site, pageContent: await loadJSON(`/api/helpdesk/topic/${slug}`) };
  }

  if (page === 'article') {
    if (!slug) throw new Error('Missing article slug.');
    return { site, pageContent: await loadJSON(`/api/helpdesk/article/${slug}`) };
  }

  const pageMap = {
    home: '/content/pages/home.json',
    services: '/content/pages/services.json',
    works: '/content/pages/works.json',
    about: '/content/pages/about.json',
    contact: '/content/pages/contact.json',
    marketing: '/content/services/marketing.json',
    development: '/content/services/development.json',
    'web-design': '/content/services/web-design.json',
    'seo-optimisation': '/content/services/seo-optimisation.json',
    ecommerce: '/content/services/ecommerce.json',
    branding: '/content/services/branding.json'
  };

  return {
    site,
    pageContent: await loadJSON(pageMap[page] || pageMap.home)
  };
}