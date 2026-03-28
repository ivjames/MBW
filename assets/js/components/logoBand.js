import { createElement } from '../primitives/element.js';
import { navigate } from '../router.js';

function normalizeLogo(item) {
  if (typeof item === 'string') {
    return { label: item, image: '', href: '' };
  }

  if (!item || typeof item !== 'object') {
    return { label: '', image: '', href: '' };
  }

  return {
    label: item.label || item.name || item.title || item.text || '',
    image: item.image || item.src || item.logo || '',
    href: item.href || ''
  };
}

export function LogoBand(items = [], className = '') {
  return createElement('div', {
    className: `logo-band ${className}`.trim(),
    children: items.map(rawItem => {
      const item = normalizeLogo(rawItem);

      const inner = [
        item.image
          ? createElement('img', {
            className: 'logo-item-image',
            attrs: { src: item.image, alt: item.label || 'Client logo' }
          })
          : null,
        item.label
          ? createElement('span', {
            className: 'logo-item-text',
            text: item.label
          })
          : null
      ].filter(Boolean);

      if (item.href) {
        const a = createElement('a', {
          className: 'logo-item reveal',
          attrs: { href: item.href },
          children: inner
        });
        a.addEventListener('click', e => {
          e.preventDefault();
          navigate(item.href);
        });
        return a;
      }

      return createElement('div', {
        className: 'logo-item reveal',
        children: inner
      });
    })
  });
}