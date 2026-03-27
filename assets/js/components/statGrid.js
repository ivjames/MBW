import { createElement } from '../primitives/element.js';
import { StatCard } from '../primitives/card.js';

export function StatGrid(items = [], className = '') {
    return createElement('div', {
        className: `stat-grid ${className}`.trim(),
        children: items.map(item => {
            const wrap = createElement('div', { className: 'stat-grid-item' });
            wrap.appendChild(StatCard(item));
            return wrap;
        })
    });
}