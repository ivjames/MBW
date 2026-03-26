export function resolveRoute() {
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');

    if (path === '/blog' && slug) {
        return { page: 'post', path, slug };
    }

    if (path === '/helpdesk' && slug) {
        return { page: 'topic', path, slug };
    }

    if (path === '/topic' && slug) {
        return { page: 'topic', path, slug };
    }

    if (path === '/article' && slug) {
        return { page: 'article', path, slug };
    }

    const routeMap = {
        '/': 'home',
        '/services': 'services',
        '/works': 'works',
        '/blog': 'blog',
        '/helpdesk': 'helpdesk',
        '/about': 'about',
        '/contact': 'contact',
        '/marketing': 'marketing',
        '/development': 'development',
        '/web-design': 'web-design',
        '/seo-optimisation': 'seo-optimisation',
        '/ecommerce': 'ecommerce',
        '/branding': 'branding'
    };

    return {
        page: routeMap[path] || 'home',
        path,
        slug
    };
}

export function navigate(url) {
    window.history.pushState({}, '', url);
    window.dispatchEvent(new Event('app:navigate'));
}