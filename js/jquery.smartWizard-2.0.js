/*
 * SmartWizard 2.0 plugin
 * jQuery Wizard control Plugin
 * by Dipu 
 * 
 * http://www.techlaboratory.net 
 * http://tech-laboratory.blogspot.com
 */

(function ($) {
    $.fn.smartWizard = function (action) {
        var options = $.extend({}, $.fn.smartWizard.defaults, action);
        var args = arguments;

        return this.each(function () {
            var obj = $(this);
            var curStepIdx = options.selected;
            var steps = $("ul > li > a[href^='#step-']", obj); // Get all anchors in this array
            var contentWidth = 0;
            var loader, msgBox, elmActionBar, elmStepContainer, btNext, btPrevious, btFinish;

            elmActionBar = $('.' + options.css_actionBar_Class, obj);
            if (elmActionBar.length == 0) {
                elmActionBar = $('<div></div>').addClass(options.css_actionBar_Class);
            }

            msgBox = $('.' + options.css_msgBox_Class, obj);
            if (msgBox.length == 0) {
                msgBox = $('<div class="' + options.css_msgBox_Class + '"><div class="' + options.css_content_Class + '"></div><a href="#" class="' + options.css_close_Class + '">X</a></div>');
                elmActionBar.append(msgBox);
            }

            $('.' + options.css_close_Class, msgBox).click(function () {
                msgBox.fadeOut("normal");
                return false;
            });


            // Method calling logic
            if (!action || action === 'init' || typeof action === 'object') {
                init();
            } else if (action === 'showMessage') {
                //showMessage(Array.prototype.slice.call( args, 1 ));
                var ar = Array.prototype.slice.call(args, 1);
                showMessage(ar[0]);
                return true;
            } else if (action === 'setError') {
                var ar = Array.prototype.slice.call(args, 1);
                setError(ar[0].stepnum, ar[0].iserror);
                return true;
            } else if (action === 'gotoStep') {
                elmStepContainer = $('.' + options.css_stepContainer_Class, obj);
                var ar = Array.prototype.slice.call(args, 1);
                LoadContent(ar - 1, 'directClick');
                return true;
            } else {
                $.error('Method ' + action + ' does not exist');
            }

            function init() {
                var allDivs = obj.children('div'); //$("div", obj);                
                obj.children('ul').addClass(options.css_anchor_Class);
                allDivs.addClass(options.css_content_Class);
                // Create Elements
                loader = $('<div>'+options.loadingText+'</div>').addClass(options.css_loader_Class);
                elmActionBar = $('<div></div>').addClass(options.css_actionBar_Class);
                elmStepContainer = $('<div></div>').addClass(options.css_stepContainer_Class);
                btNext = $('<a>' + options.labelNext + '</a>').attr("href", "#").addClass(options.css_buttonNext_Class);
                btPrevious = $('<a>' + options.labelPrevious + '</a>').attr("href", "#").addClass(options.css_buttonPrevious_Class).css('display', options.includePreviousButton ? '' : 'none');
                btFinish = $('<a>' + options.labelFinish + '</a>').attr("href", "#").addClass(options.css_buttonFinish_Class);

                // highlight steps with errors
                if (options.errorSteps && options.errorSteps.length > 0) {
                    $.each(options.errorSteps, function (i, n) {
                        setError(n, true);
                    });
                }

                elmStepContainer.append(allDivs);
                elmActionBar.append(loader);
                obj.append(elmStepContainer);
                obj.append(elmActionBar);
                if (options.includeFinishButton) {
                    elmActionBar.append(btFinish);
                }
                elmActionBar.append(btNext).append(btPrevious);
                contentWidth = elmStepContainer.width();

                $(btNext).click(nextClick);
                $(btPrevious).click(previousClick);
                $(btFinish).click(finishClick);

                if (options.directClick == true) {
                    $(steps).bind("click", function (e) {
                        var lastStepIdx = $("ul > li > a."+options.css_selected_Class+"[href^='#step-']", obj).attr('rel');
                        if (typeof lastStepIdx != 'undefined')
                            curStepIdx = lastStepIdx - 1;

                        if (steps.index(this) == curStepIdx) {
                            return false;
                        }
                        var nextStepIdx = steps.index(this);
                        var isDone = steps.eq(nextStepIdx).attr("isDone") - 0;
                        if (isDone == 1) {
                            LoadContent(nextStepIdx, 'directClick');
                        }
                        return false;
                    });
                }

                // Enable keyboard navigation                 
                if (options.keyNavigation) {
                    $(document).keyup(function (e) {
                        if (e.which == 39) { // Right Arrow
                            doForwardProgress();
                        } else if (e.which == 37) { // Left Arrow
                            doBackwardProgress();
                        }
                    });
                }
                //  Prepare the steps
                prepareSteps();
                // Show the first slected step
                LoadContent(curStepIdx, 'init');
            }

            function nextClick() {
                var lastStepIdx = $("ul > li > a."+options.css_selected_Class+"[href^='#step-']", obj).attr('rel');
                if (typeof lastStepIdx != 'undefined')
                    curStepIdx = lastStepIdx - 1;

                if ($(this).hasClass(options.css_buttonDisabled_Class)) {
                    return false;
                }
                doForwardProgress();
                return false;
            }

            function previousClick() {
                var lastStepIdx = $("ul > li > a."+options.css_selected_Class+"[href^='#step-']", obj).attr('rel');
                if (typeof lastStepIdx != 'undefined')
                    curStepIdx = lastStepIdx - 1;
                if ($(this).hasClass(options.css_buttonDisabled_Class)) {
                    return false;
                }
                doBackwardProgress();
                return false;
            }

            function finishClick() {
                if (!$(this).hasClass(options.css_buttonDisabled_Class)) {
                    // Call onLeaveStep event on Finish
                    if ($.isFunction(options.onLeaveStep)) {
                        curStepIdx = $("ul > li > a." + options.css_selected_Class + "[href^='#step-']", obj).attr('rel');
                        if (typeof curStepIdx != 'undefined') {
                            var curStep = steps.eq(curStepIdx - 1);
                            if (!options.onLeaveStep.call(this, $(curStep), 'finish')) {
                                return false;
                            }
                        }
                    }

                    if ($.isFunction(options.onFinish)) {
                        if (!options.onFinish.call(this, $(steps))) {
                            return false;
                        }
                    } else {
                        var frm = obj.parents('form');
                        if (frm && frm.length) {
                            frm.submit();
                        }
                    }
                }

                return false;
            }

            function prepareSteps() {
                if (!options.enableAllSteps) {
                    $(steps, obj).removeClass(options.css_selected_Class).removeClass(options.css_done_Class).addClass(options.css_disabled_Class);
                    $(steps, obj).attr("isDone", 0);
                } else {
                    $(steps, obj).removeClass(options.css_selected_Class).removeClass(options.css_disabled_Class).addClass(options.css_done_Class);
                    $(steps, obj).attr("isDone", 1);
                }

                $(steps, obj).each(function (i) {
                    $($(this).attr("href"), obj).hide();
                    $(this).attr("rel", i + 1);
                });
            }

            function LoadContent(stepIdx, trigger) {
                var selStep = steps.eq(stepIdx);
                var ajaxurl = options.contentURL;
                var hasContent = selStep.data('hasContent');
                stepNum = stepIdx + 1;
                if (ajaxurl && ajaxurl.length > 0) {
                    if (options.contentCache && hasContent) {
                        showStep(stepIdx);
                    } else {
                        $.ajax({
                            url: ajaxurl,
                            type: "POST",
                            data: ({ step_number: stepNum }),
                            dataType: "text",
                            beforeSend: function () { loader.show(); },
                            error: function () { loader.hide(); },
                            success: function (res) {
                                loader.hide();
                                if (res && res.length > 0) {
                                    selStep.data('hasContent', true);
                                    $($(selStep, obj).attr("href"), obj).html(res);
                                    showStep(stepIdx, trigger);
                                }
                            }
                        });
                    }
                } else {
                    showStep(stepIdx, trigger);
                }
            }

            function showStep(stepIdx, trigger) {
                var selStep = steps.eq(stepIdx);
                var curStep = steps.eq(curStepIdx);
                if (stepIdx != curStepIdx) {
                    if ($.isFunction(options.onLeaveStep)) {
                        if (!options.onLeaveStep.call(this, $(curStep), trigger)) {
                            return false;
                        }
                    }
                }
                if (options.updateHeight)
                    elmStepContainer.height($($(selStep, obj).attr("href"), obj).outerHeight());
                if (options.transitionEffect == 'slide') {
                    $($(curStep, obj).attr("href"), obj).slideUp("fast", function (e) {
                        $($(selStep, obj).attr("href"), obj).slideDown("fast");
                        curStepIdx = stepIdx;
                        SetupStep(curStep, selStep, trigger);
                    });
                } else if (options.transitionEffect == 'fade') {
                    $($(curStep, obj).attr("href"), obj).fadeOut("fast", function (e) {
                        $($(selStep, obj).attr("href"), obj).fadeIn("fast");
                        curStepIdx = stepIdx;
                        SetupStep(curStep, selStep, trigger);
                    });
                } else if (options.transitionEffect == 'slideleft') {
                    var nextElmLeft = 0;
                    var curElementLeft = 0;
                    if (stepIdx > curStepIdx) {
                        nextElmLeft1 = contentWidth + 10;
                        nextElmLeft2 = 0;
                        curElementLeft = 0 - $($(curStep, obj).attr("href"), obj).outerWidth();
                    } else {
                        nextElmLeft1 = 0 - $($(selStep, obj).attr("href"), obj).outerWidth() + 20;
                        nextElmLeft2 = 0;
                        curElementLeft = 10 + $($(curStep, obj).attr("href"), obj).outerWidth();
                    }
                    if (stepIdx == curStepIdx) {
                        nextElmLeft1 = $($(selStep, obj).attr("href"), obj).outerWidth() + 20;
                        nextElmLeft2 = 0;
                        curElementLeft = 0 - $($(curStep, obj).attr("href"), obj).outerWidth();
                    } else {
                        $($(curStep, obj).attr("href"), obj).animate({ left: curElementLeft }, "fast", function (e) {
                            $($(curStep, obj).attr("href"), obj).hide();
                        });
                    }

                    $($(selStep, obj).attr("href"), obj).css("left", nextElmLeft1);
                    $($(selStep, obj).attr("href"), obj).show();
                    $($(selStep, obj).attr("href"), obj).animate({ left: nextElmLeft2 }, "fast", function (e) {
                        curStepIdx = stepIdx;
                        SetupStep(curStep, selStep, trigger);
                    });
                } else {
                    $($(curStep, obj).attr("href"), obj).hide();
                    $($(selStep, obj).attr("href"), obj).show();
                    curStepIdx = stepIdx;
                    SetupStep(curStep, selStep, trigger);
                }
                return true;
            }

            function SetupStep(curStep, selStep, trigger) {
                $(curStep, obj).removeClass(options.css_selected_Class);
                $(curStep, obj).addClass(options.css_done_Class);

                $(selStep, obj).removeClass(options.css_disabled_Class);
                $(selStep, obj).removeClass(options.css_done_Class);
                $(selStep, obj).addClass(options.css_selected_Class);
                $(selStep, obj).attr("isDone", 1);
                adjustButton();
                if ($.isFunction(options.onShowStep)) {
                    if (!options.onShowStep.call(this, $(selStep), trigger)) {
                        return false;
                    }
                }
            }

            function doForwardProgress() {
                var nextStepIdx = curStepIdx + 1;
                if (steps.length <= nextStepIdx) {
                    if (!options.cycleSteps) {
                        return false;
                    }
                    nextStepIdx = 0;
                }
                LoadContent(nextStepIdx, 'next');
            }

            function doBackwardProgress() {
                var nextStepIdx = curStepIdx - 1;
                if (0 > nextStepIdx) {
                    if (!options.cycleSteps) {
                        return false;
                    }
                    nextStepIdx = steps.length - 1;
                }
                LoadContent(nextStepIdx, 'previous');
            }

            function adjustButton() {
                if (!options.cycleSteps) {
                    if (0 >= curStepIdx) {
                        $(btPrevious).addClass(options.css_buttonDisabled_Class);
                    } else {
                        $(btPrevious).removeClass(options.css_buttonDisabled_Class);
                    }
                    if ((steps.length - 1) <= curStepIdx) {
                        $(btNext).addClass(options.css_buttonDisabled_Class);
                    } else {
                        $(btNext).removeClass(options.css_buttonDisabled_Class);
                    }
                }
                // Finish Button 
                if (!steps.hasClass(options.css_disabled_Class) || options.enableFinishButton) {
                    $(btFinish).removeClass(options.css_buttonDisabled_Class);
                } else {
                    $(btFinish).addClass(options.css_buttonDisabled_Class);
                }
            }

            function showMessage(msg) {
                $('.' + options.css_content_Class, msgBox).html(msg);
                msgBox.show();
            }

            function setError(stepnum, iserror) {
                if (iserror) {
                    $(steps.eq(stepnum - 1), obj).addClass(options.css_error_Class);
                } else {
                    $(steps.eq(stepnum - 1), obj).removeClass(options.css_error_Class);
                }
            }
        });
    };

    // Default Properties and Events
    $.fn.smartWizard.defaults = {
        selected: 0,  // Selected Step, 0 = first step   
        keyNavigation: false, // Enable/Disable key navigation(left and right keys are used if enabled)
        enableAllSteps: false,
        updateHeight: true,
        transitionEffect: 'fade', // Effect on navigation, none/fade/slide/slideleft
        contentURL: null, // content url, Enables Ajax content loading
        contentCache: true, // cache step contents, if false content is fetched always from ajax url
        cycleSteps: false, // cycle step navigation
        includeFinishButton: true, // whether to show a Finish button
        enableFinishButton: false, // make finish button enabled always
        errorSteps: [],    // Array Steps with errors
        labelNext: 'Next',
        labelPrevious: 'Previous',
        labelFinish: 'Finish',
        onLeaveStep: null, // triggers when leaving a step
        onShowStep: null,  // triggers when showing a step
        onFinish: null,  // triggers when Finish button is clicked
        includePreviousButton: true, // enable/disable the previous button
        directClick: true, // enable/disable clicking the steps directly,
        css_actionBar_Class: 'actionBar',
        css_anchor_Class: 'anchor',
        css_content_Class: 'content',
        css_loader_Class: 'loader',
        css_actionBar_Class: 'actionBar',
        css_stepContainer_Class: 'stepContainer',
        css_buttonNext_Class: 'buttonNext',
        css_buttonPrevious_Class: 'buttonPrevious',
        css_buttonFinish_Class: 'buttonFinish',
        css_disabled_Class: 'disabled',
        css_done_Class: 'done',
        css_selected_Class: 'selected',
        css_buttonDisabled_Class: 'buttonDisabled',
        css_error_Class: 'error',
        css_msgBox_Class: 'msgBox',
        css_close_Class: 'close',
        loadingText:'Loading'		
    };

})(jQuery);
