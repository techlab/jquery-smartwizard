// Standalone demo JavaScript - No Bootstrap or external dependencies required

(function () {
    'use strict';

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

    // CSS color variables
    const cssColors = [
        "--sw-border-color",
        "--sw-toolbar-btn-color",
        "--sw-toolbar-btn-background-color",
        "--sw-anchor-default-primary-color",
        "--sw-anchor-default-secondary-color",
        "--sw-anchor-active-primary-color",
        "--sw-anchor-active-secondary-color",
        "--sw-anchor-done-primary-color",
        "--sw-anchor-done-secondary-color",
        "--sw-anchor-disabled-primary-color",
        "--sw-anchor-disabled-secondary-color",
        "--sw-anchor-error-primary-color",
        "--sw-anchor-error-secondary-color",
        "--sw-anchor-warning-primary-color",
        "--sw-anchor-warning-secondary-color",
        "--sw-progress-color",
        "--sw-progress-background-color",
        "--sw-loader-color",
        "--sw-loader-background-color",
        "--sw-loader-background-wrapper-color"
    ];

    // Preset color schemes
    const presetColors = {
        "Blue (Default)": {
            "--sw-toolbar-btn-background-color": "#009EF7",
            "--sw-anchor-default-primary-color": "#f8f9fa",
            "--sw-anchor-default-secondary-color": "#b0b0b1",
            "--sw-anchor-active-primary-color": "#009EF7",
            "--sw-anchor-active-secondary-color": "#ffffff",
            "--sw-anchor-done-primary-color": "#90d4fa",
            "--sw-anchor-done-secondary-color": "#fefefe",
            "--sw-progress-color": "#009EF7",
            "--sw-loader-color": "#009EF7",
        },
        "Green": {
            "--sw-border-color": "#eeeeee",
            "--sw-toolbar-btn-color": "#ffffff",
            "--sw-toolbar-btn-background-color": "#008931",
            "--sw-anchor-default-primary-color": "#f8f9fa",
            "--sw-anchor-default-secondary-color": "#b0b0b1",
            "--sw-anchor-active-primary-color": "#78c043",
            "--sw-anchor-active-secondary-color": "#ffffff",
            "--sw-anchor-done-primary-color": "#588835",
            "--sw-anchor-done-secondary-color": "#c2c2c2",
            "--sw-anchor-disabled-primary-color": "#f8f9fa",
            "--sw-anchor-disabled-secondary-color": "#dbe0e5",
            "--sw-anchor-error-primary-color": "#dc3545",
            "--sw-anchor-error-secondary-color": "#ffffff",
            "--sw-anchor-warning-primary-color": "#ffc107",
            "--sw-anchor-warning-secondary-color": "#ffffff",
            "--sw-progress-color": "#78c043",
            "--sw-progress-background-color": "#f8f9fa",
            "--sw-loader-color": "#78c043",
            "--sw-loader-background-color": "#f8f9fa",
            "--sw-loader-background-wrapper-color": "rgba(255, 255, 255, 0.7)",
        },
        "Yellow": {
            "--sw-border-color": "#eeeeee",
            "--sw-toolbar-btn-color": "#ffffff",
            "--sw-toolbar-btn-background-color": "#e4a707",
            "--sw-anchor-default-primary-color": "#f8f9fa",
            "--sw-anchor-default-secondary-color": "#b0b0b1",
            "--sw-anchor-active-primary-color": "#fbbd19",
            "--sw-anchor-active-secondary-color": "#ffffff",
            "--sw-anchor-done-primary-color": "#e4a707",
            "--sw-anchor-done-secondary-color": "#dbe0e5",
            "--sw-anchor-disabled-primary-color": "#f8f9fa",
            "--sw-anchor-disabled-secondary-color": "#dbe0e5",
            "--sw-anchor-error-primary-color": "#dc3545",
            "--sw-anchor-error-secondary-color": "#ffffff",
            "--sw-anchor-warning-primary-color": "#ffc107",
            "--sw-anchor-warning-secondary-color": "#ffffff",
            "--sw-progress-color": "#fbbd19",
            "--sw-progress-background-color": "#f8f9fa",
            "--sw-loader-color": "#fbbd19",
            "--sw-loader-background-color": "#f8f9fa",
            "--sw-loader-background-wrapper-color": "rgba(255, 255, 255, 0.7)",
        },
        "Red": {
            "--sw-border-color": "#eeeeee",
            "--sw-toolbar-btn-color": "#ffffff",
            "--sw-toolbar-btn-background-color": "#f44336",
            "--sw-anchor-default-primary-color": "#f8f9fa",
            "--sw-anchor-default-secondary-color": "#b0b0b1",
            "--sw-anchor-active-primary-color": "#f44336",
            "--sw-anchor-active-secondary-color": "#ffffff",
            "--sw-anchor-done-primary-color": "#f8877f",
            "--sw-anchor-done-secondary-color": "#fefefe",
            "--sw-anchor-disabled-primary-color": "#f8f9fa",
            "--sw-anchor-disabled-secondary-color": "#dbe0e5",
            "--sw-anchor-error-primary-color": "#dc3545",
            "--sw-anchor-error-secondary-color": "#ffffff",
            "--sw-anchor-warning-primary-color": "#ffc107",
            "--sw-anchor-warning-secondary-color": "#ffffff",
            "--sw-progress-color": "#f44336",
            "--sw-progress-background-color": "#f8f9fa",
            "--sw-loader-color": "#f44336",
            "--sw-loader-background-color": "#f8f9fa",
            "--sw-loader-background-wrapper-color": "rgba(255, 255, 255, 0.7)",
        },
        "Lite Blue": {
            "--sw-border-color": "#eeeeee",
            "--sw-toolbar-btn-color": "#ffffff",
            "--sw-toolbar-btn-background-color": "#0cb6d8",
            "--sw-anchor-default-primary-color": "#f8f9fa",
            "--sw-anchor-default-secondary-color": "#b0b0b1",
            "--sw-anchor-active-primary-color": "#00d5ff",
            "--sw-anchor-active-secondary-color": "#ffffff",
            "--sw-anchor-done-primary-color": "#0cb6d8",
            "--sw-anchor-done-secondary-color": "#dbe0e5",
            "--sw-anchor-disabled-primary-color": "#f8f9fa",
            "--sw-anchor-disabled-secondary-color": "#dbe0e5",
            "--sw-anchor-error-primary-color": "#dc3545",
            "--sw-anchor-error-secondary-color": "#ffffff",
            "--sw-anchor-warning-primary-color": "#ffc107",
            "--sw-anchor-warning-secondary-color": "#ffffff",
            "--sw-progress-color": "#0dcaf0",
            "--sw-progress-background-color": "#f8f9fa",
            "--sw-loader-color": "#0dcaf0",
            "--sw-loader-background-color": "#f8f9fa",
            "--sw-loader-background-wrapper-color": "rgba(255, 255, 255, 0.7)",
        },
        "Dark": {
            "--sw-border-color": "#eeeeee",
            "--sw-toolbar-btn-color": "#ffffff",
            "--sw-toolbar-btn-background-color": "#0a2730",
            "--sw-anchor-default-primary-color": "#757575",
            "--sw-anchor-default-secondary-color": "#b0b0b1",
            "--sw-anchor-active-primary-color": "#000000",
            "--sw-anchor-active-secondary-color": "#ffffff",
            "--sw-anchor-done-primary-color": "#333333",
            "--sw-anchor-done-secondary-color": "#aaaaaa",
            "--sw-anchor-disabled-primary-color": "#f8f9fa",
            "--sw-anchor-disabled-secondary-color": "#dbe0e5",
            "--sw-anchor-error-primary-color": "#dc3545",
            "--sw-anchor-error-secondary-color": "#ffffff",
            "--sw-anchor-warning-primary-color": "#ffc107",
            "--sw-anchor-warning-secondary-color": "#ffffff",
            "--sw-progress-color": "#0a2730",
            "--sw-progress-background-color": "#f8f9fa",
            "--sw-loader-color": "#0a2730",
            "--sw-loader-background-color": "#f8f9fa",
            "--sw-loader-background-wrapper-color": "rgba(255, 255, 255, 0.7)",
        }
    };

    // Settings panel toggle functionality
    function initSettingsPanel() {
        const toggleBtn = document.querySelector('.settings-toggle');
        const panel = document.querySelector('.settings-panel');

        function togglePanel() {
            const isActive = panel.classList.toggle('active');
            toggleBtn.classList.toggle('active', isActive);
        }

        if (toggleBtn) toggleBtn.addEventListener('click', togglePanel);
    }

    // Display color pickers
    function displayColors() {
        let html = '';
        const cmpStyle = window.getComputedStyle(document.documentElement);
        cssColors.forEach(col => {
            let color = cmpStyle.getPropertyValue(col).trim();
            // Convert rgba to hex if needed
            if (!color || color === '') color = '#000000';
            html += `<input type="color" class="color-picker" id="${col}" value="${color}" title="${col}">`;
        });
        document.getElementById('color-list').innerHTML = html;

        // Add event listeners to color pickers
        document.querySelectorAll('.color-picker').forEach(picker => {
            picker.addEventListener('change', function () {
                document.documentElement.style.setProperty(this.id, this.value);
            });
        });
    }

    // Load color preset list
    function loadColorList() {
        const select = document.getElementById('theme_colors');
        Object.keys(presetColors).forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            option.text = key;
            option.dataset.colors = window.btoa(JSON.stringify(presetColors[key]));
            select.appendChild(option);
        });
    }

    // Apply color preset
    function applyColors(colorObj) {
        colorObj = JSON.parse(window.atob(colorObj));
        Object.keys(colorObj).forEach(key => {
            document.documentElement.style.setProperty(key, colorObj[key]);
        });
        displayColors();
    }

    // Initialize wizard with dynamic options
    function initWizard() {
        const wizard = $('#smartwizard');

        // Get current options from UI
        function getWizardOptions() {
            return {
                theme: document.getElementById('theme_selector')?.value || 'arrows',
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

        // Color preset selector
        const colorSelector = document.getElementById('theme_colors');
        if (colorSelector) {
            colorSelector.addEventListener('change', function () {
                const selectedOption = this.options[this.selectedIndex];
                if (selectedOption.dataset.colors) {
                    applyColors(selectedOption.dataset.colors);
                }
            });
        }

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
            loadColorList();
            displayColors();
            // Wait for jQuery to be available
            if (typeof $ !== 'undefined') {
                initWizard();
            }
        });
    } else {
        initSettingsPanel();
        loadColorList();
        displayColors();
        if (typeof $ !== 'undefined') {
            initWizard();
        }
    }
})();
