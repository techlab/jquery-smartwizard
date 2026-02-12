/**
 * Event namespace
 */
export const EVENT_NAMESPACE = '.sw';

/**
 * Events used on the plugin
 */
export const EVENTS = {
    // DOM Events
    CLICK: `click${EVENT_NAMESPACE}`,
    KEYUP: `keyup${EVENT_NAMESPACE}`,
    HASHCHANGE: `hashchange${EVENT_NAMESPACE}`,
    SCROLLEND: `scrollend${EVENT_NAMESPACE}`,
    RESIZE: `resize${EVENT_NAMESPACE}`,
    ANIMATIONEND: `animationend${EVENT_NAMESPACE}`,
    ANIMATIONCANCEL: `animationcancel${EVENT_NAMESPACE}`,

    // SmartWizard Custom Events
    INITIALIZED: `initialized${EVENT_NAMESPACE}`,
    LOADED: `loaded${EVENT_NAMESPACE}`,
    LEAVESTEP: `leave${EVENT_NAMESPACE}`,
    SHOWSTEP: `shown${EVENT_NAMESPACE}`,
    STEPCHANGE: `stepchange${EVENT_NAMESPACE}`,
    RESET: `reset${EVENT_NAMESPACE}`,
};

export const STEP_DIRECTION = {
    Forward: "forward",
    Backward: "backward",
} as const;

export const CONTENT_DIRECTION = {
    LeftToRight: "ltr",
    RightToLeft: "rtl",
} as const;

export const STEP_POSITION = {
    First: "first",
    Middle: "middle",
    Last: "last",
} as const;

export const TOOLBAR_POSITION = {
    None: "none",
    Top: "top",
    Bottom: "bottom",
    Both: "both",
} as const;

// /**
//  * Selectors used
//  */
// export const SELECTORS = {
//     STEP: '.step',
//     CONTENT: '.content',
//     NAV: '.nav',
//     TOOLBAR: '.toolbar',
//     NEXT_BUTTON: '.sw-btn-next',
//     PREV_BUTTON: '.sw-btn-prev',
//     RESET_BUTTON: '.sw-btn-reset',
// };

// /**
//  * CSS class names used
//  */
// export const CLASSES = {
//     MAIN: 'sw',
//     NAV: 'nav',
//     STEP: 'step',
//     LOADING: 'loading',
//     CONTENT: 'content',
//     PROGRESS: 'progress',
//     TOOLBAR: 'toolbar',
//     STATE_ACTIVE: 'active',
//     STATE_DONE: 'done',
//     STATE_ERROR: 'error',
//     STATE_DISABLED: 'disabled',
//     STATE_HIDDEN: 'hidden',
// };

// /**
//  * Data attributes used
//  */
// export const DATA_ATTRIBUTES = {
//     STEP_INDEX: 'data-step-index',
//     STEP_DONE: 'data-step-done',
//     STEP_ERROR: 'data-step-error',
//     STEP_DISABLED: 'data-step-disabled',
// };

