import { createElement } from '../primitives/element.js';

function renderBlock(block = {}) {
    switch (block.type) {
        case 'heading':
            return createElement('h2', {
                className: 'article-heading',
                text: block.text || ''
            });

        case 'subheading':
            return createElement('h3', {
                className: 'article-subheading',
                text: block.text || ''
            });

        case 'image':
            return createElement('figure', {
                className: 'article-figure',
                children: [
                    createElement('img', {
                        attrs: {
                            src: block.src || '',
                            alt: block.alt || ''
                        }
                    }),
                    block.caption
                        ? createElement('figcaption', {
                            className: 'article-caption',
                            text: block.caption
                        })
                        : null
                ].filter(Boolean)
            });

        case 'quote':
            return createElement('blockquote', {
                className: 'article-quote',
                text: block.text || ''
            });

        case 'list':
            return createElement('ul', {
                className: 'article-list',
                children: (block.items || []).map(item =>
                    createElement('li', { text: item })
                )
            });

        case 'paragraph':
        default:
            return createElement('p', {
                className: 'article-paragraph',
                text: block.text || ''
            });
    }
}

export function ArticleBody(blocks = [], className = '') {
    return createElement('article', {
        className: `article-body ${className}`.trim(),
        children: blocks.map(renderBlock)
    });
}