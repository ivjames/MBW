import { createElement } from './element.js';

export function Button({ label, href = '#', variant = 'primary', isChip = false }) {
  const classes = ['button', `button-${variant}`];
  if (isChip) classes.push('button-chip');

  return createElement('a', {
    className: classes.join(' '),
    text: label,
    attrs: { href }
  });
}
