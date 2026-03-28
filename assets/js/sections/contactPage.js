import { createElement } from '../primitives/element.js';
import { PageHero } from './pageHero.js';
import { Card } from '../primitives/card.js';
import { Button } from '../primitives/button.js';
import { ContactForm } from '../components/contactForm.js';

export function ContactPage(data, company) {
  return createElement('div', {
    children: [
      PageHero({ ...data.hero, image: data.image }),
      createElement('section', {
        className: 'section',
        children: [
          createElement('div', {
            className: 'container contact-grid',
            children: [
              createElement('div', {
                className: 'contact-left-column',
                children: [
                  createElement('div', {
                    className: 'feature-grid feature-grid-single contact-methods-grid',
                    children: data.methods.map(item =>
                      Card({
                        className: 'feature-card contact-method-card reveal',
                        children: [
                          item.icon
                            ? createElement('div', {
                              className: 'card-title-row',
                              children: [
                                createElement('div', {
                                  className: 'card-icon',
                                  children: [createElement('i', { attrs: { class: `fa-solid ${item.icon}` } })]
                                }),
                                createElement('h3', { className: 'card-title', text: item.title })
                              ]
                            })
                            : createElement('h3', { className: 'card-title', text: item.title }),
                          createElement('p', { className: 'card-copy multiline', text: item.copy })
                        ].filter(Boolean)
                      })
                    )
                  }),
                  Card({
                    className: 'cta-card reveal compact-card',
                    children: [
                      createElement('div', { className: 'eyebrow', text: 'Primary route' }),
                      createElement('h3', { className: 'card-title', text: 'Start with a call or a scoped email.' }),
                      createElement('p', { className: 'card-copy', text: `Phone: ${company.phone} • Email: ${company.email}` }),
                      createElement('div', {
                        className: 'hero-cta-row',
                        children: [
                          Button({ label: 'Call Now', href: `tel:${company.phone}`, variant: 'primary' }),
                          Button({ label: 'Email Us', href: `mailto:${company.email}`, variant: 'secondary' })
                        ]
                      })
                    ]
                  })
                ]
              }),
              createElement('div', {
                className: 'contact-form-column',
                children: [ContactForm()]
              })
            ]
          })
        ]
      })
    ]
  });
}
