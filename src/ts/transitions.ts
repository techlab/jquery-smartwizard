import { TransitionHandler, TransitionCallback, StepDirection } from './types';
import { Wizard } from './wizard';
import { isFunction } from './util';
import * as Constants from './constants';

export const transitions: Record<string, TransitionHandler> = {
    /**
     * Default transition handler with simple hide/show steps
     */
    default: function(
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

    fade: function(
        next: JQuery,
        current: JQuery | null,
        stepDirection: StepDirection,
        wizard: Wizard,
        callback: TransitionCallback
    ): void {
        // Fallback to default transition if fadeOut is not available
        if (!isFunction(next.fadeOut)) { this.default(next, current, stepDirection, wizard, callback); return;  }
        
        const { speed, easing } = wizard.getOptions().transition;
        const show = () => next.fadeIn(speed, easing, callback);
        current ? current.fadeOut(speed, easing, show) : show();
    },

    slideHorizontal: function(
        next: JQuery,
        current: JQuery | null,
        stepDirection: StepDirection,
        wizard: Wizard,
        callback: TransitionCallback
    ): void {
        if (!isFunction(next.animate)) { this.default(next, current, stepDirection, wizard, callback); return;  }
        
        const { speed, easing } = wizard.getOptions().transition;
        const contentDirection = wizard.getContentDirection();
        const containerWidth = wizard.getWidth();

        // TODO: Apply fix
        // if (wizardObj.current_index == -1) {
        //     // Set container height at page load 
        //     wizardObj.container.height(elmToShow.outerHeight());
        // }

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

        // -----
        // const dir = contentDirection === 'rtl' ? 
        //     (stepDirection === 'forward' ? 'right' : 'left') : 
        //     (stepDirection === 'forward' ? 'left' : 'right');
        // const animIn = dir === 'left' ? 'show' : 'show';
        // const animOut = dir === 'left' ? 'hide' : 'hide';

        // current.stop(true).animate({
        //     left: animOut
        // }, speed, () => {
        //     current.hide();
        // });

        // next.stop(true).css('left', animIn).show().animate({
        //     left: 0
        // }, speed, () => {
        //     callback();
        // });
    },

    slideVertical: function(
        next: JQuery,
        current: JQuery | null,
        stepDirection: StepDirection,
        wizard: Wizard,
        callback: TransitionCallback
    ): void {
        if (!isFunction(next.animate)) { this.default(next, current, stepDirection, wizard, callback); return;  }
        
        const { speed, easing } = wizard.getOptions().transition;
        const contentDirection = wizard.getContentDirection();
        const containerWidth = wizard.getWidth();

        // TODO: Apply fix
        // if (wizardObj.current_index == -1) {
        //     // Set container height at page load 
        //     wizardObj.container.height(elmToShow.outerHeight());
        // }

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

    slideSwing: function(
        next: JQuery,
        current: JQuery | null,
        stepDirection: StepDirection,
        wizard: Wizard,
        callback: TransitionCallback
    ): void {
        // Fallback to default transition if fadeOut is not available
        if (!isFunction(next.slideDown)) { this.default(next, current, stepDirection, wizard, callback); return;  }
        
        const { speed, easing } = wizard.getOptions().transition;
        const show = () => next.slideDown(speed, easing, callback);
        current ? current.slideUp(speed, easing, show) : show();
    },

    css: function(
        next: JQuery,
        current: JQuery | null,
        stepDirection: StepDirection,
        wizard: Wizard,
        callback: TransitionCallback
    ): void {
        const { prefix, forward, backward } = wizard.getOptions().transition.css;
        if (forward.show.length == 0 || backward.show.length == 0) { this.default(next, current, stepDirection, wizard, callback); return; }

        // CSS Animation
        const animateCss = (element: JQuery<HTMLElement>, animation: string, complete: any) => {
            if (!animation || animation.length == 0) complete();

            element.addClass(animation).one(Constants.EVENTS.ANIMATIONEND, (e) => {
                $(e.currentTarget).removeClass(animation);
                complete();
            });
            element.addClass(animation).one(Constants.EVENTS.ANIMATIONCANCEL, (e) => {
                $(e.currentTarget).removeClass(animation);
                complete('cancel');
            });
        };

        const show = () => {
            const css = prefix + ' ' + (stepDirection == 'backward' ? backward.show : forward.show);
            animateCss(next, css, () => {
                next.show();
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
