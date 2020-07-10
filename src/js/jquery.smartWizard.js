/*!
 * jQuery SmartWizard v5.1.1
 * The awesome jQuery step wizard plugin
 * http://www.techlaboratory.net/jquery-smartwizard
 *
 * Created by Dipu Raj
 * http://dipu.me
 *
 * @license Licensed under the terms of the MIT License
 * https://github.com/techlab/jquery-smartwizard/blob/master/LICENSE
 */

 (function (factory) {
     if (typeof define === 'function' && define.amd) {
         // AMD. Register as an anonymous module.
         define(['jquery'], factory);
     } else if (typeof module === 'object' && module.exports) {
         // Node/CommonJS
         module.exports = function( root, jQuery ) {
             if ( jQuery === undefined ) {
                 // require('jQuery') returns a factory that requires window to
                 // build a jQuery instance, we normalize how we use modules
                 // that require this pattern but the window provided is a noop
                 // if it's defined (how jquery works)
                 if ( typeof window !== 'undefined' ) {
                     jQuery = require('jquery');
                 }
                 else {
                     jQuery = require('jquery')(root);
                 }
             }
             factory(jQuery);
             return jQuery;
         };
     } else {
         // Browser globals
         factory(jQuery);
     }
 }(function ($) {
    "use strict";

    // Default options
    var defaults = {
        selected: 0, // Initial selected step, 0 = first step
        theme: 'default', // theme for the wizard, related css need to include for other than default theme
        justified: true, // Nav menu justification. true/false
        darkMode:false, // Enable/disable Dark Mode if the theme supports. true/false
        autoAdjustHeight: true, // Automatically adjust content height
        cycleSteps: false, // Allows to cycle the navigation of steps
        backButtonSupport: true, // Enable the back button support
        enableURLhash: true, // Enable selection of the step based on url hash
        transition: {
            animation: 'none', // Effect on navigation, none/fade/slide-horizontal/slide-vertical/slide-swing
            speed: '400', // Transion animation speed
            easing:'' // Transition animation easing. Not supported without a jQuery easing plugin
        },
        toolbarSettings: {
            toolbarPosition: 'bottom', // none, top, bottom, both
            toolbarButtonPosition: 'right', // left, right, center
            showNextButton: true, // show/hide a Next button
            showPreviousButton: true, // show/hide a Previous button
            toolbarExtraButtons: [] // Extra buttons to show on toolbar, array of jQuery input/buttons elements
        },
        anchorSettings: {
            anchorClickable: true, // Enable/Disable anchor navigation
            enableAllAnchors: false, // Activates all anchors clickable all times
            markDoneStep: true, // Add done state on navigation
            markAllPreviousStepsAsDone: true, // When a step selected by url hash, all previous steps are marked done
            removeDoneStepOnNavigateBack: false, // While navigate back done step after active step will be cleared
            enableAnchorOnDoneStep: true // Enable/Disable the done steps navigation
        },
        keyboardSettings: {
            keyNavigation: true, // Enable/Disable keyboard navigation(left and right keys are used if enabled)
            keyLeft: [37], // Left key code
            keyRight: [39] // Right key code
        },
        lang: { // Language variables for button
            next: 'Next',
            previous: 'Previous'
        },
        disabledSteps: [], // Array Steps disabled
        errorSteps: [], // Highlight step with errors
        hiddenSteps: [] // Hidden steps
    };

    class SmartWizard {

      constructor(element, options) {
          // Merge user settings with default
          this.options        = $.extend(true, {}, defaults, options);
          // Main container element
          this.main           = $(element);
          // Navigation bar element
          this.nav            = this._getFirstDescendant('.nav');
          // Step anchor elements
          this.steps          = this.nav.find('.nav-link');
          // Content container
          this.container      = this._getFirstDescendant('.tab-content');
          // Content pages
          this.pages          = this.container.children('.tab-pane');

          // Assign options
          this._initOptions();
          // Initial load
          this._initLoad();
      }

      // Initial Load Method
      _initLoad() {
          // Clean the elements
          this.pages.hide();
          this.steps.removeClass('done active');

          // Active step index
          this.current_index  = null;

          // Get the initial step index
          let idx = this._getStepIndex();
          // Mark any previous steps done
          this._setPreviousStepsDone(idx);
          // Show the initial step
          this._showStep(idx);
      }

      // Initialize options
      _initOptions() {
          // Set the elements
          this._setElements();
          // Add toolbar
          this._setToolbar();
          // Assign plugin events
          this._setEvents();
      }

      _getFirstDescendant(selector) {
          // Check for first level element
          let elm = this.main.children(selector);
          if (elm.length > 0) {
              return elm;
          }

          // Check for second level element
          this.main.children().each((i, n) => {
              let tmp = $(n).children(selector);
              if (tmp.length > 0) {
                  elm = tmp;
                  return false;
              }
          });
          if (elm.length > 0) {
              return elm;
          }

          // Element not found
          this._showError("Element not found " + selector);
          return false;
      }

      _setElements() {
          // Set the main element
          this.main.addClass('sw');

          this._setTheme(this.options.theme);
          this._setJustify(this.options.justified);
          this._setDarkMode(this.options.darkMode);

          // Set the anchor default style
          if (this.options.anchorSettings.enableAllAnchors !== true || this.options.anchorSettings.anchorClickable !== true) {
              this.steps.addClass('inactive');
          }

          // Disabled steps
          this._setCSSClass(this.options.disabledSteps, "disabled");
          // Error steps
          this._setCSSClass(this.options.errorSteps, "danger");
          // Hidden steps
          this._setCSSClass(this.options.hiddenSteps, "hidden");
      }

      _setEvents() {
          // Check if event handler already exists
          if (this.main.data('click-init')) {
              return true;
          }
          // Flag item to prevent attaching handler again
          this.main.data('click-init', true);

          // Anchor click event
          $(this.steps).on("click", (e) => {
              e.preventDefault();
              if (this.options.anchorSettings.anchorClickable === false) {
                  return true;
              }

              // Get the step index
              var idx = this.steps.index(e.currentTarget);

              if (idx === this.current_index) {
                  return true;
              }

              if (this.options.anchorSettings.enableAnchorOnDoneStep === false && this._isDone(idx)) {
                  return true;
              }

              if (this.options.anchorSettings.enableAllAnchors !== false || this._isDone(idx)) {
                  this._showStep(idx);
              }
          });

          // Next button event
          this.main.find('.sw-btn-next').on("click", (e) => {
              e.preventDefault();
              this._showNext();
          });

          // Previous button event
          this.main.find('.sw-btn-prev').on("click", (e) => {
              e.preventDefault();
              this._showPrevious();
          });

          // Keyboard navigation event
          if (this.options.keyboardSettings.keyNavigation) {
              $(document).keyup((e) => {
                  this._keyNav(e);
              });
          }

          // Back/forward browser button event
          if (this.options.backButtonSupport) {
              $(window).on('hashchange', (e) => {
                  let idx = this._getURLHashIndex();
                  if (idx !== false) {
                      e.preventDefault();
                      this._showStep(idx);
                  }
              });
          }
      }

      _setToolbar() {
          // Skip right away if the toolbar is not enabled
          if (this.options.toolbarSettings.toolbarPosition === 'none') {
              return true;
          }

          // Append toolbar based on the position
          switch (this.options.toolbarSettings.toolbarPosition) {
              case 'top':
                  this.container.before(this._createToolbar('top'));
                  break;
              case 'bottom':
                  this.container.after(this._createToolbar('bottom'));
                  break;
              case 'both':
                  this.container.before(this._createToolbar('top'));
                  this.container.after(this._createToolbar('bottom'));
                  break;
              default:
                  this.container.after(this._createToolbar('bottom'));
                  break;
          }
      }

      _createToolbar(position) {
          // Skip if the toolbar is already created
          if (this.main.find('.toolbar-' + position).length > 0) {
              return null;
          }

          var toolbar       = $('<div></div>').addClass('toolbar toolbar-' + position).attr('role', 'toolbar');
          // Create the toolbar buttons
          let btnNext       = this.options.toolbarSettings.showNextButton !== false ? $('<button></button>').text(this.options.lang.next).addClass('btn sw-btn-next').attr('type', 'button') : null;
          let btnPrevious   = this.options.toolbarSettings.showPreviousButton !== false ? $('<button></button>').text(this.options.lang.previous).addClass('btn sw-btn-prev').attr('type', 'button') : null;
          toolbar.append(btnPrevious, btnNext);

          // Add extra toolbar buttons
          if (this.options.toolbarSettings.toolbarExtraButtons && this.options.toolbarSettings.toolbarExtraButtons.length > 0) {
              $.each(this.options.toolbarSettings.toolbarExtraButtons, (_i, n) => {
                  toolbar.append(n.clone(true));
              });
          }

          toolbar.css('text-align', this.options.toolbarSettings.toolbarButtonPosition);
          return toolbar;
      }

      _showNext() {
          var si = this._getNextShowable(this.current_index);
          if (si === false) {
              return false;
          }
          this._showStep(si);
      }

      _showPrevious() {
          var si = this._getPreviousShowable(this.current_index);
          if (si === false) {
              return false;
          }
          this._showStep(si);
      }

      _showStep(idx) {
          // If current step is requested again, skip
          if (idx == this.current_index) {
              return false;
          }
          // If step not found, skip
          if (!this.steps.eq(idx)) {
              return false;
          }
          // If it is a disabled step, skip
          if (!this._isShowable(idx)) {
              return false;
          }

          // Load step content
          this._loadStep(idx);
      }

      _getNextShowable(idx) {
          var si = false;
          // Find the next showable step
          for (var i = idx + 1; i < this.steps.length; i++) {
              if (this._isShowable(i)) {
                  si = i;
                  break;
              }
          }

          if (si !== false && this.steps.length <= si) {
              if (!this.options.cycleSteps) {
                  return false;
              }
              si = 0;
          }

          return si;
      }

      _getPreviousShowable(idx) {
          var si = false;
          // Find the previous showable step
          for (var i = idx - 1; i >= 0; i--) {
              if (this._isShowable(i)) {
                  si = i;
                  break;
              }
          }

          if (si !== false && 0 > si) {
              if (!this.options.cycleSteps) {
                  return false;
              }
              si = this.steps.length - 1;
          }

          return si;
      }

      _isShowable(idx) {
          let elm = this.steps.eq(idx);
          if (elm.hasClass('disabled') || elm.hasClass('hidden')) {
              return false;
          }
          return true;
      }

      _isDone(idx) {
          let elm = this.steps.eq(idx);
          if (elm.hasClass('done')) {
              return true;
          }
          return false;
      }

      _setPreviousStepsDone(idx) {
          if (idx > 0 && this.options.anchorSettings.markDoneStep && this.options.anchorSettings.markAllPreviousStepsAsDone) {
            // Mark previous steps of the active step as done
            for(var i = idx; i >= 0; i--) {
                this._setCSSClass(i, "done");
            }
          }
      }

      _setCSSClass(idx, cls) {
          if (idx === null) {
              return false;
          }
          let idxs = $.isArray(idx) ? idx : [idx];
          idxs.map((i) => {
              this.steps.eq(i).addClass(cls);
          });
      }

      _resetCSSClass(idx, cls) {
          let idxs = $.isArray(idx) ? idx : [idx];
          idxs.map((i) => {
              this.steps.eq(i).removeClass(cls);
          });
      }

      _getStepDirection(idx) {
          if (this.current_index == null) {
              return '';
          }
          return this.current_index < idx ? "forward" : "backward";
      }

      _getStepPosition(idx) {
          let stepPosition = 'middle';
          if (idx === 0) {
              stepPosition = 'first';
          } else if (idx === this.steps.length - 1) {
              stepPosition = 'last';
          }
          return stepPosition;
      }

      _getStepAnchor(idx) {
          if (idx == null) {
              return null;
          }
          return this.steps.eq(idx);
      }

      _getStepPage(idx) {
          if (idx == null) {
              return null;
          }
          let anchor = this._getStepAnchor(idx);
          return anchor.length > 0 ? this.main.find(anchor.attr("href")) : null;
      }

      _setStepContent(idx, html) {
          let page = this._getStepPage(idx);
          if (page) {
              page.html(html);
          }
      }

      _loadStep(idx) {
          // Get current step element
          let curStep          = this._getStepAnchor(this.current_index);
          // Get step direction
          let stepDirection   = this._getStepDirection(idx);
          // Get the direction of step navigation
          if (this.current_index !== null) {
              // Trigger "leaveStep" event
              if (this._triggerEvent("leaveStep", [curStep, this.current_index, idx, stepDirection]) === false) {
                  return false;
              }
          }

          // Get next step element
          let selStep          = this._getStepAnchor(idx);

          // Get the content if used
          let getStepContent  = this._triggerEvent("stepContent", [selStep, idx, stepDirection]);
          if (getStepContent) {
              if (typeof getStepContent == "object") {
                  getStepContent.then((res) => {
                      this._setStepContent(idx, res);
                      this._transitStep(idx);
                  }).catch((err) => {
                      console.error(err);
                      this._setStepContent(idx, err);
                      this._transitStep(idx);
                  });
              } else if (typeof getStepContent == "string") {
                  this._setStepContent(idx, getStepContent);
                  this._transitStep(idx);
              } else {
                  this._transitStep(idx);
              }
          } else {
              this._transitStep(idx);
          }
      }

      _transitStep(idx) {
          // Get step to show element
          let selStep          = this._getStepAnchor(idx);
          // Change the url hash to new step
          this._setURLHash(selStep.attr("href"));
          // Update controls
          this._setAnchor(idx);
          // Get the direction of step navigation
          let stepDirection   = this._getStepDirection(idx);
          // Get the position of step
          let stepPosition    = this._getStepPosition(idx);
          // Animate the step
          this._doStepAnimation(idx, () => {
              // Fix height with content
              this._fixHeight(idx);
              // Trigger "showStep" event
              this._triggerEvent("showStep", [selStep, this.current_index, stepDirection, stepPosition]);
          });

          // Update the current index
          this.current_index  = idx;
          // Set the buttons based on the step
          this._setButtons(idx);
      }

      _doStepAnimation(idx, callback) {
          // Get current step element
          let curPage   = this._getStepPage(this.current_index);
          // Get next step element
          let selPage   = this._getStepPage(idx);
          // Get the animation
          let animation = this.options.transition.animation.toLowerCase();
          // Complete any ongoing animations
          this._stopAnimations();

          switch (animation) {
            case 'slide-horizontal':
            case 'slide-h':
                // horizontal slide
                var containerWidth  = this.container.width();
                var curLastLeft     = containerWidth;
                var nextFirstLeft   = containerWidth * -2;

                // Forward direction
                if (idx > this.current_index) {
                  curLastLeft   = containerWidth * -1;
                  nextFirstLeft = containerWidth;
                }

                // First load set the container width
                if (this.current_index == null) {
                  this.container.height(selPage.outerHeight());
                }

                var css_pos, css_left;
                if (curPage) {
                    css_pos   = curPage.css("position");
                    css_left  = curPage.css("left");
                    curPage.css("position", 'absolute')
                            .css("left", 0)
                            .animate({
                             left: curLastLeft
                            },
                            this.options.transition.speed,
                            this.options.transition.easing,
                            function() {
                              $(this).hide();
                              curPage.css("position", css_pos).css("left", css_left);
                            });
                }

                css_pos   = selPage.css("position");
                css_left  = selPage.css("left");
                selPage.css("position", 'absolute')
                        .css("left", nextFirstLeft)
                        .outerWidth(containerWidth)
                        .show()
                        .animate({
                          left: 0
                        },
                        this.options.transition.speed,
                        this.options.transition.easing,
                        () => {
                            selPage.css("position", css_pos).css("left", css_left);
                            callback();
                        });
                break;
              case 'slide-vertical':
              case 'slide-v':
                  // vertical slide
                  var containerHeight = this.container.height();
                  var curLastTop      = containerHeight;
                  var nextFirstTop    = containerHeight * -2;

                  // Forward direction
                  if (idx > this.current_index) {
                    curLastTop   = containerHeight * -1;
                    nextFirstTop = containerHeight;
                  }

                  var css_vpos, css_vtop;
                  if (curPage) {
                      css_vpos = curPage.css("position");
                      css_vtop = curPage.css("top");
                      curPage.css("position", 'absolute')
                              .css("top", 0)
                              .animate({
                               top: curLastTop
                              },
                              this.options.transition.speed,
                              this.options.transition.easing,
                              function() {
                                $(this).hide();
                                curPage.css("position", css_vpos).css("top", css_vtop);
                              });
                  }

                  css_vpos = selPage.css("position");
                  css_vtop = selPage.css("top");
                  selPage.css("position", 'absolute')
                          .css("top", nextFirstTop)
                          .show()
                          .animate({
                            top: 0
                          },
                          this.options.transition.speed,
                          this.options.transition.easing,
                          () => {
                              selPage.css("position", css_vpos).css("top", css_vtop);
                              callback();
                          });
                  break;
              case 'slide-swing':
              case 'slide-s':
                  // normal slide
                  if (curPage) {
                      curPage.slideUp('fast', this.options.transition.easing, () => {
                          selPage.slideDown(this.options.transition.speed, this.options.transition.easing, () => {
                              callback();
                          });
                      });
                  } else {
                      selPage.slideDown(this.options.transition.speed, this.options.transition.easing, () => {
                          callback();
                      });
                  }
                  break;
              case 'fade':
                  // normal fade
                  if (curPage) {
                      curPage.fadeOut('fast', this.options.transition.easing, () => {
                          selPage.fadeIn('fast', this.options.transition.easing, () => {
                              callback();
                          });
                      });
                  } else {
                      selPage.fadeIn(this.options.transition.speed, this.options.transition.easing, () => {
                          callback();
                      });
                  }
                  break;
              default:
                  if (curPage) {
                      curPage.hide();
                  }
                  selPage.show();
                  callback();
                  break;
          }
      }

      _stopAnimations() {
          this.pages.finish();
          this.container.finish();
      }

      _setAnchor(idx) {
          // Current step anchor > Remove other classes and add done class
          this._resetCSSClass(this.current_index, "active");
          if (this.options.anchorSettings.markDoneStep !== false && this.current_index !== null) {
              this._setCSSClass(this.current_index, "done");
              if (this.options.anchorSettings.removeDoneStepOnNavigateBack !== false && this._getStepDirection(idx) === 'backward') {
                  this._resetCSSClass(this.current_index, "done");
              }
          }

          // Next step anchor > Remove other classes and add active class
          this._resetCSSClass(idx, "done");
          this._setCSSClass(idx, "active");
      }

      _setButtons(idx) {
          // Previous/Next Button enable/disable based on step
          if (!this.options.cycleSteps) {
              this.main.find('.sw-btn-prev').removeClass("disabled");
              this.main.find('.sw-btn-next').removeClass("disabled");
              switch (this._getStepPosition(idx)) {
                  case 'first':
                      this.main.find('.sw-btn-prev').addClass("disabled");
                      break;
                  case 'last':
                      this.main.find('.sw-btn-next').addClass("disabled");
                      break;
                  default:
                      if (this._getNextShowable(idx) === false) {
                          this.main.find('.sw-btn-next').addClass("disabled");
                      }

                      if (this._getPreviousShowable(idx) === false) {
                          this.main.find('.sw-btn-prev').addClass("disabled");
                      }
                      break;
              }
          }
      }

      _getStepIndex() {
          // Get selected step from the url
          let idx = this._getURLHashIndex();
          return (idx === false) ? this.options.selected : idx;
      }

      _setTheme(theme) {
          this.main.removeClass(function (index, className) {
              return (className.match (/(^|\s)sw-theme-\S+/g) || []).join(' ');
          }).addClass('sw-theme-' + theme);
      }

      _setJustify(justified) {
        if (justified === true) {
          this.main.addClass('sw-justified');
        } else {
          this.main.removeClass('sw-justified');
        }
      }

      _setDarkMode(darkMode) {
        if (darkMode === true) {
          this.main.addClass('sw-dark');
        } else {
          this.main.removeClass('sw-dark');
        }
      }

      // HELPER FUNCTIONS

      _keyNav(e) {
          // Keyboard navigation
          if ($.inArray(e.which, this.options.keyboardSettings.keyLeft) > -1) {
              // left
              this._showPrevious();
              e.preventDefault();
          } else if ($.inArray(e.which, this.options.keyboardSettings.keyRight) > -1) {
              // right
              this._showNext();
              e.preventDefault();
          } else {
              return; // exit this handler for other keys
          }
      }

      _fixHeight(idx) {
          // Auto adjust height of the container
          if (this.options.autoAdjustHeight) {
              let selPage = this._getStepPage(idx);
              this.container.finish()
                            .animate({
                                  height: selPage.outerHeight()
                                },
                                this.options.transition.speed
                            );
          }
      }

      _triggerEvent(name, params) {
          // Trigger an event
          var e = $.Event(name);
          this.main.trigger(e, params);
          if (e.isDefaultPrevented()) {
              return false;
          }
          return e.result;
      }

      _setURLHash(hash) {
          if (this.options.enableURLhash && window.location.hash !== hash) {
              history.pushState(null,null,hash);
          }
      }

      _getURLHashIndex() {
          if (this.options.enableURLhash) {
            // Get step number from url hash if available
            var hash = window.location.hash;
            if (hash.length > 0) {
                var elm = this.nav.find("a[href*='" + hash + "']");
                if (elm.length > 0) {
                    return this.steps.index(elm);
                }
            }
          }
          return false;
      }

      _loader(action) {
          switch (action) {
              case 'show':
                  this.main.addClass('sw-loading');
                  break;
              case 'hide':
                  this.main.removeClass('sw-loading');
                  break;
              default:
                  this.main.toggleClass('sw-loading');
          }
      }

      _showError(msg) {
          console.error(msg);
      }

      // PUBLIC FUNCTIONS

      goToStep(stepIndex) {
          this._showStep(stepIndex);
      }

      next() {
          this._showNext();
      }

      prev() {
          this._showPrevious();
      }

      reset() {
          // Reset all
          this._setURLHash('#');
          this._initOptions();
          this._initLoad();
      }

      stepState(stepArray, state) {
          if (!stepArray) {
              return false;
          }

          switch (state) {
              case 'disable':
                  this._setCSSClass(stepArray, 'disabled');
                  break;
              case 'enable':
                  this._resetCSSClass(stepArray, 'disabled');
                  break;
              case 'hide':
                  this._setCSSClass(stepArray, 'hidden');
                  break;
              case 'show':
                  this._resetCSSClass(stepArray, 'hidden');
                  break;
              case 'error-on':
                  this._setCSSClass(stepArray, 'danger');
                  break;
              case 'error-off':
                  this._resetCSSClass(stepArray, 'danger');
                  break;
          }
      }

      setOptions(options) {
          this.options  = $.extend(true, {}, this.options, options);
          this._initOptions();
      }

      getStepIndex() {
          return this.current_index;
      }

      loader(state) {
          if (state === "show") {
              this.main.addClass('sw-loading');
          } else {
              this.main.removeClass('sw-loading');
          }
      }

    }

    // Wrapper for the plugin
    $.fn.smartWizard = function (options) {
        if (options === undefined || typeof options === 'object') {
            return this.each(function () {
                if (!$.data(this, "smartWizard")) {
                    $.data(this, "smartWizard", new SmartWizard(this, options));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            let instance = $.data(this[0], 'smartWizard');

            if (options === 'destroy') {
                $.data(this, 'smartWizard', null);
            }

            if (instance instanceof SmartWizard && typeof instance[options] === 'function') {
                return instance[options].apply(instance, Array.prototype.slice.call(arguments, 1));
            } else {
                return this;
            }
        }
    };
}));
