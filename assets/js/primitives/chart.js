import { createElement } from './element.js';
import { Card } from './card.js';

export function ChartCard({ label, points = [] }) {
  return Card({
    className: 'chart-card reveal',
    children: [
      createElement('div', { className: 'metric-label', text: label }),
      createElement('div', {
        className: 'chart-shell',
        children: points.map(point =>
          createElement('div', {
            className: 'chart-bar-wrap',
            children: [
              createElement('div', {
                className: 'chart-bar-value',
                text: `${point.value}%`
              }),
              createElement('div', {
                className: 'chart-bar-track',
                children: [
                  createElement('div', {
                    className: 'chart-bar',
                    attrs: {
                      style: `height: ${Math.max(point.value, 10)}%;`
                    }
                  })
                ]
              }),
              createElement('div', {
                className: 'chart-label',
                text: point.label
              })
            ]
          })
        )
      })
    ]
  });
}