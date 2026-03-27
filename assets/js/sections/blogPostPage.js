import { createElement } from '../primitives/element.js';
import { PageHero } from '../components/pageHero.js';
import { ArticleBody } from '../components/articleBody.js';
import { MetaRow } from '../components/metaRow.js';
import { SidebarCard } from '../components/sidebarCard.js';
import { CtaPanel } from '../components/ctaPanel.js';

export function BlogPostPage(data = {}) {
    const tags = data.tags || [];
    const meta = [data.date, data.author].filter(Boolean);

    return createElement('div', {
        children: [
            PageHero({
                eyebrow: 'Blog',
                title: data.title || '',
                lead: data.excerpt || '',
                image: data.image || '',
                meta
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
                                        eyebrow: 'Article',
                                        title: 'Post details',
                                        children: [
                                            MetaRow(meta, 'meta-row-stack')
                                        ]
                                    }),
                                    CtaPanel({
                                        title: 'Need help applying this?',
                                        body: 'Turn ideas from the blog into a usable project, service page, or conversion-focused redesign.',
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
            })
        ]
    });
}