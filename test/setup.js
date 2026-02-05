const $ = require('jquery');

// Make jQuery available globally
global.$ = global.jQuery = $;

// Mock window.matchMedia (used by some CSS features)
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Initialize SmartWizard plugin
// This loads the built UMD file to test the actual output
require('../dist/js/jquery.smartWizard.js');
