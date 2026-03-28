import { createElement } from '../primitives/element.js';

export function SectionHeader({
    eyebrow = '',
    title = '',
    lead = '',
    align = 'left',
    className = ''
} = {}) {
    return createElement('div', {
        className: `section-header section-tight-top section-header-${align} ${className}`.trim(),
        children: [
            eyebrow
                ? createElement('div', { className: 'eyebrow', text: eyebrow })
                : null,
            title
                ? createElement('h2', { className: 'section-title', text: title })
                : null,
            lead
                ? createElement('p', { className: 'section-lead', text: lead })
                : null
        ].filter(Boolean)
    });
}