import { createElement } from '../primitives/element.js';
import { Card } from '../primitives/card.js';

export function FeatureGrid(items = [], className = '') {
  return createElement('div', {
    className: `feature-grid ${className}`.trim(),
    children: items.map(item =>
      Card({
        className: 'feature-card reveal',
        children: [
          item.kicker
            ? createElement('div', {
              className: 'card-kicker',
              text: item.kicker
            })
            : null,
          createElement('h3', {
            className: 'card-title',
            text: item.title || ''
          }),
          item.copy
            ? createElement('p', {
              className: 'card-copy',
              text: item.copy
            })
            : null
        ].filter(Boolean)
      })
    )
  });
}