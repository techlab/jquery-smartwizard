import { WizardOptions, StepEventArgs, LeaveStepEventArgs, StepDirection, ContentDirection, StepPosition, ToolbarPosition } from './types';
import { transitions } from './transitions';
import { defaults } from './defaults';
import * as Util from './util';
import { CSS_PROPERTIES, SELECTORS, STEP_DIRECTION, CONTENT_DIRECTION, STEP_POSITION, TOOLBAR_POSITION, EVENTS, DATA_ATTRIBUTES } from './constants';

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
    private touchStartX: number = 0;
    private touchStartY: number = 0;

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
        Util.triggerEvent(this.main, EVENTS.INITIALIZED);

        this.isInitialized = true;
    }

    private load(): void {
        // Clean the elements
        this.pages.hide();

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
        Util.triggerEvent(this.main, EVENTS.LOADED);
    }

    private getInitialStep(): number {
        // Determine target step from hash if enabled
        let hashIndex = null;
        if (this.options.behavior.useUrlHash) {
            const hash = Util.getUrlHash();
            hashIndex = hash ? this.getStepByAnchor(hash) : null;
        }

        // Determine initial step index
        const initialIndex = hashIndex ?? this.options.initialStep;

        // Find the first showable step starting from the initial index
        const showableIndex = this.getShowable(initialIndex - 1, STEP_DIRECTION.Forward);

        // If invalid or not showable, fallback to the first showable step
        return showableIndex ?? (initialIndex > 0 ? this.getShowable(-1, STEP_DIRECTION.Forward) ?? 0 : initialIndex);
    }

    private setElements(): void {
        // Set the main element classes including theme css
        this.main.removeClass((_i, className) => {
            return (className.match(new RegExp('(^|\\s)' + this.options.styles.themePrefix + '\\S+', 'g')) || []).join(' ');
        }).addClass(this.options.styles.baseClass + ' ' + this.options.styles.themePrefix + this.options.theme);

        // Set display mode
        this.setDisplayMode();
    }

    private setDisplayMode(): void {
        const mode = this.options.displayMode;

        // Remove existing data-theme attribute
        this.main.removeAttr(DATA_ATTRIBUTES.THEME);

        if (mode === 'none') {
            // Do nothing - let user manage display mode manually
            return;
        }

        if (mode === 'dark') {
            this.main.attr(DATA_ATTRIBUTES.THEME, 'dark');
        } else if (mode === 'light') {
            this.main.attr(DATA_ATTRIBUTES.THEME, 'light');
        } else if (mode === 'auto') {
            // Auto-detect system color scheme preference
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.main.attr(DATA_ATTRIBUTES.THEME, prefersDark ? 'dark' : 'light');

            // Listen for changes in color scheme preference
            if (window.matchMedia) {
                const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                const handleChange = (e: MediaQueryListEvent) => {
                    this.main.attr(DATA_ATTRIBUTES.THEME, e.matches ? 'dark' : 'light');
                };

                // Modern browsers
                if (mediaQuery.addEventListener) {
                    mediaQuery.addEventListener('change', handleChange);
                } else if (mediaQuery.addListener) {
                    // Legacy browsers
                    mediaQuery.addListener(handleChange);
                }
            }
        }
    }

    private setEvents(): void {
        // Anchor click event
        this.steps.on(EVENTS.CLICK, (e) => {
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
        this.main.on(EVENTS.CLICK, (e) => {
            const targetElm = $(e.target);
            if (targetElm.hasClass(this.options.styles.buttons.next)) {
                e.preventDefault();
                this.navigate(STEP_DIRECTION.Forward);
            } else if (targetElm.hasClass(this.options.styles.buttons.previous)) {
                e.preventDefault();
                this.navigate(STEP_DIRECTION.Backward);
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
        $(this.nav).on(EVENTS.SCROLLEND, () => {
            this.scrollCheck();
        });

        // Redirect vertical wheel scroll to horizontal on the nav bar
        this.nav.on(EVENTS.WHEEL, (e: JQuery.TriggeredEvent) => {
            const navEl = this.nav.get(0);
            if (!navEl || navEl.scrollWidth <= navEl.clientWidth) return;
            const originalEvent = e.originalEvent as WheelEvent;
            if (!originalEvent || originalEvent.deltaY === 0) return;
            e.preventDefault();
            navEl.scrollLeft += originalEvent.deltaY;
        });

        // Keyboard navigation event            
        $(document).on(EVENTS.KEYUP, (e) => {
            this.keyNav(e);
        });

        // Back/forward browser button event
        $(window).on(EVENTS.HASHCHANGE, (e) => {
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
        $(window).on(EVENTS.RESIZE, () => {
            this.fixHeight(this.currentStepIndex);
        });

        // Swipe navigation on touch devices
        this.container.on(EVENTS.TOUCHSTART, (e: JQuery.TriggeredEvent) => {
            const touch = (e.originalEvent as TouchEvent).touches[0];
            this.touchStartX = touch.clientX;
            this.touchStartY = touch.clientY;
        });

        this.container.on(EVENTS.TOUCHEND, (e: JQuery.TriggeredEvent) => {
            if (!this.options.swipeNavigation.enabled) return;
            const touch = (e.originalEvent as TouchEvent).changedTouches[0];
            const deltaX = touch.clientX - this.touchStartX;
            const deltaY = touch.clientY - this.touchStartY;
            // Ignore mostly-vertical swipes
            if (Math.abs(deltaX) < Math.abs(deltaY)) return;
            const { threshold } = this.options.swipeNavigation;
            if (deltaX < -threshold) {
                this.navigate(STEP_DIRECTION.Forward);
            } else if (deltaX > threshold) {
                this.navigate(STEP_DIRECTION.Backward);
            }
        });
    }

    private setNav(): void {
        // Clear other states from the steps
        this.steps.removeClass([
            this.options.styles.anchorStates.completed,
            this.options.styles.anchorStates.active,
            this.options.styles.anchorStates.default,
            this.options.styles.anchorStates.disabled,
            this.options.styles.anchorStates.error,
            this.options.styles.anchorStates.warning,
            this.options.styles.anchorStates.hidden
        ]);

        // Set the anchor default style
        if (this.options.navigation.alwaysClickable !== true || this.options.navigation.enabled !== true) {
            this.steps.addClass(this.options.styles.anchorStates.default);
        }

        // Completed steps
        this.setStepStyle(this.options.stepStates.completed, this.options.styles.anchorStates.completed);
        // Disabled steps
        this.setStepStyle(this.options.stepStates.disabled, this.options.styles.anchorStates.disabled);
        // Warning steps
        this.setStepStyle(this.options.stepStates.warning, this.options.styles.anchorStates.warning);
        // Error steps
        this.setStepStyle(this.options.stepStates.error, this.options.styles.anchorStates.error);
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
                if (this.options.navigation.completed.clearOnBack !== false && this.getStepDirection(stepIdx) === STEP_DIRECTION.Backward) {
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
        if (p === STEP_POSITION.First || p === STEP_POSITION.Last) {
            const c = (p === STEP_POSITION.First) ? '.' + this.options.styles.buttons.previous : '.' + this.options.styles.buttons.next;
            this.main.find(c).addClass(this.options.styles.anchorStates.disabled);
        } else {
            if (this.getShowable(idx, STEP_DIRECTION.Forward) === null) {
                this.main.find('.' + this.options.styles.buttons.next).addClass(this.options.styles.anchorStates.disabled);
            }

            if (this.getShowable(idx, STEP_DIRECTION.Backward) === null) {
                this.main.find('.' + this.options.styles.buttons.previous).addClass(this.options.styles.anchorStates.disabled);
            }
        }
    }

    private setProgressbar(idx: number) {
        const width = this.nav.width() ?? 0;
        const widthPercentage = (((width / this.steps.length) * (idx + 1) / width) * 100).toFixed(2);
        // Set css variable for supported themes
        document.documentElement.style.setProperty(CSS_PROPERTIES.PROGRESS_PERCENTAGE, widthPercentage + '%');
        if (this.progressbar.length > 0) {
            this.progressbar.find('.' + this.options.styles.progressBar.bar).css('width', widthPercentage + '%');
        }
    }

    private getShowable(idx: number, dir: StepDirection) {
        let si = -1;
        const elmList = (dir == STEP_DIRECTION.Backward) ? $(this.steps.slice(0, idx).get().reverse()) : this.steps.slice(idx + 1);
        // Find the next showable step in the direction
        elmList.each((i, elm) => {
            if (this.isEnabled($(elm))) {
                si = (dir == STEP_DIRECTION.Backward) ? idx - (i + 1) : i + idx + 1;
                return false;
            }
        });
        return si;
    }

    private isShowable(elm: JQuery) {
        if (!this.isEnabled(elm)) {
            return false;
        }

        const isCompleted = elm.hasClass(this.options.styles.anchorStates.completed);
        if (this.options.navigation.completed.enabled === false && isCompleted) {
            return false;
        }

        if (this.options.navigation.completed.clickable === false && isCompleted) {
            return false;
        }

        if (this.options.navigation.alwaysClickable === false && !isCompleted) {
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
        this.nav.find('.' + this.options.styles.buttons.scroll).remove();

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
        this.main.find(SELECTORS.TOOLBAR_ELM).remove();

        const toolbarPosition = this.options.toolbar.position;
        if (toolbarPosition === TOOLBAR_POSITION.None) {
            // Skip right away if the toolbar is not enabled
            return;
        }

        if (toolbarPosition == TOOLBAR_POSITION.Both) {
            this.container.before(this.createToolbar(TOOLBAR_POSITION.Top));
            this.container.after(this.createToolbar(TOOLBAR_POSITION.Bottom));
        } else if (toolbarPosition == TOOLBAR_POSITION.Top) {
            this.container.before(this.createToolbar(TOOLBAR_POSITION.Top));
        } else {
            this.container.after(this.createToolbar(TOOLBAR_POSITION.Bottom));
        }
    }

    private createToolbar(position: ToolbarPosition) {
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

    private navigate(dir: StepDirection) {
        this.showStep(this.getShowable(this.currentStepIndex, dir));
    }

    private scrollAnchor(dir: string) {
        let scrollLeft = this.nav.scrollLeft() ?? 0;
        if (dir == 'left') {
            if (scrollLeft == 0) return;
            scrollLeft = scrollLeft - 200;
        } else {
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

        $(this.options.styles.buttons.scrollPrevious).toggleClass('nav-scroll-btn-visible', canScrollLeft);
        $(this.options.styles.buttons.scrollNext).toggleClass('nav-scroll-btn-visible', canScrollRight);
    }

    private keyNav(e: any) {
        if (!this.options.keyboardNavigation.enabled) {
            return;
        }

        // Keyboard navigation
        if ($.inArray(e.which, this.options.keyboardNavigation.keys.left) > -1) {
            // left
            this.navigate(STEP_DIRECTION.Backward);
            e.preventDefault();
        } else if ($.inArray(e.which, this.options.keyboardNavigation.keys.right) > -1) {
            // right
            this.navigate(STEP_DIRECTION.Forward);
            e.preventDefault();
        } else {
            return; // exit this handler for other keys
        }
    }

    private getStepDirection(stepIdx: number): StepDirection {
        return stepIdx > this.currentStepIndex ? STEP_DIRECTION.Forward : STEP_DIRECTION.Backward;
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
        const contentHeight = $(elm).outerHeight(true) ?? 0;
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
            if (Util.triggerEvent(this.main, EVENTS.LEAVESTEP, leaveStepEventArgs) === false) {
                return;
            }
        }

        // Load content
        this.loadContent(stepIdx, () => {
            // Get step to show element
            const selStep = this.getStepAnchor(stepIdx);
            // Change the url hash to new step
            if (this.options.behavior.useUrlHash && this.options.behavior.supportBrowserHistory) {
                const hash = selStep?.attr("href") ?? '';
                if (hash) {
                    Util.setUrlHash(hash);
                }
            }
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
                Util.triggerEvent(this.main, EVENTS.SHOWSTEP, stepEventArgs);
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
            return STEP_POSITION.First;
        } else if (idx === this.steps.length - 1) {
            return STEP_POSITION.Last;
        }
        return STEP_POSITION.Middle;
    }

    private changeState(stepArray: number[], state: string, addOrRemove: boolean) {
        // addOrRemove: true => Add, otherwise remove 
        addOrRemove = (addOrRemove !== false) ? true : false;

        let css = '';
        if (state == 'default') {
            css = this.options.styles.anchorStates.default;
        } else if (state == 'active') {
            css = this.options.styles.anchorStates.active;
        } else if (state == 'completed') {
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

    goToStep(stepIndex: number, force: boolean) {
        force = force === true ? true : false;
        if (!force && !this.isShowable(this.steps.eq(stepIndex))) {
            return;
        }

        // Mark any previous steps done
        if (force && stepIndex > 0 && this.options.navigation.completed.enabled && this.options.navigation.completed.completeAllPreviousSteps) {
            this.steps.slice(0, stepIndex).addClass(this.options.styles.anchorStates.completed);
        }

        this.showStep(stepIndex);
    }

    public next(): void {
        this.navigate(STEP_DIRECTION.Forward);
    }

    public prev(): void {
        this.navigate(STEP_DIRECTION.Backward);
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
        if (this.options.behavior.useUrlHash && this.options.behavior.supportBrowserHistory) {
            Util.setUrlHash('#');
        }
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
        this.load();
    }

    public getOptions(): WizardOptions {
        return this.options;
    }

    public getContentDirection(): ContentDirection {
        return this.contentDirection || CONTENT_DIRECTION.LeftToRight;
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
        const contentHeight = $(elm).outerHeight(true) ?? 'auto';
        this.container.css({ height: contentHeight });
    }

    public getWidth(): number {
        return this.container.width() ?? 0;
    }
}
