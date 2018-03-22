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
  try {
    if ('_open' in window) {
      XMLHttpRequest.prototype.open = window._open;
      delete window._open;
      if ('httpRequests' in window) {
        delete window.httpRequests;
      }
    }
  } catch (e) {
    console.error('Protractor Browser Interceptor removeListener error: ', e);
  }
}

/**
 * Get the captured requests.
 */

function getRequests() {
  try {
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
  } catch (e) {
    console.error('Protractor Browser Interceptor removeListener error: ', e);
  }
}

/**
 * Add the open listener by wrapping the current function.
 */

function openListener() {
  try {
    return (function (open) {
      window.httpRequests = window.httpRequests || [];
      window._open = open;
      XMLHttpRequest.prototype.open = function () {
        var record = {
          timing: { init: new Date().toISOString() },
          request: this
        };

        this.addEventListener('loadstart', function () {
          record.timing['loadstart'] = new Date().toISOString();
        });
        this.addEventListener('abort', function () {
          record.timing['abort'] = new Date().toISOString();
        });
        this.addEventListener('error', function () {
          record.timing['error'] = new Date().toISOString();
        });
        this.addEventListener('load', function () {
          record.timing['load'] = new Date().toISOString();
        });
        this.addEventListener('timeout', function () {
          record.timing['timeout'] = new Date().toISOString();
        });
        this.addEventListener('loadend', function () {
          record.timing['loadend'] = new Date().toISOString();
        });

        window.httpRequests.push(record);
        return open.apply(this, arguments);
      };
    })(XMLHttpRequest.prototype.open);
  } catch (e) {
    console.error('Protractor Browser Interceptor removeListener error: ', e);
  }
}
//# sourceMappingURL=browser-scripts.js.map