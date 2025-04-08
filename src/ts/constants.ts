/**
 * Event namespace for SmartWizard
 */
export const EVENT_NAMESPACE = '.sw';

/**
 * Events used throughout the SmartWizard plugin
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

/**
 * CSS class names used in the SmartWizard
 */
export const CLASSES = {
    MAIN: 'sw',
    NAV: 'nav',
    STEP: 'step',
    ACTIVE: 'active',
    DONE: 'done',
    ERROR: 'error',
    DISABLED: 'disabled',
    HIDDEN: 'hidden',
    LOADING: 'loading',
    CONTENT: 'content',
    PROGRESS: 'progress',
    TOOLBAR: 'toolbar',
};

/**
 * Data attributes used in the SmartWizard
 */
export const DATA_ATTRIBUTES = {
    STEP_INDEX: 'data-step-index',
    STEP_DONE: 'data-step-done',
    STEP_ERROR: 'data-step-error',
    STEP_DISABLED: 'data-step-disabled',
};

/**
 * Selectors used in the SmartWizard
 */
export const SELECTORS = {
    STEP: '.step',
    CONTENT: '.content',
    NAV: '.nav',
    TOOLBAR: '.toolbar',
    NEXT_BUTTON: '.sw-btn-next',
    PREV_BUTTON: '.sw-btn-prev',
    RESET_BUTTON: '.sw-btn-reset',
};