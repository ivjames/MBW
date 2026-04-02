import { loadSiteContent } from './contentLoader.js';
import { resolveRoute, navigate } from './router.js';
import { initTheme, toggleTheme } from './theme.js';
import { Navbar } from './components/navbar.js';
import { Footer } from './components/footer.js';
import { resolvePageRenderer } from './renderers/renderPage.js';

const headerMount = document.getElementById('site-header');
const appMount = document.getElementById('app');
const footerMount = document.getElementById('site-footer');

let detachHeaderScrollState = null;

initTheme();

function cssReady() {
  const link = document.getElementById('app-css');
  if (!link || link.rel === 'stylesheet') return Promise.resolve();
  return new Promise(resolve => link.addEventListener('load', resolve, { once: true }));
}

function updateCanonical() {
  const tag = document.getElementById('canonical-url');
  if (tag) {
    tag.href = window.location.origin + window.location.pathname + window.location.search;
  }
}

function resetScrollPosition() {
  if (window.scrollY <= 1) {
    return;
  }

  window.requestAnimationFrame(() => {
    window.scrollTo(0, 0);
  });
}

async function boot() {
  await cssReady();
  updateCanonical();
  const route = resolveRoute();
  const { page } = route;
  const rendererPromise = resolvePageRenderer(page);

  const { site, pageContent } = await loadSiteContent(page);
  const renderPage = await rendererPromise;

  const nextHeader = Navbar({ nav: site.nav || [], currentPage: page });
  const nextPage = renderPage(pageContent, site);
  const nextFooter = Footer(site || {});

  headerMount.innerHTML = '';
  headerMount.appendChild(nextHeader);

  appMount.replaceChildren(nextPage);
  footerMount.replaceChildren(nextFooter);
  resetScrollPosition();

  initUI();
}

function initUI() {
  const header = headerMount.querySelector('.site-header');
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = headerMount.querySelector('.nav-links');
  const themeToggle = document.getElementById('themeToggle');

  detachHeaderScrollState?.();
  detachHeaderScrollState = bindHeaderScrollState(header);

  mobileToggle?.addEventListener('click', () => {
    header?.classList.toggle('is-open');
  });

  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', event => {
      const href = link.getAttribute('href') || '';

      if (!href.startsWith('/') || href.startsWith('/api') || href.startsWith('/admin')) {
        header?.classList.remove('is-open');
        return;
      }

      event.preventDefault();
      header?.classList.remove('is-open');
      navigate(href);
    });
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

  if (form && status && !form.dataset.bound) {
    form.dataset.bound = 'true';

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

  const helpdeskSearch = document.getElementById('helpdeskSearch');
  const topicGrid = document.getElementById('helpdeskTopicGrid');

  if (helpdeskSearch && topicGrid && !helpdeskSearch.dataset.bound) {
    helpdeskSearch.dataset.bound = 'true';

    helpdeskSearch.addEventListener('input', () => {
      const query = helpdeskSearch.value.trim().toLowerCase();

      topicGrid.querySelectorAll('.helpdesk-topic-card').forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = !query || text.includes(query) ? '' : 'none';
      });

      document.querySelectorAll('.helpdesk-faq-link').forEach(link => {
        const text = link.textContent.toLowerCase();
        link.style.display = !query || text.includes(query) ? '' : 'none';
      });
    });
  }
}

function bindHeaderScrollState(header) {
  if (!header) {
    return null;
  }

  let scheduled = false;
  let isScrolled = null;

  const syncHeaderState = () => {
    scheduled = false;
    const nextIsScrolled = window.scrollY > 12;

    if (nextIsScrolled === isScrolled) {
      return;
    }

    isScrolled = nextIsScrolled;
    header.classList.toggle('is-scrolled', isScrolled);
  };

  const onScroll = () => {
    if (scheduled) {
      return;
    }

    scheduled = true;
    window.requestAnimationFrame(syncHeaderState);
  };

  syncHeaderState();
  window.addEventListener('scroll', onScroll, { passive: true });

  return () => {
    window.removeEventListener('scroll', onScroll);
  };
}

window.addEventListener('app:navigate', boot);
window.addEventListener('popstate', boot);

boot().catch((error) => {
  console.error(error);
  appMount.innerHTML = `
    <section class="section">
      <div class="container">
        <p>Failed to load site content.</p>
      </div>
    </section>
  `;
});