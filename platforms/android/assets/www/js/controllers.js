
angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $state) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);


    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

})

/* ----------------------------------------------------------------------------
 * LOGIN CONTROL
 *
 * --------------------------------------------------------------------------*/
.controller('LoginCtrl', function($scope, $state, $rootScope, $http) {

  $scope.responseText = 'mom';
  $scope.login = function(clicky) {
    console.log($scope.loginData);
    console.log(sha256($scope.loginData.password));
    var data = $scope.loginData;
    var hash = sha256(data.password);
    var payload = {u: data.username, p: hash};

    $http({
        url: 'http://is-projects.harding.edu/is410/m/login/index.php',
        method: 'GET',
        cache: false,
        //data: payload,
    }).then(function(response) {
        $scope.responseText = '<span style="color:#fff">' + response.data + '</span>';
        console.log($scope.responseText);
    },
    function(response) {
        $scope.responseText = '<span style="color:#fff">pipipipip</span>';
    });


    if(0)
    {
        $state.go('app.classes');
    }
    else
    {

    }

  }

  $scope.register = function() {
    $rootScope.activated = $scope.loginData.activated;
    console.log('// is reg ');
    if(0)
    {
        $state.go('app.register');
    }
    else
    {

    }
  }

  $scope.isRegistering = null;
  // Enables registration fields
  $scope.enableRegister = function() {
    $scope.isRegistering = true;
  }
})

/* ----------------------------------------------------------------------------
 * REGISTER CONTROL
 *
 * --------------------------------------------------------------------------*/
.controller('RegisterCtrl', function($scope, $state, $rootScope) {
  $scope.isVerified = $rootScope.activated;
  console.log('Entered register state');
  $scope.toClasses = function(hasClasses) {
    console.log('Classes: ' + hasClasses);
      $rootScope.hasClasses = hasClasses;
      $state.go('app.classes');
  }
  $scope.register = function() {

  }
})

/* ----------------------------------------------------------------------------
 * CLASSES CONTROL
 *
 * --------------------------------------------------------------------------*/
.controller('ClassesCtrl', function($scope, $state, $rootScope, $ionicPopup) {
  $scope.classes = [
    { title: 'IS 323', id: 1,  ce: 'yes' },
    { title: 'BUS 435', id: 2, ce: 'yes' },
    { title: 'IS 350', id: 3,  ce: 'no' },
    { title: 'IS 410', id: 4,  ce: 'no' },
    { title: 'ART 101', id: 5, ce: 'yes' },
    { title: 'BOLD 207', id: 6, ce: 'yes' }
  ];

  $scope.newClassId = '';


  $scope.hasClasses = function() {
      return $scope.classes.length > 0 ? true : false;
  }

  $scope.toClass = function(x) {
      console.log(x);
      $state.go('app.custom');
  }

  $scope.changeClass = function() {
      console.log('//business');
      $state.go('app.customize');
  }

  $scope.showPopup = function(option) {
      $scope.data = {};

      var addClassPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="data.newCourseId">',
            title: 'New Course ID',
            subTitle: 'e.g. "IS-323" for a single-section course, "IS-323-2" for section two of a multi-section class',
            scope: $scope,
            buttons: [
              { text: 'Cancel',
                type: 'button-stable'
              },
              {
                text: '<b>Enter</b>',
                type: 'button-assertive',
                onTap: function(e) {
                  if (!$scope.data.newCourseId) {
                    //don't allow the user to close unless he enters wifi password
                    e.preventDefault();

                  // This will simulate
                  } else {
                      console.log('// else');

                    console.log('// call class registration function');

                    // simualate adding class
                    $scope.classes.push({ title: $scope.data.newCourseId, id: 99, ce: 'no' });

                    // does this return to buttons[1]?
                    return $scope.data.newCourseId;
                  }
                }
              }
            ]
      });
  }
})

/* ----------------------------------------------------------------------------
 * CUSTOMIZE CONTROL
 *
 * --------------------------------------------------------------------------*/
.controller('CustomizeCtrl', function($scope, $state) {

    console.log('// Entered customize state');

    $scope.saveDetails = function() {
        $state.go('app.view');
    }

})

/* ----------------------------------------------------------------------------
 * VIEW CONTROL
 *
 * --------------------------------------------------------------------------*/
.controller('ViewCtrl', function($scope) {

  console.log('Entered view state');

    var canvas = document.getElementById('dragonCanvas');
    var context = canvas.getContext('2d');
    var startimg = 'img/image.jpg';

    $scope.draw = function() {
        console.log('// draw called');
        var source =  new Image();
        source.src = startimg;
        canvas.width = source.width;
        canvas.height = source.height;

        console.log(canvas);

        context.drawImage(source,0,0);
    }

    console.log('// calling draw');
    $scope.draw();

});
