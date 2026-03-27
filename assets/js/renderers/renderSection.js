import { createElement } from '../primitives/element.js';
import { PageHero } from '../components/pageHero.js';
import { SectionHeader } from '../components/sectionHeader.js';
import { FeatureGrid } from '../components/featureGrid.js';
import { ProcessGrid } from '../components/processGrid.js';
import { CtaPanel } from '../components/ctaPanel.js';
import { ArticleBody } from '../components/articleBody.js';
import { Gallery } from '../components/gallery.js';
import { LogoBand } from '../components/logoBand.js';

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
    featureGrid: props =>
        createElement('section', {
            className: 'section section-tight-top',
            children: [
                createElement('div', {
                    className: 'container',
                    children: [FeatureGrid(props.items || [])]
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

export function renderSection(section = {}) {
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

    return renderer(parseProps(section));
}