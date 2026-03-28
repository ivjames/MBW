export function createElement(tag, props = {}) {
  const el = document.createElement(tag);

  const {
    children = [],
    className,
    text,
    html,
    attrs,
    ...rest
  } = props;

  if (className) {
    el.className = className;
  }

  if (text != null) {
    el.textContent = text;
  }

  if (html != null) {
    el.innerHTML = html;
  }

  if (attrs && typeof attrs === 'object') {
    Object.entries(attrs).forEach(([key, value]) => {
      if (value != null) el.setAttribute(key, value);
    });
  }

  Object.entries(rest).forEach(([key, value]) => {
    if (value == null) return;

    if (key.startsWith('on') && typeof value === 'function') {
      el.addEventListener(key.slice(2).toLowerCase(), value);
      return;
    }

    if (key in el) {
      el[key] = value;
    } else {
      el.setAttribute(key, value);
    }
  });

  const normalizedChildren = Array.isArray(children) ? children : [children];
  normalizedChildren.filter(Boolean).forEach(child => {
    if (child instanceof Node) {
      el.appendChild(child);
    } else {
      el.appendChild(document.createTextNode(String(child)));
    }
  });

  return el;
}

export function fragment(children = []) {
  const frag = document.createDocumentFragment();
  children.filter(Boolean).forEach(child => frag.appendChild(child));
  return frag;
}

