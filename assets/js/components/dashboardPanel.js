import { createElement } from '../primitives/element.js';
import { ChartCard } from '../primitives/chart.js';
import { StatGrid } from './statGrid.js';
import { QuotePanel } from './quotePanel.js';

export function DashboardPanel({
    label = 'Performance Snapshot',
    metrics = [],
    chart = {},
    quote = {}
} = {}) {
    return createElement('div', {
        className: 'dashboard',
        children: [
            createElement('div', {
                className: 'dashboard-top',
                children: [
                    createElement('div', {
                        className: 'window-dots',
                        children: [createElement('span'), createElement('span'), createElement('span')]
                    }),
                    createElement('div', {
                        className: 'metric-label',
                        text: label
                    })
                ]
            }),
            createElement('div', {
                className: 'dashboard-grid',
                children: [
                    ...metrics.map(item => {
                        const wrap = createElement('div', { className: 'metric-span-4' });
                        wrap.appendChild(StatGrid([item], 'stat-grid-single'));
                        return wrap;
                    }),
                    ChartCard(chart),
                    QuotePanel({
                        text: quote.text || '',
                        author: quote.author || ''
                    })
                ]
            })
        ]
    });
}