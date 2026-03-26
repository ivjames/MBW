import { createElement } from '../primitives/element.js';
import { Button } from '../primitives/button.js';
import { StatCard, Card } from '../primitives/card.js';
import { ChartCard } from '../primitives/chart.js';

export function HeroSection(data = {}) {
  const metrics = data.metrics || [];
  const proof = data.proof || [];
  const ctas = data.ctas || [];
  const quote = data.quote || {};
  const chart = data.chart || { label: '', points: [] };

  const metricGrid = createElement('div', {
    className: 'dashboard-grid',
    children: [
      ...metrics.map(item => {
        const wrap = createElement('div', { className: 'metric-span-4' });
        wrap.appendChild(StatCard(item));
        return wrap;
      }),
      ChartCard(chart),
      Card({
        className: 'quote-mini reveal',
        children: [
          createElement('div', { className: 'metric-label', text: 'Client feedback' }),
          createElement('p', { className: 'card-title', text: quote.text ? `“${quote.text}”` : '' }),
          createElement('div', { className: 'author-line', text: quote.author || '' })
        ]
      })
    ]
  });

  const dashboard = createElement('div', {
    className: 'dashboard',
    children: [
      createElement('div', {
        className: 'dashboard-top',
        children: [
          createElement('div', {
            className: 'window-dots',
            children: [createElement('span'), createElement('span'), createElement('span')]
          }),
          createElement('div', { className: 'metric-label', text: 'Performance Snapshot' })
        ]
      }),
      metricGrid
    ]
  });

  return createElement('section', {
    className: 'section hero-section',
    children: [
      createElement('div', {
        className: 'container hero-shell',
        children: [
          createElement('div', {
            className: 'hero-copy reveal',
            children: [
              createElement('div', { className: 'eyebrow', text: data.eyebrow || '' }),
              createElement('h1', { html: data.title || '' }),
              createElement('p', { text: data.lead || '' }),
              createElement('div', {
                className: 'hero-cta-row',
                children: ctas.map(item => Button(item))
              }),
              createElement('div', {
                className: 'proof-row',
                children: proof.map(item =>
                  Button({ label: item, href: '#', variant: 'secondary', isChip: true })
                )
              })
            ]
          }),
          createElement('div', {
            className: 'hero-visual reveal',
            children: [
              createElement('div', {
                className: 'hero-image-card',
                children: [
                  createElement('img', {
                    className: 'hero-stock-image',
                    attrs: {
                      src: data.image || '',
                      alt: 'Agency team collaboration'
                    }
                  })
                ]
              }),
              dashboard
            ]
          })
        ]
      })
    ]
  });
}