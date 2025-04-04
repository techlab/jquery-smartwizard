import { TransitionFunction } from './types';
import { SmartWizard } from './SmartWizard';

export const transitions: Record<string, TransitionFunction> = {
    none: function(
        selPage: JQuery,
        curPage: JQuery,
        stepDirection: string,
        wizard: SmartWizard,
        callback: () => void
    ): void {
        curPage && curPage.hide();
        selPage.show();
        callback();
    },

    fade: function(
        selPage: JQuery,
        curPage: JQuery,
        stepDirection: string,
        wizard: SmartWizard,
        callback: () => void
    ): void {
        const options = wizard.getOptions();
        curPage.fadeOut(options.transition.speed, () => {
            selPage.fadeIn(options.transition.speed, () => callback());
        });
    },

    slideHorizontal: function(
        selPage: JQuery,
        curPage: JQuery,
        stepDirection: string,
        wizard: SmartWizard,
        callback: () => void
    ): void {
        const options = wizard.getOptions();
        const direction = wizard.getDirection();
        const dir = direction === 'rtl' ? 
            (stepDirection === 'forward' ? 'right' : 'left') : 
            (stepDirection === 'forward' ? 'left' : 'right');
        const animIn = dir === 'left' ? 'show' : 'show';
        const animOut = dir === 'left' ? 'hide' : 'hide';

        curPage.stop(true).animate({
            left: animOut
        }, options.transition.speed, () => {
            curPage.hide();
        });

        selPage.stop(true).css('left', animIn).show().animate({
            left: 0
        }, options.transition.speed, () => {
            callback();
        });
    },

    slideVertical: function(
        selPage: JQuery,
        curPage: JQuery,
        stepDirection: string,
        wizard: SmartWizard,
        callback: () => void
    ): void {
        const options = wizard.getOptions();
        const animIn = stepDirection === 'forward' ? 'show' : 'show';
        const animOut = stepDirection === 'forward' ? 'hide' : 'hide';

        curPage.stop(true).animate({
            top: animOut
        }, options.transition.speed, () => {
            curPage.hide();
        });

        selPage.stop(true).css('top', animIn).show().animate({
            top: 0
        }, options.transition.speed, () => {
            callback();
        });
    },

    slideSwing: function(
        selPage: JQuery,
        curPage: JQuery,
        stepDirection: string,
        wizard: SmartWizard,
        callback: () => void
    ): void {
        const options = wizard.getOptions();
        curPage.stop(true).animate({
            opacity: 0
        }, options.transition.speed, () => {
            curPage.hide();
        });

        selPage.stop(true).css('opacity', 0).show().animate({
            opacity: 1
        }, options.transition.speed, () => {
            callback();
        });
    }
};
