function userState() {
    var state = 
      {loggedIn: false,
       userName: '',
       userId  : 0};

    function setStatus(input) {
      if(input.loggedIn != undefined)
        state.loggedIn = input.loggedIn;
      if(input.userName != undefined || input.userName != '')
        state.userName = input.userName;
      if(input.userId != undefined || input.userId != '')
        state.userId = input.userId;

    }

    function getStatus() {
      return state;
    }

    // expose a public API
    returnObj = 
      {get: getStatus,
       set: setStatus}
     return returnObj;
}
//var stateData = userState();
var rootURL = 'http://www.engagingdragons.com/is410/m/';

angular.module('starter.controllers', [])
.factory('stateData', userState)
.controller('AppCtrl', function($scope, $ionicModal, $timeout, $state, stateData) {

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
.controller('LoginCtrl', function($scope, $state, stateData, $http) {

  $scope.responseText = 'mom';
  $scope.login = function(clicky) {
    var data = $scope.loginData;
    var hash = sha256(data.password);
    var URL = 'http://is-projects.harding.edu/is410/m/login/index.php';
    //var URL = 'http://is-projects.harding.edu/IS410/groupedit/roster.php';
    var payload = {u: data.usertitle, p: hash};
    //var payload = {"teamId": "9"};
    var state = new Object();

    $http({
        url: URL,
        method: 'GET',
        //cache: false,
        //data: payload
    }).then(function(response) {
        $scope.responseText = response.data;
        if(response.data && response.data.length > 1)
        {
          var state = 
            {loggedIn: true,
             userName: 'Franklin',
             userId  : 3}
          stateData.set(state);
          $state.go('app.classes');
        }
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
.controller('ClassesCtrl', function($scope, $state, stateData, $http, $ionicPopup) {
  console.log(stateData.get());
  /*
  $scope.classes = [
    { title: 'IS 323', id: 1,  ce: 'yes' },
    { title: 'BUS 435', id: 2, ce: 'yes' },
    { title: 'IS 350', id: 3,  ce: 'no' },
    { title: 'IS 410', id: 4,  ce: 'no' },
    { title: 'ART 101', id: 5, ce: 'yes' },
    { title: 'BOLD 207', id: 6, ce: 'yes' }
  ];
  */
  $scope.classes= [
    { code: 'CRN 34567', title: 'Apologetics Anon', id: 2, ce: 1 },
    { code: 'CRN 56789', title: 'Memes', id: 2, ce: 1 },
    { code: 'CRN 12746', title: 'Web Culture', id: 2, ce: 1 },
    { code: 'CRN 23456', title: 'Personnel Finance', id: 2, ce: 1 },
  ];
  $scope.newClassId = '';

  // TESTING CODE
  stuId = 9;
  // TESTING CODE
  $http({
    method: "POST",
    url:    rootURL + '/classes/',
    data:   stuId
  }).then((response)=>
  {
    $scope.classes = response.data;
   },(response)=>{
     console.log(response.data);
   });


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
