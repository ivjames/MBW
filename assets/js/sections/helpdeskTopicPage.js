import { createElement } from '../primitives/element.js';
import { PageHero } from '../components/pageHero.js';
import { CtaPanel } from '../components/ctaPanel.js';
import { FeatureGrid } from '../components/featureGrid.js';

export function HelpdeskTopicPage(data = {}) {
    const articles = (data.articles || []).map(article => ({
        title: article.title || '',
        copy: article.excerpt || '',
        kicker: 'A',
        href: `/article?slug=${article.slug || ''}`
    }));

    return createElement('div', {
        children: [
            PageHero({
                eyebrow: 'Helpdesk Topic',
                title: data.title || 'Topic',
                lead: data.description || '',
                image: `https://picsum.photos/seed/helpdesk-${data.slug || 'topic'}/1600/1000.webp`
            }),

            createElement('section', {
                className: 'section',
                children: [
                    createElement('div', {
                        className: 'container',
                        children: [
                            createElement('div', {
                                className: 'feature-grid helpdesk-topic-article-grid',
                                children: (data.articles || []).map(article =>
                                    createElement('a', {
                                        className: 'feature-card reveal helpdesk-article-link-card',
                                        attrs: { href: `/article?slug=${article.slug || ''}` },
                                        children: [
                                            createElement('div', {
                                                className: 'eyebrow',
                                                text: 'Article'
                                            }),
                                            createElement('h3', {
                                                className: 'card-title',
                                                text: article.title || ''
                                            }),
                                            createElement('p', {
                                                className: 'card-copy',
                                                text: article.excerpt || ''
                                            })
                                        ]
                                    })
                                )
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
                            CtaPanel({
                                title: 'Back to Helpdesk',
                                body: 'Browse all help topics or open a specific article.',
                                actions: [
                                    { label: 'All Topics', href: '/helpdesk', variant: 'secondary' }
                                ]
                            })
                        ]
                    })
                ]
            })
        ]
    });
}