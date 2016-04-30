/* *********************************************************
 *
 * CLASSES CONTROL
 *
 * ********************************************************/
angular.module('starter.controllers')
.controller('ClassesCtrl', function($scope, $rootScope, $state, $http, $ionicPopup, courseManager, stateData, errorHandler) {
  var state = stateData.get();
  if ( state.loggedIn !== true) $state.go('app.login');

  $scope.classes = [
  ];
  $scope.canvas = {};

  if(state.classes)
    $scope.classes = state.classes;
  $scope.newClassId = '';

  // executed on view enter
  $scope.$on('$ionicView.enter', function(e) {
    courseManager.internal.list(state.userId, $scope);
    courseManager.canvas.list(state.userId);



  });

  $scope.hasClasses = function() {
      return $scope.classes.length > 0 ? true : false;
  }

  $scope.changeClass = function(id) {
      console.log('//business');
      if (state.others == undefined)
        state.others = Object.create(null);

      // why is state not set?
      state.others.currentClass = id;
      $state.go('app.class');
  }

  $scope.showPopup = function(option) {
    $scope.data = {};

    var addClassPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="data.newCourseId">',
      title: 'New Course CRN',
      subTitle: 'Please enter the CRN number of your course.',
      scope: $scope,
      buttons: [
        { text: 'Cancel',
          type: 'button-stable'
        },
        {
          text: '<b>Enter</b>',
          type: 'button-assertive',
          onTap: function(e) {
            if  (!$scope.data.newCourseId) {

            // This will simulate
            } else {
              console.log('// else');


              // set .others.crn to value of input
              var state = stateData.get();
              
              if (state.others === undefined)
                state.others = Object.create(null);

              state.classes = $scope.classes;
              state.others.crn = $scope.data.newCourseId;
              stateData.set(state);

              console.log('// trying to go to teams');
              $state.go('app.teams');


              // does this return to buttons[1]?
              return $scope.data.newCourseId;
            }
          }
        }
      ]
    });
  }
});