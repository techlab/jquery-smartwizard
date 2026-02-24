// Reusable demo shell — drop this on any demo page.
// SmartWizard init belongs in an inline <script> on the page itself.

(function () {
    'use strict';

    // ── Dark mode toggle ──
    const darkToggle = document.getElementById('darkToggle');
    if (darkToggle) {
        darkToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            const isDark = document.body.classList.contains('dark');
            darkToggle.textContent = isDark ? '☀️ Light' : '🌙 Dark';
            darkToggle.classList.toggle('active', isDark);
            $('#smartwizard').smartWizard('setOptions', { displayMode: isDark ? 'dark' : 'light' });
        });
    }

    // ── Theme switcher ──
    const themeList = {
        'basic': 'Basic',
        'arrows': 'Arrow',
        'square': 'Square',
        'dots': 'Dots',
        'chevron': 'Chevron',
        'bold': 'Bold',
        'pill': 'Pill',
        'flat-line': 'Flat-Line',
        'minimal': 'Minimal',
        'round': 'Round',
    };
    const activeTheme = 'basic';
    const themeListControls = document.getElementById('themeControls');
    if (themeListControls) {
        Object.entries(themeList).forEach(([key, value]) => {
            const btn = document.createElement('button');
            btn.textContent = value;
            btn.dataset.theme = key;
            btn.classList.add('ctrl-btn');
            if (key === activeTheme) btn.classList.add('active');
            btn.addEventListener('click', () => {
                themeListControls.querySelectorAll('[data-theme]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                $('#smartwizard').smartWizard('setOptions', { theme: btn.dataset.theme });
            });
            themeListControls.appendChild(btn);
        });
    }

    // ── Color switcher ──
    const colorList = {
        '': 'Default',
        'ocean': 'Ocean',
        'forest': 'Forest',
        'violet': 'Violet',
        'crimson': 'Crimson',
        'amber': 'Amber',
        'indigo': 'Indigo',
        'electric': 'Electric',
        'neon': 'Neon',
        'slate': 'Slate',
        'metallic': 'Metallic',
        'cyber': 'Cyber',
    };
    const colorListControls = document.getElementById('colorControls');
    if (colorListControls) {
        Object.entries(colorList).forEach(([key, value]) => {
            const btn = document.createElement('button');
            btn.textContent = value;
            btn.dataset.color = key;
            btn.classList.add('ctrl-btn');
            if (key === '') btn.classList.add('active');
            btn.addEventListener('click', () => {
                colorListControls.querySelectorAll('[data-color]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                if (key) {
                    $('#smartwizard').attr('data-color', key);
                } else {
                    $('#smartwizard').removeAttr('data-color');
                }
            });
            colorListControls.appendChild(btn);
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

    // ── CSS Animation definitions (Animate.css) ──
    const cssAnimationList = {
        cssSlideH: { prefix: 'animate__animated animate__faster', forward: { show: 'animate__slideInLeft', hide: 'animate__slideOutRight' }, backward: { show: 'animate__slideInRight', hide: 'animate__slideOutLeft' } },
        cssSlideV: { prefix: 'animate__animated animate__faster', forward: { show: 'animate__slideInDown', hide: 'animate__slideOutDown' }, backward: { show: 'animate__slideInUp', hide: 'animate__slideOutUp' } },
        cssFade: { prefix: 'animate__animated animate__faster', forward: { show: 'animate__fadeIn', hide: 'animate__fadeOut' }, backward: { show: 'animate__fadeIn', hide: 'animate__fadeOut' } },
        cssFadeSlideH: { prefix: 'animate__animated animate__faster', forward: { show: 'animate__fadeInLeft', hide: 'animate__fadeOutRight' }, backward: { show: 'animate__fadeInRight', hide: 'animate__fadeOutLeft' } },
        cssFadeSlideV: { prefix: 'animate__animated animate__faster', forward: { show: 'animate__fadeInDown', hide: 'animate__fadeOutDown' }, backward: { show: 'animate__fadeInUp', hide: 'animate__fadeOutUp' } },
        cssFadeSlideCorner1: { prefix: 'animate__animated animate__faster', forward: { show: 'animate__fadeInTopLeft', hide: 'animate__fadeOutBottomRight' }, backward: { show: 'animate__fadeInBottomRight', hide: 'animate__fadeOutTopLeft' } },
        cssFadeSlideCorner2: { prefix: 'animate__animated animate__faster', forward: { show: 'animate__fadeInBottomLeft', hide: 'animate__fadeOutTopRight' }, backward: { show: 'animate__fadeInTopRight', hide: 'animate__fadeOutBottomLeft' } },
        cssBounce: { prefix: 'animate__animated animate__faster', forward: { show: 'animate__bounceIn', hide: 'animate__bounceOut' }, backward: { show: 'animate__bounceIn', hide: 'animate__bounceOut' } },
        cssBounceSlideH: { prefix: 'animate__animated animate__faster', forward: { show: 'animate__bounceInLeft', hide: 'animate__bounceOutRight' }, backward: { show: 'animate__bounceInRight', hide: 'animate__bounceOutLeft' } },
        cssBounceSlideV: { prefix: 'animate__animated animate__faster', forward: { show: 'animate__bounceInDown', hide: 'animate__bounceOutDown' }, backward: { show: 'animate__bounceInUp', hide: 'animate__bounceOutUp' } },
        cssBackSlideH: { prefix: 'animate__animated animate__faster', forward: { show: 'animate__backInLeft', hide: 'animate__backOutRight' }, backward: { show: 'animate__backInRight', hide: 'animate__backOutLeft' } },
        cssBackSlideV: { prefix: 'animate__animated animate__faster', forward: { show: 'animate__backInDown', hide: 'animate__backOutDown' }, backward: { show: 'animate__backInUp', hide: 'animate__backOutUp' } },
        cssFlipH: { prefix: 'animate__animated animate__faster', forward: { show: 'animate__flipInY', hide: 'animate__flipOutY' }, backward: { show: 'animate__flipInY', hide: 'animate__flipOutY' } },
        cssFlipV: { prefix: 'animate__animated animate__faster', forward: { show: 'animate__flipInX', hide: 'animate__flipOutX' }, backward: { show: 'animate__flipInX', hide: 'animate__flipOutX' } },
        cssLightspeed: { prefix: 'animate__animated animate__faster', forward: { show: 'animate__lightSpeedInLeft', hide: 'animate__lightSpeedOutRight' }, backward: { show: 'animate__lightSpeedInRight', hide: 'animate__lightSpeedOutLeft' } },
        cssRotate: { prefix: 'animate__animated animate__faster', forward: { show: 'animate__rotateIn', hide: 'animate__rotateOut' }, backward: { show: 'animate__rotateIn', hide: 'animate__rotateOut' } },
        cssRotateClock: { prefix: 'animate__animated animate__faster', forward: { show: 'animate__rotateInDownLeft', hide: 'animate__rotateOutDownLeft' }, backward: { show: 'animate__rotateInUpLeft', hide: 'animate__rotateOutUpLeft' } },
        cssRotateAntiClock: { prefix: 'animate__animated animate__faster', forward: { show: 'animate__rotateInDownRight', hide: 'animate__rotateOutDownRight' }, backward: { show: 'animate__rotateInUpRight', hide: 'animate__rotateOutUpRight' } },
        cssZoom: { prefix: 'animate__animated animate__faster', forward: { show: 'animate__zoomIn', hide: 'animate__zoomOut' }, backward: { show: 'animate__zoomIn', hide: 'animate__zoomOut' } },
    };

    // ── Animation selector ──
    const animationList = {
        'Built-in': {
            'none': 'None',
            'fade': 'Fade',
            'slideHorizontal': 'Slide Horizontal',
            'slideVertical': 'Slide Vertical',
            'slideSwing': 'Slide Swing',
        },
        'CSS': {
            'cssSlideH': 'Slide Horizontal',
            'cssSlideV': 'Slide Vertical',
            'cssFade': 'Fade',
            'cssFadeSlideH': 'Fade + Slide H',
            'cssFadeSlideV': 'Fade + Slide V',
            'cssFadeSlideCorner1': 'Fade + Corner 1',
            'cssFadeSlideCorner2': 'Fade + Corner 2',
            'cssBounce': 'Bounce',
            'cssBounceSlideH': 'Bounce + Slide H',
            'cssBounceSlideV': 'Bounce + Slide V',
            'cssBackSlideH': 'Back + Slide H',
            'cssBackSlideV': 'Back + Slide V',
            'cssFlipH': 'Flip H',
            'cssFlipV': 'Flip V',
            'cssLightspeed': 'Lightspeed',
            'cssRotate': 'Rotate',
            'cssRotateClock': 'Rotate CW',
            'cssRotateAntiClock': 'Rotate CCW',
            'cssZoom': 'Zoom',
        },
    };

    // Helper: pick an animation — clears old active, fires wizard, returns selected label
    function selectAnimation(key, triggerBtn, dropdownEl) {
        animationControls.querySelectorAll('[data-animation]').forEach(b => b.classList.remove('active'));
        if (triggerBtn) {
            triggerBtn.dataset.animation = key;
            triggerBtn.classList.add('active');
        }
        if (dropdownEl) dropdownEl.classList.remove('open');

        const cssAnim = cssAnimationList[key];
        const options = cssAnim
            ? { transition: { effect: 'css', css: { ...cssAnim } } }
            : { transition: { effect: key } };
        $('#smartwizard').smartWizard('setOptions', options);
    }

    const animationControls = document.getElementById('animationControls');
    if (animationControls) {
        Object.entries(animationList).forEach(([groupKey, groupValue]) => {
            const row = document.createElement('div');
            row.classList.add('demo-controls');

            const label = document.createElement('div');
            label.classList.add('control-label');
            label.textContent = groupKey + ':';
            row.appendChild(label);

            if (groupKey === 'CSS') {
                // ── Custom dropdown for CSS animations ──
                const wrapper = document.createElement('div');
                wrapper.classList.add('ctrl-dropdown');

                const trigger = document.createElement('button');
                trigger.classList.add('ctrl-btn', 'ctrl-dropdown-trigger');
                trigger.textContent = 'Select CSS animation ▾';
                trigger.dataset.animation = '';   // filled on selection
                wrapper.appendChild(trigger);

                const menu = document.createElement('div');
                menu.classList.add('ctrl-dropdown-menu');

                Object.entries(groupValue).forEach(([key, value]) => {
                    const opt = document.createElement('button');
                    opt.classList.add('ctrl-dropdown-item');
                    opt.textContent = value;
                    opt.addEventListener('click', () => {
                        trigger.textContent = value + ' ▾';
                        selectAnimation(key, trigger, wrapper);
                    });
                    menu.appendChild(opt);
                });

                wrapper.appendChild(menu);

                trigger.addEventListener('click', (e) => {
                    e.stopPropagation();
                    wrapper.classList.toggle('open');
                });

                row.appendChild(wrapper);
            } else {
                // ── Flat buttons for Built-in ──
                Object.entries(groupValue).forEach(([key, value]) => {
                    const btn = document.createElement('button');
                    btn.textContent = value;
                    btn.dataset.animation = key;
                    btn.classList.add('ctrl-btn');
                    btn.addEventListener('click', () => selectAnimation(key, btn, null));
                    row.appendChild(btn);
                });
            }

            animationControls.appendChild(row);
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            animationControls.querySelectorAll('.ctrl-dropdown').forEach(d => d.classList.remove('open'));
        });
    }


    // ── Toolbar position — radio group ──
    document.querySelectorAll('[data-toolbar-position]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('[data-toolbar-position]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            $('#smartwizard').smartWizard('setOptions', {
                toolbar: { position: btn.dataset.toolbarPosition }
            });
        });
    });

    // ── Toolbar show/hide button toggles ──
    ['toolbar-showNextButton', 'toolbar-showPreviousButton'].forEach(id => {
        const btn = document.getElementById(id);
        if (!btn) return;
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            $('#smartwizard').smartWizard('setOptions', {
                toolbar: {
                    buttons: {
                        showNext: document.getElementById('toolbar-showNextButton')?.classList.contains('active') ?? true,
                        showPrevious: document.getElementById('toolbar-showPreviousButton')?.classList.contains('active') ?? true,
                    }
                }
            });
        });
    });

    // ── External navigation controls ──
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const resetBtn = document.getElementById('reset-btn');
    if (prevBtn) prevBtn.addEventListener('click', () => $('#smartwizard').smartWizard('prev'));
    if (nextBtn) nextBtn.addEventListener('click', () => $('#smartwizard').smartWizard('next'));
    if (resetBtn) resetBtn.addEventListener('click', () => $('#smartwizard').smartWizard('reset'));

})();
