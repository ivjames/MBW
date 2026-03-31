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
    const slug = 'about';

    clearPageBySlug(slug);

    const pageId = insertPage({
        slug,
        title: 'About Us',
        pageType: 'standard',
        seoTitle: 'About Us',
        seoDescription: 'About Us'
    });

    let sort = 10;

    insertSection(pageId, 'pageHero', sort, {
        eyebrow: 'About Us',
        title: 'Getting online is easy. Succeeding online is a different story.',
        lead: 'We build web design, marketing, and branding systems that do more than look modern. They clarify the offer, support trust, and help turn attention into qualified leads.',
        image: 'https://picsum.photos/seed/agency-about-main/467/300.webp',
        meta: ['Web Design', 'Marketing', 'Branding'],
        actions: [
            { label: 'Book a Call', href: '/contact', variant: 'primary' },
            { label: 'View Services', href: '/services', variant: 'secondary' }
        ]
    });
    sort += 10;

    insertSection(pageId, 'sectionHeader', sort, {
        eyebrow: 'Why we exist',
        title: 'Built around growth, not just presentation.',
        lead: 'A strong site should do more than look polished. It should help visitors understand what the business does, why it matters, and what to do next.'
    });
    sort += 10;

    insertSection(pageId, 'featureGrid', sort, {
        items: [
            {
                kicker: '01',
                title: 'Web Design That Performs',
                copy: 'We design pages for trust, clarity, and conversion instead of treating design as decoration.'
            },
            {
                kicker: '02',
                title: 'Marketing With Structure',
                copy: 'Marketing, branding, SEO, and development work better when they reinforce each other.'
            },
            {
                kicker: '03',
                title: 'B2B-Aware Thinking',
                copy: 'Messaging, website structure, and content all play a different role when the sales cycle is longer.'
            }
        ]
    });
    sort += 10;

    insertSection(pageId, 'sectionHeader', sort, {
        eyebrow: 'How we work',
        title: 'Strategy, design, development, and support are one system.',
        lead: 'The public site lays out a four-step flow: strategy, design, develop, and support.'
    });
    sort += 10;

    insertSection(pageId, 'processGrid', sort, {
        items: [
            {
                step: '01',
                title: 'Strategy',
                copy: 'We define the competition, audience, and what is already working before making design decisions.'
            },
            {
                step: '02',
                title: 'Design',
                copy: 'We shape the layout, hierarchy, color system, and brand presentation into something clear and usable.'
            },
            {
                step: '03',
                title: 'Develop',
                copy: 'We turn approved direction into a working site or modular content system that can actually be maintained.'
            },
            {
                step: '04',
                title: 'Support',
                copy: 'Launch is not the end state. Design, marketing, and maintenance continue to support growth after the site goes live.'
            }
        ]
    });
    sort += 10;

    insertSection(pageId, 'sectionHeader', sort, {
        eyebrow: 'What matters',
        title: 'Clear positioning. Stronger trust. Better lead quality.',
        lead: ''
    });
    sort += 10;

    insertSection(pageId, 'featureGrid', sort, {
        items: [
            {
                title: 'Clarity over clutter',
                copy: 'Visitors should understand what the company does, who it helps, and why it is credible without digging.'
            },
            {
                title: 'Systems over one-offs',
                copy: 'Design, development, branding, and marketing should reinforce each other instead of competing for attention.'
            },
            {
                title: 'Growth over vanity',
                copy: 'The goal is not just a nicer site. The goal is a site that supports real business outcomes.'
            }
        ]
    });
    sort += 10;

    insertSection(pageId, 'ctaPanel', sort, {
        title: 'Need a cleaner About page than the template version?',
        body: 'This page replaces generic agency filler with a more credible story built around actual services, process, and business value.',
        actions: [
            { label: 'Contact Us', href: '/contact', variant: 'primary' },
            { label: 'View Services', href: '/services', variant: 'secondary' }
        ]
    });

    console.log(`Imported page: ${slug}`);
}

function importAllServicePages() {
    importServicePage({
        slug: 'marketing',
        title: 'Marketing',
        description: 'We use strategic marketing tactics that have been proven to work. But strategy only matters when it is tied to the right audience, the right offer, and a system that can turn attention into qualified leads.',
        heroImage: 'https://picsum.photos/seed/agency-marketing/467/300.webp',
        mainItems: [
            {
                title: 'Campaign Strategy',
                copy: 'We start by clarifying who you want to reach, what they actually care about, and what kind of campaign structure makes sense for your market. That keeps the work focused and prevents wasted spend.'
            },
            {
                title: 'Paid and Social',
                copy: 'From PPC campaigns to social media support, we help put the right message in front of the right audience with a cleaner path from click to conversion.'
            },
            {
                title: 'Positioning and Offer Clarity',
                copy: 'Strong marketing is not only distribution. It depends on a clear offer, a stronger value story, and landing pages that support belief instead of creating friction.'
            },
            {
                title: 'Lead-Generation Focus',
                copy: 'The goal is not just reach. The goal is qualified demand. We align traffic, messaging, and page structure around lead quality rather than vanity numbers.'
            }
        ],
        includeItems: [
            'Campaign planning',
            'Audience targeting',
            'Paid media support',
            'Landing-page messaging',
            'Lead-generation optimization',
            'Performance review'
        ],
        processItems: [
            { step: '01', title: 'Define', copy: 'Clarify audience, offer, and acquisition priorities.' },
            { step: '02', title: 'Build', copy: 'Shape campaigns, messaging, and supporting pages.' },
            { step: '03', title: 'Improve', copy: 'Tighten based on performance and lead quality.' }
        ],
        ctaTitle: 'Need a marketing system that actually supports sales?',
        ctaBody: 'Replace broad filler with real channels, campaign examples, and proof once you have live client work.'
    });

    importServicePage({
        slug: 'development',
        title: 'Development',
        description: 'Custom programming for the most complex functions you can think of. We build the systems, modules, and integrations that remove friction from your operations and make the site easier to grow.',
        heroImage: 'https://picsum.photos/seed/agency-development/467/300.webp',
        mainItems: [
            {
                title: 'Custom Features',
                copy: 'We build custom functionality for business workflows, integrations, and content systems that cannot be solved well with templates alone.'
            },
            {
                title: 'Modular Architecture',
                copy: 'Clean structure matters. A modular codebase makes the site easier to extend, easier to maintain, and less likely to collapse into technical debt later.'
            },
            {
                title: 'Business Workflow Support',
                copy: 'Development is not just about visible UI. It also includes the behind-the-scenes logic that makes publishing, routing, forms, and internal processes more reliable.'
            },
            {
                title: 'Self-Hosted Practicality',
                copy: 'We favor systems that are understandable, portable, and maintainable. That means fewer hidden dependencies and a cleaner handoff when the project grows.'
            }
        ],
        includeItems: [
            'Custom modules',
            'Content systems',
            'API integrations',
            'Form and workflow logic',
            'Refactoring and cleanup',
            'Deployment support'
        ],
        processItems: [
            { step: '01', title: 'Scope', copy: 'Define the functional requirements and system constraints.' },
            { step: '02', title: 'Build', copy: 'Develop modular features in a clean, testable structure.' },
            { step: '03', title: 'Stabilize', copy: 'Refine edge cases, handoff paths, and maintainability.' }
        ],
        ctaTitle: 'Need custom development without a fragile mess?',
        ctaBody: 'Replace filler with real integrations, architecture notes, and before-and-after workflow examples.'
    });

    importServicePage({
        slug: 'web-design',
        title: 'Web Design',
        description: 'Powerful web design should do more than look modern. It should make your business easier to understand, easier to trust, and easier to choose.',
        heroImage: 'https://picsum.photos/seed/agency-web-design/467/300.webp',
        mainItems: [
            {
                title: 'Conversion-First Design',
                copy: 'We design around decision-making, trust, and action. Layout, copy structure, and visual hierarchy are built to support conversion rather than decoration.'
            },
            {
                title: 'Clear Information Architecture',
                copy: 'A strong site helps visitors understand what you do, how you help, and what to do next without forcing them to hunt for relevance.'
            },
            {
                title: 'Brand-Aligned Presentation',
                copy: 'Color, typography, imagery, and spacing should reinforce the business story. Design is stronger when it expresses positioning, not just style.'
            },
            {
                title: 'Competitive Differentiation',
                copy: 'Your strongest competitors already look credible. Good design closes that credibility gap and helps push beyond it with a clearer and more deliberate presentation.'
            }
        ],
        includeItems: [
            'Homepage design',
            'Service-page design',
            'Responsive layouts',
            'Wireframes and hierarchy',
            'Brand-aligned UI direction',
            'Conversion-focused page structure'
        ],
        processItems: [
            { step: '01', title: 'Clarify', copy: 'Define audience, positioning, and decision paths.' },
            { step: '02', title: 'Design', copy: 'Build layouts, hierarchy, and visual language.' },
            { step: '03', title: 'Refine', copy: 'Tighten usability, messaging flow, and polish.' }
        ],
        ctaTitle: 'Need a website that performs better than it looks?',
        ctaBody: 'Replace filler with screenshots, page examples, and specific conversion outcomes as project proof accumulates.'
    });

    importServicePage({
        slug: 'seo-optimisation',
        title: 'SEO Optimisation',
        description: 'Optimizing web design to rank well is not an afterthought. It starts with structure, clarity, crawlability, and content that supports the way real users search.',
        heroImage: 'https://picsum.photos/seed/agency-seo/467/300.webp',
        mainItems: [
            {
                title: 'Technical SEO Foundations',
                copy: 'We improve metadata, heading structure, internal linking, crawlability, and page organization so search engines can understand the site more clearly.'
            },
            {
                title: 'Content Structure',
                copy: 'SEO performs better when page content is organized around real questions, real services, and clear user intent instead of generic copy blocks.'
            },
            {
                title: 'Design + SEO Alignment',
                copy: 'A site that looks good but hides its meaning will struggle. We align design decisions with discoverability so form and function support ranking together.'
            },
            {
                title: 'Longer-Term Discoverability',
                copy: 'The goal is not a gimmick. It is a site structure that can support future content, future services, and stronger visibility over time.'
            }
        ],
        includeItems: [
            'Technical SEO review',
            'On-page structure',
            'Metadata cleanup',
            'Heading and hierarchy fixes',
            'Internal-linking guidance',
            'Content-structure support'
        ],
        processItems: [
            { step: '01', title: 'Audit', copy: 'Review structure, visibility, and technical friction.' },
            { step: '02', title: 'Improve', copy: 'Fix page-level and structural issues.' },
            { step: '03', title: 'Extend', copy: 'Create a stronger base for future growth and content.' }
        ],
        ctaTitle: 'Need stronger discoverability without shallow SEO filler?',
        ctaBody: 'Replace this with keyword targets, audits, and measurable traffic or lead improvements as you build out proof.'
    });

    importServicePage({
        slug: 'ecommerce',
        title: 'Ecommerce',
        description: 'We build online stores on flexible, modular systems that make it easier to grow the catalog, improve product discovery, and reduce purchase friction over time.',
        heroImage: 'https://picsum.photos/seed/agency-ecommerce/467/300.webp',
        mainItems: [
            {
                title: 'Scalable Storefront Structure',
                copy: 'A storefront should be built for growth, not only launch. We shape ecommerce systems so they can expand without turning navigation and catalog structure into chaos.'
            },
            {
                title: 'Product Discovery',
                copy: 'Product pages, category pages, and navigation paths should help users find what matters quickly instead of forcing unnecessary browsing effort.'
            },
            {
                title: 'Checkout Friction Reduction',
                copy: 'Every unnecessary step costs revenue. We simplify decision paths and reduce interface friction to support cleaner purchase behavior.'
            },
            {
                title: 'Modular Platform Thinking',
                copy: 'A flexible platform makes it easier to add products, promotions, content, and future functionality as the business grows.'
            }
        ],
        includeItems: [
            'Storefront UX',
            'Category and product-page structure',
            'Navigation refinement',
            'Checkout simplification',
            'Modular platform planning',
            'Growth-ready content architecture'
        ],
        processItems: [
            { step: '01', title: 'Map', copy: 'Define catalog structure, buyer paths, and friction points.' },
            { step: '02', title: 'Design', copy: 'Shape storefront, product experience, and purchase flow.' },
            { step: '03', title: 'Improve', copy: 'Refine usability, navigation, and growth readiness.' }
        ],
        ctaTitle: 'Building an online store that needs to grow with you?',
        ctaBody: 'Replace filler with platform choices, merchandising logic, and real commerce metrics once projects are live.'
    });

    importServicePage({
        slug: 'branding',
        title: 'Branding',
        description: 'A solid brand strategy, logo system, and set of guidelines make it easier to be recognized, remembered, and trusted across every touchpoint.',
        heroImage: 'https://picsum.photos/seed/agency-branding/467/300.webp',
        mainItems: [
            {
                title: 'Brand Strategy',
                copy: 'A good brand starts with positioning. We help define how the business should sound, what it should emphasize, and where it should differentiate.'
            },
            {
                title: 'Identity Systems',
                copy: 'Logos, color systems, typography, and supporting visual rules create consistency and reduce the visual drift that weakens credibility.'
            },
            {
                title: 'Guidelines That Scale',
                copy: 'A brand is more useful when it can be applied clearly by more than one person. Guidelines make the system easier to reuse across pages, campaigns, and materials.'
            },
            {
                title: 'Recognition Through Consistency',
                copy: 'Consistency is not about rigid sameness. It is about giving the business a recognizable and trustworthy presence wherever it appears.'
            }
        ],
        includeItems: [
            'Positioning support',
            'Logo and identity direction',
            'Color and type systems',
            'Brand guidelines',
            'Voice and presentation alignment',
            'Cross-channel consistency'
        ],
        processItems: [
            { step: '01', title: 'Define', copy: 'Clarify positioning, audience, and message priorities.' },
            { step: '02', title: 'Design', copy: 'Shape the identity system and brand presentation.' },
            { step: '03', title: 'Systematize', copy: 'Package guidelines so the brand can be applied consistently.' }
        ],
        ctaTitle: 'Need a brand that feels more credible and more coherent?',
        ctaBody: 'Replace filler with identity examples, logo systems, and before-and-after brand work once you have visual proof.'
    });
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

function importServicePage({
    slug,
    title,
    description,
    heroImage,
    mainItems,
    includeItems,
    processItems,
    ctaTitle,
    ctaBody
}) {
    clearPageBySlug(slug);

    const pageId = insertPage({
        slug,
        title,
        pageType: 'service',
        seoTitle: title,
        seoDescription: description
    });

    let sort = 10;

    insertSection(pageId, 'pageHero', sort, {
        eyebrow: 'Service',
        title,
        lead: description,
        image: heroImage
    });
    sort += 10;

    insertSection(pageId, 'featureGrid', sort, {
        items: mainItems
    });
    sort += 10;

    insertSection(pageId, 'sectionHeader', sort, {
        eyebrow: 'Scope',
        title: 'What this includes',
        lead: 'A practical view of the core deliverables and support areas inside this service.'
    });
    sort += 10;

    insertSection(pageId, 'featureGrid', sort, {
        items: includeItems.map(item => ({
            title: item,
            copy: ''
        }))
    });
    sort += 10;

    insertSection(pageId, 'sectionHeader', sort, {
        eyebrow: 'Process',
        title: `How ${title.toLowerCase()} work moves`,
        lead: 'A compact view of how the work progresses from planning through refinement.'
    });
    sort += 10;

    insertSection(pageId, 'processGrid', sort, {
        items: processItems
    });
    sort += 10;

    insertSection(pageId, 'ctaPanel', sort, {
        title: ctaTitle,
        body: ctaBody,
        actions: [
            { label: 'Contact Us', href: '/contact', variant: 'primary' },
            { label: 'View All Services', href: '/services', variant: 'secondary' }
        ]
    });

    console.log(`Imported service page: ${slug}`);
}

function upsertPost({
    slug,
    title,
    excerpt,
    coverImage,
    author = 'Agency',
    status = 'published',
    content = []
}) {
    const now = nowIso();

    db.prepare(`
    INSERT INTO posts (
      slug, title, excerpt, cover_image, author, status, published_at,
      content_json, created_at, updated_at
    ) VALUES (
      @slug, @title, @excerpt, @cover_image, @author, @status, @published_at,
      @content_json, @created_at, @updated_at
    )
    ON CONFLICT(slug) DO UPDATE SET
      title=excluded.title,
      excerpt=excluded.excerpt,
      cover_image=excluded.cover_image,
      author=excluded.author,
      status=excluded.status,
      published_at=excluded.published_at,
      content_json=excluded.content_json,
      updated_at=excluded.updated_at
  `).run({
        slug,
        title,
        excerpt,
        cover_image: coverImage || '',
        author,
        status,
        published_at: status === 'published' ? now : null,
        content_json: JSON.stringify(content),
        created_at: now,
        updated_at: now
    });
}

function upsertHelpdeskTopic({
    slug,
    title,
    description = '',
    sortOrder = 0
}) {
    const now = nowIso();

    db.prepare(`
    INSERT INTO helpdesk_topics (
      slug, title, description, sort_order, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(slug) DO UPDATE SET
      title=excluded.title,
      description=excluded.description,
      sort_order=excluded.sort_order,
      updated_at=excluded.updated_at
  `).run(
        slug,
        title,
        description,
        sortOrder,
        now,
        now
    );
}

function getHelpdeskTopicId(slug) {
    const row = db.prepare(`
    SELECT id FROM helpdesk_topics WHERE slug = ?
  `).get(slug);

    return row?.id || null;
}

function upsertHelpdeskArticle({
    slug,
    topicSlug,
    title,
    excerpt,
    tags = [],
    status = 'published',
    content = []
}) {
    const now = nowIso();
    const topicId = getHelpdeskTopicId(topicSlug);

    db.prepare(`
    INSERT INTO helpdesk_articles (
      slug, topic_id, title, excerpt, status, published_at,
      tags_json, content_json, created_at, updated_at
    ) VALUES (
      @slug, @topic_id, @title, @excerpt, @status, @published_at,
      @tags_json, @content_json, @created_at, @updated_at
    )
    ON CONFLICT(slug) DO UPDATE SET
      topic_id=excluded.topic_id,
      title=excluded.title,
      excerpt=excluded.excerpt,
      status=excluded.status,
      published_at=excluded.published_at,
      tags_json=excluded.tags_json,
      content_json=excluded.content_json,
      updated_at=excluded.updated_at
  `).run({
        slug,
        topic_id: topicId,
        title,
        excerpt,
        status,
        published_at: status === 'published' ? now : null,
        tags_json: JSON.stringify(tags),
        content_json: JSON.stringify(content),
        created_at: now,
        updated_at: now
    });
}


function importBlogContent() {
    upsertPost({
        slug: 'conversion-focused-web-design-basics',
        title: 'Conversion-Focused Web Design Basics',
        excerpt: 'Why most websites fail to convert and how to fix them with clearer structure, stronger trust signals, and more deliberate decision paths.',
        coverImage: 'https://picsum.photos/seed/blog-1/467/300.webp',
        content: [
            {
                type: 'paragraph',
                text: 'Most websites underperform for a simple reason: they are designed to look finished, not to help a visitor decide. A polished visual layer cannot compensate for weak structure, weak positioning, or unclear calls to action.'
            },
            {
                type: 'heading',
                text: 'Clarity beats decoration'
            },
            {
                type: 'paragraph',
                text: 'Visitors scan for relevance first. They want to know what the company does, who it helps, and why it is credible. If those answers are buried, the page loses momentum before design polish can matter.'
            },
            {
                type: 'image',
                src: 'https://picsum.photos/seed/blog-1-inline/586/330.webp',
                alt: 'Website wireframe and content hierarchy',
                caption: 'Strong hierarchy reduces decision friction.'
            },
            {
                type: 'heading',
                text: 'Trust should appear where decisions happen'
            },
            {
                type: 'paragraph',
                text: 'Testimonials, metrics, process summaries, and credentials are most useful near key decisions. When proof is separated from the moments where users hesitate, it becomes ornamental instead of persuasive.'
            },
            {
                type: 'quote',
                text: 'A beautiful website that does not help users decide is still underperforming.'
            },
            {
                type: 'list',
                items: [
                    'Clarify the offer early',
                    'Reduce navigation and content friction',
                    'Place proof near moments of commitment',
                    'Use page structure to support action'
                ]
            },
            {
                type: 'heading',
                text: 'Design should support the business model'
            },
            {
                type: 'paragraph',
                text: 'B2B sites, service firms, and ecommerce brands each require different decision paths. Conversion-focused design is not a single aesthetic. It is the discipline of aligning the interface with how that business actually wins customers.'
            }
        ]
    });

    upsertPost({
        slug: 'seo-starts-with-structure',
        title: 'SEO Starts With Structure',
        excerpt: 'Search performance depends on architecture, internal linking, page hierarchy, and semantic clarity long before it depends on volume publishing.',
        coverImage: 'https://picsum.photos/seed/blog-2/467/300.webp',
        content: [
            {
                type: 'paragraph',
                text: 'SEO is often reduced to keywords and content production, but most sites struggle earlier than that. Weak page hierarchy, inconsistent headings, thin internal linking, and unclear content mapping make the entire system harder to understand.'
            },
            {
                type: 'heading',
                text: 'Architecture before acceleration'
            },
            {
                type: 'paragraph',
                text: 'A site needs a clean information structure before additional content can compound effectively. When structure is broken, new pages often create more noise instead of more visibility.'
            },
            {
                type: 'image',
                src: 'https://picsum.photos/seed/blog-2-inline/586/330.webp',
                alt: 'Site map and SEO structure',
                caption: 'Stronger architecture makes content more useful to both users and search engines.'
            },
            {
                type: 'heading',
                text: 'Intent should drive organization'
            },
            {
                type: 'paragraph',
                text: 'Good SEO structure groups pages around real topics, real services, and real search intent. That improves discoverability while also making the site easier for human visitors to navigate.'
            },
            {
                type: 'list',
                items: [
                    'Strengthen page hierarchy',
                    'Align headings with page purpose',
                    'Improve internal linking discipline',
                    'Make service and topic relationships clearer'
                ]
            },
            {
                type: 'paragraph',
                text: 'Once the foundation is coherent, content has a much better chance of supporting growth over time.'
            }
        ]
    });

    upsertPost({
        slug: 'why-modular-marketing-sites-age-better',
        title: 'Why Modular Marketing Sites Age Better',
        excerpt: 'A modular site is easier to extend, easier to reframe, and much less likely to collapse into a redesign every time the business evolves.',
        coverImage: 'https://picsum.photos/seed/blog-3/467/300.webp',
        content: [
            {
                type: 'paragraph',
                text: 'Many marketing sites become brittle because every page is treated as a custom composition. That works in the short term, but it makes growth, iteration, and content updates harder than they need to be.'
            },
            {
                type: 'heading',
                text: 'Modules reduce redesign pressure'
            },
            {
                type: 'paragraph',
                text: 'When sections are reusable, content editors can adjust pages, launch campaigns, and refresh positioning without rewriting the entire front end. That lowers maintenance cost and keeps the site flexible.'
            },
            {
                type: 'image',
                src: 'https://picsum.photos/seed/blog-3-inline/586/330.webp',
                alt: 'Modular design system mockup',
                caption: 'Reusable blocks make future iteration easier.'
            },
            {
                type: 'heading',
                text: 'Systems scale better than one-offs'
            },
            {
                type: 'paragraph',
                text: 'A modular system supports brand consistency, clearer governance, and faster rollout of new content. It also improves handoff because the logic of the site is easier to understand.'
            },
            {
                type: 'list',
                items: [
                    'Reusable components',
                    'Cleaner editing workflows',
                    'Lower long-term redesign cost',
                    'Stronger consistency across pages'
                ]
            }
        ]
    });

    console.log('Imported blog content.');
}

function importHelpdeskContent() {
    [
        {
            slug: 'coverage',
            title: 'Coverage',
            description: 'Articles related to service coverage, availability, and scope.',
            sortOrder: 10
        },
        {
            slug: 'payment-method',
            title: 'Payment Method',
            description: 'Billing, invoicing, and payment-process questions.',
            sortOrder: 20
        },
        {
            slug: 'system-solutions',
            title: 'System Solutions',
            description: 'Implementation, architecture, and modular system questions.',
            sortOrder: 30
        },
        {
            slug: 'team-leader',
            title: 'Team Leader',
            description: 'Project leadership, communication, and handoff guidance.',
            sortOrder: 40
        },
        {
            slug: 'tech-support',
            title: 'Tech Support',
            description: 'Technical troubleshooting and support process guidance.',
            sortOrder: 50
        },
        {
            slug: 'user-interface',
            title: 'User Interface',
            description: 'Interface behavior, workflows, and usability guidance.',
            sortOrder: 60
        }
    ].forEach(upsertHelpdeskTopic);

    upsertHelpdeskArticle({
        slug: 'coverage-overview',
        topicSlug: 'coverage',
        title: 'Coverage Overview',
        excerpt: 'Understand what is included, where support applies, and how service boundaries work.',
        tags: ['Coverage', 'Support'],
        content: [
            {
                type: 'paragraph',
                text: 'Coverage defines the boundaries of what is included in the working relationship. That includes where support applies, what is considered part of the project scope, and where a separate engagement may be required.'
            },
            {
                type: 'heading',
                text: 'What coverage usually includes'
            },
            {
                type: 'paragraph',
                text: 'Coverage often includes the agreed pages, systems, support paths, or implementation layers defined during planning. It does not automatically expand to every future request unless that was built into the service model.'
            },
            {
                type: 'image',
                src: 'https://picsum.photos/seed/helpdesk-coverage-overview/586/330.webp',
                alt: 'Coverage illustration',
                caption: 'Clear boundaries reduce ambiguity and improve delivery.'
            },
            {
                type: 'heading',
                text: 'Why this matters'
            },
            {
                type: 'paragraph',
                text: 'When coverage is unclear, both execution and support become inconsistent. Explicit boundaries protect timelines, improve communication, and make follow-on work easier to scope.'
            }
        ]
    });

    upsertHelpdeskArticle({
        slug: 'coverage-limits',
        topicSlug: 'coverage',
        title: 'Coverage Limits',
        excerpt: 'Learn where service scope begins and ends, and how change requests are handled.',
        tags: ['Coverage'],
        content: [
            {
                type: 'paragraph',
                text: 'Coverage limits exist to keep projects understandable and maintainable. They define which requests are part of the active scope and which requests should be handled as extensions or separate work.'
            },
            {
                type: 'heading',
                text: 'Typical boundary conditions'
            },
            {
                type: 'list',
                items: [
                    'New page types not originally scoped',
                    'Major system changes after approval',
                    'New integrations or external dependencies',
                    'Expanded content production beyond the original plan'
                ]
            },
            {
                type: 'paragraph',
                text: 'The goal is not rigidity. The goal is visibility into what is changing and what additional effort is required.'
            }
        ]
    });

    upsertHelpdeskArticle({
        slug: 'billing-overview',
        topicSlug: 'payment-method',
        title: 'Billing Overview',
        excerpt: 'Understand how billing cycles, invoicing, and payment expectations are structured.',
        tags: ['Billing', 'Payment'],
        content: [
            {
                type: 'paragraph',
                text: 'Billing is easier to manage when it follows a predictable structure. Clear invoice timing, payment terms, and communication standards reduce friction on both sides.'
            },
            {
                type: 'heading',
                text: 'What a billing workflow should clarify'
            },
            {
                type: 'list',
                items: [
                    'When invoices are issued',
                    'What each invoice covers',
                    'When payment is due',
                    'How change requests affect billing'
                ]
            },
            {
                type: 'paragraph',
                text: 'A simple billing structure improves trust and makes project pacing easier to manage.'
            }
        ]
    });

    upsertHelpdeskArticle({
        slug: 'requesting-support',
        topicSlug: 'tech-support',
        title: 'Requesting Support',
        excerpt: 'How to submit support requests in a way that makes response and resolution faster.',
        tags: ['Support', 'Workflow'],
        content: [
            {
                type: 'paragraph',
                text: 'Support requests are resolved faster when they are specific. Good requests explain what happened, where it happened, and what changed before the issue appeared.'
            },
            {
                type: 'heading',
                text: 'What to include'
            },
            {
                type: 'list',
                items: [
                    'The page or system affected',
                    'What behavior was expected',
                    'What behavior occurred instead',
                    'Any screenshots or reproduction notes'
                ]
            },
            {
                type: 'paragraph',
                text: 'Structured requests reduce guesswork and shorten the investigation cycle.'
            }
        ]
    });

    upsertHelpdeskArticle({
        slug: 'project-handoff-basics',
        topicSlug: 'team-leader',
        title: 'Project Handoff Basics',
        excerpt: 'A practical overview of how materials, access, and responsibilities should be transferred.',
        tags: ['Handoff', 'Leadership'],
        content: [
            {
                type: 'paragraph',
                text: 'A good handoff ensures the next owner can maintain and extend the work without hidden dependencies. That includes access, documentation, structural clarity, and known next steps.'
            },
            {
                type: 'heading',
                text: 'Strong handoffs usually include'
            },
            {
                type: 'list',
                items: [
                    'Access and credential transfer',
                    'Content and publishing guidance',
                    'Known follow-up items',
                    'Architecture or system notes'
                ]
            },
            {
                type: 'paragraph',
                text: 'The point of handoff is not only completion. It is continuity.'
            }
        ]
    });

    upsertHelpdeskArticle({
        slug: 'reset-your-password',
        topicSlug: 'user-interface',
        title: 'Reset Your Password',
        excerpt: 'A simple walkthrough for password reset flows and common reset issues.',
        tags: ['User Interface', 'Access'],
        content: [
            {
                type: 'paragraph',
                text: 'Password reset flows should be direct, understandable, and easy to complete without confusion.'
            },
            {
                type: 'heading',
                text: 'Common issues'
            },
            {
                type: 'list',
                items: [
                    'Reset email did not arrive',
                    'The reset link expired',
                    'The new password does not meet requirements',
                    'The browser cached an older session'
                ]
            },
            {
                type: 'paragraph',
                text: 'When the interface is clear, most reset issues are resolved without support escalation.'
            }
        ]
    });

    console.log('Imported helpdesk content.');
}

function main() {
    // importHome();
    // importAbout();
    importAllServicePages();
    // importServicePage();
    importBlogContent();
    importHelpdeskContent();
    // importWorks();


    // importServiceDetail('marketing.json');
    // importServiceDetail('development.json');
    // importServiceDetail('web-design.json');
    // importServiceDetail('seo-optimisation.json');
    // importServiceDetail('ecommerce.json');
    // importServiceDetail('branding.json');

    console.log('Page import complete.');
}

main();