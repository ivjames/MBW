import { createElement } from '../primitives/element.js';

export function Gallery({ filters = [], projects = [] }) {
    const root = createElement('div', { className: 'gallery-root reveal' });

    const filterBar = createElement('div', {
        className: 'gallery-filters',
        children: filters.map((label, index) =>
            createElement('button', {
                className: index === 0 ? 'gallery-filter is-active' : 'gallery-filter',
                text: label,
                attrs: {
                    type: 'button',
                    'data-filter': label
                }
            })
        )
    });

    const grid = createElement('div', {
        className: 'gallery-grid'
    });

    const modal = createElement('div', {
        className: 'gallery-modal',
        attrs: { id: 'galleryModal', 'aria-hidden': 'true' },
        children: [
            createElement('button', {
                className: 'gallery-modal-close',
                text: 'Close',
                attrs: { type: 'button' }
            }),
            createElement('div', { className: 'gallery-modal-inner' })
        ]
    });

    function renderGrid(active = 'All') {
        grid.innerHTML = '';

        const visible = active === 'All'
            ? projects
            : projects.filter(project => project.category === active);

        visible.forEach(project => {
            const card = createElement('article', {
                className: 'gallery-card',
                attrs: { tabindex: '0' },
                children: [
                    createElement('div', {
                        className: 'gallery-card-media',
                        children: [
                            createElement('img', {
                                attrs: { src: project.image, alt: project.title }
                            })
                        ]
                    }),
                    createElement('div', {
                        className: 'gallery-card-body',
                        children: [
                            createElement('div', { className: 'gallery-card-category', text: project.category }),
                            createElement('h3', { className: 'gallery-card-title', text: project.title }),
                            createElement('p', { className: 'gallery-card-copy', text: project.summary }),
                            createElement('div', {
                                className: 'gallery-card-metrics',
                                children: (project.metrics || []).map(metric =>
                                    createElement('span', { className: 'gallery-metric', text: metric })
                                )
                            })
                        ]
                    })
                ]
            });

            const openModal = () => {
                const inner = modal.querySelector('.gallery-modal-inner');
                inner.innerHTML = '';
                inner.appendChild(
                    createElement('div', {
                        className: 'gallery-modal-panel',
                        children: [
                            createElement('img', {
                                attrs: { src: project.image, alt: project.title }
                            }),
                            createElement('div', {
                                className: 'gallery-modal-copy',
                                children: [
                                    createElement('div', { className: 'gallery-card-category', text: project.category }),
                                    createElement('h3', { className: 'gallery-card-title', text: project.title }),
                                    createElement('p', { className: 'gallery-card-copy', text: project.summary }),
                                    createElement('div', {
                                        className: 'gallery-card-metrics',
                                        children: (project.metrics || []).map(metric =>
                                            createElement('span', { className: 'gallery-metric', text: metric })
                                        )
                                    })
                                ]
                            })
                        ]
                    })
                );

                modal.classList.add('is-open');
                modal.setAttribute('aria-hidden', 'false');
            };

            card.addEventListener('click', openModal);
            card.addEventListener('keypress', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openModal();
                }
            });

            grid.appendChild(card);
        });
    }

    renderGrid();

    filterBar.querySelectorAll('.gallery-filter').forEach(button => {
        button.addEventListener('click', () => {
            filterBar.querySelectorAll('.gallery-filter').forEach(node => node.classList.remove('is-active'));
            button.classList.add('is-active');
            renderGrid(button.dataset.filter);
        });
    });

    modal.querySelector('.gallery-modal-close').addEventListener('click', () => {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
    });

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.remove('is-open');
            modal.setAttribute('aria-hidden', 'true');
        }
    });

    root.append(filterBar, grid, modal);
    return root;
}