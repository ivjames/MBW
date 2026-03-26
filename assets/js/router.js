export function resolveRoute() {
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');

    const routeMap = {
        '/': 'home',
        '/services': 'services',
        '/works': 'works',
        '/blog': slug ? 'post' : 'blog',
        '/helpdesk': slug ? 'topic' : 'helpdesk',
        '/article': 'article',
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