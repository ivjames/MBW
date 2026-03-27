import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db, nowIso, slugify } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

function readJSON(relPath) {
    const full = path.join(projectRoot, relPath);
    return JSON.parse(fs.readFileSync(full, 'utf8'));
}

function clearPageBySlug(slug) {
    const page = db.prepare('SELECT id FROM pages WHERE slug = ?').get(slug);
    if (!page) return;
    db.prepare('DELETE FROM page_sections WHERE page_id = ?').run(page.id);
    db.prepare('DELETE FROM pages WHERE id = ?').run(page.id);
}

function insertPage({ slug, title, pageType = 'standard', seoTitle = '', seoDescription = '', status = 'published' }) {
    const now = nowIso();
    const result = db.prepare(`
    INSERT INTO pages (
      slug, title, page_type, status, seo_title, seo_description, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
        slug,
        title,
        pageType,
        status,
        seoTitle,
        seoDescription,
        now,
        now
    );

    return result.lastInsertRowid;
}

function insertSection(pageId, sectionType, sortOrder, props) {
    const now = nowIso();
    db.prepare(`
    INSERT INTO page_sections (
      page_id, section_type, sort_order, props_json, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?)
  `).run(
        pageId,
        sectionType,
        sortOrder,
        JSON.stringify(props ?? {}),
        now,
        now
    );
}

function importAbout() {
    const data = readJSON('content/pages/about.json');
    const slug = 'about';

    clearPageBySlug(slug);

    const pageId = insertPage({
        slug,
        title: data.hero?.title || 'About',
        pageType: 'standard',
        seoTitle: data.hero?.title || 'About',
        seoDescription: data.hero?.lead || ''
    });

    let sort = 10;

    if (data.hero) {
        insertSection(pageId, 'pageHero', sort, data.hero);
        sort += 10;
    }

    if (data.intro) {
        insertSection(pageId, 'sectionHeader', sort, data.intro);
        sort += 10;
    }

    if (Array.isArray(data.blocks) && data.blocks.length) {
        insertSection(pageId, 'featureGrid', sort, { items: data.blocks });
        sort += 10;
    }

    if (data.story?.title || (Array.isArray(data.story?.steps) && data.story.steps.length)) {
        if (data.story?.eyebrow || data.story?.title || data.story?.lead) {
            insertSection(pageId, 'sectionHeader', sort, {
                eyebrow: data.story.eyebrow,
                title: data.story.title,
                lead: data.story.lead
            });
            sort += 10;
        }

        insertSection(pageId, 'processGrid', sort, {
            items: data.story?.steps || []
        });
        sort += 10;
    }

    if (data.values?.title || (Array.isArray(data.values?.items) && data.values.items.length)) {
        insertSection(pageId, 'sectionHeader', sort, {
            eyebrow: data.values.eyebrow,
            title: data.values.title,
            lead: data.values.lead || ''
        });
        sort += 10;

        insertSection(pageId, 'featureGrid', sort, {
            items: data.values.items || []
        });
        sort += 10;
    }

    if (data.cta) {
        insertSection(pageId, 'ctaPanel', sort, {
            title: data.cta.title || '',
            body: data.cta.body || '',
            actions: [
                { label: 'Contact Us', href: '/contact', variant: 'primary' },
                { label: 'View Services', href: '/services', variant: 'secondary' }
            ]
        });
    }

    console.log(`Imported page: ${slug}`);
}

function importServices() {
    const data = readJSON('content/pages/services.json');
    const slug = 'services';

    clearPageBySlug(slug);

    const pageId = insertPage({
        slug,
        title: data.hero?.title || 'Services',
        pageType: 'standard',
        seoTitle: data.hero?.title || 'Services',
        seoDescription: data.hero?.lead || ''
    });

    let sort = 10;

    if (data.hero) {
        insertSection(pageId, 'pageHero', sort, {
            ...data.hero,
            image: data.hero?.image || 'https://picsum.photos/seed/deepdigital-services/1600/1000'
        });
        sort += 10;
    }

    insertSection(pageId, 'sectionHeader', sort, {
        eyebrow: 'Core services',
        title: 'A broader service stack, organized clearly.',
        lead: 'Marketing, development, design, SEO, ecommerce, and branding are grouped into a cleaner service architecture.'
    });
    sort += 10;

    if (Array.isArray(data.services) && data.services.length) {
        insertSection(pageId, 'featureGrid', sort, { items: data.services });
        sort += 10;
    }

    insertSection(pageId, 'sectionHeader', sort, {
        eyebrow: 'Delivery model',
        title: 'Strategy through support.',
        lead: 'The public site outlines a four-part path: strategy, design, develop, and support.'
    });
    sort += 10;

    if (Array.isArray(data.process) && data.process.length) {
        insertSection(pageId, 'processGrid', sort, { items: data.process });
    }

    console.log(`Imported page: ${slug}`);
}

function importWorks() {
    const data = readJSON('content/pages/works.json');
    const slug = 'works';

    clearPageBySlug(slug);

    const pageId = insertPage({
        slug,
        title: data.hero?.title || 'Works',
        pageType: 'standard',
        seoTitle: data.hero?.title || 'Works',
        seoDescription: data.hero?.lead || ''
    });

    let sort = 10;

    if (data.hero) {
        insertSection(pageId, 'pageHero', sort, data.hero);
        sort += 10;
    }

    if (data.intro) {
        insertSection(pageId, 'sectionHeader', sort, {
            eyebrow: 'Gallery',
            title: data.intro.title || 'Project gallery',
            lead: data.intro.lead || ''
        });
        sort += 10;
    }

    insertSection(pageId, 'gallery', sort, {
        filters: data.filters || ['All'],
        projects: data.projects || []
    });
    sort += 10;

    if (data.cta) {
        insertSection(pageId, 'ctaPanel', sort, {
            title: data.cta.title || '',
            body: data.cta.body || '',
            actions: [
                { label: 'Contact Us', href: '/contact', variant: 'primary' },
                { label: 'View Services', href: '/services', variant: 'secondary' }
            ]
        });
    }

    console.log(`Imported page: ${slug}`);
}

function importHome() {
    const data = readJSON('content/pages/home.json');
    const slug = 'home';

    clearPageBySlug(slug);

    const pageId = insertPage({
        slug,
        title: 'Home',
        pageType: 'landing',
        seoTitle: data.hero?.title?.replace(/<[^>]+>/g, '') || 'Home',
        seoDescription: data.hero?.lead || ''
    });

    let sort = 10;

    if (Array.isArray(data.logos) && data.logos.length) {
        insertSection(pageId, 'logoBand', sort, {
            items: data.logos
        });
        sort += 10;
    }

    if (Array.isArray(data.services) && data.services.length) {
        insertSection(pageId, 'sectionHeader', sort, {
            eyebrow: 'Core services',
            title: 'Marketing, development, and design working as one system.',
            lead: 'The homepage should introduce the service stack clearly without forcing users to dig through separate pages before they understand the offer.'
        });
        sort += 10;

        insertSection(pageId, 'featureGrid', sort, {
            items: data.services
        });
        sort += 10;
    }

    if (Array.isArray(data.cases) && data.cases.length) {
        insertSection(pageId, 'sectionHeader', sort, {
            eyebrow: 'Selected work',
            title: 'Recent projects and proof of direction.',
            lead: 'Use this area to show outcome-oriented work, project categories, and short context without turning the homepage into a full case-study archive.'
        });
        sort += 10;

        insertSection(pageId, 'gallery', sort, {
            filters: ['All', ...new Set(data.cases.map(item => item.badge || 'Work'))],
            projects: data.cases.map(item => ({
                title: item.title || '',
                category: item.badge || 'Work',
                image: item.image || '',
                summary: item.body || '',
                metrics: (item.stats || []).map(stat => `${stat.value} ${stat.label}`)
            }))
        });
        sort += 10;
    }

    if (data.system?.title || Array.isArray(data.system?.pillars)) {
        insertSection(pageId, 'sectionHeader', sort, {
            eyebrow: 'System',
            title: data.system?.title || '',
            lead: data.system?.lead || ''
        });
        sort += 10;

        insertSection(pageId, 'featureGrid', sort, {
            items: data.system?.pillars || []
        });
        sort += 10;
    }

    if (Array.isArray(data.system?.process) && data.system.process.length) {
        insertSection(pageId, 'processGrid', sort, {
            items: data.system.process
        });
        sort += 10;
    }

    if (data.cta) {
        insertSection(pageId, 'ctaPanel', sort, {
            title: data.cta.title || '',
            body: data.cta.body || '',
            actions: data.cta.actions || [
                { label: 'Start the Project', href: '/contact', variant: 'primary' },
                { label: 'Review Services', href: '/services', variant: 'secondary' }
            ]
        });
    }

    console.log(`Imported page: ${slug}`);
}

function importServiceDetail(filename, slugOverride = null) {
    const rel = `content/services/${filename}`;
    const data = readJSON(rel);
    const slug = slugOverride || filename.replace(/\.json$/, '');

    clearPageBySlug(slug);

    const pageId = insertPage({
        slug,
        title: data.hero?.title || slug,
        pageType: 'service',
        seoTitle: data.meta?.title || data.hero?.title || slug,
        seoDescription: data.meta?.description || data.hero?.lead || ''
    });

    let sort = 10;

    if (data.hero) {
        insertSection(pageId, 'pageHero', sort, data.hero);
        sort += 10;
    }

    if (Array.isArray(data.sections) && data.sections.length) {
        insertSection(pageId, 'featureGrid', sort, {
            items: data.sections
        });
        sort += 10;
    }

    if (data.cta) {
        insertSection(pageId, 'ctaPanel', sort, {
            title: data.cta.title || '',
            body: data.cta.body || '',
            actions: [
                { label: 'Contact Us', href: '/contact', variant: 'primary' },
                { label: 'View All Services', href: '/services', variant: 'secondary' }
            ]
        });
    }

    console.log(`Imported service page: ${slug}`);
}

function main() {
    importHome();
    importAbout();
    importServices();
    importWorks();

    importServiceDetail('marketing.json');
    importServiceDetail('development.json');
    importServiceDetail('web-design.json');
    importServiceDetail('seo-optimisation.json');
    importServiceDetail('ecommerce.json');
    importServiceDetail('branding.json');

    console.log('Page import complete.');
}

main();