import { createElement, fragment } from '../primitives/element.js';
import { HeroSection } from './hero.js';
import { ServicesSection } from './services.js';
import { WorkSection } from './work.js';
import { SystemSection } from './system.js';
import { ClosingSection } from './testimonialCta.js';
import { LogoBand } from '../components/logoBand.js';

export function HomePage(data) {
  const home = data.home || data || {};

  return fragment([
    HeroSection(home.hero || {}),
    createElement('section', {
      className: 'section',
      children: [
        createElement('div', {
          className: 'container',
          children: [LogoBand(home.logos || [])]
        })
      ]
    }),
    ServicesSection(home.services || []),
    WorkSection(home.cases || []),
    SystemSection(home.system || {}),
    ClosingSection({
      testimonial: home.testimonial || {},
      cta: home.cta || {}
    })
  ]);
}