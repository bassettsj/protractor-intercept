'use strict'

import {removeListener, getRequests, openListener} from './browser-scripts.js'

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
