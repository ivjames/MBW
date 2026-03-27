import { createElement } from '../primitives/element.js';
import { Card } from '../primitives/card.js';

export function QuotePanel({
    label = 'Client feedback',
    text = '',
    author = '',
    className = ''
} = {}) {
    return Card({
        className: `quote-mini reveal ${className}`.trim(),
        children: [
            createElement('div', {
                className: 'metric-label',
                text: label
            }),
            createElement('p', {
                className: 'card-title',
                text: text ? `“${text}”` : ''
            }),
            author
                ? createElement('div', {
                    className: 'author-line',
                    text: author
                })
                : null
        ].filter(Boolean)
    });
}