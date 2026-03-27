import { createElement } from '../primitives/element.js';

function normalizeLogo(item) {
  if (typeof item === 'string') {
    return {
      label: item,
      image: ''
    };
  }

  if (!item || typeof item !== 'object') {
    return {
      label: '',
      image: ''
    };
  }

  return {
    label: item.label || item.name || item.title || item.text || '',
    image: item.image || item.src || item.logo || ''
  };
}

export function LogoBand(items = [], className = '') {
  return createElement('div', {
    className: `logo-band ${className}`.trim(),
    children: items.map(rawItem => {
      const item = normalizeLogo(rawItem);

      return createElement('div', {
        className: 'logo-item reveal',
        children: [
          item.image
            ? createElement('img', {
              className: 'logo-item-image',
              attrs: {
                src: item.image,
                alt: item.label || 'Client logo'
              }
            })
            : null,
          item.label
            ? createElement('span', {
              className: 'logo-item-text',
              text: item.label
            })
            : null
        ].filter(Boolean)
      });
    })
  });
}