import { createElement } from '../primitives/element.js';
import { PageHero } from './pageHero.js';
import { Card } from '../primitives/card.js';

function ArticleCard(article = {}) {
    return Card({
        className: 'feature-card reveal helpdesk-article-card',
        children: [
            createElement('div', {
                className: 'eyebrow',
                text: 'Article'
            }),
            createElement('h3', {
                className: 'card-title',
                children: [
                    createElement('a', {
                        text: article.title || '',
                        attrs: {
                            href: `article?slug=${article.slug || ''}`
                        }
                    })
                ]
            }),
            createElement('p', {
                className: 'card-copy',
                text: article.excerpt || ''
            })
        ]
    });
}

export function HelpdeskTopicPage(data = {}) {
    console.log('[HelpdeskTopicPage] data:', data);

    const title = data.title || 'Topic';
    const description = data.description || '';
    const articles = data.articles || [];

    const grid = createElement('div', {
        className: 'feature-grid helpdesk-topic-article-grid'
    });

    if (articles.length) {
        articles.forEach(article => {
            grid.appendChild(ArticleCard(article));
        });
    } else {
        grid.appendChild(
            createElement('p', {
                className: 'card-copy',
                text: 'No articles found for this topic.'
            })
        );
    }

    return createElement('div', {
        children: [
            PageHero({
                eyebrow: 'Helpdesk Topic',
                title,
                lead: description || `Articles filed under ${title}.`,
                image: `https://picsum.photos/seed/helpdesk-${data.slug || 'topic'}/1600/1000`
            }),

            createElement('section', {
                className: 'section',
                children: [
                    createElement('div', {
                        className: 'container',
                        children: [grid]
                    })
                ]
            }),

            createElement('section', {
                className: 'section',
                children: [
                    createElement('div', {
                        className: 'container',
                        children: [
                            Card({
                                className: 'cta-card reveal compact-card',
                                children: [
                                    createElement('div', {
                                        className: 'eyebrow',
                                        text: 'Navigation'
                                    }),
                                    createElement('h3', {
                                        className: 'card-title',
                                        text: 'Back to Helpdesk'
                                    }),
                                    createElement('p', {
                                        className: 'card-copy',
                                        text: 'Browse all help topics or open a specific article.'
                                    }),
                                    createElement('div', {
                                        className: 'hero-cta-row',
                                        children: [
                                            createElement('a', {
                                                className: 'button button-secondary',
                                                text: 'All Topics',
                                                attrs: { href: 'helpdesk' }
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