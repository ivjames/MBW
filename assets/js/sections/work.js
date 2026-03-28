import { createElement } from '../primitives/element.js';
import { SectionHeader } from '../primitives/sectionParts.js';
import { CaseSlider } from '../components/slider.js';

export function WorkSection(cases) {
  return createElement('section', {
    className: 'section',
    attrs: { id: 'work' },
    children: [
      createElement('div', {
        className: 'container',
        children: [
          SectionHeader({
            eyebrow: 'Selected case studies',
            title: 'Lead with context, decisions, and measurable outcomes.',
            lead: 'The slider module handles stage layout, controls, dots, and content composition. Data only describes the projects.'
          }),
          CaseSlider(cases)
        ]
      })
    ]
  });
}
