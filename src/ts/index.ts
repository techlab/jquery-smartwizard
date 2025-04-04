import { WizardOptions } from './types';
import { SmartWizard } from './SmartWizard';
import { transitions } from './transitions';

// Augment jQuery interface
declare global {
    interface JQuery {
        smartWizard(options?: Partial<WizardOptions>): JQuery;
    }

    // interface JQueryStatic {
    //     fn: JQuery & {
    //         smartWizard: {
    //             (options?: Partial<WizardOptions>): JQuery;
    //             defaults: WizardOptions;
    //             transitions: typeof transitions;
    //         };
    //     };
    // }
}

// Define the plugin
function smartWizard(this: JQuery, options?: Partial<WizardOptions>): JQuery | undefined {
    if (options === undefined || typeof options === 'object') {
        return this.each(function() {
            if (!$.data(this, "smartWizard")) {
                $.data(this, "smartWizard", new SmartWizard($(this), options));
            }
        });
    } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
        let instance = $.data(this[0], 'smartWizard');

        if (options === 'destroy') {
            $.data(this, 'smartWizard', null);
        }

        if (instance instanceof SmartWizard && typeof instance[options] === 'function') {
            return (instance[options] as Function).apply(instance, Array.prototype.slice.call(arguments, 1));
        } else {
            return this;
        }
    }
}

// Extend jQuery
$.fn.extend({
    smartWizard
});

// Define plugin defaults and transitions
($.fn.smartWizard as any).transitions = transitions;

export { SmartWizard };
