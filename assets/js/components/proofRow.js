import { createElement } from '../primitives/element.js';
import { Button } from '../primitives/button.js';

export function ProofRow(items = [], className = '') {
    const children = items
        .map(item => {
            const config = typeof item === 'string'
                ? { label: item }
                : (item || {});
            const label = (config.label || '').trim();
            const href = (config.href || '').trim();

            if (!label) {
                return null;
            }

            if (href) {
                return Button({
                    label,
                    href,
                    variant: config.variant || 'secondary',
                    isChip: true
                });
            }

            return createElement('span', {
                className: 'token-chip',
                text: label
            });
        })
        .filter(Boolean);

    return createElement('div', {
        className: `proof-row ${className}`.trim(),
        children
    });
}