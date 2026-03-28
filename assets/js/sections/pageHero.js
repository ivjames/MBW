import { createElement } from '../primitives/element.js';

export function PageHero({ eyebrow, title, lead, image }) {
  return createElement('section', {
    className: 'section page-hero',
    children: [
      createElement('div', {
        className: 'container page-hero-shell',
        children: [
          createElement('div', {
            className: 'page-hero-copy reveal',
            children: [
              createElement('div', { className: 'eyebrow', text: eyebrow }),
              createElement('h1', { text: title }),
              createElement('p', { text: lead })
            ]
          }),
          createElement('div', {
            className: 'page-hero-media reveal',
            children: [
              createElement('img', { attrs: { src: image, alt: '' } })
            ]
          })
        ]
      })
    ]
  });
}
