import { createElement } from '../primitives/element.js';
import { PageHero } from './pageHero.js';
import { Card } from '../primitives/card.js';
import { Button } from '../primitives/button.js';
import { ServiceSubnav } from '../components/serviceSubnav.js';

export function ServiceDetailPage(data, servicePills, currentPage) {
    return createElement('div', {
        children: [

            // SUBNAV ABOVE HERO
            createElement('div', {
                className: 'service-subnav-bar',
                children: [
                    createElement('div', {
                        className: 'container',
                        children: [
                            ServiceSubnav(servicePills, currentPage)
                        ]
                    })
                ]
            }),

            // HERO
            PageHero({
                eyebrow: data.hero?.eyebrow || 'Service',
                title: data.hero?.title || '',
                lead: data.hero?.lead || '',
                image: data.hero?.image || ''
            }),

            // CONTENT
            createElement('section', {
                className: 'section',
                children: [
                    createElement('div', {
                        className: 'container',
                        children: [
                            createElement('div', {
                                className: 'feature-grid',
                                children: data.sections.map(item =>
                                    Card({
                                        className: 'feature-card reveal',
                                        children: [
                                            createElement('h3', { className: 'card-title', text: item.title }),
                                            createElement('p', { className: 'card-copy', text: item.copy })
                                        ]
                                    })
                                )
                            })
                        ]
                    })
                ]
            }),

            // CTA
            createElement('section', {
                className: 'section',
                children: [
                    createElement('div', {
                        className: 'container',
                        children: [
                            Card({
                                className: 'cta-card reveal compact-card',
                                children: [
                                    createElement('div', { className: 'eyebrow', text: 'Next step' }),
                                    createElement('h3', { className: 'card-title', text: `Need help with ${data.hero?.title || ''}?` }),
                                    createElement('p', {
                                        className: 'card-copy',
                                        text: 'Use this page as a service detail template, then replace the filler copy with case studies, FAQs, deliverables, and stronger proof.'
                                    }),
                                    createElement('div', {
                                        className: 'hero-cta-row',
                                        children: [
                                            Button({ label: 'Contact Us', href: 'contact.html', variant: 'primary' }),
                                            Button({ label: 'View All Services', href: 'services.html', variant: 'secondary' })
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