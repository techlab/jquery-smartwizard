// Standalone demo JavaScript - No Bootstrap or external dependencies required

(function () {
    'use strict';

    // ── Dark mode toggle ──
    const darkToggle = document.getElementById('darkToggle');
    darkToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');
        darkToggle.textContent = isDark ? '☀️ Light' : '🌙 Dark';
        darkToggle.classList.toggle('active', isDark);

        $('#smartwizard').smartWizard('setOptions', { displayMode: isDark ? 'dark' : 'light' });
    });

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

    Object.entries(themeList).forEach(([key, value]) => {
        const btn = document.createElement('button');
        btn.textContent = value;
        btn.dataset.theme = key;
        btn.classList.add('ctrl-btn');
        if (key === activeTheme) btn.classList.add('active');
        btn.addEventListener('click', () => {
            themeListControls.querySelectorAll('[data-theme]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // Add new theme
            $('#smartwizard').smartWizard('setOptions', {
                theme: btn.dataset.theme,
            });
        });

        themeListControls.appendChild(btn);
    });

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
    const activeColor = '';
    const colorListControls = document.getElementById('colorControls');

    Object.entries(colorList).forEach(([key, value]) => {
        const btn = document.createElement('button');
        btn.textContent = value;
        btn.dataset.color = key;
        btn.classList.add('ctrl-btn');
        if (key === activeColor) btn.classList.add('active');
        btn.addEventListener('click', () => {
            colorListControls.querySelectorAll('[data-color]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const color = btn.dataset.color;
            if (color) {
                $('#smartwizard').attr('data-color', color);
            } else {
                $('#smartwizard').removeAttr('data-color');
            }
        });

        colorListControls.appendChild(btn);
    });


    // CSS Animation definitions (from Animate.css)
    const cssAnimationList = {
        cssSlideH: {
            prefixCss: 'animate__animated animate__faster',
            fwdShowCss: 'animate__slideInLeft',
            fwdHideCss: 'animate__slideOutRight',
            bckShowCss: 'animate__slideInRight',
            bckHideCss: 'animate__slideOutLeft',
        },
        cssSlideV: {
            prefixCss: 'animate__animated animate__faster',
            fwdShowCss: 'animate__slideInDown',
            fwdHideCss: 'animate__slideOutDown',
            bckShowCss: 'animate__slideInUp',
            bckHideCss: 'animate__slideOutUp',
        },
        cssFade: {
            prefixCss: 'animate__animated animate__faster',
            fwdShowCss: 'animate__fadeIn',
            fwdHideCss: 'animate__fadeOut',
            bckShowCss: 'animate__fadeIn',
            bckHideCss: 'animate__fadeOut',
        },
        cssFadeSlideH: {
            prefixCss: 'animate__animated animate__faster',
            fwdShowCss: 'animate__fadeInLeft',
            fwdHideCss: 'animate__fadeOutRight',
            bckShowCss: 'animate__fadeInRight',
            bckHideCss: 'animate__fadeOutLeft',
        },
        cssFadeSlideV: {
            prefixCss: 'animate__animated animate__faster',
            fwdShowCss: 'animate__fadeInDown',
            fwdHideCss: 'animate__fadeOutDown',
            bckShowCss: 'animate__fadeInUp',
            bckHideCss: 'animate__fadeOutUp',
        },
        cssFadeSlideCorner1: {
            prefixCss: 'animate__animated animate__faster',
            fwdShowCss: 'animate__fadeInTopLeft',
            fwdHideCss: 'animate__fadeOutBottomRight',
            bckShowCss: 'animate__fadeInBottomRight',
            bckHideCss: 'animate__fadeOutTopLeft',
        },
        cssFadeSlideCorner2: {
            prefixCss: 'animate__animated animate__faster',
            fwdShowCss: 'animate__fadeInBottomLeft',
            fwdHideCss: 'animate__fadeOutTopRight',
            bckShowCss: 'animate__fadeInTopRight',
            bckHideCss: 'animate__fadeOutBottomLeft',
        },
        cssBounce: {
            prefixCss: 'animate__animated animate__faster',
            fwdShowCss: 'animate__bounceIn',
            fwdHideCss: 'animate__bounceOut',
            bckShowCss: 'animate__bounceIn',
            bckHideCss: 'animate__bounceOut',
        },
        cssBounceSlideH: {
            prefixCss: 'animate__animated animate__faster',
            fwdShowCss: 'animate__bounceInLeft',
            fwdHideCss: 'animate__bounceOutRight',
            bckShowCss: 'animate__bounceInRight',
            bckHideCss: 'animate__bounceOutLeft',
        },
        cssBounceSlideV: {
            prefixCss: 'animate__animated animate__faster',
            fwdShowCss: 'animate__bounceInDown',
            fwdHideCss: 'animate__bounceOutDown',
            bckShowCss: 'animate__bounceInUp',
            bckHideCss: 'animate__bounceOutUp',
        },
        cssBackSlideH: {
            prefixCss: 'animate__animated animate__faster',
            fwdShowCss: 'animate__backInLeft',
            fwdHideCss: 'animate__backOutRight',
            bckShowCss: 'animate__backInRight',
            bckHideCss: 'animate__backOutLeft',
        },
        cssBackSlideV: {
            prefixCss: 'animate__animated animate__faster',
            fwdShowCss: 'animate__backInDown',
            fwdHideCss: 'animate__backOutDown',
            bckShowCss: 'animate__backInUp',
            bckHideCss: 'animate__backOutUp',
        },
        cssFlipH: {
            prefixCss: 'animate__animated animate__faster',
            fwdShowCss: 'animate__flipInY',
            fwdHideCss: 'animate__flipOutY',
            bckShowCss: 'animate__flipInY',
            bckHideCss: 'animate__flipOutY',
        },
        cssFlipV: {
            prefixCss: 'animate__animated animate__faster',
            fwdShowCss: 'animate__flipInX',
            fwdHideCss: 'animate__flipOutX',
            bckShowCss: 'animate__flipInX',
            bckHideCss: 'animate__flipOutX',
        },
        cssLightspeed: {
            prefixCss: 'animate__animated animate__faster',
            fwdShowCss: 'animate__lightSpeedInLeft',
            fwdHideCss: 'animate__lightSpeedOutRight',
            bckShowCss: 'animate__lightSpeedInRight',
            bckHideCss: 'animate__lightSpeedOutLeft',
        },
        cssRotate: {
            prefixCss: 'animate__animated animate__faster',
            fwdShowCss: 'animate__rotateIn',
            fwdHideCss: 'animate__rotateOut',
            bckShowCss: 'animate__rotateIn',
            bckHideCss: 'animate__rotateOut',
        },
        cssRotateClock: {
            prefixCss: 'animate__animated animate__faster',
            fwdShowCss: 'animate__rotateInDownLeft',
            fwdHideCss: 'animate__rotateOutDownLeft',
            bckShowCss: 'animate__rotateInUpLeft',
            bckHideCss: 'animate__rotateOutUpLeft',
        },
        cssRotateAntiClock: {
            prefixCss: 'animate__animated animate__faster',
            fwdShowCss: 'animate__rotateInDownRight',
            fwdHideCss: 'animate__rotateOutDownRight',
            bckShowCss: 'animate__rotateInUpRight',
            bckHideCss: 'animate__rotateOutUpRight',
        },
        cssZoom: {
            prefixCss: 'animate__animated animate__faster',
            fwdShowCss: 'animate__zoomIn',
            fwdHideCss: 'animate__zoomOut',
            bckShowCss: 'animate__zoomIn',
            bckHideCss: 'animate__zoomOut',
        }
    };

    // Settings panel toggle functionality
    function initSettingsPanel() {
        const toggleBtn = document.querySelector('#moreSettingsToggle');
        const panel = document.querySelector('#advancedSettings');

        function togglePanel() {
            const isActive = panel.classList.toggle('active');
            toggleBtn.classList.toggle('active', isActive);
            toggleBtn.textContent = isActive ? '⚙️ Less Settings' : '⚙️ More Settings';
        }

        if (toggleBtn) toggleBtn.addEventListener('click', togglePanel);
    }

    // Initialize wizard with dynamic options
    function initWizard() {
        const wizard = $('#smartwizard');

        // Get current options from UI
        function getWizardOptions() {
            return {
                theme: document.getElementById('theme_selector')?.value || activeTheme || 'arrows',
                displayMode: document.body.classList.contains('dark') ? 'dark' : 'light',
                transition: {
                    effect: document.getElementById('animation')?.value || 'slideHorizontal',
                    speed: 400,
                    easing: ''
                },
                navigation: {
                    enabled: document.getElementById('anchor_navigation')?.checked !== false,
                    justified: document.getElementById('is_justified')?.checked !== false,
                    alwaysClickable: document.getElementById('enableNavigationAlways')?.checked || false,
                    completed: {
                        enabled: document.getElementById('enableDoneState')?.checked !== false,
                        clearOnBack: document.getElementById('unDoneOnBackNavigation')?.checked || false,
                        clickable: document.getElementById('enableDoneStateNavigation')?.checked !== false
                    }
                },
                toolbar: {
                    position: document.querySelector('input[name="toolbar-position"]:checked')?.value || 'both',
                    buttons: {
                        showNext: document.getElementById('toolbar-showNextButton')?.checked !== false,
                        showPrevious: document.getElementById('toolbar-showPreviousButton')?.checked !== false
                    }
                },
                keyboardNavigation: {
                    enabled: document.getElementById('key_navigation')?.checked !== false
                },
                behavior: {
                    autoHeight: document.getElementById('autoAdjustHeight')?.checked !== false,
                    supportBrowserHistory: document.getElementById('back_button_support')?.checked !== false
                }
            };
        }

        // Initialize wizard
        wizard.smartWizard(getWizardOptions());

        // Update step info
        function updateStepInfo() {
            const stepInfo = wizard.smartWizard('getStepInfo');
            const currentStepEl = document.getElementById('sw-current-step');
            const totalStepEl = document.getElementById('sw-total-step');

            if (currentStepEl) currentStepEl.textContent = stepInfo.currentStep + 1;
            if (totalStepEl) totalStepEl.textContent = stepInfo.totalSteps;
        }

        // Event listeners
        wizard.on('showStep.smartWizard', function () {
            updateStepInfo();
        });

        wizard.on('initialized.smartWizard', function () {
            console.log('Wizard initialized');
            updateStepInfo();
        });

        wizard.on('loaded.smartWizard', function () {
            console.log('Wizard loaded');
        });

        // Settings change handlers
        function reinitializeWizard() {
            wizard.smartWizard('setOptions', getWizardOptions());
        }

        // Theme selector
        const themeSelector = document.getElementById('theme_selector');
        if (themeSelector) {
            themeSelector.addEventListener('change', reinitializeWizard);
        }

        // Animation selector
        const animationSelector = document.getElementById('animation');
        if (animationSelector) {
            animationSelector.addEventListener('change', function () {
                const anim = this.value;
                const cssAnim = cssAnimationList[anim];
                let options = {};

                if (cssAnim !== undefined) {
                    options = {
                        transition: {
                            animation: 'css',
                            ...cssAnim
                        },
                    };
                } else {
                    options = {
                        transition: {
                            animation: anim
                        },
                    };
                }

                wizard.smartWizard('setOptions', options);
            });
        }

        // All checkboxes
        document.querySelectorAll('.option-setting-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', reinitializeWizard);
        });

        // Radio buttons
        document.querySelectorAll('input[name="toolbar-position"]').forEach(radio => {
            radio.addEventListener('change', reinitializeWizard);
        });

        // External controls
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const resetBtn = document.getElementById('reset-btn');

        if (prevBtn) prevBtn.addEventListener('click', () => wizard.smartWizard('prev'));
        if (nextBtn) nextBtn.addEventListener('click', () => wizard.smartWizard('next'));
        if (resetBtn) resetBtn.addEventListener('click', () => wizard.smartWizard('reset'));

        // Go to step
        const btnGoTo = document.getElementById('btn-go-to');
        const btnGoToForced = document.getElementById('btn-go-to-forced');
        const goToStepSelect = document.getElementById('got_to_step');

        if (btnGoTo && goToStepSelect) {
            btnGoTo.addEventListener('click', () => {
                const stepIndex = parseInt(goToStepSelect.value) - 1;
                if (!isNaN(stepIndex)) {
                    wizard.smartWizard('goToStep', stepIndex, false);
                }
            });
        }

        if (btnGoToForced && goToStepSelect) {
            btnGoToForced.addEventListener('click', () => {
                const stepIndex = parseInt(goToStepSelect.value) - 1;
                if (!isNaN(stepIndex)) {
                    wizard.smartWizard('goToStep', stepIndex, true);
                }
            });
        }

        // Set/Unset state
        const btnStateSet = document.getElementById('btn-state-set');
        const btnStateUnset = document.getElementById('btn-state-unset');
        const stateStepSelect = document.getElementById('state_step_selection');
        const stateSelect = document.getElementById('state_selection');

        if (btnStateSet && stateStepSelect && stateSelect) {
            btnStateSet.addEventListener('click', () => {
                const stepIndex = parseInt(stateStepSelect.value) - 1;
                const state = stateSelect.value;
                if (!isNaN(stepIndex) && state) {
                    wizard.smartWizard('setState', [stepIndex], state);
                }
            });
        }

        if (btnStateUnset && stateStepSelect && stateSelect) {
            btnStateUnset.addEventListener('click', () => {
                const stepIndex = parseInt(stateStepSelect.value) - 1;
                const state = stateSelect.value;
                if (!isNaN(stepIndex) && state) {
                    wizard.smartWizard('unsetState', [stepIndex], state);
                }
            });
        }
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            initSettingsPanel();
            // Wait for jQuery to be available
            if (typeof $ !== 'undefined') {
                initWizard();
            }
        });
    } else {
        initSettingsPanel();
        if (typeof $ !== 'undefined') {
            initWizard();
        }
    }
})();
