import { createElement } from '../primitives/element.js';
import { SectionHeader } from '../primitives/sectionParts.js';
import { FeatureGrid } from '../components/featureGrid.js';

export function ServicesSection(data) {
  return createElement('section', {
    className: 'section',
    attrs: { id: 'services' },
    children: [
      createElement('div', {
        className: 'container',
        children: [
          SectionHeader({
            eyebrow: 'Services',
            title: 'Services built around business outcomes.',
            lead: 'Replace generic agency categories with focused engagements that improve trust, clarity, conversion, and growth efficiency.'
          }),
          FeatureGrid(data)
        ]
      })
    ]
  });
}
