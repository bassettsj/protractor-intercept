/* global describe,it,browser,element */
require('babel/register')
var Interceptor = require('../../src/index')
var intercept = new Interceptor(browser)
// spec.js
describe('Protractor Demo App', function () {
  it('should add one and two', function () {
    var button = element(by.id('getUsers'))
    browser.get('http://127.0.0.1:9991')
    intercept.addListener()
    browser.pause()
    button.click()
    intercept.getRequests().then(function (results) {
      expect(results.length).toEqual(100)
    })
  })
})
