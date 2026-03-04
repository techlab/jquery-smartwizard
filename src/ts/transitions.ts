import { TransitionHandler, TransitionCallback, StepDirection } from './types';
import { Wizard } from './wizard';
import { isFunction } from './util';
import * as Constants from './constants';

export const transitions: Record<string, TransitionHandler> = {
    /**
     * Default transition handler with simple hide/show steps
     */
    default: function (
        next: JQuery,
        current: JQuery | null,
        _stepDirection: StepDirection,
        _wizard: Wizard,
        callback: TransitionCallback
    ): void {
        current && current.hide();
        next.show();
        callback();
    },

    fade: function (
        next: JQuery,
        current: JQuery | null,
        stepDirection: StepDirection,
        wizard: Wizard,
        callback: TransitionCallback
    ): void {
        // Fallback to default transition if fadeOut is not available
        if (!isFunction(next.fadeOut)) { transitions.default(next, current, stepDirection, wizard, callback); return; }

        const { speed, easing } = wizard.getOptions().transition;
        const show = () => next.fadeIn(speed, easing, callback);
        current ? current.fadeOut(speed, easing, show) : show();
    },

    slideHorizontal: function (
        next: JQuery,
        current: JQuery | null,
        stepDirection: StepDirection,
        wizard: Wizard,
        callback: TransitionCallback
    ): void {
        if (!isFunction(next.animate)) { transitions.default(next, current, stepDirection, wizard, callback); return; }

        const { speed, easing } = wizard.getOptions().transition;
        const containerWidth = wizard.getWidth();

        if (wizard.getCurrentIndex() == -1) {
            // Set container height at page load 
            wizard.resetHeight();
        }

        // Horizontal slide
        const show = (element: JQuery<HTMLElement>, initial: number, final: number, complete: any) => {
            element.css({ position: 'absolute', left: initial })
                .show()
                .stop(true)
                .animate({ left: final },
                    speed,
                    easing,
                    complete);
        };

        if (current) {
            const initialCss = current.css(["position", "left"]);
            const final = containerWidth * (stepDirection == 'backward' ? 1 : -1);
            show(current, 0, final, () => {
                current.hide().css(initialCss);
            });
        }

        const initialCss = next.css(["position"]);
        const initial = containerWidth * (stepDirection == 'backward' ? -2 : 1);
        show(next, initial, 0, () => {
            next.css(initialCss);
            callback();
        });
    },

    slideVertical: function (
        next: JQuery,
        current: JQuery | null,
        stepDirection: StepDirection,
        wizard: Wizard,
        callback: TransitionCallback
    ): void {
        if (!isFunction(next.animate)) { transitions.default(next, current, stepDirection, wizard, callback); return; }

        const { speed, easing } = wizard.getOptions().transition;
        const containerWidth = wizard.getWidth();

        if (wizard.getCurrentIndex() == -1) {
            // Set container height at page load 
            wizard.resetHeight();
        }

        // Vertical slide
        const show = (element: JQuery<HTMLElement>, initial: number, final: number, complete: any) => {
            element.css({ position: 'absolute', top: initial })
                .show()
                .stop(true)
                .animate({ top: final },
                    speed,
                    easing,
                    complete);
        };

        if (current) {
            const initialCss = current.css(["position", "top"]);
            const final = containerWidth * (stepDirection == 'backward' ? 1 : -1);
            show(current, 0, final, () => {
                current.hide().css(initialCss);
            });
        }

        const initialCss = next.css(["position"]);
        const initial = containerWidth * (stepDirection == 'backward' ? -2 : 1);
        show(next, initial, 0, () => {
            next.css(initialCss);
            callback();
        });
    },

    slideSwing: function (
        next: JQuery,
        current: JQuery | null,
        stepDirection: StepDirection,
        wizard: Wizard,
        callback: TransitionCallback
    ): void {
        // Fallback to default transition if fadeOut is not available
        if (!isFunction(next.slideDown)) { transitions.default(next, current, stepDirection, wizard, callback); return; }

        const { speed, easing } = wizard.getOptions().transition;
        const show = () => next.slideDown(speed, easing, callback);
        current ? current.slideUp(speed, easing, show) : show();
    },

    css: function (
        next: JQuery,
        current: JQuery | null,
        stepDirection: StepDirection,
        wizard: Wizard,
        callback: TransitionCallback
    ): void {
        const { prefix, forward, backward } = wizard.getOptions().transition.css;
        if (forward.show.length == 0 || backward.show.length == 0) { transitions.default(next, current, stepDirection, wizard, callback); return; }

        // CSS Animation
        const animateCss = (element: JQuery<HTMLElement>, animation: string, complete: any) => {
            if (!animation || animation.length == 0) { complete(); return; }

            // Element must be visible before adding animation classes,
            // otherwise the browser won't run the animation and animationend never fires.
            element.show();

            let called = false;
            const done = (reason?: string) => {
                if (called) return;
                called = true;
                element.removeClass(animation);
                complete(reason);
            };

            element.addClass(animation)
                .one(Constants.EVENTS.ANIMATIONEND, () => done())
                .one(Constants.EVENTS.ANIMATIONCANCEL, () => done('cancel'));
        };

        const show = () => {
            const css = prefix + ' ' + (stepDirection == 'backward' ? backward.show : forward.show);
            animateCss(next, css, () => {
                callback();
            });
        };

        if (current) {
            const css = prefix + ' ' + (stepDirection == 'backward' ? backward.hide : forward.hide);
            animateCss(current, css, () => {
                current.hide();
                show();
            });
        } else {
            show();
        }
    }
};
