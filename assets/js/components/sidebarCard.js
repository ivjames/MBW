import { createElement } from '../primitives/element.js';
import { Card } from '../primitives/card.js';

export function SidebarCard({
    eyebrow = '',
    title = '',
    body = '',
    children = [],
    className = ''
} = {}) {
    return Card({
        className: `sidebar-card compact-card ${className}`.trim(),
        children: [
            eyebrow
                ? createElement('div', { className: 'eyebrow', text: eyebrow })
                : null,
            title
                ? createElement('h3', { className: 'card-title', text: title })
                : null,
            body
                ? createElement('p', { className: 'card-copy', text: body })
                : null,
            ...children
        ].filter(Boolean)
    });
}