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

export function HelpdeskArticlePage(data = {}) {
    const title = data.title || 'Help Article';
    const excerpt = data.excerpt || '';
    const date = data.date || '';
    const tags = data.tags || [];
    const topic = data.topic || 'helpdesk';
    const content = data.content || [];

    return createElement('div', {
        className: 'blog-post-page',
        children: [
            createElement('section', {
                className: 'section blog-post-hero-section',
                children: [
                    createElement('div', {
                        className: 'container blog-post-hero-shell',
                        children: [
                            createElement('div', {
                                className: 'blog-post-hero-copy reveal',
                                children: [
                                    createElement('a', {
                                        className: 'blog-back-link',
                                        text: '← Back to Topic',
                                        attrs: { href: `topic.html?slug=${topic}` }
                                    }),
                                    createElement('div', {
                                        className: 'eyebrow',
                                        text: 'Help Article'
                                    }),
                                    createElement('h1', {
                                        className: 'blog-post-title',
                                        text: title
                                    }),
                                    excerpt
                                        ? createElement('p', {
                                            className: 'blog-post-excerpt',
                                            text: excerpt
                                        })
                                        : null,
                                    createElement('div', {
                                        className: 'blog-post-meta',
                                        children: [
                                            date
                                                ? createElement('span', {
                                                    className: 'blog-post-meta-item',
                                                    text: date
                                                })
                                                : null,
                                            topic
                                                ? createElement('span', {
                                                    className: 'blog-post-meta-item',
                                                    text: topic
                                                })
                                                : null
                                        ].filter(Boolean)
                                    }),
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
                                        : null
                                ].filter(Boolean)
                            }),
                            createElement('div', {
                                className: 'blog-post-hero-media reveal',
                                children: [
                                    createElement('img', {
                                        attrs: {
                                            src: `https://picsum.photos/seed/helpdesk-article-${data.slug || 'default'}/1600/1000`,
                                            alt: title
                                        }
                                    })
                                ]
                            })
                        ]
                    })
                ]
            }),

            createElement('section', {
                className: 'section blog-post-body-section',
                children: [
                    createElement('div', {
                        className: 'container blog-post-layout',
                        children: [
                            createElement('article', {
                                className: 'blog-post-topic reveal',
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
                                                text: 'Topic'
                                            }),
                                            createElement('h3', {
                                                className: 'card-title',
                                                text: 'Details'
                                            }),
                                            createElement('p', {
                                                className: 'card-copy',
                                                text: `Topic: ${topic}`
                                            }),
                                            date
                                                ? createElement('p', {
                                                    className: 'card-copy',
                                                    text: `Published: ${date}`
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
                                                        label: 'Back to Article List',
                                                        href: `article.html?slug=${topic}`,
                                                        variant: 'secondary'
                                                    }),
                                                    Button({
                                                        label: 'Helpdesk Home',
                                                        href: 'helpdesk.html',
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
        ]
    });
}