import { createElement } from '../primitives/element.js';
import { Card } from '../primitives/card.js';

function normalizeStep(value) {
    if (value === null || value === undefined) return '';
    if (typeof value === 'number') return String(value).padStart(2, '0');

    const text = String(value).trim();
    if (!text) return '';
    if (/^\d+$/.test(text)) return text.padStart(2, '0');
    return text;
}

export function ProcessGrid(items = [], className = '') {
    return createElement('div', {
        className: `process-grid ${className}`.trim(),
        children: items.map(item =>
            Card({
                className: 'process-card reveal',
                children: [
                    createElement('div', {
                        className: 'card-title-row',
                        children: [
                            createElement('div', {
                                className: 'process-step',
                                text: normalizeStep(item.step)
                            }),
                            createElement('h3', {
                                className: 'card-title',
                                text: item.title || ''
                            })
                        ]
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