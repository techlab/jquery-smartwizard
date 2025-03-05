import { SmartWizardOptions } from './types';

export const defaults: SmartWizardOptions = {
    selected: 0,
    theme: 'basic',
    justified: true,
    darkMode: false,
    autoAdjustHeight: true,
    cycleSteps: false,
    backButtonSupport: true,
    enableUrlHash: true,
    transition: {
        animation: 'none',
        speed: 200
    },
    toolbar: {
        position: 'bottom',
        showNextButton: true,
        showPreviousButton: true,
        extraHtml: ''
    },
    anchor: {
        enableNavigation: true,
        enableNavigationAlways: false,
        markDoneStep: true,
        unDoneOnBackNavigation: false,
        enableDoneState: true,
        markAllPreviousStepsAsDone: true
    },
    keyboard: {
        keyNavigation: true,
        keyLeft: 37,
        keyRight: 39
    },
    lang: {
        next: 'Next',
        previous: 'Previous'
    },
    style: {
        mainCss: 'sw',
        navCss: 'nav nav-tabs step-anchor',
        pageCss: 'tab-pane step-content',
        toolbarCss: 'toolbar toolbar-bottom'
    }
};
