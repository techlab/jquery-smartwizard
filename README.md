# jQuery Smart Wizard 4
#### The awesome jQuery step wizard plugin with Bootstrap support.     

> **Compatible with `Bootstrap 4` from version `v4.3.1`**   

[![Build Status](https://travis-ci.org/techlab/SmartWizard.svg?branch=master)](https://travis-ci.org/techlab/SmartWizard)
[![npm version](https://badge.fury.io/js/smartwizard.svg)](https://badge.fury.io/js/smartwizard)
[![Bower version](https://badge.fury.io/bo/smartwizard.svg)](https://badge.fury.io/bo/smartwizard)
[![Latest Stable Version](https://poser.pugx.org/techlab/smartwizard/v/stable)](https://packagist.org/packages/techlab/smartwizard)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/techlab/SmartWizard/master/LICENSE)
[![Donate on Paypal](https://img.shields.io/badge/PayPal-dipuraj-blue.svg)](https://www.paypal.me/dipuraj)

Smart Wizard is a flexible and heavily customizable **jQuery step wizard plugin** with **Bootstrap** support. It is easy to implement and gives a neat and stylish interface for your forms, checkout screen, registration steps etc. Based on the feedback from our users over the past years we have come up with the **best ever built jQuery wizard plugin of all time**, all new Smart Wizard 4. The plugin is been completely rewritten from scratch, made it more powerful, robust, scalable and customizable. We have added a lot of features not limited to Bootstrap 4 support, themes, customizable toolbars, customizable options, public methods, event support and a lot more. See the list of [features](http://techlaboratory.net/smartwizard#features), [demos](http://techlaboratory.net/smartwizard/demo) and [documentation](http://techlaboratory.net/smartwizard/documentation) for more details.

+ [Homepage](http://techlaboratory.net/smartwizard)
+ [Documentation](http://techlaboratory.net/smartwizard/documentation)
+ [Demos](http://techlaboratory.net/smartwizard/demo)
+ [StackOverflow Q&A](http://stackoverflow.com/questions/tagged/smart-wizard)
+ [GitHub Issues](https://github.com/techlab/SmartWizard/issues)

Screenshots
-----
![Smart Wizard Screenshot1](http://techlaboratory.net/assets/media/products/SmartWizard43_1.png?v1)   

![Smart Wizard Screenshot2](http://techlaboratory.net/assets/media/products/SmartWizard43_2.png?v1)   

![Smart Wizard Screenshot3](http://techlaboratory.net/assets/media/products/SmartWizard43_3.png?v1)   

Demos
-----
  + [Basic Example](http://techlaboratory.net/smartwizard/demo/basic)
  + [Ajax Contents](http://techlaboratory.net/smartwizard/demo/ajax)
  + [Input Validation](http://techlaboratory.net/smartwizard/demo/validation)
  + [Events](http://techlaboratory.net/smartwizard/demo/events)
  + [With Modal Dialog](http://techlaboratory.net/smartwizard/demo/modal-dialog)

Requirements
-----
  + [Bootstrap 4.0.0](http://getbootstrap.com/getting-started/#download)
  + [jQuery](http://jquery.com/) (supports jQuery 1.9+, jQuery 2+ and jQuery 3+)

Installation
-----

### [NPM](https://www.npmjs.com/package/smartwizard)
    npm install smartwizard

### [Yarn](https://yarn.pm/smartwizard)
    yarn add smartwizard

### Bower
    bower install smartwizard

### [Composer](https://packagist.org/packages/techlab/smartwizard)
    composer require techlab/smartwizard

### Download
#### [Download from GitHub](https://github.com/techlab/SmartWizard/archive/master.zip)    

Usage
-----

Include Bootstrap CSS (*ignore this if you have already included on the page*).
```html
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" >
```
Include SmartWizard CSS
```html
<link href="../dist/css/smart_wizard.css" rel="stylesheet" type="text/css" />
```
Optionally, if you want to use the theme include the corresponding theme css
```html
<link href="../dist/css/smart_wizard_theme_arrows.css" rel="stylesheet" type="text/css" />
```
Include HTML (*This is the basic HTML markup for the Smart Wizard. You can customize it by adding your on steps contents*).
```html
<div id="smartwizard">
    <ul>
        <li><a href="#step-1">Step Title<br /><small>Step description</small></a></li>
        <li><a href="#step-2">Step Title<br /><small>Step description</small></a></li>
        <li><a href="#step-3">Step Title<br /><small>Step description</small></a></li>
        <li><a href="#step-4">Step Title<br /><small>Step description</small></a></li>
    </ul>

    <div>
        <div id="step-1" class="">
            Step Content
        </div>
        <div id="step-2" class="">
            Step Content
        </div>
        <div id="step-3" class="">
            Step Content
        </div>
        <div id="step-4" class="">
            Step Content
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
<script type="text/javascript" src="../dist/js/jquery.smartWizard.min.js"></script>
```
Initialize the SmartWizard
```javascript
<script type="text/javascript">
$(document).ready(function(){

    $('#smartwizard').smartWizard();

});
</script>
```
That's it! Now you see the wizard on the page.  
Please see the [documentation](http://techlaboratory.net/smartwizard/documentation) for more deatils on implementation and usage.  

Features
-----
  + Bootstrap 3 & 4 support
  + Responsive themes
  + Heavily customizable toolbar, option to add extra buttons
  + Theme support with various themes included
  + Customizable css styles
  + Url navigation and step selection
  + Public methods for external function call
  + Enhanced event support
  + In-built wizard reset method
  + Ajax content loading with option to specify individual url for steps
  + Keyboard navigation
  + Easy navigation with step anchors and navigation buttons
  + Multiple wizard instance on same page
  + Integratable to model window  
  + Dynamically hide or disable steps
  + Auto content height adjustment
  + Compatible with latest jQuery versions (jQuery 1.9+, jQuery 2+, jQuery 3+)
  + Easy to implement, Minimal HTML required
  + and a lot more...  

> Please use jQuery full version (`jquery-3.3.x.min.js`) as the jQuery slim version (`jquery-3.3.x.slim.min.js`) is not yet supported.

License
----
[MIT License](https://github.com/techlab/SmartWizard/blob/master/LICENSE)

Contribute
----
If you like the project please support with your contribution.

[Donate on Paypal](https://www.paypal.me/dipuraj)

Thank you :)
