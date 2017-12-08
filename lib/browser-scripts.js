'use strict';

/* global XMLHttpRequest */

/**
 * Clean up function for removing the wrapped open method and removing gloabl variables.
 */
Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.removeListener = removeListener;
exports.getRequests = getRequests;
exports.openListener = openListener;

function removeListener() {
  if ('_open' in window) {
    XMLHttpRequest.prototype.open = window._open;
    delete window._open;
    if ('httpRequests' in window) {
      var requests;

      if (window.httpRequests) {
        requests = window.httpRequests.filter(function (x) {
          return x.responseType !== 'blob';
        });
      } else {
        requests = window.httpRequests;
      }

      delete window.httpRequests;
      return requests;
    }
  }
}

/**
 * Get the captured requests.
 */

function getRequests() {
  if (window.httpRequests) {
    return window.httpRequests.filter(function (x) {
      return x.responseType !== 'blob';
    });
  } else {
    return window.httpRequests;
  }
}

/**
 * Add the open listener by wrapping the current function.
 */

function openListener() {
  return (function (open) {
    window.httpRequests = window.httpRequests || [];
    window._open = open;
    XMLHttpRequest.prototype.open = function () {
      window.httpRequests.push(this);
      return open.apply(this, arguments);
    };
  })(XMLHttpRequest.prototype.open);
}
//# sourceMappingURL=browser-scripts.js.map