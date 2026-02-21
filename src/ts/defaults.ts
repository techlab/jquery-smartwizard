import { WizardOptions } from './types';

export const defaults: WizardOptions = {
    initialStep: 0, // Initial selected step (0 = first step)
    theme: 'basic', // Theme name, ensure related CSS is included
    displayMode: 'auto', // Display mode: auto (system preference) | dark | light | none (no class applied)
    behavior: {
        autoHeight: true, // Auto-adjust content height
        useUrlHash: false, // Enable step selection via URL hash
        supportBrowserHistory: false // Enable browser history support
    },
    navigation: {
        enabled: true, // Enable/Disable anchor navigation
        alwaysClickable: false, // Allow clicking on any anchor at any time
        completed: {
            enabled: true, // Mark visited steps as completed
            completeAllPreviousSteps: true, // Mark all previous steps as completed when using URL hash
            clearOnBack: false, // Clear completed state when navigating back
            clickable: true // Allow navigation via completed state steps
        }
    },
    transition: {
        effect: 'default', // Transition type: default|fade|slideHorizontal|slideVertical|slideSwing|css
        speed: 400, // Animation speed (ignored if type is 'css')
        easing: '', // Animation easing (requires a jQuery easing plugin, ignored for 'css')
        css: { // Settings for CSS transitions
            prefix: '', // CSS animation prefix
            forward: { show: '', hide: '' }, // Forward animation classes
            backward: { show: '', hide: '' } // Backward animation classes
        }
    },
    toolbar: {
        position: 'bottom', // Toolbar position: none|top|bottom|both
        buttons: {
            showNext: true, // Show/hide Next button
            showPrevious: true // Show/hide Previous button
        },
        extraElements: '' // Additional HTML for toolbar
    },
    keyboardNavigation: {
        enabled: true, // Enable/Disable keyboard navigation (left/right keys)
        keys: {
            left: [37], // Left key codes
            right: [39] // Right key codes
        }
    },
    localization: {
        buttons: {
            next: 'Next',
            previous: 'Previous'
        }
    },
    styles: {
        baseClass: 'sw',
        navigation: {
            container: 'nav',
            link: 'nav-link',
        },
        content: {
            container: 'tab-content',
            panel: 'tab-pane'
        },
        themePrefix: 'sw-theme-',
        anchorStates: {
            default: 'default',
            completed: 'completed',
            active: 'active',
            disabled: 'disabled',
            hidden: 'hidden',
            error: 'error',
            warning: 'warning'
        },
        buttons: {
            base: 'sw-btn',
            next: 'sw-btn-next',
            previous: 'sw-btn-prev',
            reset: 'sw-btn-reset',
            scroll: 'nav-scroll-btn',
            scrollNext: 'nav-scroll-btn-right',
            scrollPrevious: 'nav-scroll-btn-left',
        },
        loader: 'sw-loading',
        progressBar: {
            container: 'progress',
            bar: 'progress-bar'
        },
        toolbar: {
            base: 'toolbar',
            prefix: 'toolbar-'
        }
    },
    stepStates: {
        completed: [], // Completed steps
        disabled: [], // Disabled steps
        hidden: [], // Hidden steps
        error: [], // Steps with errors
        warning: [], // Warning steps
    },
    swipeNavigation: {
        enabled: false, // Enable/Disable swipe navigation on touch devices
        threshold: 50, // Minimum swipe distance in pixels to trigger navigation
    },
    contentLoader: null // Callback function for dynamically loading content
};
