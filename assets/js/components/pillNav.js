import { createElement } from '../primitives/element.js';

export function PillNav(items = [], current = '', className = '') {
    return createElement('div', {
        className: `pill-nav ${className}`.trim(),
        children: items.map(item =>
            createElement('a', {
                className: item.page === current ? 'pill-nav-link is-active' : 'pill-nav-link',
                text: item.label,
                attrs: {
                    href: item.href,
                    'aria-current': item.page === current ? 'page' : null
                }
            })
        )
    });
}