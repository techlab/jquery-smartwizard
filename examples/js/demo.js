'use strict';
// DEMO PAGE JS
// ── Dark mode toggle ──
const STORAGE_KEY = 'sw-demo-theme'; // 'dark' | 'light' | 'auto'
const osPrefersDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches;
var displayMode;

/**
 * Apply a theme ('dark' | 'light') to the document and optionally
 * sync the SmartWizard instance.
 */
function applyTheme(isDark) {
    document.body.dataset.uiTheme = isDark ? 'dark' : 'light';
    if (typeof wizardElement !== 'undefined') {
        wizardElement.smartWizard('setOptions', { displayMode: isDark ? 'dark' : 'light' });
    }
}

// ── Demo navigation
const demoNavs = document.getElementById('demo-nav');
const demoList = {
    'Main': 'index.html',
    'Ajax': 'ajax.html',
    'Validation': 'validation.html',
    'RTL': 'rtl.html',
    'Multiple': 'multiple.html',
};
if (demoNavs) {
    let activePage = window.location.pathname.split('/').pop();
    Object.entries(demoList).forEach(([key, value]) => {
        const btn = document.createElement('a');
        btn.textContent = key;
        btn.href = value;
        btn.classList.add('header-btn');
        if (typeof activePage !== 'undefined' && value === activePage) {
            btn.href = '#';
            btn.classList.add('active')
        };
        demoNavs.appendChild(btn);
    });
}

/**
 * Update the toggle button label to reflect the current stored preference.
 * Labels: auto → detected, dark → forced dark, light → forced light.
 */
function updateToggleLabel(darkToggle, pref) {
    if (!darkToggle) return;
    const labels = { auto: '⚡ Auto', dark: '🌙 Dark', light: '☀️ Light' };
    darkToggle.textContent = labels[pref] || labels.auto;
    darkToggle.classList.toggle('active', pref === 'dark');
}

// ── Initialise on load ──
function initTheme() {
    const saved = localStorage.getItem(STORAGE_KEY) || 'auto'; // default: auto
    const isDark = saved === 'dark' || (saved === 'auto' && osPrefersDark());
    displayMode = isDark ? 'dark' : 'light';
    applyTheme(isDark);
    updateToggleLabel(document.getElementById('toggle-dark'), saved);
};

// ── OS theme-change listener (only active when preference is 'auto') ──
const mq = window.matchMedia('(prefers-color-scheme: dark)');
mq.addEventListener('change', (e) => {
    if ((localStorage.getItem(STORAGE_KEY) || 'auto') === 'auto') {
        applyTheme(e.matches);
    }
});

// ── Button click: cycle auto → dark → light → auto ──
const darkToggle = document.getElementById('toggle-dark');
if (darkToggle) {
    darkToggle.addEventListener('click', () => {
        const current = localStorage.getItem(STORAGE_KEY) || 'auto';
        const cycle = { auto: 'dark', dark: 'light', light: 'auto' };
        const next = cycle[current] || 'auto';

        if (next === 'auto') {
            localStorage.removeItem(STORAGE_KEY); // let OS decide; removeItem keeps fallback clean
        } else {
            localStorage.setItem(STORAGE_KEY, next);
        }

        const isDark = next === 'dark' || (next === 'auto' && osPrefersDark());
        applyTheme(isDark);
        updateToggleLabel(darkToggle, next);
    });
}

// ── More Settings panel toggle ──
const toggleBtn = document.getElementById('moreSettingsToggle');
const panel = document.getElementById('advancedSettings');
if (toggleBtn && panel) {
    toggleBtn.addEventListener('click', () => {
        const isOpen = panel.classList.toggle('active');
        toggleBtn.classList.toggle('active', isOpen);
        toggleBtn.textContent = isOpen ? '⚙️ Less Settings' : '⚙️ More Settings';
    });
}
