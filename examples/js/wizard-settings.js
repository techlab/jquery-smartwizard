function initWizardControls(wizardElement) {

    // External Button Events
    $("#btn-reset").on("click", function () {
        // Reset wizard
        wizardElement.smartWizard("reset");
        return true;
    });

    $("#btn-prev").on("click", function () {
        // Navigate previous
        wizardElement.smartWizard("prev");
        return true;
    });

    $("#btn-next").on("click", function () {
        // Navigate next
        wizardElement.smartWizard("next");
        return true;
    });

    // ── Theme switcher ──
    const themeList = {
        '': 'Default',
        'arrows': 'Arrows',
        'glow': 'Glow',
        'basic': 'Basic',
        'pills': 'Pills',
    };
    const themeListControls = document.getElementById('theme-select');
    if (themeListControls) {
        Object.entries(themeList).forEach(([key, value]) => {
            const option = document.createElement('option');
            option.textContent = value;
            option.value = key;
            if (typeof activeTheme !== 'undefined' && key === activeTheme) option.selected = true;
            themeListControls.appendChild(option);
        });

        themeListControls.addEventListener('change', () => {
            wizardElement.smartWizard('setOptions', { theme: themeListControls.value });
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

    // ── Transition selector ──
    const transitionList = {
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

    const transitionControls = document.getElementById('transition-select');
    if (transitionControls) {
        Object.entries(transitionList).forEach(([groupKey, groupValue]) => {
            const optgroup = document.createElement('optgroup');
            optgroup.label = groupKey;

            Object.entries(groupValue).forEach(([key, value]) => {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = value;
                if (typeof activeTransition !== 'undefined' && key === activeTransition) option.selected = true;
                optgroup.appendChild(option);
            });

            transitionControls.appendChild(optgroup);
        });

        transitionControls.addEventListener('change', () => {
            const cssAnim = cssAnimationList[transitionControls.value];
            const options = cssAnim
                ? { transition: { effect: 'css', css: { ...cssAnim } } }
                : { transition: { effect: transitionControls.value } };
            wizardElement.smartWizard('setOptions', options);
        });
    }

    // ── Color switcher ──
    const colorList = {
        '': 'Default',
        'ocean': 'Ocean',
        'teal': 'Teal',
        'forest': 'Forest',
        'violet': 'Violet',
        'crimson': 'Crimson',
        'amber': 'Amber',
        'indigo': 'Indigo',
        'slate': 'Slate ♿',
    };

    const colorListControls = document.getElementById('color-list');
    if (colorListControls) {
        Object.entries(colorList).forEach(([key, value]) => {
            const btn = document.createElement('button');
            btn.textContent = value;
            btn.dataset.color = key;
            btn.classList.add('btn');
            if (typeof activeColor !== 'undefined' && key === activeColor) btn.classList.add('active');

            btn.addEventListener('click', () => {
                colorListControls.querySelectorAll('[data-color]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                if (key) {
                    wizardElement.attr('data-color', key);
                } else {
                    wizardElement.removeAttr('data-color');
                }
            });
            colorListControls.appendChild(btn);
        });
    }

    // ── Toolbar swicher
    const toolbarSelect = document.getElementById('toolbar-select');
    if (toolbarSelect) {
        toolbarSelect.addEventListener('change', () => {
            if (toolbarSelect.value) {
                wizardElement.smartWizard('setOptions', { toolbar: { position: toolbarSelect.value } });
            }
        });
    }

    // ── Step infor
    const swCur = document.getElementById('sw-cur');
    const swTotal = document.getElementById('sw-total');
    if (swCur && swTotal) {
        // Step show event
        wizardElement.on("shown.sw", function (e, args) {
            swCur.textContent = args.stepIndex + 1;
            swTotal.textContent = wizardElement.smartWizard('getStepInfo').totalSteps;
        });
    }

}