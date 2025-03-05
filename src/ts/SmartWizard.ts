import { SmartWizardOptions, TransitionEffect, StepEventArgs } from './types';
import { transitions } from './transitions';
import { defaults } from './defaults';

export class SmartWizard {
    private readonly options: SmartWizardOptions;
    private readonly container: JQuery;
    private readonly steps: JQuery;
    private readonly nav: JQuery;
    private currentStepIdx: number;
    private isInitialized: boolean;
    private main: JQuery;
    private progressbar: JQuery;
    private pages: JQuery;
    private dir: string;

    constructor(element: JQuery, options?: Partial<SmartWizardOptions>) {
        this.options = { ...defaults, ...options };
        this.container = element;
        this.nav = this.container.find('.nav');
        this.steps = this.nav.find('.nav-link');
        this.currentStepIdx = this.options.selected;
        this.isInitialized = false;
        this.main = this.container;
        this.progressbar = this.container.find('.progress-bar');
        this.pages = this.container.find('.tab-pane');
        this.dir = this.container.css('direction');

        this.init();
    }

    private init(): void {
        // Set elements
        this._setElements();

        // Add toolbar
        this._setToolbar();

        // Assign plugin events
        this._setEvents();

        this.isInitialized = true;

        // Show the initial step
        this._showStep(this.options.selected);

        if (this.options.selected > 0) {
            this._markPreviousSteps();
        }
    }

    private _setElements(): void {
        // Set the elements
        this.container.addClass('sw');

        this.nav.addClass('nav-tabs step-' + this.options.theme);
        if (this.options.justified === true) {
            this.nav.addClass('nav-justified');
        }
    }

    private _setToolbar(): void {
        // Create the toolbar
        if (this.options.toolbar && this.options.toolbar.position) {
            const toolbarPosition = this.options.toolbar.position;
            const toolbarTemplate = $('<div></div>').addClass('toolbar toolbar-' + toolbarPosition);

            if (this.options.toolbar.showNextButton) {
                toolbarTemplate.append(
                    $('<button></button>').text(this.options.lang.next)
                        .addClass('btn sw-btn-next')
                        .attr('type', 'button')
                );
            }

            if (this.options.toolbar.showPreviousButton) {
                toolbarTemplate.append(
                    $('<button></button>').text(this.options.lang.previous)
                        .addClass('btn sw-btn-prev')
                        .attr('type', 'button')
                );
            }

            if (this.options.toolbar.extraHtml) {
                toolbarTemplate.append(this.options.toolbar.extraHtml);
            }

            this.container.append(toolbarTemplate);
        }
    }

    private _setEvents(): void {
        // Keyboard navigation event
        if (this.options.keyboard.keyNavigation) {
            $(document).keyup((e) => {
                if (e.which === 39) { // Right Arrow
                    this.next();
                }
                else if (e.which === 37) { // Left Arrow
                    this.prev();
                }
            });
        }

        // Back/forward browser button event
        if (this.options.enableUrlHash && window.location.hash) {
            const hash = window.location.hash.substring(1);
            const stepIdx = this.steps.index(this.steps.filter(`[href="#${hash}"]`));
            if (stepIdx > 0) {
                this._showStep(stepIdx);
            }
        }

        // Step click event
        this.steps.on("click", (e) => {
            e.preventDefault();
            if (this.options.anchor.enableNavigation) {
                const elm = $(e.currentTarget);
                const stepIdx = this.steps.index(elm);
                this._showStep(stepIdx);
            }
        });

        // Next button event
        this.container.on("click", ".sw-btn-next", (e) => {
            e.preventDefault();
            this.next();
        });

        // Previous button event
        this.container.on("click", ".sw-btn-prev", (e) => {
            e.preventDefault();
            this.prev();
        });
    }

    private _showStep(stepIdx: number): void {
        const selStep = this.steps.eq(stepIdx);
        const curStep = this.steps.eq(this.currentStepIdx);

        // Get the direction of step navigation
        const stepDirection = stepIdx > this.currentStepIdx ? "forward" : "backward";

        // Get the target step panel
        const href = selStep.attr("href");
        const targetPanel = href ? $(href) : $();
        const curHref = curStep.attr("href");
        const curPanel = curHref ? $(curHref) : $();

        // Change the url hash to new step
        if (this.options.enableUrlHash && href) {
            window.location.hash = href.substring(1);
        }

        const stepInfo: StepEventArgs = {
            direction: stepDirection,
            fromStep: this.currentStepIdx + 1,
            toStep: stepIdx + 1
        };

        // Trigger "leaveStep" event
        if (this.isInitialized && 
            this._triggerEvent("leaveStep", [curStep, stepIdx, stepInfo]) === false) {
            return;
        }

        // Get the transition effect
        const transitionEffect = this.options.transition.animation || 'none';

        this._loadStepContent(targetPanel, curPanel, transitionEffect, stepDirection, () => {
            // Mark the current step as done
            if (this.options.anchor.markDoneStep) {
                curStep.addClass('done');
                if (stepDirection === 'forward') {
                    this._markPreviousSteps();
                }
            }

            // Show the selected step header
            selStep.removeClass('done').addClass('active');
            curStep.removeClass('active');

            // Update the current index
            this.currentStepIdx = stepIdx;

            // Trigger "showStep" event
            this._triggerEvent("showStep", [selStep, this.currentStepIdx, stepInfo]);
        });
    }

    private _loadStepContent(
        selPanel: JQuery,
        curPanel: JQuery,
        transition: TransitionEffect,
        stepDirection: string,
        callback: () => void
    ): void {
        // Get transition function
        const fn = transitions[transition] || transitions['none'];
        fn(selPanel, curPanel, stepDirection, this, callback);
    }

    private _markPreviousSteps(): void {
        for (let i = 0; i < this.currentStepIdx; i++) {
            this.steps.eq(i).addClass('done');
        }
    }

    private _triggerEvent(name: string, params: any[]): boolean {
        // Trigger an event
        const e = $.Event(name);
        this.container.trigger(e, params);
        return e.isDefaultPrevented();
    }

    // Public Methods
    public next(): void {
        this._showStep(this.currentStepIdx + 1);
    }

    public prev(): void {
        this._showStep(this.currentStepIdx - 1);
    }

    public reset(): void {
        // Reset all
        this.currentStepIdx = 0;
        this.container.find('.nav-link').removeClass('done active');
        this._showStep(this.currentStepIdx);
    }

    public getOptions(): SmartWizardOptions {
        return this.options;
    }

    public getDirection(): string {
        return this.options.direction || 'ltr';
    }
}
