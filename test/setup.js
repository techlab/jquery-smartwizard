const $ = require('jquery');
global.$ = global.jQuery = $;

// Add TextEncoder and TextDecoder polyfills
const util = require('util');
global.TextEncoder = util.TextEncoder;
global.TextDecoder = util.TextDecoder;

// Mock window and document for jQuery plugin
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'http://localhost'
});

global.window = dom.window;
global.document = dom.window.document;
global.navigator = {
    userAgent: 'node.js'
};

// Initialize SmartWizard plugin
require('../dist/js/jquery.smartWizard.js');
