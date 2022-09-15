// Polyfill "window.fetch" used in the React component.
global.fetch = require('whatwg-fetch').fetch;
