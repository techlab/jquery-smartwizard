$.widget("sw.smartWizard",
    {
        options: {
            selected: 0,  // Selected Step, 0 = first step   
            keyNavigation: true, // Enable/Disable key navigation(left and right keys are used if enabled)
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
            loadingText: 'Loading',

            currentStep: -1,
            steps: null,
            contentWidth: 0,
            stepContainer: null,
            loadingContainer: null,
            messageContainer: null,
            buttonNext: null,
            buttonPrevious: null,
            buttonFinish: null
        },

        _create: function () {
            this._doCreate();
        },

        _init: function () {
        },

        _doCreate: function () {
            var obj = $(this.element);
            this.options.currentStep = this.options.selected;
            this.options.steps = $("ul > li > a[href^='#step-']", obj); // Get all anchors in this array
            this.options.contentWidth = 0;

            var elmActionBar = $('.' + this.options.css_actionBar_Class, obj);
            if (elmActionBar.length == 0) {
                elmActionBar = $('<div></div>').addClass(this.options.css_actionBar_Class);
            }

            this.options.messageContainer = $('.' + this.options.css_msgBox_Class, elmActionBar);
            if (this.options.messageContainer.length == 0) {
                this.options.messageContainer = $('<div class="' + this.options.css_msgBox_Class + '"><div class="' + this.options.css_content_Class + '"></div><a href="#" class="' + this.options.css_close_Class + '">X</a></div>');
                elmActionBar.append(this.options.messageContainer);
            }

            $('.' + this.options.css_close_Class, this.options.messageContainer).click(
                $.proxy(function () {
                    this.options.messageContainer.fadeOut("normal");
                    return false;
                }, this)
            );

            var allDivs = obj.children('div'); //$("div", obj);                
            obj.children('ul').addClass(this.options.css_anchor_Class);
            allDivs.addClass(this.options.css_content_Class);
            // Create Elements
            this.options.loadingContainer = $('<div>' + this.options.loadingText + '</div>').addClass(this.options.css_loader_Class);
            //elmActionBar = $('<div></div>').addClass(this.options.css_actionBar_Class);
            this.options.stepContainer = $('<div></div>').addClass(this.options.css_stepContainer_Class);
            this.options.buttonNext = $('<a>' + this.options.labelNext + '</a>').attr("href", "#").addClass(this.options.css_buttonNext_Class);
            this.options.buttonPrevious = $('<a>' + this.options.labelPrevious + '</a>').attr("href", "#").addClass(this.options.css_buttonPrevious_Class).css('display', this.options.includePreviousButton ? '' : 'none');
            this.options.buttonFinish = $('<a>' + this.options.labelFinish + '</a>').attr("href", "#").addClass(this.options.css_buttonFinish_Class);

            // highlight steps with errors
            if (this.options.errorSteps && this.options.errorSteps.length > 0) {
                $.each(this.options.errorSteps, function (i, n) {
                    this._setError(n, true);
                });
            }

            this.options.stepContainer.append(allDivs);
            elmActionBar.append(this.options.loadingContainer);
            obj.append(this.options.stepContainer);
            obj.append(elmActionBar);
            if (this.options.includeFinishButton) {
                elmActionBar.append(this.options.buttonFinish);
            }
            elmActionBar.append(this.options.buttonNext);
            if(this.options.includePreviousButton)
                elmActionBar.append(this.options.buttonPrevious);
            this.options.contentWidth = this.options.stepContainer.width();

            this.options.buttonNext.click($.proxy(this._nextClick, this));
            this.options.buttonPrevious.click($.proxy(this._previousClick, this));
            this.options.buttonFinish.click($.proxy(this._finishClick, this));

            if (this.options.directClick == true) {
                $(this.options.steps).click($.proxy(function (event) {
                    if (this.options.directClick == true) {
                        var requestedStep = this.options.steps.index(event.currentTarget);
                        if (requestedStep == this.options.currentStep)
                            return false;

                        var isDone = this.options.steps.eq(requestedStep).attr("isDone") - 0;
                        if (isDone == 1)
                            this._LoadContent(requestedStep, 'directClick');
                    }
                    return false;
                }, this));
            }

            // Enable keyboard navigation                 
            if (this.options.keyNavigation) {
                $(document).keyup($.proxy(function (e) {
                    if (e.which == 39) { // Right Arrow
                        this._doForwardProgress();
                    } else if (e.which == 37) { // Left Arrow
                        this._doBackwardProgress();
                    }
                }, this));
            }
            //  Prepare the steps
            this._prepareSteps();
            // Show the first slected step
            this._LoadContent(this.options.currentStep, 'init');
        },

        // Exposed methods
        showMessage: function (message) {
            $('.' + this.options.css_content_Class, this.options.messageContainer).html(message);
            this.options.messageContainer.show();
        },

        setError: function (stepnum, iserror) {
            var obj = $(this.element);
            if (iserror) {
                $(this.options.steps.eq(stepnum - 1), obj).addClass(this.options.css_error_Class);
            } else {
                $(this.options.steps.eq(stepnum - 1), obj).removeClass(this.options.css_error_Class);
            }
        },

        gotoStep: function (step) {
            var requestedStep = step - 1;
            if (requestedStep == this.options.currentStep)
                return false;

            //var isDone = this.options.steps.eq(requestedStep).attr("isDone") - 0;
            var isDone = 1;
            if (isDone == 1)
                this._LoadContent(requestedStep, 'directClick');
        },

        // Internal methods
        _prepareSteps: function () {
            var obj = $(this.element);
            if (!this.options.enableAllSteps) {
                $(this.options.steps, obj).removeClass(this.options.css_selected_Class).removeClass(this.options.css_done_Class).addClass(this.options.css_disabled_Class);
                $(this.options.steps, obj).attr("isDone", 0);
            } else {
                $(this.options.steps, obj).removeClass(this.options.css_selected_Class).removeClass(this.options.css_disabled_Class).addClass(this.options.css_done_Class);
                $(this.options.steps, obj).attr("isDone", 1);
            }

            $(this.options.steps, obj).each(function (i) {
                $($(this).attr("href"), obj).hide();
                $(this).attr("rel", i + 1);
            });
        },

        _doForwardProgress: function () {
            var nextStepIdx = this.options.currentStep + 1;
            if (this.options.steps.length <= nextStepIdx) {
                if (!this.options.cycleSteps) {
                    return false;
                }
                nextStepIdx = 0;
            }
            this._LoadContent(nextStepIdx, 'next');
        },

        _doBackwardProgress: function () {
            var nextStepIdx = this.options.currentStep - 1;
            if (0 > nextStepIdx) {
                if (!this.options.cycleSteps) {
                    return false;
                }
                nextStepIdx = this.options.steps.length - 1;
            }
            this._LoadContent(nextStepIdx, 'previous');
        },

        _adjustButton: function () {
            if (!this.options.cycleSteps) {
                if (0 >= this.options.currentStep) {
                    this.options.buttonPrevious.addClass(this.options.css_buttonDisabled_Class);
                } else {
                    this.options.buttonPrevious.removeClass(this.options.css_buttonDisabled_Class);
                }
                if ((this.options.steps.length - 1) <= this.options.currentStep) {
                    this.options.buttonNext.addClass(this.options.css_buttonDisabled_Class);
                } else {
                    this.options.buttonNext.removeClass(this.options.css_buttonDisabled_Class);
                }
            }
            // Finish Button 
            if (!this.options.steps.hasClass(this.options.css_disabled_Class) || this.options.enableFinishButton) {
                this.options.buttonFinish.removeClass(this.options.css_buttonDisabled_Class);
            } else {
                this.options.buttonFinish.addClass(this.options.css_buttonDisabled_Class);
            }
        },

        _showMessage: function (msg) {
            $('.' + this.options.css_content_Class, this.options.messageContainer).html(msg);
            this.options.messageContainer.show();
        },

        _setError: function (stepnum, iserror) {
            if (iserror) {
                $(this.options.steps.eq(stepnum - 1), obj).addClass(this.options.css_error_Class);
            } else {
                $(this.options.steps.eq(stepnum - 1), obj).removeClass(this.options.css_error_Class);
            }
        },

        _LoadContent: function (stepIdx, trigger) {
            var selStep = this.options.steps.eq(stepIdx);
            var ajaxurl = this.options.contentURL;
            var hasContent = selStep.data('hasContent');
            stepNum = stepIdx + 1;
            if (ajaxurl && ajaxurl.length > 0) {
                if (this.options.contentCache && hasContent) {
                    this._showStep(stepIdx);
                } else {
                    $.ajax({
                        url: ajaxurl,
                        type: "POST",
                        data: ({ step_number: stepNum }),
                        dataType: "text",
                        beforeSend: function () { this.options.loadingContainer.show(); },
                        error: function () { this.options.loadingContainer.hide(); },
                        success: function (res) {
                            this.options.loadingContainer.hide();
                            if (res && res.length > 0) {
                                selStep.data('hasContent', true);
                                $($(selStep, obj).attr("href"), obj).html(res);
                                showStep(stepIdx, trigger);
                            }
                        }
                    });
                }
            } else {
                this._showStep(stepIdx, trigger);
            }
        },

        _showStep: function (stepIdx, trigger) {
            var obj = $(this.element);
            var currentStepIndex = this.options.currentStep;
            var state = this.options;
            var me = this;

            var selStep = this.options.steps.eq(stepIdx);
            var curStep = this.options.steps.eq(this.options.currentStep);
            if (stepIdx != this.options.currentStep) {
                if ($.isFunction(this.options.onLeaveStep)) {
                    if (!this.options.onLeaveStep.call(this, $(curStep), trigger)) {
                        return false;
                    }
                }
            }
            if (this.options.updateHeight)
                this.options.stepContainer.height($($(selStep, obj).attr("href"), obj).outerHeight());
            if (this.options.transitionEffect == 'slide') {
                $($(curStep, obj).attr("href"), obj).slideUp("fast", function (e) {
                    $($(selStep, obj).attr("href"), obj).slideDown("fast");
                    state.currentStep = stepIdx;
                    me._SetupStep(curStep, selStep, trigger);
                });
            } else if (this.options.transitionEffect == 'fade') {
                $($(curStep, obj).attr("href"), obj).fadeOut("fast", function (e) {
                    $($(selStep, obj).attr("href"), obj).fadeIn("fast");
                    state.currentStep = stepIdx;
                    me._SetupStep(curStep, selStep, trigger);
                });
            } else if (this.options.transitionEffect == 'slideleft') {
                var nextElmLeft = 0;
                var curElementLeft = 0;
                if (stepIdx > this.options.currentStep) {
                    nextElmLeft1 = this.options.contentWidth + 10;
                    nextElmLeft2 = 0;
                    curElementLeft = 0 - $($(curStep, obj).attr("href"), obj).outerWidth();
                } else {
                    nextElmLeft1 = 0 - $($(selStep, obj).attr("href"), obj).outerWidth() + 20;
                    nextElmLeft2 = 0;
                    curElementLeft = 10 + $($(curStep, obj).attr("href"), obj).outerWidth();
                }
                if (stepIdx == this.options.currentStep) {
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
                    state.currentStep = stepIdx;
                    me._SetupStep(curStep, selStep, trigger);
                });
            } else {
                $($(curStep, obj).attr("href"), obj).hide();
                $($(selStep, obj).attr("href"), obj).show();
                this.options.currentStep = stepIdx;
                me._SetupStep(curStep, selStep, trigger);
            }
            return true;
        },

        _SetupStep: function (curStep, selStep, trigger) {
            var obj = $(this.element);
            $(curStep, obj).removeClass(this.options.css_selected_Class);
            $(curStep, obj).addClass(this.options.css_done_Class);

            $(selStep, obj).removeClass(this.options.css_disabled_Class);
            $(selStep, obj).removeClass(this.options.css_done_Class);
            $(selStep, obj).addClass(this.options.css_selected_Class);
            $(selStep, obj).attr("isDone", 1);
            this._adjustButton();
            if ($.isFunction(this.options.onShowStep)) {
                if (!this.options.onShowStep.call(this, $(selStep), trigger)) {
                    return false;
                }
            }
        },


        _nextClick: function () {
            if ($(this.options.buttonNext).hasClass(this.options.css_buttonDisabled_Class)) {
                return false;
            }
            this._doForwardProgress();
            return false;
        },

        _previousClick: function () {
            if ($(this.options.buttonNext).hasClass(this.options.css_buttonDisabled_Class)) {
                return false;
            }
            this._doBackwardProgress();
            return false;
        },

        _finishClick: function () {
            var obj = $(this.element);
            if (!$(this.options.buttonFinish).hasClass(this.options.css_buttonDisabled_Class)) {
                // Call onLeaveStep event on Finish
                if ($.isFunction(this.options.onLeaveStep)) {
                    this.options.currentStep = $("ul > li > a." + this.options.css_selected_Class + "[href^='#step-']", obj).attr('rel');
                    if (typeof curStepIdx != 'undefined') {
                        var curStep = this.options.steps.eq(curStepIdx - 1);
                        if (!this.options.onLeaveStep.call(this, $(curStep), 'finish')) {
                            return false;
                        }
                    }
                }

                if ($.isFunction(this.options.onFinish)) {
                    if (!this.options.onFinish.call(this, $(this.options.steps))) {
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
        },

        option: function (key, value) {
            if (typeof value == 'undefined') {
                return this.options[key];
            }
            else {
                this.options[key] = value;
                this._update();
            }
        },

        _update: function () { },

    }
    );