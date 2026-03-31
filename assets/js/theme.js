const STORAGE_KEY = 'dd-theme';
const DESIGN_MODE_KEY = 'dd-design-mode';

export function getTheme() {
    return localStorage.getItem(STORAGE_KEY) || 'dark';
}

export function getDesignMode() {
    return localStorage.getItem(DESIGN_MODE_KEY) || 'default';
}

export function setDesignMode(mode) {
    const safeMode = mode === 'spike' ? 'spike' : 'default';
    document.documentElement.setAttribute('data-theme', safeMode);
    localStorage.setItem(DESIGN_MODE_KEY, safeMode);

    const designToggle = document.getElementById('designModeToggle');
    if (designToggle) {
        designToggle.setAttribute('aria-pressed', safeMode === 'spike' ? 'true' : 'false');
        designToggle.textContent = safeMode === 'spike' ? '✨ Classic Mode' : '🎨 Spike Design';
    }

    // Keep sections visible after design swap
    document.querySelectorAll('.reveal').forEach(node => {
        node.classList.add('is-visible');
    });
}

export function toggleDesignMode() {
    const current = getDesignMode();
    setDesignMode(current === 'spike' ? 'default' : 'spike');
}

function setStaticHref(id, file) {
    const node = document.getElementById(id);
    if (!node) return;
    node.setAttribute('href', `/assets/css/${file}.css`);
}

export function applyTheme(theme) {
    const safeTheme = theme === 'light' ? 'light' : 'dark';
    const designMode = getDesignMode();

    setStaticHref('theme-tokens', 'tokens');
    setStaticHref('theme-utilities', 'utilities');
    setStaticHref('theme-layout', 'layout');
    setStaticHref('theme-components', 'components');

    // Apply design mode if spike, otherwise apply color theme
    if (designMode === 'spike') {
        document.documentElement.setAttribute('data-theme', 'spike');
    } else {
        document.documentElement.setAttribute('data-theme', safeTheme);
    }

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
    const designMode = getDesignMode();

    // Spike design overrides color theme
    if (designMode === 'spike') {
        document.documentElement.setAttribute('data-theme', 'spike');
    } else {
        document.documentElement.setAttribute('data-theme', theme);
    }

    const toggle = document.getElementById('themeToggle');
    if (toggle) {
        toggle.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
        toggle.textContent = theme === 'light' ? 'Dark Mode' : 'Light Mode';
    }

    const designToggle = document.getElementById('designModeToggle');
    if (designToggle) {
        designToggle.setAttribute('aria-pressed', designMode === 'spike' ? 'true' : 'false');
        designToggle.textContent = designMode === 'spike' ? '✨ Classic Mode' : '🎨 Spike Design';
    }
}

export function toggleTheme() {
    applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
}
