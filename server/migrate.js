import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CONTENT_PAGE_BOOTSTRAP } from './contentPageBootstrap.js';
import { SITE_CONFIG_BOOTSTRAP } from './siteConfigBootstrap.js';
import { db, nowIso, slugify } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });

db.exec(`
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT DEFAULT '',
  cover_image TEXT DEFAULT '',
  author TEXT DEFAULT 'Buzzworthy',
  status TEXT NOT NULL DEFAULT 'draft',
  published_at TEXT,
  content_json TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS helpdesk_topics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS helpdesk_articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  topic_id INTEGER,
  title TEXT NOT NULL,
  excerpt TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft',
  published_at TEXT,
  tags_json TEXT NOT NULL DEFAULT '[]',
  content_json TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (topic_id) REFERENCES helpdesk_topics(id) ON DELETE SET NULL
);
`);

db.exec(`
CREATE TABLE IF NOT EXISTS works (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT DEFAULT '',
  summary TEXT DEFAULT '',
  hero_image TEXT DEFAULT '',
  metrics_json TEXT NOT NULL DEFAULT '[]',
  content_json TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
`);

db.exec(`
CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    company TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    service TEXT DEFAULT '',
    budget TEXT DEFAULT '',
    message TEXT NOT NULL DEFAULT '',
    user_agent TEXT DEFAULT '',
    ip_address TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'new',
    created_at TEXT NOT NULL
);
`);

db.exec(`
CREATE TABLE IF NOT EXISTS content_pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    payload_json TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);
`);

db.exec(`
CREATE TABLE IF NOT EXISTS site_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    setting_key TEXT NOT NULL UNIQUE,
    payload_json TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);
`);

const now = nowIso();

function seedContentPageBootstrap(slug, payload) {
    const existing = db.prepare('SELECT id FROM content_pages WHERE slug = ?').get(slug);
    if (existing) return;

    try {
        db.prepare(`
          INSERT INTO content_pages (slug, payload_json, created_at, updated_at)
          VALUES (?, ?, ?, ?)
        `).run(slug, JSON.stringify(payload, null, 4), now, now);
    } catch (error) {
        console.error(`[migrate] failed seeding content page ${slug}:`, error.message);
    }
}

Object.entries(CONTENT_PAGE_BOOTSTRAP).forEach(([slug, payload]) => {
    seedContentPageBootstrap(slug, payload);
});

if (!db.prepare('SELECT id FROM site_settings WHERE setting_key = ?').get('default')) {
    db.prepare(`
            INSERT INTO site_settings (setting_key, payload_json, created_at, updated_at)
            VALUES (?, ?, ?, ?)
        `).run('default', JSON.stringify(SITE_CONFIG_BOOTSTRAP, null, 4), now, now);
}

if (!db.prepare('SELECT 1 FROM posts LIMIT 1').get()) {
    const insert = db.prepare(`
    INSERT INTO posts (
      slug, title, excerpt, cover_image, author, status, published_at,
      content_json, created_at, updated_at
    ) VALUES (
      @slug, @title, @excerpt, @cover_image, @author, @status, @published_at,
      @content_json, @created_at, @updated_at
    )
  `);

    [
        {
            title: 'Conversion-Focused Web Design Basics',
            excerpt: 'Why most websites fail to convert and how to fix it with structure, clarity, and intent.',
            cover_image: 'https://picsum.photos/seed/blog-1/1600/1000.webp',
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'Most websites fail because they prioritize aesthetics over clarity.' },
                { type: 'heading', text: 'Clarity beats creativity' },
                { type: 'paragraph', text: 'Users scan for relevance, proof, and direction.' }
            ])
        },
        {
            title: 'SEO Starts With Structure',
            excerpt: 'Ranking is not content alone. Architecture and hierarchy matter first.',
            cover_image: 'https://picsum.photos/seed/blog-2/1600/1000.webp',
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'Search performance starts with information architecture.' }
            ])
        },
        {
            title: 'The Psychology Behind High-Converting CTAs',
            excerpt: 'Why users click, hesitate, or ignore—and how to design for action.',
            cover_image: 'https://picsum.photos/seed/blog-6/1600/1000.webp',
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'CTA performance depends on clarity, timing, and perceived value.' },
                { type: 'heading', text: 'Reduce hesitation' },
                { type: 'paragraph', text: 'Users avoid uncertainty more than they seek reward.' }
            ])
        },
        {
            title: 'Designing for Scan Behavior',
            excerpt: 'Users do not read. Structure content for scanning and fast comprehension.',
            cover_image: 'https://picsum.photos/seed/blog-7/1600/1000.webp',
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'Most users scan in patterns, not linearly.' },
                { type: 'heading', text: 'Visual hierarchy matters' },
                { type: 'paragraph', text: 'Headings and spacing guide attention flow.' }
            ])
        },
        {
            title: 'Authority Signals That Build Trust Instantly',
            excerpt: 'Establish credibility within seconds using proof and positioning.',
            cover_image: 'https://picsum.photos/seed/blog-8/1600/1000.webp',
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'Trust is evaluated before content is consumed.' },
                { type: 'heading', text: 'Types of authority signals' },
                { type: 'paragraph', text: 'Testimonials, logos, and quantified results.' }
            ])
        },
        {
            title: 'How to Structure a High-Impact Homepage',
            excerpt: 'Turn your homepage into a guided narrative instead of a static layout.',
            cover_image: 'https://picsum.photos/seed/blog-9/1600/1000.webp',
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'A homepage should answer key questions immediately.' },
                { type: 'heading', text: 'Sequence matters' },
                { type: 'paragraph', text: 'Problem, solution, proof, then action.' }
            ])
        },
        {
            title: 'The Role of Speed in Conversion Rates',
            excerpt: 'Performance is not technical overhead—it directly impacts revenue.',
            cover_image: 'https://picsum.photos/seed/blog-10/1600/1000.webp',
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'Slow pages increase abandonment rates.' },
                { type: 'heading', text: 'Perceived vs actual speed' },
                { type: 'paragraph', text: 'Users react to feedback, not raw load time.' }
            ])
        },
        {
            title: 'Eliminating Friction in User Flows',
            excerpt: 'Identify and remove blockers that prevent users from completing actions.',
            cover_image: 'https://picsum.photos/seed/blog-11/1600/1000.webp',
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'Friction compounds across steps in a flow.' },
                { type: 'heading', text: 'Common friction points' },
                { type: 'paragraph', text: 'Forms, unclear labels, and unexpected steps.' }
            ])
        },
        {
            title: 'Why Simplicity Outperforms Feature-Rich Design',
            excerpt: 'More options reduce clarity and increase abandonment.',
            cover_image: 'https://picsum.photos/seed/blog-12/1600/1000.webp',
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'Complexity introduces cognitive load.' },
                { type: 'heading', text: 'Constraint improves decisions' },
                { type: 'paragraph', text: 'Fewer choices lead to faster action.' }
            ])
        },
        {
            title: 'Using Data to Refine UX Decisions',
            excerpt: 'Move beyond opinions—use behavioral data to guide design improvements.',
            cover_image: 'https://picsum.photos/seed/blog-13/1600/1000.webp',
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'User behavior reveals friction and intent.' },
                { type: 'heading', text: 'Measure what matters' },
                { type: 'paragraph', text: 'Focus on actions, not vanity metrics.' }
            ])
        },
        {
            title: 'Microcopy That Drives Action',
            excerpt: 'Small text changes can significantly impact user decisions.',
            cover_image: 'https://picsum.photos/seed/blog-14/1600/1000.webp',
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'Microcopy reduces uncertainty at critical moments.' },
                { type: 'heading', text: 'Where microcopy matters most' },
                { type: 'paragraph', text: 'Forms, buttons, and error states.' }
            ])
        },
        {
            title: 'Designing for Mobile-First Behavior',
            excerpt: 'Mobile constraints force better prioritization and clearer UX.',
            cover_image: 'https://picsum.photos/seed/blog-15/1600/1000.webp',
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'Mobile users have less patience and attention.' },
                { type: 'heading', text: 'Prioritize essential actions' },
                { type: 'paragraph', text: 'Remove non-critical elements on smaller screens.' }
            ])
        }
    ].forEach(post => {
        insert.run({
            slug: slugify(post.title),
            title: post.title,
            excerpt: post.excerpt,
            cover_image: post.cover_image,
            author: 'Buzzworthy',
            status: 'published',
            published_at: now,
            content_json: post.content_json,
            created_at: now,
            updated_at: now
        });
    });
}

if (!db.prepare('SELECT 1 FROM helpdesk_topics LIMIT 1').get()) {
    const insert = db.prepare(`
    INSERT INTO helpdesk_topics (slug, title, description, sort_order, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

    [
        ['coverage', 'Coverage', 'Articles related to service coverage, availability, and scope.', 10],
        ['payment-method', 'Payment Method', 'Payment flows, billing basics, and invoicing questions.', 20],
        ['system-solutions', 'System Solutions', 'System architecture, integrations, and implementation support.', 30],
        ['team-leader', 'Team Leader', 'Leadership, handoff, and communication articles.', 40],
        ['tech-support', 'Tech Support', 'Operational support and technical troubleshooting.', 50],
        ['user-interface', 'User Interface', 'Interface, usage, and workflow guidance.', 60]
    ].forEach(row => insert.run(row[0], row[1], row[2], row[3], now, now));
}

if (!db.prepare('SELECT 1 FROM helpdesk_articles LIMIT 1').get()) {
    const topicMap = Object.fromEntries(
        db.prepare('SELECT id, slug FROM helpdesk_topics').all().map(r => [r.slug, r.id])
    );

    const insert = db.prepare(`
    INSERT INTO helpdesk_articles (
      slug, topic_id, title, excerpt, status, published_at,
      tags_json, content_json, created_at, updated_at
    ) VALUES (
      @slug, @topic_id, @title, @excerpt, @status, @published_at,
      @tags_json, @content_json, @created_at, @updated_at
    )
  `);

    [
        {
            slug: 'coverage-overview',
            topic_id: topicMap.coverage,
            title: 'Coverage overview',
            excerpt: 'Understand what is included, where support applies, and how service boundaries work.',
            tags_json: JSON.stringify(['Coverage', 'Support']),
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'Coverage defines the boundaries of support, maintenance, and included work.' },
                { type: 'heading', text: 'What coverage means' },
                { type: 'paragraph', text: 'Coverage should be explicit so users know what is included.' }
            ])
        },
        {
            slug: 'coverage-limits',
            topic_id: topicMap.coverage,
            title: 'Coverage limits',
            excerpt: 'Learn where service scope begins and ends.',
            tags_json: JSON.stringify(['Coverage']),
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'Coverage limits clarify boundaries and reduce support ambiguity.' },
                { type: 'heading', text: 'Common limits' },
                { type: 'paragraph', text: 'Limits can be based on time, resources, or specific services.' }
            ])
        },
        {
            slug: 'payment-processing-failures',
            topic_id: topicMap['payment-method'],
            title: 'Payment processing failures',
            excerpt: 'Understand why payments fail and how to resolve common issues.',
            tags_json: JSON.stringify(['Payment', 'Billing']),
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'Payment failures are typically caused by validation or authorization issues.' },
                { type: 'heading', text: 'Common causes' },
                { type: 'paragraph', text: 'Expired cards, insufficient funds, and gateway timeouts.' }
            ])
        },
        {
            slug: 'invoice-and-billing-cycle',
            topic_id: topicMap['payment-method'],
            title: 'Invoice and billing cycle',
            excerpt: 'Learn how billing cycles work and when invoices are generated.',
            tags_json: JSON.stringify(['Billing']),
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'Billing cycles define when charges are calculated and issued.' },
                { type: 'heading', text: 'Cycle details' },
                { type: 'paragraph', text: 'Cycles can be monthly, annually, or custom based on agreements.' }
            ])
        },
        {
            slug: 'system-integration-basics',
            topic_id: topicMap['system-solutions'],
            title: 'System integration basics',
            excerpt: 'Overview of integrating external systems and APIs.',
            tags_json: JSON.stringify(['Integration', 'API']),
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'System integrations enable data synchronization across platforms.' },
                { type: 'heading', text: 'Key considerations' },
                { type: 'paragraph', text: 'Authentication, rate limits, and data consistency.' }
            ])
        },
        {
            slug: 'implementation-timelines',
            topic_id: topicMap['system-solutions'],
            title: 'Implementation timelines',
            excerpt: 'What to expect during system rollout and delivery phases.',
            tags_json: JSON.stringify(['Implementation']),
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'Implementation timelines depend on project scope and complexity.' },
                { type: 'heading', text: 'Typical phases' },
                { type: 'paragraph', text: 'Planning, development, testing, and deployment.' }
            ])
        },
        {
            slug: 'team-lead-responsibilities',
            topic_id: topicMap['team-leader'],
            title: 'Team lead responsibilities',
            excerpt: 'Define expectations for team leaders in project delivery.',
            tags_json: JSON.stringify(['Leadership']),
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'Team leads ensure alignment, communication, and execution.' },
                { type: 'heading', text: 'Core responsibilities' },
                { type: 'paragraph', text: 'Project management, stakeholder communication, and risk mitigation.' }
            ])
        },
        {
            slug: 'handoff-best-practices',
            topic_id: topicMap['team-leader'],
            title: 'Handoff best practices',
            excerpt: 'Ensure smooth transitions between teams and phases.',
            tags_json: JSON.stringify(['Handoff']),
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'Clear documentation prevents operational gaps during handoffs.' },
                { type: 'heading', text: 'Best practices' },
                { type: 'paragraph', text: 'Ensure knowledge transfer, maintain checklists, and conduct reviews.' }
            ])
        },
        {
            slug: 'troubleshooting-login-issues',
            topic_id: topicMap['tech-support'],
            title: 'Troubleshooting login issues',
            excerpt: 'Resolve common authentication and access problems.',
            tags_json: JSON.stringify(['Auth', 'Support']),
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'Login issues are often tied to credentials or session handling.' },
                { type: 'heading', text: 'Common solutions' },
                { type: 'paragraph', text: 'Password resets, clearing cookies, and checking account status.' }
            ])
        },
        {
            slug: 'system-outage-response',
            topic_id: topicMap['tech-support'],
            title: 'System outage response',
            excerpt: 'Steps to take during outages and degraded performance.',
            tags_json: JSON.stringify(['Outage']),
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'Outage response should prioritize communication and containment.' },
                { type: 'heading', text: 'Response steps' },
                { type: 'paragraph', text: 'Identify the issue, notify stakeholders, and implement mitigation strategies.' }

            ])
        },
        {
            slug: 'navigating-the-dashboard',
            topic_id: topicMap['user-interface'],
            title: 'Navigating the dashboard',
            excerpt: 'Understand layout, menus, and primary workflows.',
            tags_json: JSON.stringify(['UI']),
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'The dashboard centralizes key actions and visibility.' },
                { type: 'heading', text: 'Main sections' },
                { type: 'paragraph', text: 'Overview, management, and settings areas.' }
            ])
        },
        {
            slug: 'customizing-user-preferences',
            topic_id: topicMap['user-interface'],
            title: 'Customizing user preferences',
            excerpt: 'Adjust settings for a personalized experience.',
            tags_json: JSON.stringify(['Settings']),
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'User preferences control display, notifications, and behavior.' },
                { type: 'heading', text: 'Available options' },
                { type: 'paragraph', text: 'Themes, notification settings, and data display preferences.' }
            ])
        },
        // COVERAGE (add 3 more → total ~5)
        {
            slug: 'regional-coverage-availability',
            topic_id: topicMap.coverage,
            title: 'Regional coverage availability',
            excerpt: 'Where services are available and how regions affect delivery.',
            tags_json: JSON.stringify(['Coverage']),
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'Service availability varies by region and infrastructure.' },
                { type: 'heading', text: 'Regional factors' },
                { type: 'paragraph', text: 'Infrastructure, regulations, and local demand influence coverage.' }

            ])
        },
        {
            slug: 'coverage-exceptions',
            topic_id: topicMap.coverage,
            title: 'Coverage exceptions',
            excerpt: 'Understand scenarios where standard coverage does not apply.',
            tags_json: JSON.stringify(['Coverage']),
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'Exceptions prevent incorrect assumptions about support scope.' },
                { type: 'heading', text: 'Common exceptions' },
                { type: 'paragraph', text: 'Certain scenarios may not be covered due to specific conditions or limitations.' }

            ])
        },
        {
            slug: 'service-scope-definition',
            topic_id: topicMap.coverage,
            title: 'Service scope definition',
            excerpt: 'Define what is explicitly included in service agreements.',
            tags_json: JSON.stringify(['Coverage']),
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'Clear scope reduces ambiguity and support overhead.' },
                { type: 'heading', text: 'Defining scope' },
                { type: 'paragraph', text: 'Scope should be explicitly stated in service agreements to avoid misunderstandings.' }

            ])
        },

        // PAYMENT METHOD (add 5 more → total ~7)
        {
            slug: 'accepted-payment-types',
            topic_id: topicMap['payment-method'],
            title: 'Accepted payment types',
            excerpt: 'List of supported payment methods and limitations.',
            tags_json: JSON.stringify(['Payment']),
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'Supported methods vary by region and integration.' },
                { type: 'heading', text: 'Common payment types' },
                { type: 'paragraph', text: 'Credit cards, debit cards, and digital wallets are commonly accepted.' }

            ])
        },
        {
            slug: 'refund-processing-times',
            topic_id: topicMap['payment-method'],
            title: 'Refund processing times',
            excerpt: 'How long refunds take and what affects timing.',
            tags_json: JSON.stringify(['Payment']),
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'Refund timing depends on processors and banking systems.' },
                { type: 'heading', text: 'Factors affecting timing' },
                { type: 'paragraph', text: 'Processing delays, holidays, and bank policies can impact refund times.' }

            ])
        },
        {
            slug: 'failed-subscription-renewals',
            topic_id: topicMap['payment-method'],
            title: 'Failed subscription renewals',
            excerpt: 'Why recurring payments fail and how retries work.',
            tags_json: JSON.stringify(['Billing']),
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'Retries follow defined intervals before cancellation.' },
                { type: 'heading', text: 'Retry schedule' },
                { type: 'paragraph', text: 'The retry schedule outlines the intervals and conditions for retrying failed payments.' }

            ])
        },
        {
            slug: 'updating-payment-details',
            topic_id: topicMap['payment-method'],
            title: 'Updating payment details',
            excerpt: 'How users update billing information securely.',
            tags_json: JSON.stringify(['Payment']),
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'Payment details should be updated before billing cycles.' },
            ])
        },
        {
            slug: 'taxes-and-fees-explained',
            topic_id: topicMap['payment-method'],
            title: 'Taxes and fees explained',
            excerpt: 'Breakdown of additional charges on invoices.',
            tags_json: JSON.stringify(['Billing']),
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'Taxes depend on jurisdiction and service classification.' },
                { type: 'heading', text: 'Common fees' },
                { type: 'paragraph', text: 'Service fees, processing fees, and other charges may apply.' }

            ])
        },

        // SYSTEM SOLUTIONS (add 4 more → total ~6)
        {
            slug: 'api-authentication-methods',
            topic_id: topicMap['system-solutions'],
            title: 'API authentication methods',
            excerpt: 'Understand how systems authenticate securely.',
            tags_json: JSON.stringify(['API']),
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'Authentication ensures secure system communication.' },
                { type: 'heading', text: 'Common methods' },
                { type: 'paragraph', text: 'API keys, OAuth tokens, and JWTs are widely used authentication methods.' }
            ])
        },
        {
            slug: 'data-sync-strategies',
            topic_id: topicMap['system-solutions'],
            title: 'Data sync strategies',
            excerpt: 'Approaches for maintaining data consistency across systems.',
            tags_json: JSON.stringify(['Integration']),
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'Sync strategies balance performance and accuracy.' },
                { type: 'heading', text: 'Common strategies' },
                { type: 'paragraph', text: 'Real-time, scheduled, and on-demand syncs are common approaches.' }
            ])
        },
        {
            slug: 'webhook-configuration',
            topic_id: topicMap['system-solutions'],
            title: 'Webhook configuration',
            excerpt: 'How to set up event-driven integrations.',
            tags_json: JSON.stringify(['Integration']),
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'Webhooks push updates instead of polling.' },
                { type: 'heading', text: 'Configuration steps' },
                { type: 'paragraph', text: 'Define events, set endpoints, and secure with signatures.' }
            ])
        },
        {
            slug: 'environment-setup-guide',
            topic_id: topicMap['system-solutions'],
            title: 'Environment setup guide',
            excerpt: 'Prepare staging and production environments.',
            tags_json: JSON.stringify(['Setup']),
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'Environment separation prevents deployment risks.' },
                { type: 'heading', text: 'Setup considerations' },
                { type: 'paragraph', text: 'Staging should mirror production to ensure reliable testing.' }
            ])
        },

        // TEAM LEADER (add 6 more → total ~8)
        {
            slug: 'managing-cross-functional-teams',
            topic_id: topicMap['team-leader'],
            title: 'Managing cross-functional teams',
            excerpt: 'Coordinate across roles and responsibilities.',
            tags_json: JSON.stringify(['Leadership']),
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'Alignment reduces delays and miscommunication.' },
                { type: 'heading', text: 'Key strategies' },
                { type: 'paragraph', text: 'Regular check-ins, clear documentation, and defined roles.' }
            ])
        },
        {
            slug: 'setting-project-priorities',
            topic_id: topicMap['team-leader'],
            title: 'Setting project priorities',
            excerpt: 'Determine what matters most and sequence execution.',
            tags_json: JSON.stringify(['Leadership']),
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'Prioritization drives resource allocation.' },
                { type: 'heading', text: 'Frameworks for prioritization' },
                { type: 'paragraph', text: 'Impact vs effort matrices and stakeholder input can guide priorities.' }
            ])
        },
        {
            slug: 'communication-rhythms',
            topic_id: topicMap['team-leader'],
            title: 'Communication rhythms',
            excerpt: 'Establish consistent update cycles.',
            tags_json: JSON.stringify(['Communication']),
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'Predictable communication improves visibility.' },
                { type: 'heading', text: 'Common rhythms' },
                { type: 'paragraph', text: 'Daily standups, weekly reviews, and monthly retrospectives are common communication rhythms.' }
            ])
        },
        {
            slug: 'risk-management-basics',
            topic_id: topicMap['team-leader'],
            title: 'Risk management basics',
            excerpt: 'Identify and mitigate project risks early.',
            tags_json: JSON.stringify(['Leadership']),
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'Early risk detection reduces impact.' },
                { type: 'heading', text: 'Risk management steps' },
                { type: 'paragraph', text: 'Identify, assess, mitigate, and monitor risks throughout the project lifecycle.' }
            ])
        },
        {
            slug: 'stakeholder-alignment',
            topic_id: topicMap['team-leader'],
            title: 'Stakeholder alignment',
            excerpt: 'Keep stakeholders informed and aligned.',
            tags_json: JSON.stringify(['Communication']),
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'Misalignment causes delays and rework.' },
                { type: 'heading', text: 'Alignment strategies' },
                { type: 'paragraph', text: 'Regular updates, clear documentation, and involving stakeholders in key decisions can maintain alignment.' }
            ])
        },
        {
            slug: 'performance-tracking',
            topic_id: topicMap['team-leader'],
            title: 'Performance tracking',
            excerpt: 'Measure progress and team output.',
            tags_json: JSON.stringify(['Metrics']),
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'Tracking ensures accountability and optimization.' },
                { type: 'heading', text: 'Key performance indicators' },
                { type: 'paragraph', text: 'Velocity, quality metrics, and team satisfaction are important performance indicators.' }

            ])
        },

        // TECH SUPPORT (add 5 more → total ~7)
        {
            slug: 'debugging-common-errors',
            topic_id: topicMap['tech-support'],
            title: 'Debugging common errors',
            excerpt: 'Identify and resolve frequent system issues.',
            tags_json: JSON.stringify(['Support']),
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'Systematic debugging isolates root causes.' },
                { type: 'heading', text: 'Common error types' },
                { type: 'paragraph', text: 'Syntax errors, runtime exceptions, and logical errors are common categories.' }
            ])
        },
        {
            slug: 'clearing-cache-and-state',
            topic_id: topicMap['tech-support'],
            title: 'Clearing cache and state',
            excerpt: 'Resolve issues caused by stale data.',
            tags_json: JSON.stringify(['Support']),
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'Cached data can create inconsistent behavior.' },
                { type: 'heading', text: 'When to clear cache' },
                { type: 'paragraph', text: 'Clearing cache can resolve issues related to stale data or corrupted state.' }
            ])
        },
        {
            slug: 'browser-compatibility-issues',
            topic_id: topicMap['tech-support'],
            title: 'Browser compatibility issues',
            excerpt: 'Handle inconsistencies across browsers.',
            tags_json: JSON.stringify(['Support']),
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'Different engines interpret code differently.' },
                { type: 'heading', text: 'Handling compatibility issues' },
                { type: 'paragraph', text: 'Testing across multiple browsers and using polyfills can mitigate compatibility problems.' }

            ])
        },
        {
            slug: 'error-log-analysis',
            topic_id: topicMap['tech-support'],
            title: 'Error log analysis',
            excerpt: 'Use logs to diagnose system failures.',
            tags_json: JSON.stringify(['Debugging']),
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'Logs provide context for failures and anomalies.' },
                { type: 'heading', text: 'Effective log analysis' },
                { type: 'paragraph', text: 'Filtering, correlation, and pattern recognition are key techniques for analyzing logs effectively.' }
            ])
        },
        {
            slug: 'support-escalation-process',
            topic_id: topicMap['tech-support'],
            title: 'Support escalation process',
            excerpt: 'When and how to escalate issues.',
            tags_json: JSON.stringify(['Support']),
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'Escalation ensures critical issues are prioritized.' },
                { type: 'heading', text: 'Escalation criteria' },
                { type: 'paragraph', text: 'Issues that impact multiple users, cause data loss, or have no workaround should be escalated immediately.' }
            ])
        },

        // USER INTERFACE (add 4 more → total ~6)
        {
            slug: 'using-keyboard-shortcuts',
            topic_id: topicMap['user-interface'],
            title: 'Using keyboard shortcuts',
            excerpt: 'Improve efficiency with shortcut workflows.',
            tags_json: JSON.stringify(['UI']),
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'Shortcuts reduce interaction time.' },
                { type: 'heading', text: 'Common shortcuts' },
                { type: 'paragraph', text: 'Ctrl+C for copy, Ctrl+V for paste, and Ctrl+Z for undo are widely used shortcuts.' }

            ])
        },
        {
            slug: 'understanding-navigation-structure',
            topic_id: topicMap['user-interface'],
            title: 'Understanding navigation structure',
            excerpt: 'How menus and hierarchy are organized.',
            tags_json: JSON.stringify(['UI']),
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'Navigation reflects system architecture.' },
                { type: 'heading', text: 'Navigation patterns' },
                { type: 'paragraph', text: 'Hierarchical, flat, and faceted navigation are common patterns depending on content complexity.' }
            ])
        },
        {
            slug: 'form-interaction-guidelines',
            topic_id: topicMap['user-interface'],
            title: 'Form interaction guidelines',
            excerpt: 'Best practices for completing forms.',
            tags_json: JSON.stringify(['UI']),
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'Clear input expectations reduce errors.' },
                { type: 'heading', text: 'Form validation' },
                { type: 'paragraph', text: 'Real-time validation helps users correct mistakes promptly.' }

            ])
        },
        {
            slug: 'notification-settings-control',
            topic_id: topicMap['user-interface'],
            title: 'Notification settings control',
            excerpt: 'Manage alerts and system notifications.',
            tags_json: JSON.stringify(['Settings']),
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'Notification control prevents overload.' },
                { type: 'heading', text: 'Managing notifications' },
                { type: 'paragraph', text: 'Users can customize notification preferences to reduce distractions and focus on important alerts.' }

            ])
        }
        
    ].forEach(article => {
        insert.run({
            ...article,
            status: 'published',
            published_at: now,
            created_at: now,
            updated_at: now
        });
    });
}

if (!db.prepare('SELECT 1 FROM works LIMIT 1').get()) {
    const now = nowIso();
    const insert = db.prepare(`
    INSERT INTO works (
      slug, title, category, summary, hero_image, metrics_json, content_json, status, created_at, updated_at
    ) VALUES (
      @slug, @title, @category, @summary, @hero_image, @metrics_json, @content_json, @status, @created_at, @updated_at
    )
  `);

    [
        {
            title: 'NorthPeak Legal',
            category: 'Web Design',
            summary: 'Service-page redesign focused on trust, clarity, and consultation conversion.',
            hero_image: 'https://picsum.photos/seed/deepdigital-work-legal/1600/1000.webp',
            metrics_json: JSON.stringify(['+41% qualified leads', '+28% consult bookings']),
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'NorthPeak Legal needed a cleaner digital presence that made complex services easier to understand and easier to trust.' },
                { type: 'heading', text: 'Project Focus' },
                { type: 'paragraph', text: 'We rebuilt the service architecture, simplified decision paths, and aligned messaging around consultation intent.' },
                { type: 'image', src: 'https://picsum.photos/seed/deepdigital-work-legal-detail/1400/900.webp', alt: 'Legal project screen', caption: 'A tighter structure improved readability and trust.' },
                { type: 'heading', text: 'Outcome' },
                { type: 'paragraph', text: 'The result was a cleaner consultation funnel, stronger content hierarchy, and a site that felt more aligned with the quality of the firm.' }
            ])
        },
        {
            title: 'MetricForge',
            category: 'Development',
            summary: 'Modular marketing site rebuild with cleaner product story and stronger user flow.',
            hero_image: 'https://picsum.photos/seed/deepdigital-work-saas/1600/1000.webp',
            metrics_json: JSON.stringify(['+52% demo requests', '+33% activation rate']),
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'MetricForge had a strong product but a fragmented marketing surface that made positioning harder than it needed to be.' },
                { type: 'heading', text: 'What We Changed' },
                { type: 'paragraph', text: 'We rebuilt the page system around reusable modules, clearer segmentation, and stronger product-to-action flows.' },
                { type: 'image', src: 'https://picsum.photos/seed/deepdigital-work-saas-detail/1400/900.webp', alt: 'SaaS project screen', caption: 'Reusable modules made future expansion easier.' },
                { type: 'heading', text: 'Outcome' },
                { type: 'paragraph', text: 'The resulting build was easier to extend, easier to maintain, and more effective at moving visitors toward demos.' }
            ])
        },
        {
            title: 'BlueHarbor Systems',
            category: 'Marketing',
            summary: 'Campaign landing pages and message cleanup for an industrial services brand.',
            hero_image: 'https://picsum.photos/seed/deepdigital-work-industrial/1600/1000.webp',
            metrics_json: JSON.stringify(['+31% quote requests', '-17% drop-off rate']),
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'BlueHarbor Systems needed campaign pages that translated technical offerings into a clearer buying story.' },
                { type: 'heading', text: 'Execution' },
                { type: 'paragraph', text: 'We aligned campaign message structure, landing page hierarchy, and follow-up CTA placement around buyer intent.' },
                { type: 'image', src: 'https://picsum.photos/seed/deepdigital-work-industrial-detail/1400/900.webp', alt: 'Industrial project screen', caption: 'Cleaner hierarchy reduced friction in technical decision flows.' },
                { type: 'heading', text: 'Outcome' },
                { type: 'paragraph', text: 'The campaign system became easier to scale and produced stronger quote-request behavior from qualified visitors.' }
            ])
        },
        {
            title: 'Aster Advisory',
            category: 'Branding',
            summary: 'Brand system refresh with tighter visual language and stronger executive positioning.',
            hero_image: 'https://picsum.photos/seed/deepdigital-work-brand/1600/1000.webp',
            metrics_json: JSON.stringify(['Brand refresh', 'Guideline system']),
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'Aster Advisory needed a sharper visual system and more confident executive-facing positioning.' },
                { type: 'heading', text: 'Brand Direction' },
                { type: 'paragraph', text: 'We refined typography, tone, spacing, and core identity rules into a more coherent brand system.' },
                { type: 'image', src: 'https://picsum.photos/seed/deepdigital-work-brand-detail/1400/900.webp', alt: 'Brand project screen', caption: 'A stronger identity system improved consistency across touchpoints.' },
                { type: 'heading', text: 'Outcome' },
                { type: 'paragraph', text: 'The refresh gave the firm a more controlled, polished, and scalable presentation across the site and related materials.' }
            ])
        },
        {
            title: 'HarborCart',
            category: 'Ecommerce',
            summary: 'Ecommerce UX refresh focused on product discovery and checkout simplification.',
            hero_image: 'https://picsum.photos/seed/deepdigital-work-ecommerce/1600/1000.webp',
            metrics_json: JSON.stringify(['Higher AOV', 'Cleaner navigation']),
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'HarborCart needed a storefront that felt easier to browse and easier to buy from.' },
                { type: 'heading', text: 'UX Improvements' },
                { type: 'paragraph', text: 'We reorganized navigation, clarified product-page hierarchy, and reduced checkout friction.' },
                { type: 'image', src: 'https://picsum.photos/seed/deepdigital-work-ecommerce-detail/1400/900.webp', alt: 'Ecommerce project screen', caption: 'Improved product discovery supported stronger shopping behavior.' },
                { type: 'heading', text: 'Outcome' },
                { type: 'paragraph', text: 'The new experience supported clearer browsing paths and stronger commercial performance.' }
            ])
        },
        {
            title: 'SignalRank',
            category: 'SEO',
            summary: 'SEO structure and content improvements to support discoverability and ranking.',
            hero_image: 'https://picsum.photos/seed/deepdigital-work-seo/1600/1000.webp',
            metrics_json: JSON.stringify(['Technical cleanup', 'Content structure']),
            content_json: JSON.stringify([
                { type: 'paragraph', text: 'SignalRank needed a content and structure cleanup that made the site easier for users and search engines to understand.' },
                { type: 'heading', text: 'Technical + Content Work' },
                { type: 'paragraph', text: 'We tightened heading hierarchy, internal linking, metadata discipline, and page-level content structure.' },
                { type: 'image', src: 'https://picsum.photos/seed/deepdigital-work-seo-detail/1400/900.webp', alt: 'SEO project screen', caption: 'Better structure supported both crawlability and readability.' },
                { type: 'heading', text: 'Outcome' },
                { type: 'paragraph', text: 'The site became more coherent, more indexable, and easier to expand with future content.' }
            ])
        }
    ].forEach(work => {
        insert.run({
            slug: slugify(work.title),
            ...work,
            status: 'published',
            created_at: now,
            updated_at: now
        });
    });
}

console.log('Migration complete.');