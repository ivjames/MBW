const dbPages = new Set([
    'about',
    'services',
    'marketing',
    'development',
    'web-design',
    'seo-optimisation',
    'ecommerce',
    'branding'
]);

export async function resolvePageRenderer(page) {
    if (page === 'home' || !page) {
        const { HomePage } = await import('../sections/home.js');
        return (pageContent, site) => HomePage({ home: pageContent, ...site });
    }

    if (dbPages.has(page)) {
        const { DbPage } = await import('../sections/dbPage.js');
        return (pageContent, site) => DbPage(pageContent, site, page);
    }

    if (page === 'works') {
        const { WorksPage } = await import('../sections/worksPage.js');
        return pageContent => WorksPage(pageContent);
    }

    if (page === 'work') {
        const { WorkDetailPage } = await import('../sections/workDetailPage.js');
        return pageContent => WorkDetailPage(pageContent);
    }

    if (page === 'blog') {
        const { BlogPage } = await import('../sections/blogPage.js');
        return pageContent => BlogPage(pageContent);
    }

    if (page === 'post') {
        const { BlogPostPage } = await import('../sections/blogPostPage.js');
        return pageContent => BlogPostPage(pageContent);
    }

    if (page === 'helpdesk') {
        const { HelpdeskPage } = await import('../sections/helpdeskPage.js');
        return pageContent => HelpdeskPage(pageContent);
    }

    if (page === 'topic') {
        const { HelpdeskTopicPage } = await import('../sections/helpdeskTopicPage.js');
        return pageContent => HelpdeskTopicPage(pageContent);
    }

    if (page === 'article') {
        const { HelpdeskArticlePage } = await import('../sections/helpdeskArticlePage.js');
        return pageContent => HelpdeskArticlePage(pageContent);
    }

    if (page === 'contact') {
        const { ContactPage } = await import('../sections/contactPage.js');
        return (pageContent, site) => ContactPage(pageContent, site.company);
    }

    if (page === 'build-from-scratch') {
        const { BuildFromScratchPage } = await import('../sections/buildFromScratchPage.js');
        return pageContent => BuildFromScratchPage(pageContent);
    }

    const { HomePage } = await import('../sections/home.js');
    return (pageContent, site) => HomePage({ home: pageContent, ...site });
}

export async function renderPage(page, pageContent, site) {
    const renderer = await resolvePageRenderer(page);
    return renderer(pageContent, site);
}