import { WizardOptions, StepEventArgs, LeaveStepEventArgs, StepDirection, ContentDirection, StepPosition } from './types';
import { transitions } from './transitions';
import { defaults } from './defaults';
import * as Util from './util';
import * as Constants from './constants';

export class Wizard {
    private options: WizardOptions;
    private readonly main: JQuery<HTMLElement>;
    private container!: JQuery<HTMLElement>;
    private nav!: JQuery<HTMLElement>;
    private steps!: JQuery<HTMLElement>;
    private pages!: JQuery<HTMLElement>;
    private progressbar!: JQuery<HTMLElement>;
    private contentDirection!: ContentDirection;
    private isInitialized: boolean = false;
    private currentStepIndex: number = -1;

    constructor(element: JQuery<HTMLElement>, options?: Partial<WizardOptions>) {
        // Merge user settings with default
        this.options = { ...defaults, ...options };
        // Main container element
        this.main = $(element);

        // Initial setup
        this.setup();
        // Initialize
        this.init();

        // Load wizard asynchronously
        requestAnimationFrame(() => {
            this.load();
        });
    }

    private setup(): void {
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
        this.contentDirection = Util.getContentDirection(this.main);
        this.contentDirection ?? Util.setContentDirection(this.main, this.contentDirection)

        // Initial wizard index
        this.currentStepIndex = -1;
        // Is initialiazed
        this.isInitialized = false;
    }

    private init(): void {
        // Set elements
        this.setElements();
        // Add toolbar
        this.setToolbar();
        // Set anchor
        this.setNav();

        // Remove Skip if already init
        if (this.isInitialized === true) return;

        // Assign plugin events
        this.setEvents();

        // Trigger the initialized event
        Util.triggerEvent(this.main, Constants.EVENTS.INITIALIZED);

        this.isInitialized = true;
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
        this.currentStepIndex = -1;

        // Get the initial step index
        const idx = this.getInitialStep();

        // Mark any previous steps as completed
        if (idx > 0 && this.options.navigation.completed.enabled && this.options.navigation.completed.completeAllPreviousSteps) {
            this.steps.slice(0, idx).addClass(this.options.styles.anchorStates.completed);
        }

        // Show the initial step
        this.showStep(idx);
        // Trigger the loaded event
        Util.triggerEvent(this.main, Constants.EVENTS.LOADED);
    }

    private getInitialStep(): number {
        // Determine target step from hash if enabled
        const hash = this.options.behavior.useUrlHash ? Util.getUrlHash() : null;

        // Determine initial step index
        const hashIndex = hash ? this.getStepByAnchor(hash) : null;
        const initialIndex = hashIndex ?? this.options.initialStep;

        // Find the first showable step starting from the initial index
        const showableIndex = this.getShowable(initialIndex - 1, 'forward');

        // If invalid or not showable, fallback to the first showable step
        return showableIndex ?? (initialIndex > 0 ? this.getShowable(-1, 'forward') ?? 0 : initialIndex);
    }

    private setElements(): void {
        // Set the main element classes including theme css
        this.main.removeClass((_i, className) => {
            return (className.match(new RegExp('(^|\\s)' + this.options.styles.themePrefix + '\\S+', 'g')) || []).join(' ');
        }).addClass(this.options.styles.baseClass + ' ' + this.options.styles.themePrefix + this.options.theme);

        // Set justify option
        this.main.toggleClass(this.options.styles.navigation.justified, this.options.navigation.justified);
    }

    private setEvents(): void {
        // Anchor click event
        this.steps.on(Constants.EVENTS.CLICK, (e) => {
            e.preventDefault();
            if (this.options.navigation.enabled !== true) {
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
            } else if (targetElm.hasClass(this.options.styles.buttons.scrollNext)) {
                e.preventDefault();
                this.scrollAnchor('right');
            } else if (targetElm.hasClass(this.options.styles.buttons.scrollPrevious)) {
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
            if (this.options.behavior.supportBrowserHistory !== true) {
                return;
            }
            const idx = this.getURLHashIndex();
            if (idx !== false && this.isShowable(this.steps.eq(idx))) {
                e.preventDefault();
                this.showStep(idx);
            }
        });

        // Fix content height on window resize
        $(window).on(Constants.EVENTS.RESIZE, () => {
            this.fixHeight(this.currentStepIndex);
        });
    }

    private setNav(): void {
        // Set the anchor default style
        if (this.options.navigation.alwaysClickable !== true || this.options.navigation.enabled !== true) {
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

    private setAnchor(stepIdx: number) {
        // Current step anchor > Remove other classes and add done class
        if (this.currentStepIndex !== null && this.currentStepIndex >= 0) {
            let removeCss = this.options.styles.anchorStates.active;
            let addCss = '';

            if (this.options.navigation.completed.enabled !== false) {
                addCss += this.options.styles.anchorStates.completed;
                if (this.options.navigation.completed.clearOnBack !== false && this.getStepDirection(stepIdx) === 'backward') {
                    removeCss += ' ' + this.options.styles.anchorStates.completed;
                }
            }

            this.steps.eq(this.currentStepIndex).addClass(addCss).removeClass(removeCss);
        }

        // Next step anchor > Remove other classes and add active class
        this.steps.eq(stepIdx).removeClass(this.options.styles.anchorStates.completed).addClass(this.options.styles.anchorStates.active);
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
        const width = this.nav.width() ?? 0;
        const widthPercentage = ((width / this.steps.length) * (idx + 1) / width) * 100;
        // Set css variable for supported themes
        document.documentElement.style.setProperty('--sw-progress-width', widthPercentage + '%');
        if (this.progressbar.length > 0) {
            this.progressbar.find('.' + this.options.styles.progressBar.bar).css('width', widthPercentage + '%');
        }
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
        if (this.options.navigation.completed.enabled === false && isDone) {
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

    private getStepByAnchor(hash: string): number | null {
        var elm = this.nav.find("a[href*='" + hash + "']");
        if (elm.length > 0) {
            return this.steps.index(elm);
        }
        return null;
    }

    private setStepStyle(stepIndexes: number[], cssClass: string) {
        $.each(stepIndexes, (_i, n: any) => {
            this.steps.eq(n).addClass(cssClass);
        });
    }

    private createAnchorScroll() {
        // Remove existing scroll buttons if any
        this.nav.find(this.options.styles.buttons.scroll).remove();

        // Check if the nav bar is scrollable
        const navElement = this.nav.get(0);
        if (!navElement) return;

        const isScrollable = navElement.scrollWidth > navElement.clientWidth;

        // Only add scroll buttons if the nav bar is scrollable
        if (!isScrollable) return;

        // Create the scroll buttons
        const btnNext = $('<button></button>').addClass(this.options.styles.buttons.scroll + ' ' + this.options.styles.buttons.scrollNext).attr('type', 'button');
        const btnPrevious = $('<button></button>').addClass(this.options.styles.buttons.scroll + ' ' + this.options.styles.buttons.scrollPrevious).attr('type', 'button');
        btnNext.height(this.nav.height() ?? 0);
        btnPrevious.height(this.nav.height() ?? 0);
        return this.nav.append(btnPrevious, btnNext);
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
        let buttonArray = [];
        if (this.options.toolbar.buttons.showPrevious !== false) {
            buttonArray.push($('<button></button>').text(this.options.localization.buttons.previous).addClass('btn ' + this.options.styles.buttons.previous + ' ' + this.options.styles.buttons.base).attr('type', 'button'));
        }
        if (this.options.toolbar.buttons.showNext !== false) {
            buttonArray.push($('<button></button>').text(this.options.localization.buttons.next).addClass('btn ' + this.options.styles.buttons.next + ' ' + this.options.styles.buttons.base).attr('type', 'button'));
        }
        if (buttonArray.length > 0) {
            toolbar.append(...buttonArray);
        }
        return toolbar.append(this.options.toolbar.extraElements);
    }

    private getURLHashIndex() {
        if (this.options.behavior.useUrlHash) {
            // Get step number from url hash if available
            var hash = Util.getUrlHash();
            if (hash.length > 0) {
                var elm = this.nav.find("a[href*='" + hash + "']");
                if (elm.length > 0) {
                    return this.steps.index(elm);
                }
            }
        }
        return false;
    }

    private navigate(dir: string) {
        this.showStep(this.getShowable(this.currentStepIndex, dir));
    }

    private scrollAnchor(dir: string) {
        let scrollLeft = this.nav.scrollLeft() ?? 0;
        if (dir == 'left') {
            if (scrollLeft == 0) return;
            scrollLeft = scrollLeft - 200;
        } else {
            // const maxScrollLeft = this.nav.get(0).scrollWidth - this.nav.width();
            const navWidth = this.nav.width() ?? 0;
            const scrollWidth = this.nav?.get(0)?.scrollWidth ?? 0;
            if (scrollLeft + navWidth >= scrollWidth) return;
            scrollLeft = scrollLeft + 200;
        }

        if (Util.isFunction(this.nav.animate)) {
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

        const scrollLeft = this.nav.scrollLeft() ?? 0;
        const scrollWidth = this.nav?.get(0)?.scrollWidth ?? 0;
        const width = this.nav.outerWidth() ?? 0;
        if (width < scrollWidth) {
            hasScroll = true;
        }

        $(this.options.styles.buttons.scroll).toggle(hasScroll);
        if (!hasScroll) return;

        if (scrollLeft > 0) {
            canScrollLeft = true;
        }
        if (Math.ceil(width + scrollLeft) < scrollWidth) {
            canScrollRight = true;
        }
        $(this.options.styles.buttons.scrollPrevious).toggle(canScrollLeft);
        $(this.options.styles.buttons.scrollNext).toggle(canScrollRight);
    }

    private keyNav(e: any) {
        if (!this.options.keyboardNavigation.enabled) {
            return;
        }

        // Keyboard navigation
        if ($.inArray(e.which, this.options.keyboardNavigation.keys.left) > -1) {
            // left
            this.navigate('prev');
            e.preventDefault();
        } else if ($.inArray(e.which, this.options.keyboardNavigation.keys.right) > -1) {
            // right
            this.navigate('next');
            e.preventDefault();
        } else {
            return; // exit this handler for other keys
        }
    }

    private getStepDirection(stepIdx: number): StepDirection {
        return stepIdx > this.currentStepIndex ? "forward" : "backward";
    }

    private getStepAnchor(stepIdx: number): JQuery<HTMLElement> | null {
        if (stepIdx == null || stepIdx == -1) return null;
        return this.steps.eq(stepIdx) ?? null;
    }

    private getStepPage(idx: number): JQuery<HTMLElement> | null {
        if (idx == null || idx == -1) return null;
        return this.pages.eq(idx) ?? null;
    }

    private transit(next: JQuery, current: JQuery | null, stepDirection: StepDirection, callback: any) {
        Util.stopAnimations(this.pages, this.container);

        let doTransit = transitions[this.options.transition.effect] ?? null;
        doTransit = Util.isFunction(doTransit) ? doTransit : transitions['default'];
        doTransit(next, current, stepDirection, this, callback);
    }

    private fixHeight(idx: number): void {
        if (this.options.behavior.autoHeight === false) return;
        const elm = this.getStepPage(idx);
        if (elm == null) return;
        // Auto adjust height of the container
        const contentHeight = $(elm).outerHeight() ?? 0;
        if (Util.isFunction(this.container.finish) && Util.isFunction(this.container.animate) && contentHeight > 0) {
            this.container.finish().animate({ height: contentHeight }, this.options.transition.speed);
        } else {
            this.container.css({ height: contentHeight > 0 ? contentHeight : 'auto' });
        }
    }

    private showStep(stepIdx: number): void {
        if (stepIdx === -1 || stepIdx === null) return;
        // If current step is requested again, skip
        if (stepIdx == this.currentStepIndex) return;
        // If step not found, skip
        if (!this.steps.eq(stepIdx)) return;
        // If it is a disabled step, skip
        if (!this.isEnabled(this.steps.eq(stepIdx))) return;
        // Get the direction of navigation
        const stepDirection = this.getStepDirection(stepIdx);

        if (this.currentStepIndex !== -1) {
            const leaveStepEventArgs: LeaveStepEventArgs = {
                stepIndex: this.currentStepIndex,
                nextStepIndex: stepIdx,         // The step being shown/left
                stepElement: this.getStepAnchor(this.currentStepIndex),  // DOM element of the step
                stepDirection: stepDirection, // or custom enum
                stepPosition: this.getStepPosition(stepIdx), // optional helper classification
            };

            // Trigger "leaveStep" event
            if (Util.triggerEvent(this.main, Constants.EVENTS.LEAVESTEP, leaveStepEventArgs) === false) {
                return;
                // TODO : Fix this
            }
        }

        // Load content
        this.loadContent(stepIdx, () => {
            // Get step to show element
            const selStep = this.getStepAnchor(stepIdx);
            // Change the url hash to new step
            selStep?.attr("href") ?? Util.setUrlHash(selStep?.attr("href") ?? '');
            // Update controls
            this.setAnchor(stepIdx);
            // Scroll the element into view
            selStep && Util.scrollToView(selStep);

            // Get current step element
            const curPage = this.getStepPage(this.currentStepIndex);
            // Get next step element
            const selPage = this.getStepPage(stepIdx);
            if (selPage == null) return;
            // transit the step
            this.transit($(selPage), curPage ? $(curPage) : null, stepDirection, () => {
                // Fix height with content
                this.fixHeight(stepIdx);
                // Trigger "showStep" event
                const stepEventArgs: StepEventArgs = {
                    stepIndex: stepIdx,
                    stepElement: selStep,
                    stepDirection: stepDirection,
                    stepPosition: this.getStepPosition(stepIdx),
                };
                Util.triggerEvent(this.main, Constants.EVENTS.SHOWSTEP, stepEventArgs);
            });

            // Update the current index
            this.currentStepIndex = stepIdx;
            // Set the buttons based on the step
            this.setButtons(stepIdx);
            // Set the progressbar based on the step
            this.setProgressbar(stepIdx);
        });
    }

    private loadContent(idx: number, callback: any) {
        if (!this.options.contentLoader || !Util.isFunction(this.options.contentLoader)) { callback(); return; }

        let selPage = this.getStepPage(idx);
        if (!selPage) { callback(); return; }
        selPage = $(selPage);
        // Get step direction
        const stepDirection = this.getStepDirection(idx);
        // Get step position
        const stepPosition = this.getStepPosition(idx);
        // Get next step element
        let selStep = this.getStepAnchor(idx);
        if (selStep == null) { callback(); return; }
        selStep = $(selStep);

        this.options.contentLoader(idx, stepDirection, stepPosition, selStep, (content) => {
            if (content) selPage.html(content);
            callback();
        });
    }

    private getStepPosition(idx: number): StepPosition {
        if (idx === 0) {
            return 'first';
        } else if (idx === this.steps.length - 1) {
            return 'last';
        }
        return 'middle';
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

    private changeState(stepArray: number[], state: string, addOrRemove: boolean) {
        // addOrRemove: true => Add, otherwise remove 
        addOrRemove = (addOrRemove !== false) ? true : false;

        let css = '';
        if (state == 'default') {
            css = this.options.styles.anchorStates.default;
        } else if (state == 'active') {
            css = this.options.styles.anchorStates.active;
        } else if (state == 'done') {
            css = this.options.styles.anchorStates.completed;
        } else if (state == 'disable') {
            css = this.options.styles.anchorStates.disabled;
        } else if (state == 'hidden') {
            css = this.options.styles.anchorStates.hidden;
        } else if (state == 'error') {
            css = this.options.styles.anchorStates.error;
        } else if (state == 'warning') {
            css = this.options.styles.anchorStates.warning;
        }

        $.each(stepArray, (_i, n) => {
            this.steps.eq(n).toggleClass(css, addOrRemove);
        });
    }

    // PUBLIC FUNCTIONS

    goToStep(stepIndex: number, force: boolean) { // TODO: Rename to show
        force = force !== false ? true : false;
        if (force !== true && !this.isShowable(this.steps.eq(stepIndex))) {
            return;
        }

        // Mark any previous steps done
        if (force === true && stepIndex > 0 && this.options.navigation.completed.enabled && this.options.navigation.completed.completeAllPreviousSteps) {
            this.steps.slice(0, stepIndex).addClass(this.options.styles.anchorStates.completed);
        }

        this.showStep(stepIndex);
    }

    public next(): void {
        this.navigate('next');
    }

    public prev(): void {
        this.navigate('prev');
    }

    public reset(): void {
        // Clear css from steps except default, hidden and disabled
        this.steps.removeClass([
            this.options.styles.anchorStates.completed,
            this.options.styles.anchorStates.active,
            this.options.styles.anchorStates.error,
            this.options.styles.anchorStates.warning
        ]);

        // Reset all
        Util.setUrlHash('#');
        this.init();
        this.load();
    }

    public setState(stepArray: number[], state: string) {
        this.changeState(stepArray, state, true);
    }

    public unsetState(stepArray: number[], state: string) {
        this.changeState(stepArray, state, false);
    }

    public setOptions(options: Partial<WizardOptions>) {
        this.options = { ...this.options, ...options };
        this.init();
    }

    public getOptions(): WizardOptions {
        return this.options;
    }

    public getContentDirection(): ContentDirection {
        return this.contentDirection || 'ltr';
    }

    public getCurrentIndex(): number {
        return this.currentStepIndex;
    }

    public getStepInfo() {
        return {
            currentStep: this.currentStepIndex ? this.currentStepIndex : 0,
            totalSteps: this.steps ? this.steps.length : 0
        };
    }

    public loader(state: string) {
        this.main.toggleClass(this.options.styles.loader, (state === "show"));
    }

    public adjustHeight() {
        this.fixHeight(this.currentStepIndex);
    }

    public resetHeight() {
        const elm = this.getStepPage(0);
        if (elm == null) return;
        const contentHeight = $(elm).outerHeight() ?? 'auto';
        this.container.css({ height: contentHeight });
    }

    public getWidth(): number {
        return this.container.width() ?? 0;
    }
}
