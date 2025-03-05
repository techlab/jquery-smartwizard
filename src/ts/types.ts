// Type definitions for SmartWizard
export type TransitionEffect = 'none' | 'fade' | 'slideHorizontal' | 'slideVertical' | 'slideSwing';

export interface TransitionOptions {
    animation: TransitionEffect;
    speed: number;
}

export interface ToolbarOptions {
    position: 'none' | 'top' | 'bottom' | 'both';
    showNextButton: boolean;
    showPreviousButton: boolean;
    extraHtml?: string;
}

export interface AnchorOptions {
    enableNavigation: boolean;
    enableNavigationAlways: boolean;
    markDoneStep: boolean;
    unDoneOnBackNavigation: boolean;
    enableDoneState: boolean;
    markAllPreviousStepsAsDone: boolean;
}

export interface KeyboardOptions {
    keyNavigation: boolean;
    keyLeft: number;
    keyRight: number;
}

export interface LangOptions {
    next: string;
    previous: string;
}

export interface StyleOptions {
    mainCss: string;
    navCss: string;
    pageCss: string;
    toolbarCss: string;
}

export interface SmartWizardOptions {
    selected: number;
    theme: string;
    justified: boolean;
    darkMode?: boolean;
    autoAdjustHeight: boolean;
    cycleSteps: boolean;
    backButtonSupport: boolean;
    enableUrlHash: boolean;
    transition: TransitionOptions;
    toolbar: ToolbarOptions;
    anchor: AnchorOptions;
    keyboard: KeyboardOptions;
    lang: LangOptions;
    style: StyleOptions;
    direction?: 'ltr' | 'rtl';
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
