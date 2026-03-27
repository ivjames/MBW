import { createElement } from '../primitives/element.js';
import { Button } from '../primitives/button.js';

export function ProofRow(items = [], className = '') {
    return createElement('div', {
        className: `proof-row ${className}`.trim(),
        children: items.map(item =>
            Button({
                label: item,
                href: '#',
                variant: 'secondary',
                isChip: true
            })
        )
    });
}