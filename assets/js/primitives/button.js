import { createElement } from './element.js';

export function Button({ label, href = '#', variant = 'primary', isChip = false, className = '' }) {
  const classes = ['button', `button-${variant}`];
  if (isChip) classes.push('button-chip');
  if (className) classes.push(className);

  return createElement('a', {
    className: classes.join(' '),
    text: label,
    attrs: { href }
  });
}
