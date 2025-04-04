import { WizardOptions } from './types';

export const defaults: WizardOptions = {
    initialStep: 0, // Initial selected step (0 = first step)
    theme: {
        name: 'basic' // Theme name, ensure related CSS is included
    },
    behavior: {
        autoAdjustHeight: true, // Auto-adjust content height
        backButtonSupport: true, // Enable browser back button support
        enableUrlHashNavigation: true // Enable step selection via URL hash
    },
    transition: {
        type: 'none', // Transition type: none|fade|slideHorizontal|slideVertical|slideSwing|css
        speed: 400, // Animation speed (ignored if type is 'css')
        easing: '', // Animation easing (requires a jQuery easing plugin, ignored for 'css')
        css: {
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
        extraHtml: '' // Additional HTML for toolbar
    },
    navigation: {
        enableAnchors: true, // Enable/Disable anchor navigation
        alwaysClickable: false, // Allow clicking on any anchor at any time
        justified: true, // Navigation menu justification (true/false)
        completedState: {
            enabled: true, // Mark visited steps as completed
            markPreviousAsCompleted: true, // Mark all previous steps as completed when using URL hash
            clearOnBack: false, // Clear completed state when navigating back
            allowCompletedStateNavigation: true // Allow navigation via completed state steps
        }
    },
    keyboardShortcuts: {
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
            justified: 'sw-justified'
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
            previous: 'sw-btn-prev'
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
        disabled: [], // Disabled steps
        error: [], // Steps with errors
        warning: [], // Warning steps
        hidden: [] // Hidden steps
    },
    contentLoader: null // Callback function for dynamically loading content
};
