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
    WHEEL: `wheel${EVENT_NAMESPACE}`,
    RESIZE: `resize${EVENT_NAMESPACE}`,
    ANIMATIONEND: `animationend${EVENT_NAMESPACE}`,
    ANIMATIONCANCEL: `animationcancel${EVENT_NAMESPACE}`,
    TOUCHSTART: `touchstart${EVENT_NAMESPACE}`,
    TOUCHEND: `touchend${EVENT_NAMESPACE}`,

    // SmartWizard Custom Events
    INITIALIZED: `initialized${EVENT_NAMESPACE}`,
    LOADED: `loaded${EVENT_NAMESPACE}`,
    LEAVESTEP: `leave${EVENT_NAMESPACE}`,
    SHOWSTEP: `shown${EVENT_NAMESPACE}`,
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

/**
 * CSS Custom Properties
 */
export const CSS_PROPERTIES = {
    PROGRESS_PERCENTAGE: '--sw-progress-percentage',
};

/**
 * Selectors used
 */
export const SELECTORS = {
    TOOLBAR_ELM: '.sw-toolbar-elm',
};

/**
 * Data attributes used
 */
export const DATA_ATTRIBUTES = {
    THEME: 'data-theme',
};
