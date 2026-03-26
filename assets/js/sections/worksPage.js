import { createElement } from '../primitives/element.js';
import { PageHero } from './pageHero.js';
import { SectionHeader } from '../primitives/sectionParts.js';
import { Card } from '../primitives/card.js';
import { Gallery } from '../components/gallery.js';

export function WorksPage(data) {
    return createElement('div', {
        children: [
            PageHero(data.hero),

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
                            Card({
                                className: 'cta-card reveal compact-card',
                                children: [
                                    createElement('div', { className: 'eyebrow', text: 'Next step' }),
                                    createElement('h3', {
                                        className: 'card-title',
                                        text: data.cta?.title || 'Need deeper case studies?'
                                    }),
                                    createElement('p', {
                                        className: 'card-copy',
                                        text: data.cta?.body || 'Replace this gallery with detailed case-study pages when you are ready.'
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