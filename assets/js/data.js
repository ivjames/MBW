export const siteData = {
  company: {
    name: "DeepDigital",
    email: "maurice@marketingbuzzworthy.com",
    phone: "1-800-123-4567",
    supportPhone: "1-800-123-4569",
    addressLines: ["2231 Sycamore Lake Road", "Green Bay, WI 54304"]
  },

  nav: [
    { label: "Home", href: "index", page: "home" },
    {
      label: "Services",
      href: "services",
      page: "services",
      children: [
        { label: "Marketing", href: "marketing", page: "marketing" },
        { label: "Development", href: "development", page: "development" },
        { label: "Web Design", href: "web-design", page: "web-design" },
        { label: "SEO Optimisation", href: "seo-optimisation", page: "seo-optimisation" },
        { label: "Ecommerce", href: "ecommerce", page: "ecommerce" },
        { label: "Branding", href: "branding", page: "branding" }
      ]
    },
    { label: "About", href: "about", page: "about" },
    { label: "Contact", href: "contact", page: "contact" }
  ],

  home: {
    hero: {
      eyebrow: "Conversion-focused digital agency",
      title: "Websites that make your business easier to <span class=\"highlight\">choose</span>.",
      lead: "We redesign underperforming sites, sharpen positioning, and build growth campaigns that turn traffic into qualified leads and revenue. The system is modular, flex-first, and built to self-host cleanly.",
      ctas: [
        { label: "Book a Strategy Call", href: "contact", variant: "primary" },
        { label: "See Services", href: "services", variant: "secondary" },
        { label: "About the Team", href: "about", variant: "ghost" }
      ],
      proof: [
        "50+ launches delivered",
        "34% average lift in qualified leads",
        "Design system + modular JS"
      ],
      metrics: [
        { label: "Qualified Leads", value: "+38%", trend: "Month over month" },
        { label: "Conversion Rate", value: "5.4%", trend: "Up from 3.1%" },
        { label: "Cost per Lead", value: "-22%", trend: "Trim intake waste" }
      ],
      chart: {
        label: "Lead growth after redesign",
        points: [
          { label: "Jan", value: 34 },
          { label: "Feb", value: 42 },
          { label: "Mar", value: 46 },
          { label: "Apr", value: 58 },
          { label: "May", value: 69 },
          { label: "Jun", value: 78 },
          { label: "Jul", value: 84 },
          { label: "Aug", value: 94 }
        ]
      },
      quote: {
        text: "The new site finally matches the quality of our service. Lead quality improved within the first month.",
        author: "Operations Director, NorthPeak Legal"
      },
      image: "https://picsum.photos/seed/deepdigital-hero-a/1600/900"
    },

    logos: ["NorthPeak", "Aster", "Axiom", "BlueHarbor", "MetricForge", "PrimeLayer"],

    services: [
      {
        kicker: "01",
        title: "Marketing",
        copy: "We use strategic marketing tactics that have been proven to work.",
        tokens: ["Campaign strategy", "Lead generation", "B2B focus"]
      },
      {
        kicker: "02",
        title: "Development",
        copy: "Custom programming for most complex functions you can think.",
        tokens: ["Custom features", "Clean handoff", "Self-hosted builds"]
      },
      {
        kicker: "03",
        title: "Web Design",
        copy: "Powerful web design that will out-perform your strongest competitors.",
        tokens: ["Conversion-focused", "Responsive UX", "Clear hierarchy"]
      }
    ],

    cases: [
      {
        badge: "B2B Professional Services",
        title: "NorthPeak Legal",
        body: "Repositioned the firm, rebuilt core service pages, and tightened consultation flows to improve trust and lead quality for a multi-location practice.",
        image: "https://picsum.photos/seed/deepdigital-case-legal/1400/900",
        stats: [
          { value: "+41%", label: "Qualified leads" },
          { value: "+28%", label: "Consult bookings" },
          { value: "-19%", label: "Bounce rate" }
        ]
      },
      {
        badge: "Growth-Stage SaaS",
        title: "MetricForge",
        body: "Rebuilt the homepage and demand-gen landing flow around a clearer product story, stronger proof, and sharper user segmentation.",
        image: "https://picsum.photos/seed/deepdigital-case-saas/1400/900",
        stats: [
          { value: "+52%", label: "Demo requests" },
          { value: "+33%", label: "Activation rate" },
          { value: "-24%", label: "Paid CAC" }
        ]
      },
      {
        badge: "Industrial Services",
        title: "BlueHarbor Systems",
        body: "Rebuilt a dense legacy site into a cleaner technical platform with better hierarchy, stronger lead routing, and easier decision paths.",
        image: "https://picsum.photos/seed/deepdigital-case-industrial/1400/900",
        stats: [
          { value: "+31%", label: "Quote requests" },
          { value: "+22%", label: "Qualified sessions" },
          { value: "-17%", label: "Drop-off rate" }
        ]
      }
    ],

    system: {
      title: "A reusable system, not a pile of disconnected files.",
      lead: "The template uses tokens, utilities, primitives, section modules, and data-driven composition. Layouts default to flex patterns, while cards, sliders, charts, and buttons stay reusable and consistent.",
      pillars: [
        { kicker: "T", title: "Tokens", copy: "Color, spacing, radius, type, glow, and shadows live in a dedicated token layer.", tokens: ["Palette", "Spacing", "Typography"] },
        { kicker: "U", title: "Utilities", copy: "Flex and container helpers create layout discipline without inline-style sprawl.", tokens: ["Flex-first", "Containers", "Responsive"] },
        { kicker: "P", title: "Primitives", copy: "Buttons, cards, and charts expose variants and enforce consistent design behavior.", tokens: ["Variants", "States", "Reuse"] },
        { kicker: "S", title: "Sections", copy: "Hero, services, slider, system panels, and CTA are assembled from data and modules.", tokens: ["Composable", "Data-driven", "Scalable"] }
      ],
      process: [
        { step: "1", title: "Strategy", copy: "We define your competition and target audience. Discover what is working in your online industry, then design your website accordingly." },
        { step: "2", title: "Design", copy: "Color scheme, layout, sitemap, and style. We bring your brand to life with a one-of-a-kind masterpiece." },
        { step: "3", title: "Develop", copy: "We turn your ideas into a reality. Your website is placed on a development server where you can watch the process live." },
        { step: "4", title: "Support", copy: "Design, marketing, and maintenance remain supported after launch so the site keeps improving." }
      ]
    },

    testimonial: {
      quote: "DeepDigital replaced a generic website with a system our team can extend without degrading the design or the message.",
      author: "Maya Chen, CEO at Aster Advisory"
    },

    cta: {
      title: "Ready to replace the template with a real offer?",
      body: "Use this starter as the base for a static self-hosted build, then swap placeholder metrics, case studies, and contact routing with real business content.",
      actions: [
        { label: "Start the Project", href: "contact", variant: "primary" },
        { label: "Review Services", href: "services", variant: "secondary" }
      ]
    }
  },
  servicePills: [
    { label: "Marketing", href: "marketing", page: "marketing" },
    { label: "Development", href: "development", page: "development" },
    { label: "Web Design", href: "web-design", page: "web-design" },
    { label: "SEO Optimisation", href: "seo-optimisation", page: "seo-optimisation" },
    { label: "Ecommerce", href: "ecommerce", page: "ecommerce" },
    { label: "Branding", href: "branding", page: "branding" }
  ],
  servicesPage: {
    hero: {
      eyebrow: "Services",
      title: "Marketing, development, design, SEO, ecommerce, and branding.",
      lead: "Marketing BuzzWorthy’s public site emphasizes six core service areas. This page turns those into a usable service architecture."
    },
    services: [
      { kicker: "01", title: "Marketing", copy: "We use strategic marketing tactics that have been proven to work.", tokens: ["Strategy", "Campaigns", "Lead gen"] },
      { kicker: "02", title: "Development", copy: "Custom programming for most complex functions you can think. No more headaches. Focus on the business logic.", tokens: ["Custom code", "Integrations", "Self-hosted"] },
      { kicker: "03", title: "Web Design", copy: "Powerful web design that will out-perform your strongest competitors.", tokens: ["Responsive", "Conversion", "Positioning"] },
      { kicker: "04", title: "SEO Optimisation", copy: "Optimizing our web designs to rank on the first page of Google is our specialty.", tokens: ["Technical SEO", "On-page", "Content support"] },
      { kicker: "05", title: "Ecommerce", copy: "We build your online store using a flexible, modular platform that allows you to expand and grow.", tokens: ["Catalogs", "Checkout UX", "Growth-ready"] },
      { kicker: "06", title: "Branding", copy: "A solid brand strategy, logo and guidelines help you get recognized.", tokens: ["Identity", "Guidelines", "Consistency"] }
    ],
    process: [
      { step: "01", title: "Strategy", copy: "Define competition and target audience. Discover what works in the market, then align the site and funnel to it." },
      { step: "02", title: "Design", copy: "Establish color scheme, layout, sitemap, and style before the build starts." },
      { step: "03", title: "Develop", copy: "Turn ideas into working pages, interactions, and systems on a development server." },
      { step: "04", title: "Support", copy: "Keep design, marketing, and maintenance aligned after launch." }
    ]
  },

  aboutPage: {
    hero: {
      eyebrow: "About",
      title: "Getting online is easy. Succeeding online is a different story.",
      lead: "The source site leans on conversion-based web design coupled with a lead-generating marketing plan. This page reframes that into a sharper agency narrative."
    },
    blocks: [
      {
        kicker: "Perspective",
        title: "More than a beautiful website",
        copy: "You need more than a beautiful website to stand out. Online marketing solutions and a lead-generating plan are treated as part of the same system."
      },
      {
        kicker: "B2B Focus",
        title: "Built for longer buying cycles",
        copy: "B2B client acquisition is not the same as B2C. Brand messaging, website structure, and content marketing play a different role across the funnel."
      },
      {
        kicker: "Resources",
        title: "Content that supports sales",
        copy: "The public site positions resources and articles as part of the agency offer, not an afterthought. That supports trust and lead nurturing."
      }
    ],
    stats: [
      { label: "Core model", value: "Design + Marketing", trend: "Integrated delivery" },
      { label: "Buyer type", value: "B2B", trend: "Longer sales cycle" },
      { label: "Approach", value: "Lead-generating", trend: "Conversion focused" }
    ],
    image: "https://picsum.photos/seed/deepdigital-about-a/1600/1000"
  },

  contactPage: {
    hero: {
      eyebrow: "Contact",
      title: "Start the conversation.",
      lead: "Use the shared contact structure across the site, keep the cards compact, and route serious inquiries through a working Node-powered demo form."
    },
    methods: [
      { kicker: "Call Us", title: "New Accounts", copy: "1-800-123-4567" },
      { kicker: "Call Us", title: "Support", copy: "1-800-123-4569" },
      { kicker: "Write Us", title: "Email", copy: "maurice@marketingbuzzworthy.com" },
      { kicker: "Visit Us", title: "Office", copy: "2231 Sycamore Lake Road\nGreen Bay, WI 54304" }
    ],
    image: "https://picsum.photos/seed/deepdigital-contact-a/1600/1000"
  },

  servicePages: {
    marketing: {
      eyebrow: "Service",
      title: "Marketing",
      lead: "We use strategic marketing tactics that have been proven to work. Social networks, PPC campaigns. We can do it all for your company!",
      image: "https://picsum.photos/seed/deepdigital-marketing/1600/1000",
      sections: [
        {
          title: "Campaign Strategy",
          copy: "We build practical marketing plans around your audience, your offer, and your growth goals. That includes channel selection, message development, and execution priorities."
        },
        {
          title: "Paid and Social",
          copy: "From PPC campaigns to social media support, we help you put the right message in front of the right audience with cleaner tracking and stronger conversion paths."
        },
        {
          title: "Filler Content",
          copy: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat."
        }
      ]
    },

    development: {
      eyebrow: "Service",
      title: "Development",
      lead: "Custom programming for most complex functions you can think. No more headaches. Focus on your business and let it grow fast!",
      image: "https://picsum.photos/seed/deepdigital-development/1600/1000",
      sections: [
        {
          title: "Custom Features",
          copy: "We build custom functionality for business workflows, integrations, forms, tools, and internal processes that cannot be solved cleanly with generic templates."
        },
        {
          title: "Clean Delivery",
          copy: "The goal is stable code, maintainable structure, and a build you can extend without turning the site into a mess."
        },
        {
          title: "Filler Content",
          copy: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat."
        }
      ]
    },

    "web-design": {
      eyebrow: "Service",
      title: "Web Design",
      lead: "Powerful web design that will out-perform your strongest competitors. Let us help you with that. Get a free quote. Lorem ipsum dolor sit amet, consetetur.",
      image: "https://picsum.photos/seed/deepdigital-web-design/1600/1000",
      sections: [
        {
          title: "Conversion-Focused Layouts",
          copy: "We design pages around decision-making, trust, and action. That means stronger hierarchy, cleaner calls to action, and less wasted space."
        },
        {
          title: "Brand-Consistent Experience",
          copy: "Typography, color, structure, imagery, and interaction patterns are aligned so the site feels deliberate instead of patched together."
        },
        {
          title: "Filler Content",
          copy: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat."
        }
      ]
    },

    "seo-optimisation": {
      eyebrow: "Service",
      title: "SEO Optimisation",
      lead: "Optimizing our web designs to rank on the first page of Google is our specialty. Lorem ipsum dolor sit amet, consetetur sadipscing elitr.",
      image: "https://picsum.photos/seed/deepdigital-seo/1600/1000",
      sections: [
        {
          title: "Technical SEO",
          copy: "We improve structure, page speed, markup, crawlability, metadata, and internal linking so the site is easier for search engines to understand."
        },
        {
          title: "Search Visibility",
          copy: "SEO is treated as part of the page system, not an afterthought. That means content structure and design choices support discoverability from the start."
        },
        {
          title: "Filler Content",
          copy: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat."
        }
      ]
    },

    ecommerce: {
      eyebrow: "Service",
      title: "Ecommerce",
      lead: "We build your online store using a flexible, modular platform that allows you to expand and grow your website easily as your business grows.",
      image: "https://picsum.photos/seed/deepdigital-ecommerce/1600/1000",
      sections: [
        {
          title: "Flexible Storefronts",
          copy: "We design ecommerce systems that support growth, cleaner merchandising, better category structure, and easier product discovery."
        },
        {
          title: "Growth-Ready Foundation",
          copy: "The platform and page structure are built so content, products, and campaigns can evolve without requiring a rebuild every time the business changes."
        },
        {
          title: "Filler Content",
          copy: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat."
        }
      ]
    },

    branding: {
      eyebrow: "Service",
      title: "Branding",
      lead: "A solid brand strategy, logo and guidelines help you to get recognized. Lorem ipsum dolor sit amet, consetetur sadipscing elitr.",
      image: "https://picsum.photos/seed/deepdigital-branding/1600/1000",
      sections: [
        {
          title: "Brand Strategy",
          copy: "We clarify how the company should look, sound, and position itself so the site, campaigns, and collateral stay consistent."
        },
        {
          title: "Identity Systems",
          copy: "Logos, color systems, visual rules, and usage guidance help the business present itself more clearly and more professionally."
        },
        {
          title: "Filler Content",
          copy: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat."
        }
      ]
    }
  }
};
