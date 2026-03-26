import { loadSiteContent } from './contentLoader.js';
import { resolveRoute } from './router.js';
import { initTheme, toggleTheme } from './theme.js';

import { Navbar } from './components/navbar.js';
import { Footer } from './components/footer.js';

import { HomePage } from './sections/home.js';
import { ServicesPage } from './sections/servicesPage.js';
import { WorksPage } from './sections/worksPage.js';
import { BlogPage } from './sections/blogPage.js';
import { BlogPostPage } from './sections/blogPostPage.js';
import { HelpdeskPage } from './sections/helpdeskPage.js';
import { HelpdeskTopicPage } from './sections/helpdeskTopicPage.js';
import { HelpdeskArticlePage } from './sections/helpdeskArticlePage.js';
import { AboutPage } from './sections/aboutPage.js';
import { ContactPage } from './sections/contactPage.js';
import { ServiceDetailPage } from './sections/serviceDetailPage.js';

const headerMount = document.getElementById('site-header');
const appMount = document.getElementById('app');
const footerMount = document.getElementById('site-footer');

async function boot() {
  const { page } = resolveRoute();
  const { site, pageContent } = await loadSiteContent(page);

  headerMount.innerHTML = '';
  appMount.innerHTML = '';
  footerMount.innerHTML = '';

  headerMount.appendChild(Navbar({ nav: site.nav, currentPage: page }));

  const pageMap = {
    home: () => HomePage({ home: pageContent, ...site }),
    services: () => ServicesPage(pageContent),
    works: () => WorksPage(pageContent),
    blog: () => BlogPage(pageContent),
    post: () => BlogPostPage(pageContent),
    helpdesk: () => HelpdeskPage(pageContent),
    topic: () => HelpdeskTopicPage(pageContent),
    article: () => HelpdeskArticlePage(pageContent),
    about: () => AboutPage(pageContent),
    contact: () => ContactPage(pageContent, site.company),
    marketing: () => ServiceDetailPage(pageContent, site.servicePills, 'marketing'),
    development: () => ServiceDetailPage(pageContent, site.servicePills, 'development'),
    'web-design': () => ServiceDetailPage(pageContent, site.servicePills, 'web-design'),
    'seo-optimisation': () => ServiceDetailPage(pageContent, site.servicePills, 'seo-optimisation'),
    ecommerce: () => ServiceDetailPage(pageContent, site.servicePills, 'ecommerce'),
    branding: () => ServiceDetailPage(pageContent, site.servicePills, 'branding')
  };

  appMount.appendChild((pageMap[page] || pageMap.home)());
  footerMount.appendChild(Footer(site.company));

  initUI();
  initTheme();
}

function initUI() {
  const header = headerMount.querySelector('.site-header');
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = headerMount.querySelector('.nav-links');
  const themeToggle = document.getElementById('themeToggle');

  mobileToggle?.addEventListener('click', () => {
    header?.classList.toggle('is-open');
  });

  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => header?.classList.remove('is-open'));
  });

  themeToggle?.addEventListener('click', () => {
    toggleTheme();
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  document.querySelectorAll('.reveal').forEach(node => observer.observe(node));

  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  if (form && status) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      status.textContent = '';

      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());

      if (!payload.name?.trim() || !payload.email?.trim() || !payload.message?.trim()) {
        status.textContent = 'Name, email, and message are required.';
        status.dataset.state = 'error';
        return;
      }

      try {
        status.textContent = 'Sending…';
        status.dataset.state = 'pending';

        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok || !data.ok) {
          throw new Error(data.message || 'Submission failed.');
        }

        form.reset();
        status.textContent = data.message || 'Message received.';
        status.dataset.state = 'success';
      } catch (error) {
        status.textContent = error.message || 'Submission failed.';
        status.dataset.state = 'error';
      }
    });
  }
}

window.addEventListener('app:navigate', boot);
window.addEventListener('popstate', boot);

boot().catch((error) => {
  console.error(error);

  loadJSON('/api/site')
    .then((site) => {
      headerMount.innerHTML = '';
      footerMount.innerHTML = '';

      if (site?.nav?.length) {
        headerMount.appendChild(Navbar({ nav: site.nav, currentPage: 'not-found' }));
      }

      if (site?.company) {
        footerMount.appendChild(Footer(site.company));
      }
    })
    .catch((siteError) => {
      console.error(siteError);
      headerMount.innerHTML = '';
      footerMount.innerHTML = '';
    })
    .finally(() => {
      appMount.innerHTML = '';
      appMount.appendChild(NotFoundPage());
      initUI();
      initTheme();
    });
});
