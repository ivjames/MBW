import { createElement } from '../primitives/element.js';
import { Button } from '../primitives/button.js';
import { ProofRow } from '../components/proofRow.js';
import { DashboardPanel } from '../components/dashboardPanel.js';

export function HeroSection(data = {}) {
  const ctas = data.ctas || [];
  const proof = data.proof || [];
  const metrics = data.metrics || [];
  const chart = data.chart || { label: '', points: [] };
  const quote = data.quote || {};

  return createElement('section', {
    className: 'section hero-section',
    children: [
      createElement('div', {
        className: 'container hero-shell',
        children: [
          createElement('div', {
            className: 'hero-copy reveal',
            children: [
              data.eyebrow
                ? createElement('div', {
                  className: 'eyebrow',
                  text: data.eyebrow
                })
                : null,
              createElement('h1', {
                html: data.title || ''
              }),
              data.lead
                ? createElement('p', {
                  text: data.lead
                })
                : null,
              ctas.length
                ? createElement('div', {
                  className: 'hero-cta-row',
                  children: ctas.map(item => Button(item))
                })
                : null,
              proof.length ? ProofRow(proof) : null
            ].filter(Boolean)
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
              DashboardPanel({
                metrics,
                chart,
                quote
              })
            ]
          })
        ]
      })
    ]
  });
}