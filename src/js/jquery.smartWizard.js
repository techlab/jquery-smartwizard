/*!
* jQuery SmartWizard v6.0.6
* The awesome step wizard plugin for jQuery
* http://www.techlaboratory.net/jquery-smartwizard
*
* Created by Dipu Raj (http://dipu.me)
*
* Licensed under the terms of the MIT License
* https://github.com/techlab/jquery-smartwizard/blob/master/LICENSE
*/

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = function( root, jQuery ) {
            if ( jQuery === undefined ) {
                // require('jQuery') returns a factory that requires window to
                // build a jQuery instance, we normalize how we use modules
                // that require this pattern but the window provided is a noop
                // if it's defined (how jquery works)
                if ( typeof window !== 'undefined' ) {
                    jQuery = require('jquery');
                }
                else {
                    jQuery = require('jquery')(root);
                }
            }
            factory(jQuery);
            return jQuery;
        };
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    "use strict";

    // Default options
    const defaults = {
        selected: 0, // Initial selected step, 0 = first step
        theme: 'basic', // Theme for the wizard, related css need to include for other than default theme
        justified: true, // Nav menu justification. true/false
        autoAdjustHeight: true, // Automatically adjust content height
        backButtonSupport: true, // Enable the back button support
        enableUrlHash: true, // Enable selection of the step based on url hash
        transition: {
            animation: 'none', // Animation effect on navigation, none|fade|slideHorizontal|slideVertical|slideSwing|css(Animation CSS class also need to specify)
            speed: '400', // Animation speed. Not used if animation is 'css'
            easing: '', // Animation easing. Not supported without a jQuery easing plugin. Not used if animation is 'css'
            prefixCss: '', // Only used if animation is 'css'. Animation CSS prefix
            fwdShowCss: '', // Only used if animation is 'css'. Step show Animation CSS on forward direction
            fwdHideCss: '', // Only used if animation is 'css'. Step hide Animation CSS on forward direction
            bckShowCss: '', // Only used if animation is 'css'. Step show Animation CSS on backward direction
            bckHideCss: '', // Only used if animation is 'css'. Step hide Animation CSS on backward direction
        },
        toolbar: {
            position: 'bottom', // none|top|bottom|both
            showNextButton: true, // show/hide a Next button
            showPreviousButton: true, // show/hide a Previous button
            extraHtml: '' // Extra html to show on toolbar
        },
        anchor: {
            enableNavigation: true, // Enable/Disable anchor navigation 
            enableNavigationAlways: false, // Activates all anchors clickable always
            enableDoneState: true, // Add done state on visited steps
            markPreviousStepsAsDone: true, // When a step selected by url hash, all previous steps are marked done
            unDoneOnBackNavigation: false, // While navigate back, done state will be cleared
            enableDoneStateNavigation: true // Enable/Disable the done state navigation
        },
        keyboard: {
            keyNavigation: true, // Enable/Disable keyboard navigation(left and right keys are used if enabled)
            keyLeft: [37], // Left key code
            keyRight: [39] // Right key code
        },
        lang: { // Language variables for button
            next: 'Next',
            previous: 'Previous'
        },
        style: { // CSS Class settings
            mainCss: 'sw',
            navCss: 'nav',
            navLinkCss: 'nav-link',
            contentCss: 'tab-content',
            contentPanelCss: 'tab-pane',
            themePrefixCss: 'sw-theme-',
            anchorDefaultCss: 'default',
            anchorDoneCss: 'done',
            anchorActiveCss: 'active',
            anchorDisabledCss: 'disabled',
            anchorHiddenCss: 'hidden',
            anchorErrorCss: 'error',
            anchorWarningCss: 'warning',
            justifiedCss: 'sw-justified',
            btnCss: 'sw-btn',
            btnNextCss: 'sw-btn-next',
            btnPrevCss: 'sw-btn-prev',
            loaderCss: 'sw-loading',
            progressCss: 'progress',
            progressBarCss: 'progress-bar',
            toolbarCss: 'toolbar',
            toolbarPrefixCss: 'toolbar-',
        },
        disabledSteps: [], // Array Steps disabled
        errorSteps: [], // Array Steps error
        warningSteps: [], // Array Steps warning
        hiddenSteps: [], // Hidden steps
        getContent: null, // Callback function for content loading
    };

    class SmartWizard {

        constructor(element, options) {
            // Merge user settings with default
            this.options        = $.extend(true, {}, defaults, options);
            // Main container element
            this.main           = $(element);
            // Navigation bar element
            this.nav            = this._getFirstDescendant('.' + this.options.style.navCss);
            // Content container
            this.container      = this._getFirstDescendant('.' + this.options.style.contentCss);
            // Step anchor elements
            this.steps          = this.nav.find('.' + this.options.style.navLinkCss);
            // Content pages
            this.pages          = this.container.children('.' + this.options.style.contentPanelCss);
            // Progressbar
            this.progressbar    = this.main.find('.' + this.options.style.progressCss);
            // Direction, RTL/LTR
            this.dir            = this._getDir();
            // Initial wizard index
            this.current_index  = -1;
            // Is initialiazed
            this.is_init        = false;    

            // Initialize options
            this._init();

            // Load wizard asynchronously
            setTimeout(() => {
                this._load();
            }, 0);
        }

        // Initialize options
        _init() {
            // Set the elements
            this._setElements();
            // Add toolbar
            this._setToolbar();

            // Skip if already init
            if (this.is_init === true) return true;

            // Assign plugin events
            this._setEvents();

            this.is_init = true;
            // Trigger the initialized event
            this._triggerEvent("initialized");
        }

        // Initial Load Method
        _load() {
            // Clean the elements
            this.pages.hide();

            // Clear other states from the steps
            this.steps.removeClass([
                this.options.style.anchorDoneCss,
                this.options.style.anchorActiveCss
            ]);

            // Initial step index
            this.current_index  = -1;

            // Get the initial step index
            let idx = this._getURLHashIndex();
            idx = idx !== false ? idx : this.options.selected;
            const idxShowable = this._getShowable(idx - 1, 'forward');
            idx = (idxShowable === null && idx > 0) ? this._getShowable(-1, 'forward') : idxShowable;

            // Mark any previous steps done
            if (idx > 0 && this.options.anchor.enableDoneState && this.options.anchor.markPreviousStepsAsDone) {
                this.steps.slice(0, idx).addClass(this.options.style.anchorDoneCss);
            }

            // Show the initial step
            this._showStep(idx);
            // Trigger the loaded event
            this._triggerEvent("loaded");
        }

        _getFirstDescendant(selector) {
            // Check for first level element
            let elm = this.main.children(selector);
            if (elm.length > 0) {
                return elm;
            }

            // Check for second level element
            this.main.children().each((i, n) => {
                let tmp = $(n).children(selector);
                if (tmp.length > 0) {
                    elm = tmp;
                    return false;
                }
            });
            if (elm.length > 0) {
                return elm;
            }

            // Element not found
            this._showError("Element not found " + selector);
            return false;
        }

        _getDir() {
            let dir = this.main.prop('dir');
            if (dir.length === 0) {
                dir = document.documentElement.dir;
                // Helps to isolate related css classes
                this.main.prop('dir', dir);
            }
            return dir;
        }

        _setElements() {
            // Set the main element classes including theme css
            this.main.removeClass((i, className) => {
                return (className.match(new RegExp('(^|\\s)' + this.options.style.themePrefixCss + '\\S+','g')) || []).join(' ');
            }).addClass(this.options.style.mainCss + ' ' + this.options.style.themePrefixCss + this.options.theme);

            // Set justify option
            this.main.toggleClass(this.options.style.justifiedCss, this.options.justified);
            
            // Set the anchor default style
            if (this.options.anchor.enableNavigationAlways !== true || this.options.anchor.enableNavigation !== true) {
                this.steps.addClass(this.options.style.anchorDefaultCss);
            }

            // Disabled steps
            $.each(this.options.disabledSteps, (i, n) => {
                this.steps.eq(n).addClass(this.options.style.anchorDisabledCss);
            });
            // Error steps
            $.each(this.options.errorSteps, (i, n) => {
                this.steps.eq(n).addClass(this.options.style.anchorErrorCss);
            });
            // Warning steps
            $.each(this.options.warningSteps, (i, n) => {
                this.steps.eq(n).addClass(this.options.style.anchorWarningCss);
            });
            // Hidden steps
            $.each(this.options.hiddenSteps, (i, n) => {
                this.steps.eq(n).addClass(this.options.style.anchorHiddenCss);
            });
        }

        _setEvents() {
            // Anchor click event
            this.steps.on("click", (e) => {
                e.preventDefault();
                if (this.options.anchor.enableNavigation !== true) {
                    return;
                }

                const elm = $(e.currentTarget);
                if (this._isShowable(elm)) {
                    // Get the step index
                    this._showStep(this.steps.index(elm));
                }
            });

            // Next/Previous button event
            this.main.on("click", (e) => {
                if ($(e.target).hasClass(this.options.style.btnNextCss)) {
                    e.preventDefault();
                    this._navigate('next');
                } else if ($(e.target).hasClass(this.options.style.btnPrevCss)) {
                    e.preventDefault();
                    this._navigate('prev');
                }
                return;
            });
            
            // Keyboard navigation event            
            $(document).keyup((e) => {
                this._keyNav(e);
            });        

            // Back/forward browser button event
            $(window).on('hashchange', (e) => {
                if (this.options.backButtonSupport !== true) {
                    return;
                }
                const idx = this._getURLHashIndex();
                if (idx !== false && this._isShowable(this.steps.eq(idx))) {
                    e.preventDefault();
                    this._showStep(idx);
                }
            });

            // Fix content height on window resize
            $(window).on('resize', (e) => {
               this._fixHeight(this.current_index);
            });
        }

        _setToolbar() {
            // Remove already existing toolbar if any
            this.main.find(".sw-toolbar-elm").remove();

            const toolbarPosition = this.options.toolbar.position;
            if (toolbarPosition === 'none') {
                // Skip right away if the toolbar is not enabled
                return;
            } else if (toolbarPosition == 'both') {
                this.container.before(this._createToolbar('top'));
                this.container.after(this._createToolbar('bottom'));
            } else if (toolbarPosition == 'top') {
                this.container.before(this._createToolbar('top'));
            } else {
                this.container.after(this._createToolbar('bottom'));
            }
        }

        _createToolbar(position) {
            const toolbar       = $('<div></div>').addClass('sw-toolbar-elm ' + this.options.style.toolbarCss + ' ' + this.options.style.toolbarPrefixCss + position).attr('role', 'toolbar');
            // Create the toolbar buttons
            const btnNext       = this.options.toolbar.showNextButton !== false ? $('<button></button>').text(this.options.lang.next).addClass('btn ' + this.options.style.btnNextCss + ' ' + this.options.style.btnCss).attr('type', 'button') : null;
            const btnPrevious   = this.options.toolbar.showPreviousButton !== false ? $('<button></button>').text(this.options.lang.previous).addClass('btn ' + this.options.style.btnPrevCss + ' ' + this.options.style.btnCss).attr('type', 'button') : null;
            return toolbar.append(btnPrevious, btnNext, this.options.toolbar.extraHtml);
        }

        _navigate(dir) {
            this._showStep(this._getShowable(this.current_index, dir));
        }

        _showStep(idx) {
            if (idx === -1 || idx === null) return false;

            // If current step is requested again, skip
            if (idx == this.current_index) return false;

            // If step not found, skip
            if (!this.steps.eq(idx)) return false;

            // If it is a disabled step, skip
            if (!this._isEnabled(this.steps.eq(idx))) return false;

            // Get the direction of navigation
            const stepDirection = this._getStepDirection(idx);

            if (this.current_index !== -1) {
                // Trigger "leaveStep" event
                if (this._triggerEvent("leaveStep", [this._getStepAnchor(this.current_index), this.current_index, idx, stepDirection]) === false) {
                    return false;
                }
            }

            this._loadContent(idx, () => {
                // Get step to show element
                const selStep = this._getStepAnchor(idx);
                // Change the url hash to new step
                this._setURLHash(selStep.attr("href"));
                // Update controls
                this._setAnchor(idx);

                // Get current step element
                const curPage   = this._getStepPage(this.current_index);
                // Get next step element
                const selPage   = this._getStepPage(idx);
                // transit the step
                this._transit(selPage, curPage, stepDirection, () => {
                    // Fix height with content
                    this._fixHeight(idx);
                    // Trigger "showStep" event
                    this._triggerEvent("showStep", [selStep, idx, stepDirection, this._getStepPosition(idx)]);
                });

                // Update the current index
                this.current_index  = idx;
                // Set the buttons based on the step
                this._setButtons(idx);
                // Set the progressbar based on the step
                this._setProgressbar(idx);
            });
        }

        _getShowable(idx, dir) {
            let si = null;
            const elmList = (dir == 'prev') ? $(this.steps.slice(0, idx).get().reverse()) : this.steps.slice(idx + 1);
            // Find the next showable step in the direction
            elmList.each((i, elm) => {
                if (this._isEnabled($(elm))) {
                    si = (dir == 'prev') ? idx - (i + 1) : i + idx + 1;
                    return false;
                }
            });
            return si;
        }

        _isShowable(elm) {
            if (!this._isEnabled(elm)) {
                return false;
            }

            const isDone = elm.hasClass(this.options.style.anchorDoneCss);
            if (this.options.anchor.enableDoneStateNavigation === false && isDone) {
                return false;
            }
    
            if (this.options.anchor.enableNavigationAlways === false && !isDone) {
                return false;
            }
    
            return true;
        }

        _isEnabled(elm) {
            return (elm.hasClass(this.options.style.anchorDisabledCss) || elm.hasClass(this.options.style.anchorHiddenCss)) ? false : true;
        }

        _getStepDirection(idx) {
            return this.current_index < idx ? "forward" : "backward";
        }

        _getStepPosition(idx) {
            if (idx === 0) {
                return 'first';
            } else if (idx === this.steps.length - 1) {
                return 'last';
            }
            return 'middle';
        }

        _getStepAnchor(idx) {
            if (idx == null || idx == -1) return null;
            return this.steps.eq(idx);
        }

        _getStepPage(idx) {
            if (idx == null || idx == -1) return null;
            return this.pages.eq(idx);
        }

        _loadContent(idx, callback) {
            if (!$.isFunction(this.options.getContent)) { callback(); return; }

            const selPage       = this._getStepPage(idx);
            if (!selPage) { callback(); return; }
            // Get step direction
            const stepDirection = this._getStepDirection(idx);
            // Get step position
            const stepPosition  = this._getStepPosition(idx);
            // Get next step element
            const selStep       = this._getStepAnchor(idx);

            this.options.getContent(idx, stepDirection, stepPosition, selStep, (content) => {
                if (content) selPage.html(content);
                callback();
            });
        }

        _transit(elmToShow, elmToHide, stepDirection, callback) {
            const transitFn = $.fn.smartWizard.transitions[this.options.transition.animation];
            this._stopAnimations();
            if ($.isFunction(transitFn)) {
                transitFn(elmToShow, elmToHide, stepDirection, this, (res) => {
                    if (res === false) {
                        if (elmToHide !== null) elmToHide.hide();
                        elmToShow.show();
                    }
                    callback();
                });
            } else {
                if (elmToHide !== null) elmToHide.hide();
                elmToShow.show();
                callback();
            }
        }

        _stopAnimations() {
            if ($.isFunction(this.container.finish)) {
                this.pages.finish();
                this.container.finish();
            }
        }

        _fixHeight(idx) {
            if (this.options.autoAdjustHeight === false) return;
            // Auto adjust height of the container
            const contentHeight = this._getStepPage(idx).outerHeight();
            if ($.isFunction(this.container.finish) && $.isFunction(this.container.animate) && contentHeight > 0) {
                this.container.finish().animate({ height: contentHeight }, this.options.transition.speed);
            } else {
                this.container.css({ height: contentHeight > 0 ? contentHeight : 'auto' });
            }
        }

        _setAnchor(idx) {
            // Current step anchor > Remove other classes and add done class
            if (this.current_index !== null && this.current_index >= 0) {
                let removeCss   = this.options.style.anchorActiveCss;
                let addCss      = '';

                if (this.options.anchor.enableDoneState !== false) {
                    addCss += this.options.style.anchorDoneCss;
                    if (this.options.anchor.unDoneOnBackNavigation !== false && this._getStepDirection(idx) === 'backward') {
                        removeCss += ' ' + this.options.style.anchorDoneCss;
                    }
                }

                this.steps.eq(this.current_index).addClass(addCss).removeClass(removeCss);
            }

            // Next step anchor > Remove other classes and add active class
            this.steps.eq(idx).removeClass(this.options.style.anchorDoneCss).addClass(this.options.style.anchorActiveCss);
        }

        _setButtons(idx) {
            // Previous/Next Button enable/disable based on step
            this.main.find('.' + this.options.style.btnNextCss + ', .' + this.options.style.btnPrevCss).removeClass(this.options.style.anchorDisabledCss);

            const p = this._getStepPosition(idx);
            if (p === 'first' || p === 'last') {
                const c = (p === 'first') ? '.' + this.options.style.btnPrevCss : '.' + this.options.style.btnNextCss;
                this.main.find(c).addClass(this.options.style.anchorDisabledCss);
            } else {
                if (this._getShowable(idx, 'next') === null) {
                    this.main.find('.' + this.options.style.btnNextCss).addClass(this.options.style.anchorDisabledCss);
                }

                if (this._getShowable(idx, 'prev') === null) {
                    this.main.find('.' + this.options.style.btnPrevCss).addClass(this.options.style.anchorDisabledCss);
                }
            }
        }

        _setProgressbar(idx) {
            const width = this.nav.width();
            const widthPercentage = ((width / this.steps.length) * (idx + 1) / width) * 100;
            // Set css variable for supported themes
            document.documentElement.style.setProperty('--sw-progress-width', widthPercentage + '%');
            if (this.progressbar.length > 0) {
                this.progressbar.find('.' + this.options.style.progressBarCss).css('width', widthPercentage + '%');
            }
        }

        // HELPER FUNCTIONS

        _keyNav(e) {
            if (!this.options.keyboard.keyNavigation) {
                return;
            }

            // Keyboard navigation
            if ($.inArray(e.which, this.options.keyboard.keyLeft) > -1) {
                // left
                this._navigate('prev');
                e.preventDefault();
            } else if ($.inArray(e.which, this.options.keyboard.keyRight) > -1) {
                // right
                this._navigate('next');
                e.preventDefault();
            } else {
                return; // exit this handler for other keys
            }
        }

        _triggerEvent(name, params) {
            // Trigger an event
            var e = $.Event(name);
            this.main.trigger(e, params);
            if (e.isDefaultPrevented()) {
                return false;
            }
            return e.result;
        }

        _setURLHash(hash) {
            if (this.options.enableUrlHash && window.location.hash !== hash) {
                history.pushState(null,null,hash);
            }
        }

        _getURLHashIndex() {
            if (this.options.enableUrlHash) {
                // Get step number from url hash if available
                var hash = window.location.hash;
                if (hash.length > 0) {
                    var elm = this.nav.find("a[href*='" + hash + "']");
                    if (elm.length > 0) {
                        return this.steps.index(elm);
                    }
                }
            }
            return false;
        }

        _showError(msg) {
            console.error(msg);
        }

        _changeState(stepArray, state, addOrRemove) {
            // addOrRemove: true => Add, otherwise remove 
            addOrRemove = (addOrRemove !== false) ? true : false;

            let css = '';
            if (state == 'default') {
                css = this.options.style.anchorDefaultCss;
            } else if (state == 'active') {
                css = this.options.style.anchorActiveCss;
            } else if (state == 'done') {
                css = this.options.style.anchorDoneCss;
            } else if (state == 'disable') {
                css = this.options.style.anchorDisabledCss;
            } else if (state == 'hidden') {
                css = this.options.style.anchorHiddenCss;
            } else if (state == 'error') {
                css = this.options.style.anchorErrorCss;
            } else if (state == 'warning') {
                css = this.options.style.anchorWarningCss;
            }

            $.each(stepArray, (i, n) => {
                this.steps.eq(n).toggleClass(css, addOrRemove);
            });
        }

        // PUBLIC FUNCTIONS

        goToStep(stepIndex, force) {
            force = force !== false ? true : false;
            if (force !== true && !this._isShowable(this.steps.eq(stepIndex))) {
                return;
            }

            // Mark any previous steps done
            if (force === true && stepIndex > 0 && this.options.anchor.enableDoneState && this.options.anchor.markPreviousStepsAsDone) {
                this.steps.slice(0, stepIndex).addClass(this.options.style.anchorDoneCss);
            }

            this._showStep(stepIndex);
        }

        next() {
            this._navigate('next');
        }

        prev() {
            this._navigate('prev');
        }

        reset() {
            // Clear css from steps except default, hidden and disabled
            this.steps.removeClass([
                this.options.style.anchorDoneCss,
                this.options.style.anchorActiveCss,
                this.options.style.anchorErrorCss,
                this.options.style.anchorWarningCss
            ]);

            // Reset all
            this._setURLHash('#');
            this._init();
            this._load();
        }

        setState(stepArray, state) {
            this._changeState(stepArray, state, true);
        }

        unsetState(stepArray, state) {
            this._changeState(stepArray, state, false);
        }

        setOptions(options) {
            this.options  = $.extend(true, {}, this.options, options);
            this._init();
        }

        getOptions() {
            return this.options;
        }

        getStepInfo() {
            return {
                currentStep: this.current_index ? this.current_index : 0,
                totalSteps: this.steps ? this.steps.length : 0
            };
        }

        loader(state) {
            this.main.toggleClass(this.options.style.loaderCss, (state === "show"));
        }

        fixHeight() {
            this._fixHeight(this.current_index);
        }
    }

    // Wrapper for the plugin
    $.fn.smartWizard = function (options) {
        if (options === undefined || typeof options === 'object') {
            return this.each(function () {
                if (!$.data(this, "smartWizard")) {
                    $.data(this, "smartWizard", new SmartWizard(this, options));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            let instance = $.data(this[0], 'smartWizard');

            if (options === 'destroy') {
                $.data(this, 'smartWizard', null);
            }

            if (instance instanceof SmartWizard && typeof instance[options] === 'function') {
                return instance[options].apply(instance, Array.prototype.slice.call(arguments, 1));
            } else {
                return this;
            }
        }
    };

    // Transition effects
    $.fn.smartWizard.transitions = {
        fade: (elmToShow, elmToHide, stepDirection, wizardObj, callback) => {
            if (!$.isFunction(elmToShow.fadeOut)) { callback(false); return; }

            if (elmToHide) {
                elmToHide.fadeOut(wizardObj.options.transition.speed, wizardObj.options.transition.easing, () => {
                    elmToShow.fadeIn(wizardObj.options.transition.speed, wizardObj.options.transition.easing, () => {
                        callback();
                    });
                });
            } else {
                elmToShow.fadeIn(wizardObj.options.transition.speed, wizardObj.options.transition.easing, () => {
                    callback();
                });
            }
        },
        slideSwing: (elmToShow, elmToHide, stepDirection, wizardObj, callback) => {
            if (!$.isFunction(elmToShow.slideDown)) { callback(false); return; }

            if (elmToHide) {
                elmToHide.slideUp(wizardObj.options.transition.speed, wizardObj.options.transition.easing, () => {
                    elmToShow.slideDown(wizardObj.options.transition.speed, wizardObj.options.transition.easing, () => {
                        callback();
                    });
                });
            } else {
                elmToShow.slideDown(wizardObj.options.transition.speed, wizardObj.options.transition.easing, () => {
                    callback();
                });
            }
        },
        slideHorizontal: (elmToShow, elmToHide, stepDirection, wizardObj, callback) => {
            if (!$.isFunction(elmToShow.animate)) { callback(false); return; }

            // Horizontal slide
            const animFn = (elm, iniLeft, finLeft, cb) => {
                elm.css({position:'absolute', left: iniLeft })
                    .show()
                    .animate({ left: finLeft }, 
                        wizardObj.options.transition.speed, 
                        wizardObj.options.transition.easing,
                        cb);
            };

            if (wizardObj.current_index == -1) {
                // Set container height at page load 
                wizardObj.container.height(elmToShow.outerHeight());
            }
            const containerWidth  = wizardObj.container.width();
            if (elmToHide) {
                const initCss1  = elmToHide.css(["position", "left"]);
                const finLeft   = containerWidth * (stepDirection == 'backward' ? 1 : -1);
                animFn(elmToHide, 0, finLeft, () => {
                    elmToHide.hide().css(initCss1);
                });
            }

            const initCss2  = elmToShow.css(["position"]);
            const iniLeft   = containerWidth * (stepDirection == 'backward' ? -2 : 1);
            animFn(elmToShow, iniLeft, 0, () => {
                elmToShow.css(initCss2);
                callback();
            });
        },
        slideVertical: (elmToShow, elmToHide, stepDirection, wizardObj, callback) => {
            if (!$.isFunction(elmToShow.animate)) { callback(false); return; }

            // Vertical slide
            const animFn = (elm, iniTop, finTop, cb) => {
                elm.css({ position:'absolute', top: iniTop })
                    .show()
                    .animate({ top: finTop }, 
                        wizardObj.options.transition.speed, 
                        wizardObj.options.transition.easing,
                        cb);
            };

            if (wizardObj.current_index == -1) {
                // Set container height at page load 
                wizardObj.container.height(elmToShow.outerHeight());
            }
            const containerHeight = wizardObj.container.height();
            if (elmToHide) {
                const initCss1  = elmToHide.css(["position", "top"]);
                const finTop    = containerHeight * (stepDirection == 'backward' ? -1 : 1);
                animFn(elmToHide, 0, finTop, () => {
                    elmToHide.hide().css(initCss1);
                });
            }

            const initCss2  = elmToShow.css(["position"]);
            const iniTop    = containerHeight * (stepDirection == 'backward' ? 1 : -2);
            animFn(elmToShow, iniTop, 0, () => {
                elmToShow.css(initCss2);
                callback();
            });            
        },
        css: (elmToShow, elmToHide, stepDirection, wizardObj, callback) => {
            if (wizardObj.options.transition.fwdHideCss.length == 0 || wizardObj.options.transition.bckHideCss.length == 0 ) { callback(false); return; }
            
            // CSS Animation
            const animFn = (elm, animation, cb) => {
                if (!animation || animation.length == 0) cb();

                elm.addClass(animation).one("animationend", (e) => {
                    $(e.currentTarget).removeClass(animation);
                    cb();
                });
                elm.addClass(animation).one("animationcancel", (e) => {
                    $(e.currentTarget).removeClass(animation);
                    cb('cancel');
                });
            };

            const showCss = wizardObj.options.transition.prefixCss + ' ' + (stepDirection == 'backward' ? wizardObj.options.transition.bckShowCss : wizardObj.options.transition.fwdShowCss);
            if (elmToHide) {
                const hideCss = wizardObj.options.transition.prefixCss + ' ' + (stepDirection == 'backward' ? wizardObj.options.transition.bckHideCss : wizardObj.options.transition.fwdHideCss);
                animFn(elmToHide, hideCss, () => {
                    elmToHide.hide();

                    animFn(elmToShow, showCss, () => {
                        callback();
                    });
                    elmToShow.show();
                });
            } else {
                animFn(elmToShow, showCss, () => {
                    callback();
                });
                elmToShow.show();
            }
        }
    };

}));