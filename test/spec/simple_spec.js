/* global describe,it,browser,element,expect */
require('babel/register')
var Interceptor = require('../../src/index')
var intercept = new Interceptor(browser)
// spec.js
describe('Interceptor', function () {
  describe('should have basic functionality', function () {
    var button
    it('should pass basic thing', function () {
      button = element(by.id('getUsers'))
      browser.get('http://127.0.0.1:9991')
    })

    it('should add the listener', function () {
      intercept.addListener()

      browser.executeScript('return \'_open\' in window &&  \'httpRequests\' in window').then(function (result) {
        expect(result).toBeTruthy()
      })
    })

    it('should pickup all XMLHttpRequest open calls', function() {
      button.click()
      intercept.getRequests().then(function (results) {
        expect(results.length).toEqual(1)
      })
    })


    it('should cleanup the context', function () {
      intercept.removeListener()
      browser.executeScript('return \'_open\' in window || \'httpRequests\' in window')
        .then(function (result) {
          expect(result).not.toBeTruthy()
        })
    })
  })
})
