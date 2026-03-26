import { createElement } from '../primitives/element.js';
import { Button } from '../primitives/button.js';
import { Card } from '../primitives/card.js';

function renderBlock(block) {
    switch (block.type) {
        case 'heading':
            return createElement('h2', {
                className: 'blog-post-heading',
                text: block.text
            });

        case 'subheading':
            return createElement('h3', {
                className: 'blog-post-subheading',
                text: block.text
            });

        case 'image':
            return createElement('figure', {
                className: 'blog-post-figure',
                children: [
                    createElement('img', {
                        attrs: {
                            src: block.src,
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
                text: block.text
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
                text: block.text
            });
    }
}

export function BlogPostPage(data) {
    const tags = data.tags || [];
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
                                        text: '← Back to Blog',
                                        attrs: { href: 'blog' }
                                    }),
                                    createElement('div', {
                                        className: 'eyebrow',
                                        text: 'Blog'
                                    }),
                                    createElement('h1', {
                                        className: 'blog-post-title',
                                        text: data.title || ''
                                    }),
                                    createElement('p', {
                                        className: 'blog-post-excerpt',
                                        text: data.excerpt || ''
                                    }),
                                    createElement('div', {
                                        className: 'blog-post-meta',
                                        children: [
                                            data.date
                                                ? createElement('span', {
                                                    className: 'blog-post-meta-item',
                                                    text: data.date
                                                })
                                                : null,
                                            data.author
                                                ? createElement('span', {
                                                    className: 'blog-post-meta-item',
                                                    text: data.author
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
                            data.image
                                ? createElement('div', {
                                    className: 'blog-post-hero-media reveal',
                                    children: [
                                        createElement('img', {
                                            attrs: {
                                                src: data.image,
                                                alt: data.title || 'Blog featured image'
                                            }
                                        })
                                    ]
                                })
                                : null
                        ].filter(Boolean)
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
                                                text: 'Post details'
                                            }),
                                            createElement('div', {
                                                className: 'blog-sidebar-meta',
                                                children: [
                                                    data.author
                                                        ? createElement('p', {
                                                            className: 'card-copy',
                                                            text: `Author: ${data.author}`
                                                        })
                                                        : null,
                                                    data.date
                                                        ? createElement('p', {
                                                            className: 'card-copy',
                                                            text: `Published: ${data.date}`
                                                        })
                                                        : null
                                                ].filter(Boolean)
                                            })
                                        ]
                                    }),
                                    Card({
                                        className: 'blog-sidebar-card compact-card',
                                        children: [
                                            createElement('div', {
                                                className: 'eyebrow',
                                                text: 'Next step'
                                            }),
                                            createElement('h3', {
                                                className: 'card-title',
                                                text: 'Need help applying this?'
                                            }),
                                            createElement('p', {
                                                className: 'card-copy',
                                                text: 'Turn ideas from the blog into a usable project, service page, or conversion-focused redesign.'
                                            }),
                                            createElement('div', {
                                                className: 'hero-cta-row',
                                                children: [
                                                    Button({
                                                        label: 'Contact Us',
                                                        href: 'contact',
                                                        variant: 'primary'
                                                    }),
                                                    Button({
                                                        label: 'View Services',
                                                        href: 'services',
                                                        variant: 'secondary'
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