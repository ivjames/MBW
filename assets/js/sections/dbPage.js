import { createElement } from '../primitives/element.js';
import { renderSection } from '../renderers/renderSection.js';

export function DbPage(data = {}) {
    return createElement('div', {
        children: (data.sections || []).map(section => renderSection(section))
    });
}