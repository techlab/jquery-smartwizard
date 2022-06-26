# jQuery Smart Wizard v6
### The awesome step wizard plugin for jQuery 

[![Build Status](https://travis-ci.org/techlab/jquery-smartwizard.svg?branch=master)](https://travis-ci.org/techlab/jquery-smartwizard)
[![npm version](https://badge.fury.io/js/smartwizard.svg)](https://www.npmjs.com/package/smartwizard)
[![jsDelivr Hits](https://data.jsdelivr.com/v1/package/npm/smartwizard/badge?style=rounded)](https://www.jsdelivr.com/package/npm/smartwizard)
[![Npm Downloadsl](https://badgen.net/npm/dm/smartwizard?icon=npm)](https://www.npmjs.com/package/smartwizard)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/techlab/jquery-smartwizard/master/LICENSE)
[![GitHub Repo](https://badgen.net/badge/icon/jquery-smartwizard?icon=github&label=&color=0da4d3)](https://github.com/techlab/jquery-smartwizard)
[![GitHub Sponsor](https://img.shields.io/badge/Sponsor-techlab-blue.svg?logo=github)](https://github.com/sponsors/techlab)
[![Donate on Paypal](https://img.shields.io/badge/PayPal-dipuraj-blue.svg)](https://www.paypal.me/dipuraj)


**jQuery Smart Wizard** is an accessible step wizard plugin for jQuery. Provides a neat, usable and stylish user interface for your forms, checkout screen, registration process, etc. Easy to implement, Bootstrap compatiblity, customizable toolbars, themes and colors, events and Ajax support are few of the features.

+ [Homepage](https://techlaboratory.net/jquery-smartwizard)
+ [Documentation](https://techlaboratory.net/jquery-smartwizard#documentation)
+ [Demos](https://techlaboratory.net/jquery-smartwizard#demo)
+ [StackOverflow Q&A](https://stackoverflow.com/questions/tagged/smart-wizard)
+ [GitHub Issues](https://github.com/techlab/jquery-smartwizard/issues)

Demos
-----
+ [Basic Example](https://techlaboratory.net/projects/demo/jquery-smart-wizard/v6)
+ [Form Validation Example](https://techlaboratory.net/projects/demo/jquery-smart-wizard/v6/validation)
+ [Ajax Content Example](https://techlaboratory.net/projects/demo/jquery-smart-wizard/v6/ajax)
+ [Multiple Wizard Example](https://techlaboratory.net/projects/demo/jquery-smart-wizard/v6/multiple)
+ [Bootstrap Modal Example](https://techlaboratory.net/projects/demo/jquery-smart-wizard/v6/bootstrap-modal)
+ [RTL (Right-to-left Language) Example](https://techlaboratory.net/projects/demo/jquery-smart-wizard/v6/rtl)

Screenshots
-----
![Smart Wizard Demo](https://techlaboratory.net/assets/media/jquery-smart-wizard/v6/gif/sw-6-validation.gif)  

![Smart Wizard Demo](https://techlaboratory.net/assets/media/jquery-smart-wizard/v6/gif/sw-6-basic-green.gif)   

![Smart Wizard Arrows Dark](https://techlaboratory.net/assets/media/jquery-smart-wizard/v6/sw-6-arrows-dark.png)   

![Smart Wizard Round](https://techlaboratory.net/assets/media/jquery-smart-wizard/v6/sw-6-round-lite-blue.png) 

![Smart Wizard Dots](https://techlaboratory.net/assets/media/jquery-smart-wizard/v6/sw-6-dots-red.png)

Requirements
-----
  + [jQuery](https://jquery.com/)

Installation
-----

### [NPM](https://www.npmjs.com/package/smartwizard)
    npm install smartwizard

### [Yarn](https://yarn.pm/smartwizard)
    yarn add smartwizard

### [CDN - jsDelivr](https://www.jsdelivr.com/package/npm/smartwizard)
```html
<!-- CSS -->
<link href="https://cdn.jsdelivr.net/npm/smartwizard@6/dist/css/smart_wizard_all.min.css" rel="stylesheet" type="text/css" />

<!-- JavaScript -->
<script src="https://cdn.jsdelivr.net/npm/smartwizard@6/dist/js/jquery.smartWizard.min.js" type="text/javascript"></script>
```    
### [CDN - UNPKG](https://unpkg.com/browse/smartwizard/)
```html
<!-- CSS -->
<link href="https://unpkg.com/smartwizard@6/dist/css/smart_wizard_all.min.css" rel="stylesheet" type="text/css" />

<!-- JavaScript -->
<script src="https://unpkg.com/smartwizard@6/dist/js/jquery.smartWizard.min.js" type="text/javascript"></script>
```

### Download
#### [Download from GitHub](https://github.com/techlab/jquery-smartwizard/archive/master.zip)

Features
-----
- Easy to implement and minimal HTML required
- Supports all modern browsers
- Responsive CSS design
- Bootstrap compatible
- Cool themes included and can be easly customize
- Easy color cusomization using CSS variables
- Built-in transition animations (none|fade|slideHorizontal|slideVertical|slideSwing|css)
- Transition animations can be added easly by extending
- CSS Animations support for transition animations (Supports [Animate.css](https://animate.style/))
- Form validation support
- RTL(Right-to-left language) support
- Accessible controls
- External controls support
- Easy ajax content integration
- Keyboard navigation
- Auto content height adjustment
- Customizable toolbar and option to provide extra HTML
- Buit-in progressbar
- Buit-in loader
- Buit-in events
- UMD (Universal Module Definition) support
- Compatible with all jQuery versions (jQuery 1.11.1+, jQuery 3.6+, and jQuery Slim)

Usage
-----

Include SmartWizard CSS
```html
<link href="https://cdn.jsdelivr.net/npm/smartwizard@6/dist/css/smart_wizard_all.min.css" rel="stylesheet" type="text/css" />
```

Include HTML (*This is the basic HTML markup for the Smart Wizard. You can customize it by adding your on steps content*).
```html
<!-- SmartWizard html -->
<div id="smartwizard">
    <ul class="nav">
        <li class="nav-item">
          <a class="nav-link" href="#step-1">
            <div class="num">1</div>
            Step Title
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#step-2">
            <span class="num">2</span>
            Step Title
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#step-3">
            <span class="num">3</span>
            Step Title
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link " href="#step-4">
            <span class="num">4</span>
            Step Title
          </a>
        </li>
    </ul>

    <div class="tab-content">
        <div id="step-1" class="tab-pane" role="tabpanel" aria-labelledby="step-1">
            Step content
        </div>
        <div id="step-2" class="tab-pane" role="tabpanel" aria-labelledby="step-2">
            Step content
        </div>
        <div id="step-3" class="tab-pane" role="tabpanel" aria-labelledby="step-3">
            Step content
        </div>
        <div id="step-4" class="tab-pane" role="tabpanel" aria-labelledby="step-4">
            Step content
        </div>
    </div>

    <!-- Include optional progressbar HTML -->
    <div class="progress">
      <div class="progress-bar" role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
    </div>
</div>
```

Include jQuery (*ignore this if you have already included on the page*).  
```html
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
```

Include SmartWizard plugin JavaScript
```html
<script src="https://cdn.jsdelivr.net/npm/smartwizard@6/dist/js/jquery.smartWizard.min.js" type="text/javascript"></script>
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

Please see the detailed [documentation](https://techlaboratory.net/jquery-smartwizard#documentation) for implementation and usage.  

##### All options

```JavaScript
$('#smartwizard').smartWizard({
  selected: 0, // Initial selected step, 0 = first step
  theme: 'basic', // theme for the wizard, related css need to include for other than basic theme
  justified: true, // Nav menu justification. true/false
  autoAdjustHeight: true, // Automatically adjust content height
  backButtonSupport: true, // Enable the back button support
  enableUrlHash: true, // Enable selection of the step based on url hash
  transition: {
      animation: 'none', // Animation effect on navigation, none|fade|slideHorizontal|slideVertical|slideSwing|css(Animation CSS class also need to specify)
      speed: '400', // Animation speed. Not used if animation is 'css'
      easing: '', // Animation easing. Not supported without a jQuery easing plugin. Not used if animation is 'css'
      prefixCss: '', // Only used if animation is 'css'. Animation CSS prefix
      fwdShowCss: '', // Only used if animation is 'css'. Step show Animation CSS on forward direction
      fwdHideCss: '', // Only used if animation is 'css'. Step hide Animation CSS on forward direction
      bckShowCss: '', // Only used if animation is 'css'. Step show Animation CSS on backward direction
      bckHideCss: '', // Only used if animation is 'css'. Step hide Animation CSS on backward direction
  },
  toolbar: {
      position: 'bottom', // none|top|bottom|both
      showNextButton: true, // show/hide a Next button
      showPreviousButton: true, // show/hide a Previous button
      extraHtml: '' // Extra html to show on toolbar
  },
  anchor: {
      enableNavigation: true, // Enable/Disable anchor navigation 
      enableNavigationAlways: false, // Activates all anchors clickable always
      enableDoneState: true, // Add done state on visited steps
      markPreviousStepsAsDone: true, // When a step selected by url hash, all previous steps are marked done
      unDoneOnBackNavigation: false, // While navigate back, done state will be cleared
      enableDoneStateNavigation: true // Enable/Disable the done state navigation
  },
  keyboard: {
      keyNavigation: true, // Enable/Disable keyboard navigation(left and right keys are used if enabled)
      keyLeft: [37], // Left key code
      keyRight: [39] // Right key code
  },
  lang: { // Language variables for button
      next: 'Next',
      previous: 'Previous'
  },
  disabledSteps: [], // Array Steps disabled
  errorSteps: [], // Array Steps error
  warningSteps: [], // Array Steps warning
  hiddenSteps: [], // Hidden steps
  getContent: null // Callback function for content loading
});
```

License
----
[MIT License](https://github.com/techlab/jquery-smartwizard/blob/master/LICENSE)

Contribute
----
If you like the project please support with your contribution.

[GitHub Sponsor](https://github.com/sponsors/techlab)  
[Donate on Paypal](https://www.paypal.me/dipuraj)

Happy Coding :heart:
