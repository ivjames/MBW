import { createElement } from '../primitives/element.js';
import { PageHero } from './pageHero.js';
import { Card } from '../primitives/card.js';

function TopicCard(topic) {
    return Card({
        className: 'feature-card reveal helpdesk-topic-card',
        children: [
            createElement('div', {
                className: 'card-kicker',
                text: (topic.icon || topic.title || '?').slice(0, 1)
            }),
            createElement('h3', {
                className: 'card-title',
                children: [
                    createElement('a', {
                        text: topic.title || '',
                        attrs: {
                            href: `topic?slug=${topic.slug || ''}`
                        }
                    })
                ]
            }),
            createElement('p', {
                className: 'card-copy',
                text: `${topic.count || 0} article${(topic.count || 0) === 1 ? '' : 's'}`
            })
        ]
    });
}

function FaqList(title, items = []) {
    return Card({
        className: 'compact-card reveal helpdesk-faq-card',
        children: [
            createElement('div', { className: 'eyebrow', text: 'FAQs' }),
            createElement('h3', { className: 'card-title', text: title }),
            createElement('div', {
                className: 'helpdesk-faq-list',
                children: items.map(item =>
                    createElement('a', {
                        className: 'helpdesk-faq-link',
                        attrs: {
                            href: `article?slug=${item.slug || ''}`
                        },
                        children: [
                            createElement('div', {
                                className: 'helpdesk-faq-link-main',
                                children: [
                                    createElement('span', {
                                        className: 'helpdesk-faq-link-title',
                                        text: item.title || ''
                                    }),
                                    createElement('span', {
                                        className: 'helpdesk-faq-link-arrow',
                                        text: '→'
                                    })
                                ]
                            }),
                            item.topic
                                ? createElement('span', {
                                    className: 'helpdesk-faq-link-meta',
                                    text: item.topic
                                })
                                : null
                        ].filter(Boolean)
                    })
                )
            })
        ]
    });
}

export function HelpdeskPage(data = {}) {
    const hero = data.hero || {};
    const topics = data.topics || [];
    const popular = data.popular || [];
    const mostViewed = data.mostViewed || [];

    return createElement('div', {
        children: [
            PageHero({
                eyebrow: hero.eyebrow || 'Helpdesk',
                title: hero.title || 'How can we help?',
                lead: hero.lead || 'Search FAQs, browse support topics, and open individual help articles.',
                image: hero.image || 'https://picsum.photos/seed/deepdigital-helpdesk/1600/1000'
            }),

            createElement('section', {
                className: 'section',
                children: [
                    createElement('div', {
                        className: 'container',
                        children: [
                            createElement('div', {
                                className: 'helpdesk-search-wrap reveal',
                                children: [
                                    createElement('input', {
                                        className: 'helpdesk-search',
                                        attrs: {
                                            type: 'search',
                                            placeholder: 'Search help topics and FAQs',
                                            id: 'helpdeskSearch'
                                        }
                                    })
                                ]
                            }),

                            createElement('div', {
                                className: 'feature-grid helpdesk-topic-grid',
                                attrs: { id: 'helpdeskTopicGrid' },
                                children: topics.map(TopicCard)
                            })
                        ]
                    })
                ]
            }),

            createElement('section', {
                className: 'section',
                children: [
                    createElement('div', {
                        className: 'container helpdesk-faq-grid',
                        children: [
                            FaqList('Popular FAQs', popular),
                            FaqList('Most Viewed FAQs', mostViewed)
                        ]
                    })
                ]
            })
        ]
    });
}