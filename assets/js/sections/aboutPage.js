import { createElement } from '../primitives/element.js';
import { Card, StatCard } from '../primitives/card.js';
import { PageHero } from '../components/pageHero.js';
import { SectionHeader } from '../components/sectionHeader.js';
import { CtaPanel } from '../components/ctaPanel.js';

function normalizeKicker(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'number') return String(value).padStart(2, '0');

  const text = String(value).trim();
  if (!text) return '';
  if (/^\d+$/.test(text)) return text.padStart(2, '0');
  return '';
}

function normalizeStep(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'number') return String(value).padStart(2, '0');

  const text = String(value).trim();
  if (!text) return '';
  if (/^\d+$/.test(text)) return text.padStart(2, '0');
  return text;
}

export function AboutPage(data = {}) {
  const hero = data.hero || {};
  const intro = data.intro || {};
  const blocks = data.blocks || [];
  const stats = data.stats || [];
  const story = data.story || {};
  const values = data.values || {};
  const cta = data.cta || {};

  return createElement('div', {
    children: [
      PageHero(hero),

      createElement('section', {
        className: 'section',
        children: [
          createElement('div', {
            className: 'container',
            children: [
              SectionHeader({
                eyebrow: intro.eyebrow,
                title: intro.title,
                lead: intro.lead
              })
            ]
          })
        ]
      }),

      createElement('section', {
        className: 'section section-tight-top',
        children: [
          createElement('div', {
            className: 'container split-page-grid',
            children: [
              createElement('div', {
                className: 'feature-grid feature-grid-single',
                children: blocks.map(item =>
                  Card({
                    className: 'feature-card reveal',
                    children: [
                      (() => {
                        const kickerText = normalizeKicker(item.kicker);
                        const isNumericKicker = /^\d+$/.test(kickerText);

                        if (isNumericKicker) {
                          return createElement('div', {
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
                          });
                        }

                        return createElement('h3', {
                          className: 'card-title',
                          text: item.title || ''
                        });
                      })(),
                      createElement('p', {
                        className: 'card-copy',
                        text: item.copy || ''
                      })
                    ].filter(Boolean)
                  })
                )
              }),
              createElement('div', {
                className: 'stats-stack',
                children: stats.map(item => StatCard(item))
              })
            ]
          })
        ]
      }),

      story.title
        ? createElement('section', {
          className: 'section',
          children: [
            createElement('div', {
              className: 'container',
              children: [
                SectionHeader({
                  eyebrow: story.eyebrow,
                  title: story.title,
                  lead: story.lead
                }),
                createElement('div', {
                  className: 'process-grid',
                  children: (story.steps || []).map(step =>
                    Card({
                      className: 'process-card reveal',
                      children: [
                        createElement('div', {
                          className: 'card-title-row',
                          children: [
                            createElement('div', {
                              className: 'process-step',
                              text: normalizeStep(step.step)
                            }),
                            createElement('h3', {
                              className: 'card-title',
                              text: step.title || ''
                            })
                          ]
                        }),
                        createElement('p', {
                          className: 'card-copy',
                          text: step.copy || ''
                        })
                      ]
                    })
                  )
                })
              ]
            })
          ]
        })
        : null,

      values.title
        ? createElement('section', {
          className: 'section',
          children: [
            createElement('div', {
              className: 'container',
              children: [
                SectionHeader({
                  eyebrow: values.eyebrow,
                  title: values.title
                }),
                createElement('div', {
                  className: 'feature-grid',
                  children: (values.items || []).map(item =>
                    Card({
                      className: 'feature-card reveal',
                      children: [
                        createElement('h3', {
                          className: 'card-title',
                          text: item.title || ''
                        }),
                        createElement('p', {
                          className: 'card-copy',
                          text: item.copy || ''
                        })
                      ]
                    })
                  )
                })
              ]
            })
          ]
        })
        : null,

      createElement('section', {
        className: 'section',
        children: [
          createElement('div', {
            className: 'container',
            children: [
              CtaPanel({
                title: cta.title || 'Need a stronger About page?',
                body: cta.body || '',
                actions: [
                  { label: 'Contact Us', href: '/contact', variant: 'primary' },
                  { label: 'View Services', href: '/services', variant: 'secondary' }
                ]
              })
            ]
          })
        ]
      })
    ].filter(Boolean)
  });
}