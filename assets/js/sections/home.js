import { createElement } from '../primitives/element.js';
import { HeroSection } from './hero.js';
import { SectionHeader } from '../components/sectionHeader.js';
import { FeatureGrid } from '../components/featureGrid.js';
import { ProcessGrid } from '../components/processGrid.js';
import { CtaPanel } from '../components/ctaPanel.js';
import { LogoBand } from '../components/logoBand.js';
import { Gallery } from '../components/gallery.js';
import { Card } from '../primitives/card.js';

function CaseGallery(cases = []) {
  const filters = ['All', ...new Set(cases.map(item => item.badge || 'Work'))];

  const projects = cases.map(item => ({
    title: item.title || '',
    category: item.badge || 'Work',
    image: item.image || '',
    summary: item.body || '',
    metrics: (item.stats || []).map(stat => `${stat.value} ${stat.label}`)
  }));

  return Gallery({
    filters,
    projects
  });
}

function TestimonialPanel(testimonial = {}) {
  return Card({
    className: 'cta-panel compact-card reveal',
    children: [
      createElement('div', {
        className: 'eyebrow',
        text: 'Testimonial'
      }),
      createElement('p', {
        className: 'card-title',
        text: testimonial.quote ? `“${testimonial.quote}”` : ''
      }),
      testimonial.author
        ? createElement('div', {
          className: 'author-line',
          text: testimonial.author
        })
        : null
    ].filter(Boolean)
  });
}

export function HomePage(data = {}) {
  const home = data.home || {};
  const hero = home.hero || {};
  const logos = home.logos || [];
  const services = home.services || [];
  const cases = home.cases || [];
  const system = home.system || {};
  const testimonial = home.testimonial || {};
  const cta = home.cta || {};

  return createElement('div', {
    children: [
      HeroSection(hero),

      createElement('section', {
        className: 'section section-tight-top',
        children: [
          createElement('div', {
            className: 'container',
            children: [
              SectionHeader({
                eyebrow: 'Core services',
                title: 'Marketing, development, and design working as one system.',
                lead: 'The homepage should introduce the service stack clearly without forcing users to dig through separate pages before they understand the offer.'
              }),
              FeatureGrid(services)
            ]
          })
        ]
      }),

      cases.length
        ? createElement('section', {
          className: 'section section-tight-top',
          children: [
            createElement('div', {
              className: 'container',
              children: [
                SectionHeader({
                  eyebrow: 'Selected work',
                  title: 'Recent projects and proof of direction.',
                  lead: 'Use this area to show outcome-oriented work, project categories, and short context without turning the homepage into a full case-study archive.'
                }),
                CaseGallery(cases)
              ]
            })
          ]
        })
        : null,

      logos.length
        ? createElement('section', {
          className: 'section section-tight-top',
          children: [
            createElement('div', {
              className: 'container',
              children: [LogoBand(logos)]
            })
          ]
        })
        : null,

      system.title
        ? createElement('section', {
          className: 'section',
          children: [
            createElement('div', {
              className: 'container',
              children: [
                SectionHeader({
                  eyebrow: 'System',
                  title: system.title,
                  lead: system.lead
                }),
                FeatureGrid(system.pillars || []),
                createElement('div', {
                  className: 'section-spacer-sm'
                }),
                ProcessGrid(system.process || [])
              ]
            })
          ]
        })
        : null,

      createElement('section', {
        className: 'section section-tight-top',
        children: [
          createElement('div', {
            className: 'container dual-panel',
            children: [
              TestimonialPanel(testimonial),
              CtaPanel({
                title: cta.title || 'Ready to replace the template with a real offer?',
                body: cta.body || '',
                actions: cta.actions || [
                  { label: 'Start the Project', href: '/contact', variant: 'primary' },
                  { label: 'Review Services', href: '/services', variant: 'secondary' }
                ]
              })
            ]
          })
        ]
      })
    ].filter(Boolean)
  });
}