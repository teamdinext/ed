/* *********************************************************
 * LOGIN CONTROL
 *
 * ********************************************************/
angular.module('starter.controllers')
.controller('LoginCtrl', function($scope, $rootScope, $state, stateData, $http) {

  $scope.responseText = '';

  /*********************************************************
   *
   * login function
   *
   */
  $scope.login = function(clicky) {

    //get data to send, hash password
    var data = $scope.loginData;
    //var hash = sha256(data.password);
    var URL = rootURL + '/login/';
    var payload = {username: data.username, password: data.password};
    var state = Object.create(null);

    $http({
        url: URL,
        method: 'POST',
        //cache: false,
        data: payload
    }).then(function(response) {
      $scope.responseText = response.data;
      if (response.data.loggedIn)
      {
        var state = {};
        data = response.data;
        console.log(data);
        if (data.loggedIn == true)
        {
          state = response.data;
          stateData.set(state);
          $state.go('app.classes');
        }
      }
    },
    function(response) {
        $scope.responseText = '<span style="colour:#fff">pipipipip</span>';
    });

  }

  /********************************************************
   *
   * register function
   *
   */
  $scope.register = function() {
    var data = $scope.loginData;
    console.log(data);
    var payload = {username: data.username, password: data.password};
    var state = Object.create(null);
    var URL = rootURL + 'register/';

    $http({
        url: URL,
        method: 'POST',
        //cache: false,
        data: data 
    }).then(function(response) {
      $scope.responseText = response.data;
      data = response.data;
      console.log(data);
      if (data == 'y')
      {
        state = response.data;
        stateData.set(state);
        $scope.login();
      }
    },
    function(response) {
        $scope.responseText = '<span style="colour:#fff">pipipipip</span>';
    });

  }

  $scope.isRegistering = null;
  // Enables registration fields
  $scope.enableRegister = function() {
    $scope.isRegistering = true;
  }
})
