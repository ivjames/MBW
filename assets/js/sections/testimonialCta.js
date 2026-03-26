import { createElement } from '../primitives/element.js';
import { Card } from '../primitives/card.js';
import { Button } from '../primitives/button.js';

export function ClosingSection({ testimonial, cta }) {
  return createElement('section', {
    className: 'section',
    attrs: { id: 'contact' },
    children: [
      createElement('div', {
        className: 'container dual-panel',
        children: [
          Card({
            className: 'quote-card reveal',
            children: [
              createElement('div', { className: 'eyebrow', text: 'Client perspective' }),
              createElement('blockquote', { text: `“${testimonial.quote}”` }),
              createElement('div', { className: 'author-line', text: testimonial.author })
            ]
          }),
          Card({
            className: 'cta-card reveal',
            children: [
              createElement('div', { className: 'eyebrow', text: 'Start here' }),
              createElement('h3', { className: 'card-title', text: cta.title }),
              createElement('p', { className: 'card-copy', text: cta.body }),
              createElement('div', {
                className: 'hero-cta-row',
                children: cta.actions.map(item => Button(item))
              })
            ]
          })
        ]
      })
    ]
  });
}
