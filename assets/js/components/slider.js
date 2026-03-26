import { createElement } from '../primitives/element.js';
import { Button } from '../primitives/button.js';

export function CaseSlider(items) {
  let activeIndex = 0;

  const track = createElement('div', {
    className: 'slider-track',
    children: items.map(item =>
      createElement('article', {
        className: 'slide-panel',
        children: [
          createElement('div', {
            className: 'slide-media',
            children: [
              createElement('img', { attrs: { src: item.image, alt: item.title } })
            ]
          }),
          createElement('div', {
            className: 'slide-copy',
            children: [
              createElement('div', {
                children: [
                  createElement('div', { className: 'eyebrow', text: item.badge }),
                  createElement('h3', { className: 'card-title', text: item.title }),
                  createElement('p', { className: 'card-copy', text: item.body }),
                  createElement('div', {
                    className: 'case-stats',
                    children: item.stats.map(stat =>
                      createElement('div', {
                        className: 'case-stat',
                        html: `<strong>${stat.value}</strong><span>${stat.label}</span>`
                      })
                    )
                  })
                ]
              }),
              createElement('div', {
                className: 'tag-row',
                children: [
                  Button({ label: 'View Project', href: '#contact', variant: 'primary' }),
                  Button({ label: 'Discuss Similar Build', href: '#contact', variant: 'secondary' })
                ]
              })
            ]
          })
        ]
      })
    )
  });

  const dots = items.map((_, index) => createElement('button', {
    className: `slider-dot${index === 0 ? ' is-active' : ''}`,
    attrs: { type: 'button', 'aria-label': `Go to slide ${index + 1}` }
  }));

  function updateSlider(nextIndex) {
    activeIndex = (nextIndex + items.length) % items.length;
    track.style.transform = `translateX(-${activeIndex * 100}%)`;
    dots.forEach((dot, index) => {
      dot.classList.toggle('is-active', index === activeIndex);
    });
  }

  const prevButton = createElement('button', {
    className: 'button button-secondary',
    text: 'Previous',
    attrs: { type: 'button' }
  });

  const nextButton = createElement('button', {
    className: 'button button-primary',
    text: 'Next Case',
    attrs: { type: 'button' }
  });

  prevButton.addEventListener('click', () => updateSlider(activeIndex - 1));
  nextButton.addEventListener('click', () => updateSlider(activeIndex + 1));
  dots.forEach((dot, index) => dot.addEventListener('click', () => updateSlider(index)));

  return createElement('div', {
    className: 'slider-shell',
    children: [
      createElement('div', {
        className: 'slider-stage reveal',
        children: [track]
      }),
      createElement('div', {
        className: 'slider-controls reveal',
        children: [
          createElement('div', { className: 'slider-dots', children: dots }),
          createElement('div', {
            className: 'flex gap-3',
            children: [prevButton, nextButton]
          })
        ]
      })
    ]
  });
}
