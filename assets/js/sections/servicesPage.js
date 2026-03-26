import { createElement } from '../primitives/element.js';
import { PageHero } from './pageHero.js';
import { SectionHeader } from '../primitives/sectionParts.js';
import { FeatureGrid } from '../components/featureGrid.js';
import { Card } from '../primitives/card.js';

export function ServicesPage(data) {
  return createElement('div', {
    children: [
      PageHero({ ...data.hero, image: 'https://picsum.photos/seed/buzzworthy-services/1400/900' }),
      createElement('section', {
        className: 'section',
        children: [
          createElement('div', {
            className: 'container',
            children: [
              SectionHeader({
                eyebrow: 'Core services',
                title: 'A broader service stack, organized clearly.',
                lead: 'The source site lists marketing, development, web design, SEO, ecommerce, and branding. This page turns that list into a usable service catalog.'
              }),
              FeatureGrid(data.services)
            ]
          })
        ]
      }),
      createElement('section', {
        className: 'section',
        children: [
          createElement('div', {
            className: 'container',
            children: [
              SectionHeader({
                eyebrow: 'Delivery model',
                title: 'Strategy through support.',
                lead: 'The original site outlines a four-part path: strategy, design, develop, support.'
              }),
              createElement('div', {
                className: 'process-grid',
                children: data.process.map(item =>
                  Card({
                    className: 'process-card reveal',
                    children: [
                      createElement('div', { className: 'process-step', text: item.step }),
                      createElement('h3', { className: 'card-title', text: item.title }),
                      createElement('p', { className: 'card-copy', text: item.copy })
                    ]
                  })
                )
              })
            ]
          })
        ]
      })
    ]
  });
}
