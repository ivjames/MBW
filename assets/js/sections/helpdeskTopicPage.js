import { createElement } from '../primitives/element.js';
import { PageHero } from '../components/pageHero.js';
import { CtaPanel } from '../components/ctaPanel.js';
import { FeatureGrid } from '../components/featureGrid.js';

function hashText(input = '') {
    let hash = 0;
    const text = String(input);
    for (let i = 0; i < text.length; i += 1) {
        hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
    }
    return Math.abs(hash);
}

function pickFromPool(pool = [], seed = '') {
    if (!Array.isArray(pool) || !pool.length) return 'fa-circle-question';
    const index = hashText(seed) % pool.length;
    return pool[index];
}

function resolveArticleIcon(title = '', lead = '') {
    const key = `${title} ${lead}`.toLowerCase();
    const seed = `${title}|${lead}`;

    if (key.includes('password') || key.includes('login') || key.includes('auth') || key.includes('access')) {
        return pickFromPool(['fa-key', 'fa-fingerprint', 'fa-right-to-bracket'], seed);
    }
    if (key.includes('account') || key.includes('profile') || key.includes('user')) {
        return pickFromPool(['fa-user-gear', 'fa-id-badge', 'fa-user-pen'], seed);
    }
    if (key.includes('billing') || key.includes('payment') || key.includes('invoice') || key.includes('refund')) {
        return pickFromPool(['fa-credit-card', 'fa-file-invoice-dollar', 'fa-receipt', 'fa-wallet'], seed);
    }
    if (key.includes('security') || key.includes('privacy') || key.includes('2fa') || key.includes('permission')) {
        return pickFromPool(['fa-shield-halved', 'fa-lock', 'fa-user-shield'], seed);
    }
    if (key.includes('integrat') || key.includes('api') || key.includes('connect') || key.includes('webhook')) {
        return pickFromPool(['fa-plug-circle-bolt', 'fa-link', 'fa-code-branch'], seed);
    }
    if (key.includes('perform') || key.includes('speed') || key.includes('optimi') || key.includes('cache')) {
        return pickFromPool(['fa-gauge-high', 'fa-bolt', 'fa-stopwatch'], seed);
    }
    if (key.includes('email') || key.includes('notify') || key.includes('message')) {
        return pickFromPool(['fa-envelope-open-text', 'fa-bell', 'fa-paper-plane'], seed);
    }
    if (key.includes('report') || key.includes('analytics') || key.includes('metric')) {
        return pickFromPool(['fa-chart-line', 'fa-chart-column', 'fa-chart-pie'], seed);
    }
    return 'fa-circle-question';
}

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
                                                text: `Topic: ${data.title || 'Helpdesk'}`
                                            }),
                                            createElement('div', {
                                                className: 'card-title-row',
                                                children: [
                                                    createElement('div', {
                                                        className: 'card-icon',
                                                        children: [
                                                            createElement('i', {
                                                                attrs: {
                                                                    class: `fa-solid ${resolveArticleIcon(article.title, article.excerpt)}`,
                                                                    'aria-hidden': 'true'
                                                                }
                                                            })
                                                        ]
                                                    }),
                                                    createElement('h3', {
                                                        className: 'card-title',
                                                        text: article.title || ''
                                                    })
                                                ]
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