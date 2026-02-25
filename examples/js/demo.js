(function () {
    'use strict';
    // DEMO PAGE JS
    // ── Dark mode toggle ──
    const darkToggle = document.getElementById('toggle-dark');
    if (darkToggle) {
        darkToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            const isDark = document.body.classList.contains('dark');
            document.body.dataset.uiTheme = isDark ? 'dark' : 'light';
            darkToggle.textContent = isDark ? '☀️ Light' : '🌙 Dark';
            darkToggle.classList.toggle('active', isDark);
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

})();