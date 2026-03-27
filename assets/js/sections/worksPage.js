import { createElement } from '../primitives/element.js';
import { PageHero } from '../components/pageHero.js';
import { SectionHeader } from '../components/sectionHeader.js';
import { CtaPanel } from '../components/ctaPanel.js';
import { Gallery } from '../components/gallery.js';

export function WorksPage(data = {}) {
    return createElement('div', {
        children: [
            PageHero(data.hero || {}),

            createElement('section', {
                className: 'section',
                children: [
                    createElement('div', {
                        className: 'container',
                        children: [
                            SectionHeader({
                                eyebrow: 'Gallery',
                                title: data.intro?.title || 'Project gallery',
                                lead: data.intro?.lead || ''
                            }),
                            Gallery({
                                filters: data.filters || ['All'],
                                projects: data.projects || []
                            })
                        ]
                    })
                ]
            }),

            createElement('section', {
                className: 'section',
                children: [
                    createElement('div', {
                        className: 'container',
                        children: [
                            CtaPanel({
                                title: data.cta?.title || 'Need deeper case studies?',
                                body: data.cta?.body || 'Replace this gallery with detailed case-study pages when you are ready.',
                                actions: [
                                    { label: 'Contact Us', href: '/contact', variant: 'primary' },
                                    { label: 'View Services', href: '/services', variant: 'secondary' }
                                ]
                            })
                        ]
                    })
                ]
            })
        ]
    });
}