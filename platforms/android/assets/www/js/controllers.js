"use strict";
function userState() {
  var state = {
      loggedIn: false,
      userName: '',
      userId  : 0,
      others: Object.create(null)
    };

  function setStatus(input) {
    if (input.loggedIn !== undefined)
    {
      state.loggedIn = input.loggedIn;
    }
    if (input.userName !== undefined || input.userName !== '')
    {
      state.userName = input.userName;
    }
    if (input.userId !== undefined || input.userId !== '')
    {
      state.userId = input.userId;
    }
    if (input.others !== undefined || input.others !== '')
    {
      state.others = input.others;
    }

  }

  function getStatus() {
    return state;
  }

  // expose a public API
  var returnObj = 
    {get: getStatus,
     set: setStatus}
   return returnObj;
}
//var stateData = userState();
var rootURL = 'http://www.engagingdragons.com/m/';

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

  // Create(null) the login modal that we will use later
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
    // code if  using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

})

/* ----------------------------------------------------------------------------
 * LOGIN CONTROL
 *
 * --------------------------------------------------------------------------*/
.controller('LoginCtrl', function($scope, $rootScope, $state, stateData, $http) {

  $scope.responseText = '';
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

  $scope.register = function() {
    $rootScope.activated = $scope.loginData.activated;
    console.log('// is reg ');
    if (0)
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
.controller('ClassesCtrl', function($scope, $rootScope, $state, stateData, $http, $ionicPopup) {
  var state = stateData.get();
  if ( state.loggedIn !== true) $state.go('app.login');
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
  $scope.classes = [
    { code: 'CRN 34567', title: 'Apologetics Anon', id: 2, ce: 1 },
    { code: 'CRN 56789', title: 'Memes', id: 2, ce: 1 },
    { code: 'CRN 12746', title: 'Web Culture', id: 2, ce: 1 },
    { code: 'CRN 23456', title: 'Personnel Finance', id: 2, ce: 1 }
  ];
  $scope.newClassId = '';

  $http({
    method: "POST",
    url:    rootURL + '/classes/',
    data:   {stuId: state.userId}
  }).then(function(response)
  {
    $scope.classes = response.data;
    console.log('//good news for classes');
    console.log(response);
   },function(response)
   {
     console.log(response.data);
   });


  $scope.hasClasses = function() {
      return $scope.classes.length > 0 ? true : false;
  }

  $scope.changeClass = function(id) {
      console.log('//business');
      if (state.others == undefined)
        state.others = Object.create(null);

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
})

/* ----------------------------------------------------------------------------
 * CLASS PAGE
 *
 * --------------------------------------------------------------------------*/
.controller('ClassCtrl', function($scope, $state, $http, stateData) {
  var state = stateData.get();
  if (state.loggedIn !== true) $state.go('app.login');
  if (state.others.currentClass == undefined) $state.go('app.classes');
  console.log(state.others);

  $scope.image = 'img/image.jpg';

  $scope.classInfo = {};
  $scope.levelPercent = function() {
    var data = $scope.classInfo;
    var numerator = data.points - data.prevLvl;
    var denominator = data.nextLvl - data.prevLvl;
    console.log(numerator + ' / ' + denominator);
    return parseInt((numerator / denominator) * 100) + '%';
  }

  $http({
    method: "POST",
    url:    rootURL + '/class/',
    data:   {id: state.userId, classId: state.others.currentClass}
  }).then(function(response)
  {
    var data = response.data;
    // TODO: move this logic to the server
    $scope.classes = data;
    var color = '';
    if (data.color == 'Red')
      color = "#c00";
    else if (data.color == 'Blue')
      color = "#00c";
    else if (data.color == 'Green')
      color = "#0c0";
    data.color = color;

    var scale = data.scale;
    var prevLvlKey = "ToLvl" + data.level;
    if (data.level == 1)
        var prevLvl = 0;
    else
      var prevLvl = scale[prevLvlKey];

    var nextLvlKey = "ToLvl" + parseInt(parseInt(data.level) + 1);
    var nextLvl = scale[nextLvlKey];
    console.log(nextLvl);
    data.prevLvl = prevLvl;
    data.nextLvl = nextLvl;
    
    $scope.classInfo = data;
    console.log($scope.classInfo);
   },function(response)
   {
     console.log(response.data);
   });

  $scope.viewDragon = function() {
    if (state.others == undefined)
      state.others = Object.create(null);
    state.others.currentTeam = $scope.classInfo.teamId;
    stateData.set(state);
    $state.go('app.view');
  }
})

/* ----------------------------------------------------------------------------
 * TEAM SELECTION PAGE
 *
 * --------------------------------------------------------------------------*/
.controller('TeamsCtrl', function($scope, $state, $http, stateData) {
  var state = stateData.get();
  if ( state.loggedIn !== true) $state.go('app.login');

  console.log('// Entered customize state');

  $scope.test = '';

  $http({
    method: "POST",
    url:    rootURL + '/classes/teams/',
    data:   {CRN: state.others.crn}
  }).then(function(response)
    {
      console.log(response.data);
      $scope.teams = response.data;
      $scope.hasTeams = true;
     },function(response)
     {
       console.log(response.data);
  });

  $scope.selectTeam = function(id) {
    console.log(id);
    console.log(state.userId);
    $http({
      method: "POST",
      url:    rootURL + '/classes/register/',
      data:   {stuId: state.userId, teamId: id}
    }).then(function(response)
      {
        console.log(response.data);
        if (response.data === "success")
          $state.go('app.classes');
       },function(response)
       {
         console.log(response.data);
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
.controller('ViewCtrl', function($scope, stateData) {
  var state = stateData.get();
  if(state.team === undefined)
  {
    state.team = {};
    state.team.level = 2;
  }
  if(state.team.level == undefined)
  {
    state.team.level = 2;
  }

  var level = state.team.level;
  var world = 'draco';
  var levelImages = '/img/' + world + '/levels/';
  var levelImageSrc = levelImages + level + '.png';

  var avatar = new Image();
  avatar.src = levelImageSrc;

  var Box = function(x1, y1, x2, y2) {
    x1 = x1;
    x2 = x2;
    y1 = y1;
    y2 = y2;

    function origin() {
      return {x: x1, y: y1};
    }
    function destination() {
      return {x: x2, y: y2};
    }
    function width() {
      return (x2 - x1);
    }
    function height() {
      return (y2 - y1);
    }
    function points() {
      return [{x: x1, y: y1},{x: x2, y: y2}];
    }
    return {
      origin: origin,
      destination: destination,
      width: width, 
      height: height, 
      points: points};
  }

  console.log('Entered view state');

    var canvas = document.getElementById('dragonCanvas');
    var context = canvas.getContext('2d');
    var startimg = 'img/image.jpg';

    $scope.draw = function() {
        console.log('// draw called');
        //var source =  new Image();
        var frame = new Box(0,0,window.innerWidth,window.innerHeight);
        var source = window;
        source.src = startimg;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - 40;

        console.log(canvas);

        context.fillStyle = "#242";
        context.fillRect(0,0,frame.width(),frame.height());
        
        context.drawImage(avatar,0,0, (frame.width() / 2), (frame.height() / 2));
        console.log(avatar.src);
        //context.drawImage(source,0,0);
    }

    console.log('// calling draw');
    $scope.draw();

});
