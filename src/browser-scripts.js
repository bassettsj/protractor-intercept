'use strict'

/* global XMLHttpRequest */

/**
 * Clean up function for removing the wrapped open method and removing gloabl variables.
 */
export function removeListener () {
  try {
    if ('_open' in window) {
      XMLHttpRequest.prototype.open = window._open
      delete window._open
      if ('httpRequests' in window) {
        delete window.httpRequests
      }
    }
  } catch (e) {
    console.error(`Protractor Browser Interceptor removeListener error: `, e)
  }
}
/**
 * Get the captured requests.
 */
export function getRequests () {
  try {
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
  } catch (e) {
  console.error(`Protractor Browser Interceptor removeListener error: `, e)
  }
}
/**
 * Add the open listener by wrapping the current function.
 */
export function openListener () {
  try {
    return (function (open) {
      window.httpRequests = window.httpRequests || []
      window._open = open
      XMLHttpRequest.prototype.open = function () {
        // NB window._Date is the "real" Date when we use lolex to advance browser time
        function getTimeStamp () {
          return (window._Date)
            ? (new window._Date()).toISOString()
            : (new Date()).toISOString()
        }

        const record = {
          timing: { init: getTimeStamp() },
          request: this
        }


        this.addEventListener('loadstart', function () { record.timing['loadstart'] = getTimeStamp() })
        this.addEventListener('abort', function () { record.timing['abort'] = getTimeStamp() })
        this.addEventListener('error', function () { record.timing['error'] = getTimeStamp() })
        this.addEventListener('load', function () { record.timing['load'] = getTimeStamp() })
        this.addEventListener('timeout', function () { record.timing['timeout'] = getTimeStamp() })
        this.addEventListener('loadend', function () { record.timing['loadend'] = getTimeStamp() })

        window.httpRequests.push(record)
        return open.apply(this, arguments)
      }
    })(XMLHttpRequest.prototype.open)
  } catch (e) {
    console.error(`Protractor Browser Interceptor removeListener error: `, e)
  }
}
