import { createElement } from '../primitives/element.js';

export function LogoBand(logos) {
  return createElement('div', {
    className: 'logo-band reveal',
    children: logos.map((logo) => {
      const label = document.createElement('span');
      label.className = 'logo-label';
      label.textContent = logo.name || '';

      return createElement('div', {
        className: 'logo-item',
        children: [
          createElement('img', {
            src: logo.image,
            alt: logo.name || '',
            title: logo.name || ''
          }),
          label
        ]
      });
    })
  });
}