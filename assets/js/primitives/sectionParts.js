import { createElement } from './element.js';

export function SectionHeader({ eyebrow, title, lead }) {
  const wrapper = createElement('div', { className: 'section-header reveal' });
  const left = createElement('div', {
    children: [
      eyebrow ? createElement('div', { className: 'eyebrow', text: eyebrow }) : null,
      createElement('h2', { text: title })
    ]
  });
  const right = createElement('p', { text: lead });

  wrapper.append(left, right);
  return wrapper;
}
