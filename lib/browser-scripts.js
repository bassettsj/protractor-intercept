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
      delete window.httpRequests;
    }
  }
}

/**
 * Get the captured requests.
 */

function getRequests() {
  if (window.httpRequests) {
    return window.httpRequests.map(function (record) {
      if (record.request.responseType !== 'blob') {
        return record;
      }
      return {
        timing: record.timing,
        request: {
          url: record.request.responseURL,
          status: record.request.status,
          statusText: record.request.statusText,
          responseText: '{ "blob": "redacted" }'
        }
      };
    });
  } else {
    return [];
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
      var record = {
        timing: { init: new Date().toISOString() },
        request: this
      };

      window.httpRequests.push(record);
      return open.apply(this, arguments);
    };
  })(XMLHttpRequest.prototype.open);
}
//# sourceMappingURL=browser-scripts.js.map