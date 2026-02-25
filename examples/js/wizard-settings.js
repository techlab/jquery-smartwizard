(function () {
    'use strict';

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
    const themeListControls = document.getElementById('theme-select');
    if (themeListControls) {
        Object.entries(themeList).forEach(([key, value]) => {
            const option = document.createElement('option');
            option.textContent = value;
            option.value = key;
            if (key === activeTheme) option.selected = true;
            themeListControls.appendChild(option);
        });

        themeListControls.addEventListener('change', () => {
            $('#smartwizard').smartWizard('setOptions', { theme: themeListControls.value });
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
                optgroup.appendChild(option);
            });

            transitionControls.appendChild(optgroup);
        });

        transitionControls.addEventListener('change', () => {
            const cssAnim = cssAnimationList[transitionControls.value];
            const options = cssAnim
                ? { transition: { effect: 'css', css: { ...cssAnim } } }
                : { transition: { effect: transitionControls.value } };
            $('#smartwizard').smartWizard('setOptions', options);
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


})();