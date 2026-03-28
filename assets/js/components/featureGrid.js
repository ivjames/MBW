import { createElement } from '../primitives/element.js';
import { Card } from '../primitives/card.js';

function normalizeKicker(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'number') return String(value).padStart(2, '0');

  const text = String(value).trim();
  if (!text) return '';
  if (/^\d+$/.test(text)) return text.padStart(2, '0');
  return '';
}

export function FeatureGrid(items = [], className = '') {
  return createElement('div', {
    className: `feature-grid ${className}`.trim(),
    children: items.map(item => {
      const kickerText = normalizeKicker(item.kicker);
      const isNumericKicker = /^\d+$/.test(kickerText);

      const iconLead = item.icon
        ? createElement('div', {
          className: 'card-icon-marker',
          children: [
            createElement('i', {
              attrs: {
                class: `fa-solid ${item.icon}`,
                'aria-hidden': 'true'
              }
            })
          ]
        })
        : null;

      const cardContent = [
        item.icon
          ? createElement('div', {
            className: 'card-title-row',
            children: [
              iconLead,
              createElement('h3', {
                className: 'card-title',
                text: item.title || ''
              })
            ]
          })
          : isNumericKicker
            ? createElement('div', {
              className: 'card-title-row',
              children: [
                createElement('div', {
                  className: 'card-kicker-lead',
                  text: kickerText
                }),
                createElement('h3', {
                  className: 'card-title',
                  text: item.title || ''
                })
              ]
            })
            : createElement('h3', {
            className: 'card-title',
            text: item.title || ''
          }),
        item.copy
          ? createElement('p', {
            className: 'card-copy',
            text: item.copy
          })
          : null,
        item.detail
          ? createElement('p', {
            className: 'card-copy',
            text: item.detail
          })
          : null,
        Array.isArray(item.tokens) && item.tokens.length
          ? createElement('div', {
            className: 'token-row',
            children: item.tokens.map(token =>
              createElement('span', {
                className: 'token-chip',
                text: token
              })
            )
          })
          : null
      ].filter(Boolean);

      const card = Card({
        className: 'feature-card reveal',
        children: cardContent
      });

      // If item has href, wrap in anchor
      if (item.href) {
        return createElement('a', {
          attrs: { href: item.href },
          children: [card]
        });
      }

      return card;
    })
  });
}