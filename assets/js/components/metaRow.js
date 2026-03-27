import { createElement } from '../primitives/element.js';

export function MetaRow(items = [], className = '') {
    return createElement('div', {
        className: `meta-row ${className}`.trim(),
        children: items
            .filter(Boolean)
            .map(item =>
                createElement('span', {
                    className: 'meta-row-item',
                    text: item
                })
            )
    });
}