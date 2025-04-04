const EVENT_KEY = '.sw';
export const EVENTS = {
    // Common Events
    CLICK: 'click' + EVENT_KEY,
    KEYUP: 'keyup' + EVENT_KEY,
    HASHCHANGE: 'hashchange' + EVENT_KEY,
    SCROLLEND: 'scrollend' + EVENT_KEY,
    RESIZE: 'resize' + EVENT_KEY,
    ANIMATIONEND: "animationend" + EVENT_KEY,
    ANIMATIONCANCEL: "animationcancel" + EVENT_KEY,
    // SmartWizard Custom Events
    INITIALIZED: "initialized" + EVENT_KEY,
    LOADED: "loaded" + EVENT_KEY,
    LEAVESTEP: "leave" + EVENT_KEY,
    SHOWSTEP: "shown" + EVENT_KEY,
};