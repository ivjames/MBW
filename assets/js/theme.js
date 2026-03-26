const STORAGE_KEY = 'dd-theme';
const DEFAULT_THEME = 'dark';

export function getTheme() {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME;
}

function setHref(id, theme, file) {
    const node = document.getElementById(id);
    if (!node) return;
    node.setAttribute('href', `/assets/css/${file}.${theme}.css`);
}

export function applyTheme(theme) {
    const safeTheme = theme === 'light' ? 'light' : 'dark';

    setHref('theme-tokens', safeTheme, 'tokens');
    setHref('theme-utilities', safeTheme, 'utilities');
    setHref('theme-layout', safeTheme, 'layout');
    setHref('theme-components', safeTheme, 'components');

    document.documentElement.setAttribute('data-theme', safeTheme);
    localStorage.setItem(STORAGE_KEY, safeTheme);

    const toggle = document.getElementById('themeToggle');
    if (toggle) {
        toggle.setAttribute('aria-pressed', safeTheme === 'light' ? 'true' : 'false');
        toggle.textContent = safeTheme === 'light' ? 'Dark' : 'Light';
    }
}

export function initTheme() {
    applyTheme(getTheme());
}

export function toggleTheme() {
    applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
}