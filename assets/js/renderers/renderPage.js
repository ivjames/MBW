import { HomePage } from '../sections/home.js';
import { WorksPage } from '../sections/worksPage.js';
import { WorkDetailPage } from '../sections/workDetailPage.js';
import { BlogPage } from '../sections/blogPage.js';
import { BlogPostPage } from '../sections/blogPostPage.js';
import { HelpdeskPage } from '../sections/helpdeskPage.js';
import { HelpdeskTopicPage } from '../sections/helpdeskTopicPage.js';
import { HelpdeskArticlePage } from '../sections/helpdeskArticlePage.js';
import { ContactPage } from '../sections/contactPage.js';
import { DbPage } from '../sections/dbPage.js';

function renderHome(pageContent, site) {
    return HomePage({ home: pageContent, ...site });
}

function renderWorks(pageContent) {
    return WorksPage(pageContent);
}

function renderWorkDetail(pageContent) {
    return WorkDetailPage(pageContent);
}

function renderBlog(pageContent) {
    return BlogPage(pageContent);
}

function renderBlogPost(pageContent) {
    return BlogPostPage(pageContent);
}

function renderHelpdesk(pageContent) {
    return HelpdeskPage(pageContent);
}

function renderHelpdeskTopic(pageContent) {
    return HelpdeskTopicPage(pageContent);
}

function renderHelpdeskArticle(pageContent) {
    return HelpdeskArticlePage(pageContent);
}

function renderContact(pageContent, site) {
    return ContactPage(pageContent, site.company);
}

function renderDbPage(pageContent) {
    return DbPage(pageContent);
}

const rendererMap = {
    home: renderHome,

    about: renderDbPage,
    services: renderDbPage,
    marketing: renderDbPage,
    development: renderDbPage,
    'web-design': renderDbPage,
    'seo-optimisation': renderDbPage,
    ecommerce: renderDbPage,
    branding: renderDbPage,

    works: renderWorks,
    work: renderWorkDetail,

    blog: renderBlog,
    post: renderBlogPost,
    helpdesk: renderHelpdesk,
    topic: renderHelpdeskTopic,
    article: renderHelpdeskArticle,
    contact: renderContact
};

export function renderPage(page, pageContent, site) {
    const renderer = rendererMap[page] || rendererMap.home;
    return renderer(pageContent, site);
}