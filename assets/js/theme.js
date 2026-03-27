const STORAGE_KEY = 'dd-theme';

export function getTheme() {
    return localStorage.getItem(STORAGE_KEY) || 'dark';
}

function setHref(id, theme, file) {
    const node = document.getElementById(id);
    if (!node) return;
    node.setAttribute('href', `/assets/css/${file}.${theme}.css`);
}

function setStaticHref(id, file) {
    const node = document.getElementById(id);
    if (!node) return;
    node.setAttribute('href', `/assets/css/${file}.css`);
}

export function applyTheme(theme) {
    const safeTheme = theme === 'light' ? 'light' : 'dark';
    
    document.documentElement.style.background = safeTheme === 'light' ? '#f6f8fc' : '#000000';

    setHref('theme-tokens', safeTheme, 'tokens');
    setStaticHref('theme-utilities', 'utilities');
    setStaticHref('theme-layout', 'layout');
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
    const theme = getTheme();
    document.documentElement.setAttribute('data-theme', theme);

    const toggle = document.getElementById('themeToggle');
    if (toggle) {
        toggle.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
        toggle.textContent = theme === 'light' ? 'Dark' : 'Light';
    }
}

export function toggleTheme() {
    applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
}
