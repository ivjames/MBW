import { createElement } from '../primitives/element.js';
import { PageHero } from './pageHero.js';
import { Button } from '../primitives/button.js';

function BlogCard(post) {
    const tags = post.tags || [];

    return createElement('article', {
        className: 'blog-index-card reveal',
        children: [
            createElement('a', {
                className: 'blog-index-media',
                attrs: {
                    href: `blog?slug=${post.slug}`,
                    'aria-label': post.title
                },
                children: [
                    createElement('img', {
                        attrs: {
                            src: post.image,
                            alt: post.title
                        }
                    })
                ]
            }),

            createElement('div', {
                className: 'blog-index-body',
                children: [
                    createElement('div', {
                        className: 'blog-index-meta',
                        children: [
                            post.date
                                ? createElement('span', {
                                    className: 'blog-index-date',
                                    text: post.date
                                })
                                : null,
                            post.author
                                ? createElement('span', {
                                    className: 'blog-index-author',
                                    text: post.author
                                })
                                : null
                        ].filter(Boolean)
                    }),

                    createElement('a', {
                        className: 'blog-index-title-link',
                        attrs: { href: `blog?slug=${post.slug}` },
                        children: [
                            createElement('h3', {
                                className: 'blog-index-title',
                                text: post.title
                            })
                        ]
                    }),

                    createElement('p', {
                        className: 'blog-index-excerpt',
                        text: post.excerpt || ''
                    }),

                    tags.length
                        ? createElement('div', {
                            className: 'blog-index-tags',
                            children: tags.map(tag =>
                                createElement('span', {
                                    className: 'blog-index-tag',
                                    text: tag
                                })
                            )
                        })
                        : null,

                    createElement('div', {
                        className: 'blog-index-actions',
                        children: [
                            Button({
                                label: 'Read Article',
                                href: `blog?slug=${post.slug}`,
                                variant: 'secondary'
                            })
                        ]
                    })
                ].filter(Boolean)
            })
        ]
    });
}

export function BlogPage(data) {
    return createElement('div', {
        children: [
            PageHero({
                eyebrow: 'Blog',
                title: 'Insights, structure, and practical breakdowns.',
                lead: 'Short articles on design, marketing, SEO, development, and system thinking.',
                image: data.hero?.image || 'https://picsum.photos/seed/buzzworthy-blog-hero/1600/1000.webp'
            }),

            createElement('section', {
                className: 'section',
                children: [
                    createElement('div', {
                        className: 'container',
                        children: [
                            createElement('div', {
                                className: 'blog-index-header reveal',
                                children: [
                                    createElement('div', { className: 'eyebrow', text: 'Latest posts' }),
                                    createElement('h2', {
                                        className: 'section-title-lite',
                                        text: data.intro?.title || 'Articles and updates'
                                    }),
                                    createElement('p', {
                                        className: 'section-copy-lite',
                                        text: data.intro?.lead || 'Use the blog to publish articles, thinking, and case-study-adjacent content without overloading the core site pages.'
                                    })
                                ]
                            }),

                            createElement('div', {
                                className: 'blog-index-grid',
                                children: (data.posts || []).map(post => BlogCard(post))
                            })
                        ]
                    })
                ]
            })
        ]
    });
}