import { createElement } from '../primitives/element.js';

export function Footer(company = {}) {
  const year = new Date().getFullYear();
  const name = company?.name || 'DeepDigital';
  const email = company?.email || '';
  const phone = company?.phone || '';
  const address = company?.addressLines?.join(', ') || '';
  return createElement('div', {
    className: 'site-footer',
    children: [
      createElement('div', {
        className: 'footer-inner',
        children: [
          createElement('div', { text: `© ${year} ${company.name}. Self-hosted modular template.` }),
          createElement('div', { text: `${company.email} • ${company.phone}` })
        ]
      })
    ]
  });
}
