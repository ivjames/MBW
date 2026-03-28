import { createElement } from '../primitives/element.js';
import { renderSection } from '../renderers/renderSection.js';
import { ServiceSubnav } from '../components/serviceSubnav.js';

const servicePageSlugs = new Set([
    'services',
    'marketing',
    'development',
    'web-design',
    'seo-optimisation',
    'ecommerce',
    'branding'
]);

export function DbPage(data = {}, site = {}, currentPage = '') {
    const pageSlug = (data.slug || currentPage || '').toLowerCase();
    const shouldShowServiceSubnav = servicePageSlugs.has(pageSlug);

    const subnav = shouldShowServiceSubnav
        ? createElement('div', {
            className: 'service-subnav-bar',
            children: [
                createElement('div', {
                    className: 'container',
                    children: [
                        ServiceSubnav(site.servicePills || [], pageSlug)
                    ]
                })
            ]
        })
        : null;

    return createElement('div', {
        children: [
            subnav,
            ...(data.sections || []).map(section => renderSection(section, { pageSlug }))
        ].filter(Boolean)
    });
}