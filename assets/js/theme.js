const STORAGE_KEY = 'dd-theme';

export function getTheme() {
    return localStorage.getItem(STORAGE_KEY) || 'dark';
}

function setStaticHref(id, file) {
    const node = document.getElementById(id);
    if (!node) return;
    node.setAttribute('href', `/assets/css/${file}.css`);
}

export function applyTheme(theme) {
    const safeTheme = theme === 'light' ? 'light' : 'dark';

    setStaticHref('theme-tokens', 'tokens');
    setStaticHref('theme-utilities', 'utilities');
    setStaticHref('theme-layout', 'layout');
    setStaticHref('theme-components', 'components');

    document.documentElement.setAttribute('data-theme', safeTheme);
    localStorage.setItem(STORAGE_KEY, safeTheme);

    const toggle = document.getElementById('themeToggle');
    if (toggle) {
        toggle.setAttribute('aria-pressed', safeTheme === 'light' ? 'true' : 'false');
        toggle.textContent = safeTheme === 'light' ? 'Dark Mode' : 'Light Mode';
    }

    // Keep sections from getting stuck hidden after theme swaps.
    document.querySelectorAll('.reveal').forEach(node => {
        node.classList.add('is-visible');
    });
}

export function initTheme() {
    const theme = getTheme();
    document.documentElement.setAttribute('data-theme', theme);

    const toggle = document.getElementById('themeToggle');
    if (toggle) {
        toggle.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
        toggle.textContent = theme === 'light' ? 'Dark Mode' : 'Light Mode';
    }
}

export function toggleTheme() {
    applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
}
