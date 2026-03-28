import { createElement } from '../primitives/element.js';
import { PageHero } from '../components/pageHero.js';
import { Card } from '../primitives/card.js';
import { SectionHeader } from '../components/sectionHeader.js';

function resolveTopicIcon(topic = {}) {
    const key = `${topic.slug || ''} ${topic.title || ''} ${topic.description || ''}`.toLowerCase();

    if (key.includes('account') || key.includes('profile') || key.includes('user')) return 'fa-user-gear';
    if (key.includes('billing') || key.includes('payment') || key.includes('invoice')) return 'fa-credit-card';
    if (key.includes('security') || key.includes('privacy') || key.includes('access')) return 'fa-shield-halved';
    if (key.includes('integrat') || key.includes('api') || key.includes('connect')) return 'fa-plug-circle-bolt';
    if (key.includes('perform') || key.includes('speed') || key.includes('optimi')) return 'fa-gauge-high';
    if (key.includes('email') || key.includes('message') || key.includes('notify')) return 'fa-envelope-open-text';
    if (key.includes('report') || key.includes('analytics') || key.includes('metric')) return 'fa-chart-line';
    return 'fa-circle-question';
}

function TopicCard(topic = {}) {
    return Card({
        className: 'feature-card reveal helpdesk-topic-card',
        children: [
            createElement('div', {
                className: 'card-title-row',
                children: [
                    createElement('div', {
                        className: 'card-icon',
                        children: [
                            createElement('i', {
                                attrs: {
                                    class: `fa-solid ${resolveTopicIcon(topic)}`,
                                    'aria-hidden': 'true'
                                }
                            })
                        ]
                    }),
                    createElement('h3', {
                        className: 'card-title',
                        children: [
                            createElement('a', {
                                text: topic.title || '',
                                attrs: {
                                    href: `/helpdesk?slug=${topic.slug || ''}`
                                }
                            })
                        ]
                    })
                ]
            }),
            topic.description
                ? createElement('p', {
                    className: 'card-copy',
                    text: topic.description
                })
                : null,
            createElement('p', {
                className: 'card-copy',
                text: `${topic.count || 0} article${(topic.count || 0) === 1 ? '' : 's'}`
            })
        ].filter(Boolean)
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
                        attrs: { href: `/article?slug=${item.slug || ''}` },
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
            PageHero(hero),

            createElement('section', {
                className: 'section',
                children: [
                    createElement('div', {
                        className: 'container',
                        children: [
                            SectionHeader({
                                eyebrow: 'Topics',
                                title: 'Browse support topics and common questions.',
                                lead: 'Find the right support area, then drill into individual help articles.'
                            }),
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