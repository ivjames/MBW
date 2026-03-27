import { createElement } from '../primitives/element.js';
import { Card } from '../primitives/card.js';

export function ProcessGrid(items = [], className = '') {
    return createElement('div', {
        className: `process-grid ${className}`.trim(),
        children: items.map(item =>
            Card({
                className: 'process-card reveal',
                children: [
                    createElement('div', {
                        className: 'process-step',
                        text: item.step || ''
                    }),
                    createElement('h3', {
                        className: 'card-title',
                        text: item.title || ''
                    }),
                    createElement('p', {
                        className: 'card-copy',
                        text: item.copy || ''
                    })
                ]
            })
        )
    });
}