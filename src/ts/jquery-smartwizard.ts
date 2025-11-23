import { WizardOptions } from './types';
import { Wizard } from './wizard';
import { transitions } from './transitions';



// Define the plugin
function smartWizard(this: JQuery, options?: Partial<WizardOptions>): JQuery | undefined {
    if (options === undefined || typeof options === 'object') {
        return this.each(function () {
            if (!$.data(this, "smartWizard")) {
                $.data(this, "smartWizard", new Wizard($(this), options));
            }
        });
    } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
        const instance = $.data(this[0], 'smartWizard');

        if (options === 'destroy') {
            $.data(this, 'smartWizard', null);
        }

        if (instance instanceof Wizard && typeof instance[options] === 'function') {
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

export default Wizard;
