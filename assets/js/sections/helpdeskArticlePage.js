import { createElement } from '../primitives/element.js';
import { ArticleBody } from '../components/articleBody.js';
import { MetaRow } from '../components/metaRow.js';
import { SidebarCard } from '../components/sidebarCard.js';
import { CtaPanel } from '../components/ctaPanel.js';
import { PageHero } from '../components/pageHero.js';

export function HelpdeskArticlePage(data = {}) {
    const topic = data.topic || 'helpdesk';
    const meta = [data.date, data.topic].filter(Boolean);
    const tags = data.tags || [];

    return createElement('div', {
        children: [
            data.hero
                ? PageHero({
                    eyebrow: data.hero.eyebrow || 'Help Article',
                    title: data.hero.title || data.title || '',
                    lead: data.hero.lead || data.excerpt || '',
                    image: data.hero.image || '',
                    meta
                })
                : createElement('section', {
                    className: 'section helpdesk-article-header-section',
                    children: [
                        createElement('div', {
                            className: 'container helpdesk-article-header-wrap',
                            children: [
                                createElement('a', {
                                    className: 'blog-back-link',
                                    text: '← Back to Topic',
                                    attrs: { href: `/helpdesk?slug=${topic}` }
                                }),
                                createElement('h1', {
                                    className: 'helpdesk-article-title',
                                    text: data.title || 'Help Article'
                                }),
                                data.excerpt
                                    ? createElement('p', {
                                        className: 'helpdesk-article-excerpt',
                                        text: data.excerpt
                                    })
                                    : null,
                                MetaRow(meta)
                            ].filter(Boolean)
                        })
                    ]
                }),

            createElement('section', {
                className: 'section section-tight-top',
                children: [
                    createElement('div', {
                        className: 'container blog-post-layout',
                        children: [
                            createElement('div', {
                                className: 'blog-post-main reveal',
                                children: [
                                    tags.length
                                        ? createElement('div', {
                                            className: 'blog-post-tags',
                                            children: tags.map(tag =>
                                                createElement('span', {
                                                    className: 'blog-post-tag',
                                                    text: tag
                                                })
                                            )
                                        })
                                        : null,
                                    ArticleBody(data.content || [])
                                ].filter(Boolean)
                            }),
                            createElement('aside', {
                                className: 'blog-post-sidebar reveal',
                                children: [
                                    SidebarCard({
                                        eyebrow: 'Navigation',
                                        title: 'Need another answer?',
                                        children: [
                                            createElement('div', {
                                                className: 'hero-cta-row',
                                                children: [
                                                    createElement('a', {
                                                        className: 'button button-secondary',
                                                        text: 'Back to Topic',
                                                        attrs: { href: `/helpdesk?slug=${topic}` }
                                                    }),
                                                    createElement('a', {
                                                        className: 'button button-primary',
                                                        text: 'Helpdesk Home',
                                                        attrs: { href: '/helpdesk' }
                                                    })
                                                ]
                                            })
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