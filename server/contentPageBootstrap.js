export const CONTENT_PAGE_BOOTSTRAP = {
    home: {
        hero: {
            eyebrow: 'Conversion-focused digital agency',
            title: 'Websites that make your business easier to <span class="highlight">choose</span>.',
            lead: 'We redesign underperforming sites, sharpen positioning, and build growth campaigns that turn traffic into qualified leads and revenue. The system is modular, flex-first, and built to self-host cleanly.',
            ctas: [
                {
                    label: 'Book a Strategy Call',
                    href: 'contact',
                    variant: 'primary'
                },
                {
                    label: 'See Services',
                    href: 'services',
                    variant: 'secondary'
                },
                {
                    label: 'About the Team',
                    href: 'about',
                    variant: 'ghost'
                }
            ],
            proof: [
                '50+ launches delivered',
                '34% average lift in qualified leads',
                'Design system + modular JS'
            ],
            metrics: [
                {
                    label: 'Qualified Leads',
                    value: '+38%',
                    trend: 'Month over month'
                },
                {
                    label: 'Conversion Rate',
                    value: '5.4%',
                    trend: 'Up from 3.1%'
                },
                {
                    label: 'Cost per Lead',
                    value: '-22%',
                    trend: 'Trim intake waste'
                }
            ],
            chart: {
                label: 'Lead growth after redesign',
                points: [
                    { label: 'Jan', value: 34 },
                    { label: 'Feb', value: 42 },
                    { label: 'Mar', value: 46 },
                    { label: 'Apr', value: 58 },
                    { label: 'May', value: 69 },
                    { label: 'Jun', value: 78 },
                    { label: 'Jul', value: 84 },
                    { label: 'Aug', value: 94 }
                ]
            },
            quote: {
                text: 'The new site finally matches the quality of our service. Lead quality improved within the first month.',
                author: 'Operations Director, NorthPeak Legal'
            },
            image: 'https://picsum.photos/seed/buzzworthy-hero-a/533/300.webp'
        },
        services: [
            {
                title: 'Marketing',
                href: '/marketing',
                icon: 'fa-bullhorn',
                copy: 'Campaign architecture and messaging strategy built around qualified pipeline, not vanity traffic.',
                detail: 'We connect offer framing, landing flow, and follow-up loops so acquisition and conversion work as one system.',
                tokens: ['Campaign strategy', 'Lead generation', 'B2B focus']
            },
            {
                title: 'Development',
                href: '/development',
                icon: 'fa-code',
                copy: 'Custom build work focused on speed, maintainability, and content operations your team can actually manage.',
                detail: 'From data models to reusable components, we ship production-ready features without brittle handoff debt.',
                tokens: ['Custom features', 'Clean handoff', 'Self-hosted builds']
            },
            {
                title: 'Web Design',
                href: '/web-design',
                icon: 'fa-palette',
                copy: 'Conversion-first UI built to clarify positioning, reduce friction, and increase action on high-intent pages.',
                detail: 'We prioritize hierarchy, trust signals, and mobile behavior so the experience supports both brand and revenue goals.',
                tokens: ['Conversion-focused', 'Responsive UX', 'Clear hierarchy']
            }
        ],
        logos: [
            { name: 'NorthPeak', image: 'assets/logos/logo_1.webp', href: '/works?slug=northpeak-legal' },
            { name: 'Aster', image: 'assets/logos/logo_2.webp', href: '/works?slug=aster-advisory' },
            { name: 'Axiom', image: 'assets/logos/logo_3.webp', href: '/works' },
            { name: 'BlueHarbor', image: 'assets/logos/logo_4.webp', href: '/works?slug=blueharbor-systems' },
            { name: 'MetricForge', image: 'assets/logos/logo_5.webp', href: '/works?slug=metricforge' },
            { name: 'PrimeLayer', image: 'assets/logos/logo_6.webp', href: '/works' }
        ],
        cases: [
            {
                badge: 'B2B Professional Services',
                slug: 'northpeak-legal',
                title: 'NorthPeak Legal',
                body: 'Repositioned the firm, rebuilt core service pages, and tightened consultation flows to improve trust and lead quality for a multi-location practice.',
                image: 'https://picsum.photos/seed/buzzworthy-case-legal/586/330.webp',
                stats: [
                    { value: '+41%', label: 'Qualified leads' },
                    { value: '+28%', label: 'Consult bookings' },
                    { value: '-19%', label: 'Bounce rate' }
                ]
            },
            {
                badge: 'Growth-Stage SaaS',
                slug: 'metricforge',
                title: 'MetricForge',
                body: 'Rebuilt the homepage and demand-gen landing flow around a clearer product story, stronger proof, and sharper user segmentation.',
                image: 'https://picsum.photos/seed/buzzworthy-case-saas/586/330.webp',
                stats: [
                    { value: '+52%', label: 'Demo requests' },
                    { value: '+33%', label: 'Activation rate' },
                    { value: '-24%', label: 'Paid CAC' }
                ]
            },
            {
                badge: 'Industrial Services',
                slug: 'blueharbor-systems',
                title: 'BlueHarbor Systems',
                body: 'Rebuilt a dense legacy site into a cleaner technical platform with better hierarchy, stronger lead routing, and easier decision paths.',
                image: 'https://picsum.photos/seed/buzzworthy-case-industrial/586/330.webp',
                stats: [
                    { value: '+31%', label: 'Quote requests' },
                    { value: '+22%', label: 'Qualified sessions' },
                    { value: '-17%', label: 'Drop-off rate' }
                ]
            }
        ],
        system: {
            title: 'A reusable system, not a pile of disconnected files.',
            lead: 'The template uses tokens, utilities, primitives, section modules, and data-driven composition.',
            pillars: [
                {
                    title: 'Tokens',
                    copy: 'Color, spacing, radius, type, glow, and shadows live in a dedicated token layer.',
                    tokens: ['Palette', 'Spacing', 'Typography']
                },
                {
                    title: 'Utilities',
                    copy: 'Flex and container helpers create layout discipline without inline-style sprawl.',
                    tokens: ['Flex-first', 'Containers', 'Responsive']
                },
                {
                    title: 'Primitives',
                    copy: 'Buttons, cards, and charts expose variants and enforce consistent design behavior.',
                    tokens: ['Variants', 'States', 'Reuse']
                },
                {
                    title: 'Sections',
                    copy: 'Hero, services, slider, system panels, and CTA are assembled from data and modules.',
                    tokens: ['Composable', 'Data-driven', 'Scalable']
                }
            ],
            process: [
                { step: '1', title: 'Strategy', copy: 'Define your competition and target audience.' },
                { step: '2', title: 'Design', copy: 'Establish color scheme, layout, sitemap, and style.' },
                { step: '3', title: 'Develop', copy: 'Turn ideas into working pages, interactions, and systems.' },
                { step: '4', title: 'Support', copy: 'Keep design, marketing, and maintenance aligned after launch.' }
            ]
        },
        testimonial: {
            quote: 'Buzzworthy replaced a generic website with a system our team can extend without degrading the design or the message.',
            author: 'Maya Chen, CEO at Aster Advisory'
        },
        buildStory: {
            eyebrow: 'Behind the build',
            title: 'Built from scratch, not dropped into a generic CMS theme.',
            lead: 'This site was planned and engineered as a custom modular build, not assembled from a pre-existing WordPress stack. That gives tighter performance control, cleaner updates, and fewer plugin-level failure points.',
            panelEyebrow: 'Why this matters',
            panelTitle: 'Custom architecture gives us better speed, security, and control',
            panelBody: 'By owning the component system, routing, and data models directly, we can evolve content and features without the dependency churn that often slows down CMS-heavy builds.',
            linkLabel: 'View build timeline',
            linkHref: '/build-from-scratch'
        },
        cta: {
            title: 'Ready to replace the template with a real offer?',
            body: 'Use this starter as the base for a static self-hosted build, then swap placeholder metrics, case studies, and contact routing with real business content.',
            actions: [
                { label: 'Start the Project', href: 'contact', variant: 'primary' },
                { label: 'Review Services', href: 'services', variant: 'secondary' }
            ]
        }
    },
    contact: {
        hero: {
            eyebrow: 'Contact',
            title: 'Start the conversation.',
            lead: 'Use the shared contact structure across the site, keep the cards compact, and route serious inquiries through a working Node-powered demo form.'
        },
        methods: [
            { icon: 'fa-phone', title: 'New Accounts', copy: '1-800-123-4567' },
            { icon: 'fa-phone', title: 'Support', copy: '1-800-123-4569' },
            { icon: 'fa-envelope', title: 'Email', copy: 'maurice@marketingbuzzworthy.com' },
            { icon: 'fa-location-dot', title: 'Office', copy: '2231 Sycamore Lake Road\nGreen Bay, WI 54304' }
        ],
        image: 'https://picsum.photos/seed/buzzworthy-contact-a/467/300.webp'
    },
    'build-from-scratch': {
        hero: {
            eyebrow: 'Built From Scratch',
            title: 'Why we built this site without WordPress',
            lead: 'This project was intentionally designed and developed as a custom, modular stack instead of a prebuilt CMS theme. The result is faster pages, cleaner ownership, and fewer plugin-driven surprises over time.',
            image: 'https://picsum.photos/seed/buzzworthy-build-from-scratch-hero2/467/300.webp',
            meta: [
                'Custom architecture',
                'Modular sections',
                'Performance-first delivery'
            ],
            actions: [
                { label: 'Start Your Project', href: '/contact', variant: 'primary' },
                { label: 'See Services', href: '/services', variant: 'secondary' }
            ]
        },
        reasonsEyebrow: 'Why this approach',
        reasonsTitle: 'Custom build advantages over traditional CMS installs',
        reasonsLead: 'WordPress can be useful, but for this project we prioritized long-term reliability, predictable performance, and simpler operations.',
        reasons: [
            {
                icon: 'fa-gauge-high',
                title: 'Leaner performance baseline',
                copy: 'No plugin bloat, fewer runtime dependencies, and tighter control over what ships to production.',
                tokens: ['Faster page loads', 'Lower JS overhead', 'Cleaner Core Web Vitals']
            },
            {
                icon: 'fa-shield-halved',
                title: 'Smaller attack surface',
                copy: 'Custom functionality removes the need for large plugin ecosystems that often drive emergency patch cycles.',
                tokens: ['Fewer vulnerable packages', 'Controlled updates', 'Reduced exploit exposure']
            },
            {
                icon: 'fa-sitemap',
                title: 'Architecture that fits the business',
                copy: 'Content models, routes, and modules are organized around actual workflows rather than theme constraints.',
                tokens: ['Purpose-built structure', 'Clear ownership', 'Easier iteration']
            }
        ],
        timelineEyebrow: 'Project timeline',
        timelineTitle: 'General build progress from kickoff to launch',
        timelineLead: 'A typical custom-build sequence used to deliver this site and keep future growth straightforward.',
        timeline: [
            { step: 1, title: 'Discovery and content mapping', copy: 'Defined goals, conversion paths, page inventory, and messaging priorities before any visual or technical implementation.' },
            { step: 2, title: 'System design and UX direction', copy: 'Established design tokens, component patterns, and section-level structure to keep every page consistent and reusable.' },
            { step: 3, title: 'Frontend build and data wiring', copy: 'Implemented modular JavaScript sections, reusable primitives, and data-driven rendering paths for flexible content updates.' },
            { step: 4, title: 'Backend and content operations', copy: 'Connected API routes, database-backed pages, and import tooling so the team can manage and extend content cleanly.' },
            { step: 5, title: 'QA, optimization, and launch', copy: 'Validated navigation, responsiveness, and accessibility while tightening asset delivery and deployment reliability.' }
        ],
        cta: {
            eyebrow: 'Plan your build',
            title: 'Want this same custom approach for your site?',
            body: 'We can map your requirements, timeline, and rollout plan into a practical build scope with clear milestones.',
            actions: [
                { label: 'Book a Strategy Call', href: '/contact', variant: 'primary' },
                { label: 'Back to Home', href: '/', variant: 'secondary' }
            ]
        }
    }
};