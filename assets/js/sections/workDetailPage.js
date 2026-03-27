import { createElement } from '../primitives/element.js';
import { PageHero } from '../components/pageHero.js';
import { ArticleBody } from '../components/articleBody.js';
import { CtaPanel } from '../components/ctaPanel.js';

export function WorkDetailPage(data = {}) {
    return createElement('div', {
        children: [
            createElement('section', {
                className: 'section helpdesk-article-header-section',
                children: [
                    createElement('div', {
                        className: 'container helpdesk-article-header-wrap',
                        children: [
                            createElement('a', {
                                className: 'blog-back-link',
                                text: '← Back to Works',
                                attrs: { href: '/works' }
                            })
                        ]
                    })
                ]
            }),

            PageHero({
                eyebrow: data.category || 'Project',
                title: data.title || '',
                lead: data.excerpt || '',
                image: data.image || '',
                meta: data.metrics || []
            }),

            createElement('section', {
                className: 'section section-tight-top',
                children: [
                    createElement('div', {
                        className: 'container',
                        children: [
                            ArticleBody(data.content || [])
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
                                title: 'Need work like this?',
                                body: 'Use these project pages as structured proof points, then replace the filler narrative with real deliverables, outcomes, and screenshots.',
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