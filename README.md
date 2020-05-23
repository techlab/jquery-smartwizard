# jQuery Smart Wizard v5
#### The awesome jQuery step wizard plugin.

[![Build Status](https://travis-ci.org/techlab/jquery-smartwizard.svg?branch=master)](https://travis-ci.org/techlab/jquery-smartwizard)
[![npm version](https://badge.fury.io/js/smartwizard.svg)](https://badge.fury.io/js/smartwizard)
[![Latest Stable Version](https://poser.pugx.org/techlab/smartwizard/v/stable)](https://packagist.org/packages/techlab/smartwizard)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/techlab/jquery-smartwizard/master/LICENSE)
[![Donate on Paypal](https://img.shields.io/badge/PayPal-dipuraj-blue.svg)](https://www.paypal.me/dipuraj)


**jQuery Smart Wizard** is a step wizard plugin for jQuery.
Provides a neat and stylish interface for your forms, checkout screen, registration steps, etc.
Easy implementation,  Bootstrap compatiblity, customizable toolbars, themes, events and Ajax support are few of the features.


+ [Homepage](http://techlaboratory.net/jquery-smartwizard)
+ [Documentation](http://techlaboratory.net/jquery-smartwizard#documentation)
+ [Demos](http://techlaboratory.net/jquery-smartwizard#demo)
+ [StackOverflow Q&A](http://stackoverflow.com/questions/tagged/smart-wizard)
+ [GitHub Issues](https://github.com/techlab/jquery-smartwizard/issues)

Demos
-----
+ [Basic Example](http://techlaboratory.net/projects/demo/jquery-smart-wizard/v5)
+ [Ajax Example](http://techlaboratory.net/projects/demo/jquery-smart-wizard/v5/ajax)
+ [Multiple Wizard Example](http://techlaboratory.net/projects/demo/jquery-smart-wizard/v5/multiple)

Screenshots
-----
![Smart Wizard Default](http://techlaboratory.net/assets/media/jquery-smart-wizard/jquery-smartwizard-v5-default.png)   

![Smart Wizard Arrows](http://techlaboratory.net/assets/media/jquery-smart-wizard/jquery-smartwizard-v5-arrows.png)   

![Smart Wizard Black](http://techlaboratory.net/assets/media/jquery-smart-wizard/jquery-smartwizard-v5-dark.png)   

![Smart Wizard Dots](http://techlaboratory.net/assets/media/jquery-smart-wizard/jquery-smartwizard-v5-dots.png)  


Requirements
-----
  + [jQuery](http://jquery.com/) (supports from jQuery-1.11.1+ to the latest jQuery-3.5)

Installation
-----

### [NPM](https://www.npmjs.com/package/smartwizard)
    npm install smartwizard

### [Yarn](https://yarn.pm/smartwizard)
    yarn add smartwizard

### [Composer](https://packagist.org/packages/techlab/smartwizard)
    composer require techlab/smartwizard

### Download
#### [Download from GitHub](https://github.com/techlab/jquery-smartwizard/archive/master.zip)

Features
-----

- Standalone CSS
- Bootstrap compatible
- Various themes included
- Customizable CSS
- URL navigation and selection
- Event support
- Ajax content loading support
- Keyboard navigation
- Auto content height adjustment
- Cool transition animations (fade/slide-horizontal/slide-vertical/slide-swing)
- External anchor support
- Easy to implement and minimal HTML required
- Customizable toolbar, option to add extra buttons
- Compatible with all jQuery versions (jQuery 1.11.1+, jQuery 2+, jQuery 3.5+)
- Supports all modern browsers
- Responsive design
- In-built reset method
- Easy navigation with step anchors and navigation buttons

Usage
-----

Include SmartWizard CSS
```html
<link href="../dist/css/smart_wizard_all.min.css" rel="stylesheet" type="text/css" />
```

Include HTML (*This is the basic HTML markup for the Smart Wizard. You can customize it by adding your on steps content*).
```html
<div id="smartwizard">

    <ul class="nav">
        <li class="nav-item">
          <a class="nav-link" href="#step-1">
            Step 1
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#step-2">
            Step 2
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#step-3">
            Step 3
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#step-4">
            Step 4
          </a>
        </li>
    </ul>

    <div class="tab-content">
        <div id="step-1" class="tab-pane" role="tabpanel" aria-labelledby="step-1">
            Step 1 Content
        </div>
        <div id="step-2" class="tab-pane" role="tabpanel" aria-labelledby="step-2">
            Step 2 Content
        </div>
        <div id="step-3" class="tab-pane" role="tabpanel" aria-labelledby="step-3">
            Step 3 Content
        </div>
        <div id="step-4" class="tab-pane" role="tabpanel" aria-labelledby="step-4">
            Step 4 Content
        </div>
    </div>
</div>
```

Include jQuery (*ignore this if you have already included on the page*).  
```html
<script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
```

Include SmartWizard plugin
```html
<script src="../dist/js/jquery.smartWizard.min.js" type="text/javascript"></script>
```
Initialize the SmartWizard
```html
<script type="text/javascript">
$(document).ready(function() {

    $('#smartwizard').smartWizard();

});
</script>
```
That's it!   

Please see the [documentation](http://techlaboratory.net/jquery-smartwizard#documentation) for more details on implementation and usage.  

##### All options

```JavaScript
$('#smartwizard').smartWizard({
    selected: 0, // Initial selected step, 0 = first step
    theme: 'default', // theme for the wizard, related css need to include for other than default theme
    justified: true, // Nav menu justification. true/false
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
});
```

License
----
[MIT License](https://github.com/techlab/jquery-smartwizard/blob/master/LICENSE)

Contribute
----
If you like the project please support with your contribution.

[Donate on Paypal](https://www.paypal.me/dipuraj)

Thank you :)
