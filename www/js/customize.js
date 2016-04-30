/* *********************************************************
 *
 * CUSTOMIZE CONTROL
 *
 * ********************************************************/
angular.module('starter.controllers')
.controller('CustomizeCtrl', function($scope, $state) {

    console.log('// Entered customize state');

    $scope.saveDetails = function() {
        $state.go('app.view');
    }
});