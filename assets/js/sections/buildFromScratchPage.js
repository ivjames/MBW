import { createElement } from '../primitives/element.js';
import { PageHero } from '../components/pageHero.js';
import { SectionHeader } from '../components/sectionHeader.js';
import { FeatureGrid } from '../components/featureGrid.js';
import { ProcessGrid } from '../components/processGrid.js';
import { CtaPanel } from '../components/ctaPanel.js';

export function BuildFromScratchPage(data = {}) {
    const hero = data.hero || {};
    const reasons = data.reasons || [];
    const timeline = data.timeline || [];
    const cta = data.cta || {};

    return createElement('div', {
        children: [
            PageHero(hero),

            reasons.length
                ? createElement('section', {
                    className: 'section section-tight-top',
                    children: [
                        createElement('div', {
                            className: 'container',
                            children: [
                                SectionHeader({
                                    eyebrow: data.reasonsEyebrow || 'Why custom beats CMS lock-in',
                                    title: data.reasonsTitle || 'Built for your goals, not plugin constraints.',
                                    lead: data.reasonsLead || 'A custom stack gives predictable performance, cleaner ownership, and less long-term technical debt.'
                                }),
                                FeatureGrid(reasons)
                            ]
                        })
                    ]
                })
                : null,

            timeline.length
                ? createElement('section', {
                    className: 'section section-tight-top',
                    children: [
                        createElement('div', {
                            className: 'container',
                            children: [
                                SectionHeader({
                                    eyebrow: data.timelineEyebrow || 'Build timeline',
                                    title: data.timelineTitle || 'How this site was delivered from zero.',
                                    lead: data.timelineLead || 'A practical, phased process from discovery to launch and iteration.'
                                }),
                                ProcessGrid(timeline, 'process-grid-3up')
                            ]
                        })
                    ]
                })
                : null,

            createElement('section', {
                className: 'section section-tight-top',
                children: [
                    createElement('div', {
                        className: 'container',
                        children: [
                            CtaPanel({
                                eyebrow: cta.eyebrow || 'Next step',
                                title: cta.title || 'Want this same approach for your site?',
                                body: cta.body || 'We can scope your pages, architecture, and rollout plan in one working session.',
                                actions: cta.actions || [
                                    { label: 'Book a Strategy Call', href: '/contact', variant: 'primary' },
                                    { label: 'Back to Home', href: '/', variant: 'secondary' }
                                ]
                            })
                        ]
                    })
                ]
            })
        ].filter(Boolean)
    });
}
