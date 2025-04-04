import { WizardOptions, TransitionEffect, StepEventArgs, StepDirection } from './types';
import { transitions } from './transitions';
import { defaults } from './defaults';
import * as Util from './util';
import * as Constants from './constants';

export class SmartWizard {
    private readonly options: WizardOptions;
    private readonly container: JQuery;
    private readonly steps: JQuery;
    private readonly nav: JQuery;
    private currentStepIdx: number;
    private isInitialized: boolean;
    private main: JQuery;
    private progressbar: JQuery;
    private pages: JQuery;
    private dir: string;

    constructor(element: JQuery, options?: Partial<WizardOptions>) {
        // Merge user settings with default
        this.options = { ...defaults, ...options };
        // Main container element
        this.main = $(element);
        // Content container
        this.container = Util.getFirstDescendant(this.main, '.' + this.options.styles.content.container);
        // Navigation bar element
        this.nav = Util.getFirstDescendant(this.main, '.' + this.options.styles.navigation.container);
        // Step anchor elements
        this.steps = this.nav.find('.' + this.options.styles.navigation.link);
        // Content pages
        this.pages = this.container.children('.' + this.options.styles.content.panel);
        // Progressbar
        this.progressbar = this.main.find('.' + this.options.styles.progressBar.container);
        // Direction, RTL/LTR
        this.dir = Util.getContentDirection(this.main);
        this.dir ?? Util.setContentDirection(this.main, this.dir)
        // Initial wizard index
        this.currentStepIdx = -1;
        // Is initialiazed
        this.isInitialized = false;

        // Initial setup
        // this.setup(element, options);
        // Initialize
        this.init();
        // Load wizard asynchronously
        setTimeout(() => {
            this.load();
        }, 0);
    }

    // private setup(element: JQuery, options?: Partial<WizardOptions>): void {

    // }

    private init(): void {
        // Set elements
        this.setElements();
        // Add toolbar
        this.setToolbar();
        // Set anchor
        this.setNav();

        // TODO: Remove Skip if already init
        if (this.isInitialized === true) return;

        // Assign plugin events
        this.setEvents();

        // Trigger the initialized event
        Util.triggerEvent(this.main, Constants.EVENTS.INITIALIZED);
    }

    private load(): void {
        // Clean the elements
        this.pages.hide();

        // Clear other states from the steps
        this.steps.removeClass([
            this.options.styles.anchorStates.completed,
            this.options.styles.anchorStates.active
        ]);

        // Initial wizard index
        this.currentStepIdx = -1;

        // Get the initial step index
        let hash = this.options.behavior.enableUrlHashNavigation ? Util.getURLHashIndex() : null;
        let idx = hash ? this.getStepByAnchor(hash) : false;
        idx = idx !== false ? idx : this.options.initialStep;
        const idxShowable = this.getShowable(idx - 1, 'forward');
        idx = (idxShowable === null && idx > 0) ? this.getShowable(-1, 'forward') : idxShowable;

        // Mark any previous steps done
        if (idx > 0 && this.options.navigation.completedState.enabled && this.options.navigation.completedState.markPreviousAsCompleted) {
            this.steps.slice(0, idx).addClass(this.options.styles.anchorStates.completed);
        }

        // Show the initial step
        this.showStep(idx);
        // Trigger the loaded event
        Util.triggerEvent(this.main, Constants.EVENTS.LOADED);
    }

    private getShowable(idx: number, dir: string) {
        let si = 0;
        const elmList = (dir == 'prev') ? $(this.steps.slice(0, idx).get().reverse()) : this.steps.slice(idx + 1);
        // Find the next showable step in the direction
        elmList.each((i, elm) => {
            if (this.isEnabled($(elm))) {
                si = (dir == 'prev') ? idx - (i + 1) : i + idx + 1;
                return false;
            }
        });
        return si;
    }

    private isShowable(elm: JQuery) {
        if (!this.isEnabled(elm)) {
            return false;
        }

        const isDone = elm.hasClass(this.options.styles.anchorStates.completed);
        if (this.options.navigation.completedState.enabled === false && isDone) {
            return false;
        }

        if (this.options.navigation.alwaysClickable === false && !isDone) {
            return false;
        }

        return true;
    }

    private isEnabled(elm: JQuery) {
        return (elm.hasClass(this.options.styles.anchorStates.disabled) || elm.hasClass(this.options.styles.anchorStates.hidden)) ? false : true;
    }

    private getStepByAnchor(hash: string): number {
        var elm = this.nav.find("a[href*='" + hash + "']");
        if (elm.length > 0) {
            return this.steps.index(elm);
        }
        return 0;
    }

    private setNav(): void {
        // Set the anchor default style
        if (this.options.navigation.alwaysClickable !== true || this.options.navigation.enableAnchors !== true) {
            this.steps.addClass(this.options.styles.anchorStates.default);
        }

        // Disabled steps
        this.setStepStyle(this.options.stepStates.disabled, this.options.styles.anchorStates.disabled);
        // Error steps
        this.setStepStyle(this.options.stepStates.error, this.options.styles.anchorStates.error);
        // Warning steps
        this.setStepStyle(this.options.stepStates.warning, this.options.styles.anchorStates.warning);
        // Hidden steps
        this.setStepStyle(this.options.stepStates.hidden, this.options.styles.anchorStates.hidden);
        // Add scroll buttons for nav bar
        this.createAnchorScroll();
    }

    private setStepStyle(stepIndexes: number[], cssClass: string) {
        $.each(stepIndexes, (_i, n: any) => {
            this.steps.eq(n).addClass(cssClass);
        });
    }

    private createAnchorScroll() {
        // Create the scroll buttons
        // Only add if the nav bar is scrollable
        const btnNext = $('<button></button>').addClass('nav-scroll-btn nav-scroll-btn-right nav-scroll-right').html("&#11166;").attr('type', 'button');
        const btnPrevious = $('<button></button>').addClass('nav-scroll-btn nav-scroll-btn-left nav-scroll-left').html("&#11164;").attr('type', 'button');
        return this.nav.append(btnPrevious, btnNext);
    }

    private setElements(): void {
        // Set the main element classes including theme css
        this.main.removeClass((_i, className) => {
            return (className.match(new RegExp('(^|\\s)' + this.options.styles.themePrefix + '\\S+', 'g')) || []).join(' ');
        }).addClass(this.options.styles.baseClass + ' ' + this.options.styles.themePrefix + this.options.theme);

        // Set justify option
        this.main.toggleClass(this.options.styles.navigation.justified, this.options.navigation.justified);
    }

    private setToolbar(): void {
        // Remove already existing toolbar if any
        this.main.find(".sw-toolbar-elm").remove();

        const toolbarPosition = this.options.toolbar.position;
        if (toolbarPosition === 'none') {
            // Skip right away if the toolbar is not enabled
            return;
        }

        if (toolbarPosition == 'both') {
            this.container.before(this.createToolbar('top'));
            this.container.after(this.createToolbar('bottom'));
        } else if (toolbarPosition == 'top') {
            this.container.before(this.createToolbar('top'));
        } else {
            this.container.after(this.createToolbar('bottom'));
        }
    }

    private createToolbar(position: string) {
        const toolbar = $('<div></div>').addClass('sw-toolbar-elm ' + this.options.styles.toolbar.base + ' ' + this.options.styles.toolbar.prefix + position).attr('role', 'toolbar');
        // Create the toolbar buttons
        const btnNext = this.options.toolbar.buttons.showNext !== false ? $('<button></button>').text(this.options.localization.buttons.next).addClass('btn ' + this.options.styles.buttons.next + ' ' + this.options.styles.buttons.base).attr('type', 'button') : null;
        const btnPrevious = this.options.toolbar.buttons.showPrevious !== false ? $('<button></button>').text(this.options.localization.buttons.previous).addClass('btn ' + this.options.styles.buttons.previous + ' ' + this.options.styles.buttons.base).attr('type', 'button') : null;
        return toolbar.append(btnPrevious, btnNext, this.options.toolbar.extraHtml);
    }

    private setEvents(): void {
        // Anchor click event
        this.steps.on(Constants.EVENTS.CLICK, (e) => {
            e.preventDefault();
            if (this.options.navigation.enableAnchors !== true) {
                return;
            }

            const elm = $(e.currentTarget);
            if (this.isShowable(elm)) {
                // Get the step index
                this.showStep(this.steps.index(elm));
            }
        });

        // Next/Previous button event
        this.main.on(Constants.EVENTS.CLICK, (e) => {
            const targetElm = $(e.target);
            if (targetElm.hasClass(this.options.styles.buttons.next)) {
                e.preventDefault();
                this.navigate('next');
            } else if (targetElm.hasClass(this.options.styles.buttons.previous)) {
                e.preventDefault();
                this.navigate('prev');
            } else if (targetElm.hasClass('nav-scroll-right')) {
                e.preventDefault();
                this.scrollAnchor('right');
            } else if (targetElm.hasClass('nav-scroll-left')) {
                e.preventDefault();
                this.scrollAnchor('left');
            }

            return;
        });

        // Scroll event
        $(this.nav).on(Constants.EVENTS.SCROLLEND, () => {
            this.scrollCheck();
        });

        // Keyboard navigation event            
        $(document).on(Constants.EVENTS.KEYUP, (e) => {
            this.keyNav(e);
        });

        // Back/forward browser button event
        $(window).on(Constants.EVENTS.HASHCHANGE, (e) => {
            if (this.options.behavior.backButtonSupport !== true) {
                return;
            }
            const idx = Util.getURLHashIndex();
            if (idx !== false && this.isShowable(this.steps.eq(idx))) {
                e.preventDefault();
                this.showStep(idx);
            }
        });

        // Fix content height on window resize
        $(window).on(Constants.EVENTS.RESIZE, () => {
            this.fixHeight(this.currentStepIdx);
        });
    }

    private navigate(dir: string) {
        this.showStep(this.getShowable(this.currentStepIdx, dir));
    }

    private scrollAnchor(dir: string) {
        // element.scrollWidth - element.clientWidth
        // console.log(this.nav.scrollLeft() + this.nav.width(), this.nav.get(0).scrollWidth);

        let scrollLeft = this.nav.scrollLeft() ?? 0;
        if (dir == 'left') {
            if (scrollLeft == 0) return;
            scrollLeft = scrollLeft - 200;
        } else {
            // const maxScrollLeft = this.nav.get(0).scrollWidth - this.nav.width();
            if (this.nav.scrollLeft() + this.nav.width() >= this.nav.get(0).scrollWidth) return;
            scrollLeft = scrollLeft + 200;
        }

        if (typeof this.nav.animate === "function") {
            this.nav.animate({
                scrollLeft: scrollLeft
            },
                this.options.transition.speed,
                this.options.transition.easing);
        } else {
            this.nav.scrollLeft(scrollLeft);
        }
    }

    private scrollCheck() {
        let hasScroll = false;
        let canScrollLeft = false;
        let canScrollRight = false;

        const scrollLeft = this.nav.scrollLeft()??0;
        const scrollWidth = this.nav?.get(0)?.scrollWidth??0;
        const width = this.nav.outerWidth()??0;
        if (width < scrollWidth) {
            hasScroll = true;
        }

        $('.nav-scroll-btn').toggle(hasScroll);
        if (!hasScroll) return;

        if (scrollLeft > 0) {
            canScrollLeft = true;
        }
        if (Math.ceil(width + scrollLeft) < scrollWidth) {
            canScrollRight = true;
        }

        $('.nav-scroll-btn-left').toggle(canScrollLeft);
        $('.nav-scroll-btn-right').toggle(canScrollRight);

        // console.log(this.nav.outerWidth(), scrollLeft, this.nav.get(0).scrollWidth);
        // console.log(hasScroll, canScrollLeft, canScrollRight);
    }

    private keyNav(e: any) {
        if (!this.options.keyboardShortcuts.enabled) {
            return;
        }

        // Keyboard navigation
        if ($.inArray(e.which, this.options.keyboardShortcuts.keys.left) > -1) {
            // left
            this.navigate('prev');
            e.preventDefault();
        } else if ($.inArray(e.which, this.options.keyboardShortcuts.keys.right) > -1) {
            // right
            this.navigate('next');
            e.preventDefault();
        } else {
            return; // exit this handler for other keys
        }
    }

    private getStepDirection(stepIdx: number): StepDirection {
        return stepIdx > this.currentStepIdx ? "forward" : "backward";
    }

    private getStepAnchor(stepIdx: number) {
        if (stepIdx == null || stepIdx == -1) return null;
        return this.steps.eq(stepIdx);
    }

    private setAnchor(stepIdx: number) {
        // Current step anchor > Remove other classes and add done class
        if (this.currentStepIdx !== null && this.currentStepIdx >= 0) {
            let removeCss = this.options.styles.anchorStates.active;
            let addCss = '';

            if (this.options.navigation.completedState.enabled !== false) {
                addCss += this.options.styles.anchorStates.completed;
                if (this.options.navigation.completedState.clearOnBack !== false && this.getStepDirection(stepIdx) === 'backward') {
                    removeCss += ' ' + this.options.styles.anchorStates.completed;
                }
            }

            this.steps.eq(this.currentStepIdx).addClass(addCss).removeClass(removeCss);
        }

        // Next step anchor > Remove other classes and add active class
        this.steps.eq(stepIdx).removeClass(this.options.styles.anchorStates.completed).addClass(this.options.styles.anchorStates.active);
    }

    

    private getStepPage(idx: number) {
        if (idx == null || idx == -1) return null;
        return this.pages.eq(idx);
    }

    private transit(elmToShow: JQuery, elmToHide: JQuery, stepDirection: string, callback: any) {
        const transitFn = transitions[this.options.transition.type];
        this.stopAnimations();
        if (typeof transitFn === "function") {
            transitFn(elmToShow, elmToHide, stepDirection, this, () => {
                // if (res === false) {
                //     if (elmToHide !== null) elmToHide.hide();
                //     elmToShow.show();
                // }
                callback();
            });
        } else {
            if (elmToHide !== null) elmToHide.hide();
            elmToShow.show();
            callback();
        }
    }

    private stopAnimations() {
        if (typeof this.container.finish === "function") {
            this.pages.finish();
            this.container.finish();
        }
    }

    private fixHeight(idx: number) {
        if (this.options.behavior.autoAdjustHeight === false) return;
        // Auto adjust height of the container
        const contentHeight = this.getStepPage(idx)?.outerHeight()??0;
        if (typeof this.container.finish === "function" && typeof this.container.animate === "function" && contentHeight > 0) {
            this.container.finish().animate({ height: contentHeight }, this.options.transition.speed);
        } else {
            this.container.css({ height: contentHeight > 0 ? contentHeight : 'auto' });
        }
    }

    private showStep(stepIdx: number): void {
        if (stepIdx === -1 || stepIdx === null) return;
        // If current step is requested again, skip
        if (stepIdx == this.currentStepIdx) return;
        // If step not found, skip
        if (!this.steps.eq(stepIdx)) return;
        // If it is a disabled step, skip
        if (!this.isEnabled(this.steps.eq(stepIdx))) return;
        // Get the direction of navigation
        const stepDirection = this.getStepDirection(stepIdx);

        if (this.currentStepIdx !== -1) {
            // const stepInfo: StepEventArgs = {
            //     direction: stepDirection,
            //     fromStep: this.currentStepIdx + 1,
            //     toStep: stepIdx + 1
            // };

            // Trigger "leaveStep" event
            if (Util.triggerEvent(this.main, Constants.EVENTS.LEAVESTEP, [this.getStepAnchor(this.currentStepIdx), this.currentStepIdx, stepIdx, stepDirection]) === false) {
                return;
            }
        }

        // Load content
        this.loadContent(stepIdx, () => {
            // Get step to show element
            const selStep = this.getStepAnchor(stepIdx);
            // Change the url hash to new step
            selStep?.attr("href") ?? Util.setURLHash(selStep?.attr("href")??'');
            // Update controls
            this.setAnchor(stepIdx);
            // Scroll the element into view
            Util.scrollToView(selStep);

            // Get current step element
            const curPage = this.getStepPage(this.currentStepIdx);
            // Get next step element
            const selPage = this.getStepPage(stepIdx);
            // transit the step
            this.transit(selPage, curPage, stepDirection, () => {
                // Fix height with content
                this.fixHeight(stepIdx);
                // Trigger "showStep" event
                Util.triggerEvent(this.main, Constants.EVENTS.SHOWSTEP, [selStep, stepIdx, stepDirection, this.getStepPosition(stepIdx)]);
            });

            // Update the current index
            this.currentStepIdx = stepIdx;
            // Set the buttons based on the step
            this.setButtons(stepIdx);
            // Set the progressbar based on the step
            this.setProgressbar(stepIdx);
        });

    // ======================

        // Get the transition effect
        // const transitionEffect = this.options.transition.animation || 'none';
    }

    private loadContent(idx: number, callback: any) {
        if (typeof this.options.contentLoader != "function") { callback(); return; }

        const selPage = this.getStepPage(idx);
        if (!selPage) { callback(); return; }
        // Get step direction
        const stepDirection = this.getStepDirection(idx);
        // Get step position
        const stepPosition = this.getStepPosition(idx);
        // Get next step element
        const selStep = this.getStepAnchor(idx);

        this.options.contentLoader(idx, stepDirection, stepPosition, selStep, (content) => {
            if (content) selPage.html(content);
            callback();
        });
    }

    private getStepPosition(idx: number) {
        if (idx === 0) {
            return 'first';
        } else if (idx === this.steps.length - 1) {
            return 'last';
        }
        return 'middle';
    }

    private setButtons(idx: number) {
        // Previous/Next Button enable/disable based on step
        this.main.find('.' + this.options.styles.buttons.next + ', .' + this.options.styles.buttons.previous).removeClass(this.options.styles.anchorStates.disabled);

        const p = this.getStepPosition(idx);
        if (p === 'first' || p === 'last') {
            const c = (p === 'first') ? '.' + this.options.styles.buttons.previous : '.' + this.options.styles.buttons.next;
            this.main.find(c).addClass(this.options.styles.anchorStates.disabled);
        } else {
            if (this.getShowable(idx, 'next') === null) {
                this.main.find('.' + this.options.styles.buttons.next).addClass(this.options.styles.anchorStates.disabled);
            }

            if (this.getShowable(idx, 'prev') === null) {
                this.main.find('.' + this.options.styles.buttons.previous).addClass(this.options.styles.anchorStates.disabled);
            }
        }
    }

    private setProgressbar(idx: number) {
        const width = this.nav.width()??0;
        const widthPercentage = ((width / this.steps.length) * (idx + 1) / width) * 100;
        // Set css variable for supported themes
        document.documentElement.style.setProperty('--sw-progress-width', widthPercentage + '%');
        if (this.progressbar.length > 0) {
            this.progressbar.find('.' + this.options.styles.progressBar.bar).css('width', widthPercentage + '%');
        }
    }

    // private _loadStepContent(
    //     selPanel: JQuery,
    //     curPanel: JQuery,
    //     transition: TransitionEffect,
    //     stepDirection: string,
    //     callback: () => void
    // ): void {
    //     // Get transition function
    //     const fn = transitions[transition] || transitions['none'];
    //     fn(selPanel, curPanel, stepDirection, this, callback);
    // }

    // private _markPreviousSteps(): void {
    //     for (let i = 0; i < this.currentStepIdx; i++) {
    //         this.steps.eq(i).addClass('done');
    //     }
    // }

    // Public Methods
    public next(): void {
        console.log('SW Next Called');
        this.showStep(this.currentStepIdx + 1);
    }

    public prev(): void {
        console.log('SW Prev Called');
        this.showStep(this.currentStepIdx - 1);
    }

    public reset(): void {
        // Reset all
        this.currentStepIdx = 0;
        this.container.find('.nav-link').removeClass('done active');
        this.showStep(this.currentStepIdx);
    }

    public getOptions(): WizardOptions {
        return this.options;
    }

    public getDirection(): string {
        return this.dir;
    }
}
