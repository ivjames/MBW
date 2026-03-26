import { createElement } from '../primitives/element.js';
import { Card } from '../primitives/card.js';

export function FeatureGrid(items) {
  return createElement('div', {
    className: 'feature-grid',
    children: items.map(item =>
      Card({
        className: 'feature-card reveal',
        children: [
          createElement('div', { className: 'card-kicker', text: item.kicker }),
          createElement('h3', { className: 'card-title', text: item.title }),
          createElement('p', { className: 'card-copy', text: item.copy }),
          createElement('div', {
            className: 'token-row',
            children: item.tokens.map(token => createElement('span', { className: 'token-chip', text: token }))
          })
        ]
      })
    )
  });
}
