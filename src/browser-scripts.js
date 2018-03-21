'use strict'

/* global XMLHttpRequest */

/**
 * Clean up function for removing the wrapped open method and removing gloabl variables.
 */
export function removeListener () {
  if ('_open' in window) {
    XMLHttpRequest.prototype.open = window._open
    delete window._open
    if ('httpRequests' in window) {
      delete window.httpRequests
    }
  }
}
/**
 * Get the captured requests.
 */
export function getRequests () {
  if (window.httpRequests) {
    return window.httpRequests.map(record => {
      if (record.request.responseType !== 'blob') { return record }
      return {
        timing: record.timing,
        request: {
          url: record.request.responseURL,
          status: record.request.status,
          statusText: record.request.statusText,
          responseText: '{ "blob": "redacted" }'
        }
      }
    })
  } else {
    return []
  }
}
/**
 * Add the open listener by wrapping the current function.
 */
export function openListener () {
  return (function (open) {
    window.httpRequests = window.httpRequests || []
    window._open = open
    XMLHttpRequest.prototype.open = function () {
      const record = {
        timing: { init: (new Date().toISOString()) },
        request: this
      }

      window.httpRequests.push(record)
      return open.apply(this, arguments)
    }
  })(XMLHttpRequest.prototype.open)
}
