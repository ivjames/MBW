import { createElement } from '../primitives/element.js';
import { PageHero } from './pageHero.js';
import { Card, StatCard } from '../primitives/card.js';

export function AboutPage(data) {
  return createElement('div', {
    children: [
      PageHero({ ...data.hero, image: data.image }),
      createElement('section', {
        className: 'section',
        children: [
          createElement('div', {
            className: 'container split-page-grid',
            children: [
              createElement('div', {
                className: 'feature-grid feature-grid-single',
                children: data.blocks.map(item =>
                  Card({
                    className: 'feature-card reveal',
                    children: [
                      createElement('div', { className: 'card-kicker', text: item.kicker.slice(0,1) }),
                      createElement('h3', { className: 'card-title', text: item.title }),
                      createElement('p', { className: 'card-copy', text: item.copy })
                    ]
                  })
                )
              }),
              createElement('div', {
                className: 'stats-stack',
                children: data.stats.map(item => StatCard(item))
              })
            ]
          })
        ]
      })
    ]
  });
}
