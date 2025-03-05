import { SmartWizard } from './SmartWizard';
import { SmartWizardOptions } from './types';
import { defaults } from './defaults';
import { transitions } from './transitions';

// Augment jQuery interface
declare global {
    interface JQuery {
        smartWizard(options?: Partial<SmartWizardOptions>): JQuery;
    }

    interface JQueryStatic {
        fn: JQuery & {
            smartWizard: {
                (options?: Partial<SmartWizardOptions>): JQuery;
                defaults: SmartWizardOptions;
                transitions: typeof transitions;
            };
        };
    }
}

// Define the plugin
function smartWizard(this: JQuery, options?: Partial<SmartWizardOptions>): JQuery {
    const mergedOptions = { ...defaults, ...options };
    return this.each(function(this: HTMLElement) {
        const $this = $(this);
        let instance = $this.data('smartWizard');

        if (!instance) {
            instance = new SmartWizard($this, mergedOptions);
            $this.data('smartWizard', instance);
        }
    });
}

// Extend jQuery
$.fn.extend({
    smartWizard
});

// Define plugin defaults and transitions
($.fn.smartWizard as any).defaults = defaults;
($.fn.smartWizard as any).transitions = transitions;

export { SmartWizard, SmartWizardOptions };
