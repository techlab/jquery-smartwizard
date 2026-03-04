import { Wizard } from "./wizard";

// Augment jQuery interface
declare global {
    interface JQuery {
        smartWizard(options?: Partial<WizardOptions>): JQuery;
    }

    namespace JQueryStatic {
        const smartWizard: {
            defaults: WizardOptions;
            transitions: Record<string, TransitionHandler>;
        };
    }
}

// Type definitions for SmartWizard
export type ContentDirection = "ltr" | "rtl";
export type DisplayMode = 'auto' | 'dark' | 'light' | 'none';
export type StepDirection = 'forward' | 'backward';
export type StepPosition = 'first' | 'middle' | 'last';
export type ToolbarPosition = 'none' | 'top' | 'bottom' | 'both';
export type StepState =
    | 'default'    // Default initial state
    | 'active'     // Current step
    | 'completed'  // Successfully visited
    | 'disabled'   // Not allowed to visit
    | 'hidden'    // Conditionally not shown
    | 'error'      // Validation failed
    | 'warning';    // Soft validation warning


/**
 * Represents a step in the wizard
 */
export interface WizardStep {
    index: number;
    element: JQuery;
    content: JQuery;
    state: StepState;
}

// Types for the wizard options
export interface WizardOptions {
    initialStep: number;
    theme: string;
    displayMode: DisplayMode;
    behavior: Behavior;
    navigation: Navigation;
    transition: Transition;
    toolbar: Toolbar;
    keyboardNavigation: KeyboardNavigation;
    localization: Localization;
    styles: Styles;
    stepStates: {
        completed: number[];
        disabled: number[];
        hidden: number[];
        error: number[];
        warning: number[];
    };
    swipeNavigation: SwipeNavigation;
    scrollToView: boolean;
    contentLoader: ContentLoader | null;
}

export interface Behavior {
    autoHeight: boolean;
    useUrlHash: boolean;
    supportBrowserHistory: boolean;
}

export interface Navigation {
    enabled: boolean;
    alwaysClickable: boolean;
    completed: {
        enabled: boolean;
        completeAllPreviousSteps: boolean;
        clearOnBack: boolean;
        clickable: boolean;
    };
}

export interface Transition {
    effect: 'default' | 'fade' | 'slideHorizontal' | 'slideVertical' | 'slideSwing' | 'css' | string;
    speed: number;
    easing: string;
    css: {
        prefix: string;
        forward: {
            show: string;
            hide: string
        };
        backward: {
            show: string;
            hide: string
        };
    }
}

export interface Toolbar {
    position: ToolbarPosition;
    buttons: {
        showNext: boolean;
        showPrevious: boolean;
        showReset?: boolean;
    };
    extraElements: JQuery.htmlString | JQuery.TypeOrArray<JQuery.Node | JQuery<JQuery.Node>>;
}

export interface KeyboardNavigation {
    enabled: boolean;
    keys: {
        left: number[];
        right: number[];
    };
}

export interface SwipeNavigation {
    enabled: boolean;
    threshold: number; // Minimum px distance to trigger a swipe
}

export interface Localization {
    buttons: {
        next: string;
        previous: string;
    }
}

export interface Styles {
    baseClass: string;
    navigation: {
        container: string;
        link: string;
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
        reset: string;
        scroll: string
        scrollNext: string;
        scrollPrevious: string;
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

export type ContentLoader = (
    stepIndex: number,
    stepDirection: StepDirection,
    stepPosition: StepPosition,
    stepElement: JQuery,
    callback: (content: string | JQuery.htmlString | JQuery.Node) => void
) => void;

export interface StepEventArgs {
    stepIndex: number;
    stepElement: JQuery<HTMLElement> | null;
    stepDirection: StepDirection;
    stepPosition: StepPosition;
}
export interface LeaveStepEventArgs extends StepEventArgs {
    nextStepIndex: number;
}

export type TransitionCallback = () => void;
export interface TransitionHandler {
    (
        next: JQuery,
        current: JQuery | null,
        stepDirection: StepDirection,
        wizard: Wizard,
        callback: TransitionCallback
    ): void;
}
