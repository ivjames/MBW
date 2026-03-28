import { createElement } from '../primitives/element.js';
import { Button } from '../primitives/button.js';
import { MetaRow } from './metaRow.js';

export function PageHero({
    eyebrow = '',
    title = '',
    lead = '',
    image = '',
    actions = [],
    meta = [],
    className = ''
} = {}) {
    return createElement('section', {
        className: `section page-hero ${className}`.trim(),
        children: [
            createElement('div', {
                className: 'container page-hero-shell',
                children: [
                    createElement('div', {
                        className: 'page-hero-copy reveal',
                        children: [
                            eyebrow
                                ? createElement('div', { className: 'eyebrow', text: eyebrow })
                                : null,
                            title
                                ? createElement('h1', { className: 'page-hero-title', text: title })
                                : null,
                            lead
                                ? createElement('p', { className: 'page-hero-lead', text: lead })
                                : null,
                            meta.length ? MetaRow(meta) : null,
                            actions.length
                                ? createElement('div', {
                                    className: 'hero-cta-row',
                                    children: actions.map(action => Button(action))
                                })
                                : null
                        ].filter(Boolean)
                    }),
                    image
                        ? createElement('div', {
                            className: 'page-hero-media reveal',
                            children: [
                                createElement('img', {
                                    attrs: { src: image, alt: '' }
                                })
                            ]
                        })
                        : null
                ].filter(Boolean)
            })
        ]
    });
}