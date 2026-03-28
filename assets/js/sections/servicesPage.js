import { createElement } from '../primitives/element.js';
import { PageHero } from '../components/pageHero.js';
import { SectionHeader } from '../components/sectionHeader.js';
import { FeatureGrid } from '../components/featureGrid.js';
import { ProcessGrid } from '../components/processGrid.js';

export function ServicesPage(data = {}) {
  return createElement('div', {
    children: [
      PageHero({
        ...data.hero,
        image: data.hero?.image || 'https://picsum.photos/seed/deepdigital-services/1600/1000.webp'
      }),

      createElement('section', {
        className: 'section',
        children: [
          createElement('div', {
            className: 'container',
            children: [
              SectionHeader({
                eyebrow: 'Core services',
                title: 'A broader service stack, organized clearly.',
                lead: 'Marketing, development, design, SEO, ecommerce, and branding are grouped into a cleaner service architecture.'
              }),
              FeatureGrid(data.services || [])
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
                lead: 'The public site outlines a four-part path: strategy, design, develop, and support.'
              }),
              ProcessGrid(data.process || [])
            ]
          })
        ]
      })
    ]
  });
}