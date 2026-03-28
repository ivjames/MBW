import { createElement } from '../primitives/element.js';
import { Button } from '../primitives/button.js';

function createNavItem(item, currentPage) {
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;

  const link = createElement('a', {
    text: item.label,
    attrs: {
      href: item.href,
      'aria-current': item.page === currentPage ? 'page' : null
    }
  });

  if (!hasChildren) {
    return createElement('div', {
      className: 'nav-item',
      children: [link]
    });
  }

  const submenu = createElement('div', {
    className: 'submenu',
    children: item.children.map(child =>
      createElement('a', {
        text: child.label,
        attrs: {
          href: child.href,
          'aria-current': child.page === currentPage ? 'page' : null
        }
      })
    )
  });

  return createElement('div', {
    className: 'nav-item has-submenu',
    children: [link, submenu]
  });
}

export function Navbar({ nav, currentPage }) {
  const header = createElement('div', { className: 'site-header' });
  const inner = createElement('div', { className: 'header-inner' });

  const brand = createElement('a', {
    className: 'brand-lockup',
    attrs: { href: '/', 'aria-label': 'Buzzworthy home' },
    children: [
      createElement('img', {
        className: 'brand-mark-image',
        attrs: {
          src: '/assets/images/logo-mark.png',
          alt: 'Buzzworthy logo mark'
        }
      }),
      createElement('div', {
        className: 'brand-wordmark',
        children: [
          createElement('span', {
            className: 'brand-name',
            text: 'Buzzworthy'
          })
        ]
      })
    ]
  });

  const links = createElement('nav', {
    className: 'nav-links',
    children: nav.map(item => createNavItem(item, currentPage))
  });

  const actions = createElement('div', {
    className: 'header-actions',
    children: [
      Button({ label: 'Book a Call', href: '/contact', variant: 'primary' }),
      createElement('button', {
        className: 'mobile-toggle',
        attrs: {
          type: 'button',
          'aria-label': 'Open navigation',
          id: 'mobileToggle'
        },
        children: [
          createElement('span', { className: 'mobile-toggle-bar' }),
          createElement('span', { className: 'mobile-toggle-bar' }),
          createElement('span', { className: 'mobile-toggle-bar' })
        ]
      })
    ]
  });

  inner.append(brand, links, actions);
  header.appendChild(inner);
  return header;
}