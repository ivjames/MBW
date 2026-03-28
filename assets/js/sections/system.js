import { createElement } from '../primitives/element.js';
import { SectionHeader } from '../primitives/sectionParts.js';
import { FeatureGrid } from '../components/featureGrid.js';
import { Card } from '../primitives/card.js';

export function SystemSection(system) {
  return createElement('section', {
    className: 'section',
    attrs: { id: 'system' },
    children: [
      createElement('div', {
        className: 'container',
        children: [
          SectionHeader({
            eyebrow: 'Design system',
            title: system.title,
            lead: system.lead
          }),
          FeatureGrid(system.pillars),
          createElement('div', {
            className: 'process-grid',
            children: system.process.map(item =>
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
  });
}
