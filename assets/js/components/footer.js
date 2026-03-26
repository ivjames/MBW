import { createElement } from '../primitives/element.js';

function footerLinkColumn(title, links = []) {
  return createElement('div', {
    className: 'footer-column',
    children: [
      createElement('div', {
        className: 'footer-title',
        text: title
      }),
      createElement('div', {
        className: 'footer-link-list',
        children: links.map(link =>
          createElement('a', {
            className: 'footer-link',
            text: link.label,
            attrs: { href: link.href }
          })
        )
      })
    ]
  });
}

export function Footer(company = {}) {
  const year = new Date().getFullYear();
  const name = company?.name || 'Buzzworthy';
  const email = company?.email || '';
  const phone = company?.phone || '';
  const addressLines = company?.addressLines || [];

  const primaryLinks = [
    { label: 'Services', href: '/services' },
    { label: 'Works', href: '/works' },
    { label: 'Blog', href: '/blog' },
    { label: 'Helpdesk', href: '/helpdesk' }
  ];

  const serviceLinks = [
    { label: 'Marketing', href: '/marketing' },
    { label: 'Development', href: '/development' },
    { label: 'Web Design', href: '/web-design' },
    { label: 'Branding', href: '/branding' }
  ];

  return createElement('div', {
    className: 'site-footer',
    children: [
      createElement('div', {
        className: 'footer-inner',
        children: [
          createElement('div', {
            className: 'footer-lede',
            children: [
              createElement('div', {
                className: 'footer-kicker',
                text: 'Buzzworthy Review Build'
              }),
              createElement('h2', {
                className: 'footer-brand',
                text: name
              }),
              createElement('p', {
                className: 'footer-copy',
                text: 'Conversion-focused pages, editable content, and a heavier presentation layer built to feel polished during review.'
              }),
              createElement('div', {
                className: 'footer-pill-row',
                children: [
                  createElement('span', {
                    className: 'footer-pill',
                    text: 'Custom content'
                  }),
                  createElement('span', {
                    className: 'footer-pill',
                    text: 'SQLite-backed admin'
                  }),
                  createElement('span', {
                    className: 'footer-pill',
                    text: 'Fast review deploy'
                  })
                ]
              })
            ]
          }),
          createElement('div', {
            className: 'footer-grid',
            children: [
              footerLinkColumn('Explore', primaryLinks),
              footerLinkColumn('Services', serviceLinks),
              createElement('div', {
                className: 'footer-column footer-contact',
                children: [
                  createElement('div', {
                    className: 'footer-title',
                    text: 'Contact'
                  }),
                  email
                    ? createElement('a', {
                        className: 'footer-link footer-contact-link',
                        text: email,
                        attrs: { href: `mailto:${email}` }
                      })
                    : null,
                  phone
                    ? createElement('a', {
                        className: 'footer-link footer-contact-link',
                        text: phone,
                        attrs: { href: `tel:${phone.replace(/[^\d+]/g, '')}` }
                      })
                    : null,
                  ...addressLines.map(line =>
                    createElement('div', {
                      className: 'footer-address-line',
                      text: line
                    })
                  ),
                  createElement('a', {
                    className: 'footer-link footer-admin-link',
                    text: 'Admin Login',
                    attrs: { href: '/admin/login' }
                  })
                ].filter(Boolean)
              })
            ]
          }),
          createElement('div', {
            className: 'footer-bottom',
            children: [
              createElement('div', {
                text: `© ${year} ${name}. Self-hosted modular review build.`
              }),
              createElement('div', {
                text: 'Built for iterative content updates and stakeholder walkthroughs.'
              })
            ]
          })
        ]
      })
    ]
  });
}
