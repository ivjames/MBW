import { createElement } from '../primitives/element.js';
import { Button } from '../primitives/button.js';
import { Card } from '../primitives/card.js';
import { PageHero } from './pageHero.js';

export function NotFoundPage() {
  return createElement('div', {
    className: 'not-found-page',
    children: [
      PageHero({
        eyebrow: '404',
        title: 'This page could not be found.',
        lead: 'The link may be outdated, the content may have moved, or the URL may be incomplete.',
        image: 'https://picsum.photos/seed/deepdigital-404/1600/1000'
      }),
      createElement('section', {
        className: 'section',
        children: [
          createElement('div', {
            className: 'container',
            children: [
              Card({
                className: 'compact-card reveal',
                children: [
                  createElement('div', {
                    className: 'eyebrow',
                    text: 'Try these instead'
                  }),
                  createElement('h2', {
                    className: 'card-title',
                    text: 'Pick a safe place to continue'
                  }),
                  createElement('p', {
                    className: 'card-copy',
                    text: 'You can head back to the homepage, browse the blog, or open the helpdesk.'
                  }),
                  createElement('div', {
                    className: 'hero-cta-row',
                    children: [
                      Button({ label: 'Go Home', href: 'index', variant: 'primary' }),
                      Button({ label: 'Browse Blog', href: 'blog', variant: 'secondary' }),
                      Button({ label: 'Open Helpdesk', href: 'helpdesk', variant: 'secondary' })
                    ]
                  })
                ]
              })
            ]
          })
        ]
      })
    ]
  });
}
