// Type definitions for SmartWizard
export type TransitionEffect = 'none' | 'fade' | 'slideHorizontal' | 'slideVertical' | 'slideSwing' | 'css';
export type StepDirection = 'forward' | 'backward';
export type ContentDirection = "ltr" | "rtl";

// Options
export interface TransitionCss {
    prefix: string;
    forward: { show: string; hide: string };
    backward: { show: string; hide: string };
}

export interface Transition {
    type: TransitionEffect;
    speed: number;
    easing: string;
    css: TransitionCss;
}

export interface Toolbar {
    position: 'none' | 'top' | 'bottom' | 'both';
    buttons: {
        showNext: boolean;
        showPrevious: boolean;
    };
    extraHtml: string;
}

export interface Navigation {
    enableAnchors: boolean;
    alwaysClickable: boolean;
    justified: boolean;
    completedState: {
        enabled: boolean;
        markPreviousAsCompleted: boolean;
        clearOnBack: boolean;
        allowCompletedStateNavigation: boolean;
    };
}

export interface KeyboardShortcuts {
    enabled: boolean;
    keys: {
        left: number[];
        right: number[];
    };
}

export interface Localization {
    buttons: {
        next: string;
        previous: string;
    };
}

export interface Styles {
    baseClass: string;
    navigation: {
        container: string;
        link: string;
        justified: string;
    };
    content: {
        container: string;
        panel: string;
    };
    themePrefix: string;
    anchorStates: {
        default: string;
        completed: string;
        active: string;
        disabled: string;
        hidden: string;
        error: string;
        warning: string;
    };
    buttons: {
        base: string;
        next: string;
        previous: string;
    };
    loader: string;
    progressBar: {
        container: string;
        bar: string;
    };
    toolbar: {
        base: string;
        prefix: string;
    };
}

export interface StepStates {
    disabled: number[];
    error: number[];
    warning: number[];
    hidden: number[];
}

export interface WizardOptions {
    /**
     * Initial selected step, 0 = first step
     *
     * @default 0
     */
    initialStep: number;
    /**
     * theme for the wizard, related css need to include for other than default theme
     *
     * @default 'default'
     */
    theme: { name: string };
    behavior: {
        autoAdjustHeight: boolean;
        backButtonSupport: boolean;
        enableUrlHashNavigation: boolean;
    };
    transition: Transition;
    toolbar: Toolbar;
    navigation: Navigation;
    keyboardShortcuts: KeyboardShortcuts;
    localization: Localization;
    styles: Styles;
    stepStates: StepStates;
    contentLoader: ((idx: number, stepDirection: string, stepPosition: string, selStep: JQuery, callback: any) => void) | null;
}

export interface StepEventArgs {
    fromStep: number;
    toStep: number;
    direction: 'forward' | 'backward';
}

export interface TransitionFunction {
    (
        selPage: JQuery,
        curPage: JQuery,
        stepDirection: string,
        wizard: any,
        callback: () => void
    ): void;
}
