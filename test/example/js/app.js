angular.module('example', [])
  .controller('MainCtrl', ['$http', MainCtrl])


function MainCtrl ($http) {
  this.users = []
  this.getUsers = function() {
    $http.get('/api/users').success(function (data) {
      this.users = data
    }.bind(this))
  }
}
