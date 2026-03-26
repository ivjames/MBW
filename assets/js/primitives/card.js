import { createElement, fragment } from './element.js';

export function Card({ className = '', bodyClass = '', children = [] }) {
  const root = createElement('article', {
    className: ['card', className].filter(Boolean).join(' ')
  });

  const body = createElement('div', {
    className: ['card-body', bodyClass].filter(Boolean).join(' '),
    children
  });

  root.appendChild(body);
  return root;
}

export function StatCard({ label, value, trend }) {
  return createElement('article', {
    className: 'card metric-card reveal',
    children: [
      createElement('div', { className: 'metric-label', text: label }),
      createElement('div', { className: 'metric-value', text: value }),
      createElement('div', { className: 'metric-trend', html: `<span>●</span><span>${trend}</span>` })
    ]
  });
}
