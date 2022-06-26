CHANGELOG
=========

v6.0.1
-----
- **Added:** Support for jQuery Slim version
- **Added:** Public function `fixHeight`. See http://techlaboratory.net/jquery-smartwizard#func-fixheight
- **Added:** Public function `setState`. See http://techlaboratory.net/jquery-smartwizard#func-setstate https://github.com/techlab/jquery-smartwizard/issues/131
- **Added:** Public function `unsetState`. See http://techlaboratory.net/jquery-smartwizard#func-unsetstate
- **Added:** Public function `getStepInfo` to get step index and total steps. See http://techlaboratory.net/jquery-smartwizard#func-getstepinfo
- **Added:** `goToStep` function with force parameter. See http://techlaboratory.net/jquery-smartwizard#func-gotostep
- **Added:** Built-in progressbar
- **Added:** New themes, Square and Round
- **Added:** Dots and Square these can have progressbar on navigation by adding `nav-progress` CSS Class.
- **Added:** Colors are changable dynamically using CSS variables.
- **Added:** Bootstrap 5 support
- **Added:** Num(badge) class support on all themes
- **Added:** RTL (Right-to-left language) support https://github.com/techlab/jquery-smartwizard/issues/72
- **Added:** `initialized` event . See http://techlaboratory.net/jquery-smartwizard#event-initialized https://github.com/techlab/jquery-smartwizard/issues/118
- **Added:** Move CSS class names to options
- **Added:** Transition animations can be extended
- **Added:** CSS Animations support on transition animations. Supports [Animate.css](https://animate.style/)

- **Changed:** JavaScript and CSS code is rewritten  
- **Changed:** Imporoved all CSS themes
- **Changed:** Made most of the options can changed with `setOptions` function
- **Changed:** Rewritten option names and properties with minimal and meaningful names
- **Changed:** Improved transition animations

- **Fixed:** Reset doesn't clear the existing steps of the error state. https://github.com/techlab/jquery-smartwizard/issues/134
- **Fixed:** `goToStep` method fails to recognize the correct step https://github.com/techlab/jquery-smartwizard/issues/133
- **Fixed:** URL Navigation to check if step visited. https://github.com/techlab/jquery-smartwizard/issues/140
- **Fixed:** Fixed and also added `fixHeight` public function to refresh content height. https://github.com/techlab/jquery-smartwizard/issues/142 https://github.com/techlab/jquery-smartwizard/issues/116 https://github.com/techlab/jquery-smartwizard/issues/88 https://github.com/techlab/jquery-smartwizard/issues/114 https://github.com/techlab/jquery-smartwizard/issues/101
- **Fixed:** CSS Files are empty https://github.com/techlab/jquery-smartwizard/issues/113 
- **Fixed:** stepNumber is incorrect on showStep event when no transition https://github.com/techlab/jquery-smartwizard/issues/112
- **Fixed:** showStep showing Null instead of index 0 on initializing https://github.com/techlab/jquery-smartwizard/issues/109  
- **Fixed:** showStep's stepIndex contains previous index https://github.com/techlab/jquery-smartwizard/issues/103  
- **Fixed:** Content not showing when used inside a Bootrap 4 modal https://github.com/techlab/jquery-smartwizard/issues/98
- **Fixed:** Other fixes https://github.com/techlab/jquery-smartwizard/issues/111 https://github.com/techlab/jquery-smartwizard/issues/107 https://github.com/techlab/jquery-smartwizard/issues/86

- **Removed:** `this.options.toolbar.buttonPosition` is removed
- **Removed:** `cycleNavigation` is removed
- **Removed:** Dark mode is removed. Added CSS variable support to change any colors. See example for dark colors.

v5.1.1
-----
- **Added:** Accessibility
- **Added:** Dark Mode support for all themes
- **Added:**  New theme "Progress"
- **Added:** leaveStep event has new parameter => nextStepIndex
- **Added:** UMD ([Universal Module Definition](https://github.com/umdjs/umd)) support 
- **Changed:** `leaveStep` event has new parameter => `nextStepIndex`
- **Fixed:** `stepDirection` on `leaveStep` event
- **Fixed:** Incorrect stepDirection on leaveStep event (#91)

v5.0.0
-----
**All new jQuery SmartWizard v5**

- **Added:** External Ajax content support via Promise
- **Added:** New navigation animations
- **Added:** New themes
- **Added:** New public functions
- **Added:** New content loading event
- **Added:** Standalone CSS with Bootstrap compatibility
- **Changed:** Complete rewrite of JavaScript and CSS
- **Changed:** CSS to SCSS
- **Changed:** Updated all build packages

v4.4.1
-----
- **Added:** Two new public functions, `goToStep` and `hiddenSteps`.
- **Changed:** Build system packages updated to latest available.

v4.3.1
-----
- **Added:** Bootstrap 4 support added
- **Added:** Yarn package manager added
- **Added:** Ajax loader UI updated
- **Fixed:** Fixes and improvements

v4.2.2
-----
- **Added:** Example for multiple wizard in a page
- **Fixed:** Auto height adjust when content height change after step is shown

v4.2.1
-----
- **Added:** Gulp automation tasks
- **Added:** Validation and bundling
- **Added:** Test file
- **Changed:** Repository structure with `src`, `dist`, `test`

v4.1.7
-----
- **Updated:** Themes (dots and circles)
- **Updated:** Examples pages

v4.1.5
-----
- **Updated:** Updated to v4.1.5
- **Added:** New option `contentCache`
- **Added:** On or Off caching of step contents on ajax calls, if false content is fetched always from ajax url
- **Added:** New option `ajaxSettings`
- **Added:** Extra settings for step ajax content calls

v4.1.2
-----
***Patch version***

- **Changed:** Option `markAllPreviousStepsAsDone` is enabled for `selected` option 
- **Changed:** While reset, set hash is now controllable using `showStepURLhash` option

v4.1.1
-----
- **Added:** New options `showStepURLhash`, `removeDoneStepOnNavigateBack`, `markAllPreviousStepsAsDone`, `hiddenSteps`
- **Added:** New parameter on `showStep` event, name: `stepPosition` values: `first`, `final`, `middle`
- **Added:** New public method, `stepState` to Dynamically disable/enable hide/show steps
- **Added:** Compatible with latest jQuery versions (jQuery 1.9+, jQuery 2+, jQuery 3+)
- **Changed:** Option `toolbarExtraButtons` now accepts elements as jQuery objects
- **Changed:** Code optimized
- **Fixed:** General bugs

v4.0.5
-----
- **Added:** Get direction navigaion on `leaveStep` and `showStep` events
- **Added:** New Events `beginReset`, `endReset`, `themeChanged`
- **Updated:** Example pages

v4.0.1
-----
- **Changed:** Completely rewritten the code from scratch
- **Added:** Bootstrap support
- **Added:** Theme support
- **Added:** Customizable toolbar
