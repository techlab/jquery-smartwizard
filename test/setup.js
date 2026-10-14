const $ = require('jquery');

// Make jQuery available globally
global.$ = global.jQuery = $;

// Mock requestAnimationFrame to execute synchronously
global.requestAnimationFrame = window.requestAnimationFrame = (callback) => {
    return callback(performance.now());
};

global.cancelAnimationFrame = window.cancelAnimationFrame = (id) => {
    // noop
};

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
require('../dist/js/jquery.smartWizard.js');
