import { createElement } from '../primitives/element.js';
import { PageHero } from '../components/pageHero.js';
import { SectionHeader } from '../components/sectionHeader.js';
import { FeatureGrid } from '../components/featureGrid.js';
import { ProcessGrid } from '../components/processGrid.js';
import { CtaPanel } from '../components/ctaPanel.js';
import { ArticleBody } from '../components/articleBody.js';
import { Gallery } from '../components/gallery.js';
import { LogoBand } from '../components/logoBand.js';

const serviceHrefByTitle = {
    marketing: '/marketing',
    development: '/development',
    'web design': '/web-design',
    'seo optimisation': '/seo-optimisation',
    'seo optimization': '/seo-optimisation',
    ecommerce: '/ecommerce',
    branding: '/branding'
};

function withServiceHref(item = {}) {
    if (item.href) return item;

    const title = String(item.title || '').trim().toLowerCase();
    const href = serviceHrefByTitle[title];
    if (!href) return item;

    return {
        ...item,
        href
    };
}

function parseProps(section = {}) {
    try {
        return JSON.parse(section.props_json || '{}');
    } catch {
        return {};
    }
}

const sectionMap = {
    pageHero: props => PageHero(props),
    sectionHeader: props =>
        createElement('section', {
            className: 'section',
            children: [
                createElement('div', {
                    className: 'container',
                    children: [SectionHeader(props)]
                })
            ]
        }),
    featureGrid: (props, context = {}) =>
        createElement('section', {
            className: 'section section-tight-top',
            children: [
                createElement('div', {
                    className: 'container',
                    children: [
                        FeatureGrid(
                            (props.items || []).map(withServiceHref),
                            context.pageSlug === 'services' ? 'services-grid-3up' : ''
                        )
                    ]
                })
            ]
        }),
    processGrid: props =>
        createElement('section', {
            className: 'section',
            children: [
                createElement('div', {
                    className: 'container',
                    children: [ProcessGrid(props.items || [])]
                })
            ]
        }),
    ctaPanel: props =>
        createElement('section', {
            className: 'section',
            children: [
                createElement('div', {
                    className: 'container',
                    children: [CtaPanel(props)]
                })
            ]
        }),
    articleBody: props =>
        createElement('section', {
            className: 'section',
            children: [
                createElement('div', {
                    className: 'container',
                    children: [ArticleBody(props.blocks || [])]
                })
            ]
        }),
    gallery: props =>
        createElement('section', {
            className: 'section',
            children: [
                createElement('div', {
                    className: 'container',
                    children: [Gallery(props)]
                })
            ]
        }),
    logoBand: props =>
        createElement('section', {
            className: 'section section-tight-top',
            children: [
                createElement('div', {
                    className: 'container',
                    children: [LogoBand(props.items || [])]
                })
            ]
        })
};

export function renderSection(section = {}, context = {}) {
    const renderer = sectionMap[section.section_type];
    if (!renderer) {
        return createElement('section', {
            className: 'section',
            children: [
                createElement('div', {
                    className: 'container',
                    children: [
                        createElement('p', {
                            className: 'card-copy',
                            text: `Unknown section type: ${section.section_type}`
                        })
                    ]
                })
            ]
        });
    }

    return renderer(parseProps(section), context);
}