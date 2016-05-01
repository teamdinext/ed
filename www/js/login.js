/* *********************************************************
 * LOGIN CONTROL
 *
 * ********************************************************/
angular.module('starter.controllers')
.controller('LoginCtrl', function($scope, $rootScope, $state, stateData, $http, errorHandler) {

  $scope.message = '';

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
      $scope.message = response.data;
      if (response.data.loggedIn && response.data.status == "good")
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
      else
      {
        if(response.data.status == "error")
        {
          $scope.message = errorHandler.read(response.data.returned);
        }
      }
      
    },
    function(response) {
        $scope.mesage = response;
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
      $scope.message = response.data;
      data = response.data;
      console.log(data);
      if (response.data.loggedIn && response.data.status == "good")
      {
        state = response.data;
        stateData.set(state);
        $scope.login();
      }
      else
      {
        if(response.data.status == "error")
        {
          $scope.message = errorHandler.read(response.data.returned);
        }
      }
    },
    function(response) {
        $scope.message = response.data;
    });

  }

  $scope.isRegistering = false;
  $scope.pageState = 'Login';
  // Enables registration fields
  $scope.enableRegister = function() {
    $scope.isRegistering = true;
    $scope.message = '';
    $scope.pageState = 'Register';
  }
  $scope.enableLogin = function() {
    console.log('enable login');
    $scope.isRegistering = false;
    $scope.message = '';
    $scope.pageState = 'Login';
  }
})
