'use strict'

/* global XMLHttpRequest */

/**
 * Clean up function for removing the wrapped open method and removing gloabl variables.
 */
var removeListener = `
return (function () {
    if ('_open' in window) {
      XMLHttpRequest.prototype.open = window._open
      delete window._open
      if ('httpRequests' in window) {
        var requests = window.httpRequests
        delete window.httpRequests
        return requests
      }
    }
})()
`
/**
 * Get the captured requests.
 */
var getRequests = `return window.httpRequests`

/**
 * Add the open listener by wrapping the current function.
 */
function openListener() {
  return (function (open) {
    window.httpRequests = []
    window._open = open
    XMLHttpRequest.prototype.open = function () {
      httpRequests.push(this)
      return open.apply(this, arguments)
    }
  })(XMLHttpRequest.prototype.open)
}


export default class Intercept {
  constructor (browser) {
    this._browser = browser
  }
  addListener () {
    return this._browser.executeScript(openListener)
  }

  getRequests () {
    return this._browser.executeScript(getRequests)
  }
  removeListener () {
    return this._browser.executeScript(removeListener)
  }
}
