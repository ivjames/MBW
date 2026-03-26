import { createElement } from '../primitives/element.js';

export function ServiceSubnav(items, currentPage) {
    return createElement('div', {
        className: 'service-subnav-wrap reveal',
        children: [
            createElement('div', {
                className: 'service-subnav',
                children: items.map(item =>
                    createElement('a', {
                        text: item.label,
                        className: item.page === currentPage ? 'service-pill is-active' : 'service-pill',
                        attrs: {
                            href: item.href,
                            'aria-current': item.page === currentPage ? 'page' : null
                        }
                    })
                )
            })
        ]
    });
}