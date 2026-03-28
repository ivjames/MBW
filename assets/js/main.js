import { loadSiteContent } from './contentLoader.js';
import { resolveRoute, navigate } from './router.js';
import { initTheme, toggleTheme } from './theme.js';
import { Navbar } from './components/navbar.js';
import { Footer } from './components/footer.js';
import { renderPage } from './renderers/renderPage.js';

const headerMount = document.getElementById('site-header');
const appMount = document.getElementById('app');
const footerMount = document.getElementById('site-footer');

let detachHeaderScrollState = null;

initTheme();

async function boot() {
  const route = resolveRoute();
  const { page } = route;

  const { site, pageContent } = await loadSiteContent(page);

  const nextHeader = Navbar({ nav: site.nav || [], currentPage: page });
  const nextPage = renderPage(page, pageContent, site);
  const nextFooter = Footer(site.company || {});

  headerMount.innerHTML = '';
  headerMount.appendChild(nextHeader);

  appMount.replaceChildren(nextPage);
  footerMount.replaceChildren(nextFooter);

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

  const syncHeaderState = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  };

  syncHeaderState();
  window.addEventListener('scroll', syncHeaderState, { passive: true });

  return () => {
    window.removeEventListener('scroll', syncHeaderState);
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