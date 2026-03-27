import { createElement } from '../primitives/element.js';
import { Button } from '../primitives/button.js';
import { Card } from '../primitives/card.js';

export function CtaPanel({
    eyebrow = 'Next step',
    title = '',
    body = '',
    actions = [],
    className = ''
} = {}) {
    return Card({
        className: `cta-panel compact-card ${className}`.trim(),
        children: [
            createElement('div', { className: 'eyebrow', text: eyebrow }),
            createElement('h3', { className: 'card-title', text: title }),
            body
                ? createElement('p', { className: 'card-copy', text: body })
                : null,
            actions.length
                ? createElement('div', {
                    className: 'hero-cta-row',
                    children: actions.map(action => Button(action))
                })
                : null
        ].filter(Boolean)
    });
}