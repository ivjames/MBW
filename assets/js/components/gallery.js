import { createElement } from '../primitives/element.js';

function GalleryCard(project = {}, openModal) {
    const card = createElement('article', {
        className: 'gallery-card',
        attrs: { tabindex: '0' },
        children: [
            createElement('div', {
                className: 'gallery-card-media',
                children: [
                    createElement('img', {
                        attrs: {
                            src: project.image || '',
                            alt: project.title || 'Project image'
                        }
                    })
                ]
            }),
            createElement('div', {
                className: 'gallery-card-body',
                children: [
                    project.category
                        ? createElement('div', {
                            className: 'gallery-card-category',
                            text: project.category
                        })
                        : null,
                    createElement('h3', {
                        className: 'gallery-card-title',
                        text: project.title || ''
                    }),
                    project.summary
                        ? createElement('p', {
                            className: 'gallery-card-copy',
                            text: project.summary
                        })
                        : null,
                    (project.metrics || []).length
                        ? createElement('div', {
                            className: 'gallery-card-metrics',
                            children: project.metrics.map(metric =>
                                createElement('span', {
                                    className: 'gallery-metric',
                                    text: metric
                                })
                            )
                        })
                        : null,
                    project.slug
                        ? createElement('a', {
                            className: 'gallery-detail-link',
                            text: 'View project',
                            attrs: {
                                href: `/works?slug=${project.slug}`
                            }
                        })
                        : null,
                ].filter(Boolean)
            })
        ]
    });

    card.addEventListener('click', () => openModal(project));
    card.addEventListener('keypress', event => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openModal(project);
        }
    });

    return card;
}

function GalleryModal() {
    const modal = createElement('div', {
        className: 'gallery-modal',
        attrs: {
            id: 'galleryModal',
            'aria-hidden': 'true'
        },
        children: [
            createElement('button', {
                className: 'gallery-modal-close',
                text: 'Close',
                attrs: { type: 'button' }
            }),
            createElement('div', {
                className: 'gallery-modal-inner'
            })
        ]
    });

    return modal;
}

function renderModalContent(modal, project = {}) {
    const inner = modal.querySelector('.gallery-modal-inner');
    inner.innerHTML = '';

    inner.appendChild(
        createElement('div', {
            className: 'gallery-modal-panel',
            children: [
                createElement('img', {
                    attrs: {
                        src: project.image || '',
                        alt: project.title || 'Project image'
                    }
                }),
                createElement('div', {
                    className: 'gallery-modal-copy',
                    children: [
                        project.category
                            ? createElement('div', {
                                className: 'gallery-card-category',
                                text: project.category
                            })
                            : null,
                        createElement('h3', {
                            className: 'gallery-card-title',
                            text: project.title || ''
                        }),
                        project.summary
                            ? createElement('p', {
                                className: 'gallery-card-copy',
                                text: project.summary
                            })
                            : null,
                        (project.metrics || []).length
                            ? createElement('div', {
                                className: 'gallery-card-metrics',
                                children: project.metrics.map(metric =>
                                    createElement('span', {
                                        className: 'gallery-metric',
                                        text: metric
                                    })
                                )
                            })
                            : null,
                        project.slug
                            ? createElement('a', {
                                className: 'gallery-detail-link',
                                text: 'View project',
                                attrs: {
                                    href: `/works?slug=${project.slug}`
                                }
                            })
                            : null
                    ].filter(Boolean)
                })
            ]
        })
    );
}

export function Gallery({ filters = [], projects = [], className = '' } = {}) {
    const root = createElement('div', {
        className: `gallery-root reveal ${className}`.trim()
    });

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

    const modal = GalleryModal();

    function openModal(project) {
        renderModalContent(modal, project);
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
    }

    function closeModal() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
    }

    function visibleProjects(active = 'All') {
        if (active === 'All') return projects;
        return projects.filter(project => project.category === active);
    }

    function renderGrid(active = 'All') {
        grid.innerHTML = '';
        visibleProjects(active).forEach(project => {
            grid.appendChild(GalleryCard(project, openModal));
        });
    }

    renderGrid();

    filterBar.querySelectorAll('.gallery-filter').forEach(button => {
        button.addEventListener('click', () => {
            filterBar.querySelectorAll('.gallery-filter').forEach(node => {
                node.classList.remove('is-active');
            });
            button.classList.add('is-active');
            renderGrid(button.dataset.filter);
        });
    });

    modal.querySelector('.gallery-modal-close')?.addEventListener('click', closeModal);

    modal.addEventListener('click', event => {
        if (event.target === modal) closeModal();
    });

    root.append(filterBar, grid, modal);
    return root;
}