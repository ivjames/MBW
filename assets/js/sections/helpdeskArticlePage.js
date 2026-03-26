import { createElement } from '../primitives/element.js';
import { Card } from '../primitives/card.js';
import { Button } from '../primitives/button.js';

function renderBlock(block = {}) {
    switch (block.type) {
        case 'heading':
            return createElement('h2', {
                className: 'blog-post-heading',
                text: block.text || ''
            });

        case 'subheading':
            return createElement('h3', {
                className: 'blog-post-subheading',
                text: block.text || ''
            });

        case 'image':
            return createElement('figure', {
                className: 'blog-post-figure',
                children: [
                    createElement('img', {
                        attrs: {
                            src: block.src || '',
                            alt: block.alt || ''
                        }
                    }),
                    block.caption
                        ? createElement('figcaption', {
                            className: 'blog-post-caption',
                            text: block.caption
                        })
                        : null
                ].filter(Boolean)
            });

        case 'quote':
            return createElement('blockquote', {
                className: 'blog-post-quote',
                text: block.text || ''
            });

        case 'list':
            return createElement('ul', {
                className: 'blog-post-list',
                children: (block.items || []).map(item =>
                    createElement('li', { text: item })
                )
            });

        case 'paragraph':
        default:
            return createElement('p', {
                className: 'blog-post-paragraph',
                text: block.text || ''
            });
    }
}

function ArticleHeader(data = {}) {
    const topic = data.topic || 'helpdesk';

    return createElement('section', {
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
                        : null
                ].filter(Boolean)
            })
        ]
    });
}

function OptionalHero(data = {}) {
    if (!data.hero) return null;

    return createElement('section', {
        className: 'section blog-post-hero-section',
        children: [
            createElement('div', {
                className: 'container blog-post-hero-shell',
                children: [
                    createElement('div', {
                        className: 'blog-post-hero-copy reveal',
                        children: [
                            data.hero.eyebrow
                                ? createElement('div', {
                                    className: 'eyebrow',
                                    text: data.hero.eyebrow
                                })
                                : null,
                            data.hero.title
                                ? createElement('h2', {
                                    className: 'blog-post-title',
                                    text: data.hero.title
                                })
                                : null,
                            data.hero.lead
                                ? createElement('p', {
                                    className: 'blog-post-excerpt',
                                    text: data.hero.lead
                                })
                                : null
                        ].filter(Boolean)
                    }),
                    data.hero.image
                        ? createElement('div', {
                            className: 'blog-post-hero-media reveal',
                            children: [
                                createElement('img', {
                                    attrs: {
                                        src: data.hero.image,
                                        alt: data.hero.title || data.title || 'Article hero image'
                                    }
                                })
                            ]
                        })
                        : null
                ].filter(Boolean)
            })
        ]
    });
}

export function HelpdeskArticlePage(data = {}) {
    const topic = data.topic || 'helpdesk';
    const content = data.content || [];

    return createElement('div', {
        className: 'blog-post-page',
        children: [
            ArticleHeader(data),
            OptionalHero(data),

            createElement('section', {
                className: 'section blog-post-body-section',
                children: [
                    createElement('div', {
                        className: 'container blog-post-layout',
                        children: [
                            createElement('article', {
                                className: 'blog-post-article reveal',
                                children: content.map(renderBlock)
                            }),
                            createElement('aside', {
                                className: 'blog-post-sidebar reveal',
                                children: [
                                    Card({
                                        className: 'blog-sidebar-card compact-card',
                                        children: [
                                            createElement('div', {
                                                className: 'eyebrow',
                                                text: 'Article'
                                            }),
                                            createElement('h3', {
                                                className: 'card-title',
                                                text: 'Details'
                                            }),
                                            data.topic
                                                ? createElement('p', {
                                                    className: 'card-copy',
                                                    text: `Topic: ${data.topic}`
                                                })
                                                : null,
                                            data.date
                                                ? createElement('p', {
                                                    className: 'card-copy',
                                                    text: `Published: ${data.date}`
                                                })
                                                : null
                                        ].filter(Boolean)
                                    }),
                                    Card({
                                        className: 'blog-sidebar-card compact-card',
                                        children: [
                                            createElement('div', {
                                                className: 'eyebrow',
                                                text: 'Navigation'
                                            }),
                                            createElement('h3', {
                                                className: 'card-title',
                                                text: 'Need another answer?'
                                            }),
                                            createElement('div', {
                                                className: 'hero-cta-row',
                                                children: [
                                                    Button({
                                                        label: 'Back to Topic',
                                                        href: `/helpdesk?slug=${topic}`,
                                                        variant: 'secondary'
                                                    }),
                                                    Button({
                                                        label: 'Helpdesk Home',
                                                        href: '/helpdesk',
                                                        variant: 'primary'
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
        ].filter(Boolean)
    });
}