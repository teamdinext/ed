/**********************************************************
 *
 * CONTROLLERS
 * 
 * single file containing all controllers for Angular
 * views
 *
 * CONTROLLER LIST
 * AppCtrl
 * LoginCtrl
 * RegisterCtrl
 * ClassesCtrl
 * ClassCtrl
 * TeamsCtrl
 * CustomizeCtrl
 * ViewCtrol
 *  
 *
 * AJAX CALLS 
 * LoginCtrl
 *  $scope.login        POST  '/m/login'
 *  $scope.register     POST  '/m/register'
 * ClassesCtrl
 *   ionic view enter   POST  '/m/classes'
 * ClassCtrl
 *   controller load    POST  '/m/class'
 * TeamsCtrl
 *   controller load    POST  '/m/classes/teams/'
 *   $scope.selectTeam  POST  '/m/classes/register/'
 *
 *********************************************************/
"use strict";
function userState() {
  var state = {
      loggedIn: false,
      userName: '',
      userId  : 0,
      team    : Object.create(null),
      others  : Object.create(null),
      classes : [
          { code: 'CRN 34567', title: '', id: 2, ce: 1 }
        ]
    };

  function setStatus(input) {

    // TODO: should this not be an AND comparison?
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
    if (input.team !== undefined || input.team !== '')
    {
      state.team = input.team;
    }
    if (input.classes !== undefined || input.classes !== '')
    {
      state.classes = input.classes ;
    }

  }

  function getStatus() {
    return state;
  }

  var returnObj = 
    {get: getStatus,
     set: setStatus}
   return returnObj;
}

/***********************************************************
 *
 * Register a Course
 * requires {stu: <STUDENT_ID>, CRN: <CRN>, id: <COURSE_ID>}
 * returns  {id: <COURSE_ID>, status: <STAT>, error: <ERR>}
 *
 **********************************************************/
function CourseRegister(params) {
  if(params && params.stu)
  {
    if(params.CRN || params.id)
    {
      // Not Canvas
    }
  }
  else
  {
    // insufficient data
  }

  console.log('registerCourse run');
  return function(){return 'return';};
}

var rootURL = 'http://www.engagingdragons.com/m/';

angular.module('starter.controllers', [])
.factory('stateData', userState)
.factory('courseRegister', CourseRegister)
.controller('AppCtrl', function($scope, $ionicModal, $timeout, $state, stateData, courseRegister) {

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

/* *********************************************************
 * LOGIN CONTROL
 *
 * ********************************************************/
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

/* *********************************************************
 *
 * REGISTER CONTROL
 *
 * ********************************************************/
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

/* *********************************************************
 *
 * CLASSES CONTROL
 *
 * ********************************************************/
.controller('ClassesCtrl', function($scope, $rootScope, $state, courseRegister, stateData, $http, $ionicPopup) {
  var state = stateData.get();
  if ( state.loggedIn !== true) $state.go('app.login');

  $scope.classes = [
  ];
  if(state.classes)
    $scope.classes = state.classes;
  $scope.newClassId = '';

  $scope.$on('$ionicView.enter', function(e) {
    console.log(e);
    courseRegister();
    $http({
      method: "POST",
      url:    rootURL + '/classes/',
      data:   {stuId: state.userId}
    }).then(function(response)
    {
      $scope.classes = response.data;
      if(response.data === '' || response.data === undefined)
        $scope.classes = new Array();
      console.log('//good news for classes');
      console.log(response);
     },function(response)
     {
       console.log(response.data);
     });

    $http({
      method: "POST",
      url:    rootURL + '/canvas/courses/',
      data:   {id: state.userId}
    }).then(function(response)
    {
      $scope.classes = response.data;
      if(response.data === '' || response.data === undefined)
        $scope.classes = new Array();
      console.log('//good news for canvas');
      console.log(response.data);
     },function(response)
     {
       console.log(response.data);
     });

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
})

/* **********************************************************
 *
 * CLASS PAGE
 *
 * *********************************************************/
.controller('ClassCtrl', function($scope, $state, $http, stateData) {
  var state = stateData.get();
  if (state.loggedIn !== true) $state.go('app.login');
  if (state.others.currentClass == undefined) $state.go('app.classes');
  console.log('/*\n *\n * STATE\n *\n */');
  console.log(state);

  /*********************************************************
   *
   * Code for statistics at the bottom
   *
   */
  $scope.classInfo = {};
  $scope.levelPercent = function() {
    var data = $scope.classInfo;
    var numerator = data.points - data.prevLvl;
    var denominator = data.nextLvl - data.prevLvl;
    return parseInt((numerator / denominator) * 100) + '%';
  }

  // call for team data
  var payload ={id: state.userId, classId: state.others.currentClass} ;
  console.log('\n\npayload');
  console.log(payload);
  $http({
    method: "POST",
    url:    rootURL + '/class/',
    data: payload 
  }).then(function(response)
  {
    // success function
    var data = response.data;
    // TODO: move this logic to the server
    $scope.classes = data;

    // set color variable to be used in dragon view
    var color = '';
    if (data.color == 'Red')
      color = "#c00";
    else if (data.color == 'Blue')
      color = "#00c";
    else if (data.color == 'Green')
      color = "#0c0";
    data.color = color;

    // determine current points and points to next level
    var scale = data.scale;
    var prevLvlKey = "ToLvl" + data.level;
    if (data.level == 1)
        var prevLvl = 0;
    else
      var prevLvl = scale[prevLvlKey];

    var nextLvlKey = "ToLvl" + parseInt(parseInt(data.level) + 1);
    var nextLvl = scale[nextLvlKey];
    data.prevLvl = prevLvl;
    data.nextLvl = nextLvl;
    
    $scope.classInfo = data;
    state.team = data;
    console.log($scope.classInfo);
    $scope.draw();
   },function(response)
   {
    // failure function
     console.log(response.data);
   });


  /*********************************************************
   *
   * Canvas Area
   *
   */
  if(state.team === undefined)
  {
    state.team = {};
    state.team.level = 4;
  }
  if(state.team.level === undefined)
  {
    state.team.level = 2;
  }

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


  var canvas = document.createElement('canvas');

  $scope.draw = function() {
    var level = state.team.level;
    var world = 'draco';
    //var levelImages = 'img/' + world + '/levels/';
    var levelImages = rootURL + 'img/' + world + '/levels/';
    var levelImageSrc = levelImages + level + '.png';

    console.log('// draw called');

    // append Canvas element 
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.85;
    document.getElementById("canvasParent").appendChild(canvas);
  
    var source = new Image();
    source.src = 'img/' + world + '/bg.png';

    var frame = new Box(0,0,window.innerWidth,window.innerHeight);
    var context = canvas.getContext('2d');

    // draw background
    source.onload = function() {
      var xOrigin = ((canvas.width  - source.width)  / 2);
      var yOrigin = ((canvas.height - source.height) / 2);
      console.log('(' + xOrigin + ',' + yOrigin + ')');
      context.drawImage(source,xOrigin,yOrigin, source.width, source.height);

    var avatar = new Image();
    avatar.src = levelImageSrc;

    avatar.onload = function() {

        // calculate position and dimensions of avatar
        var maxWidth = frame.width() * 0.45;
        var maxHeight = frame.height() * 0.45;
        var avatarWidth = 0;
        var avatarHeight = 0;

        if (avatar.width < maxWidth && avatar.height < maxHeight)
        {
          avatarWidth = avatar.width;
          avatarHeight = avatar.height;
        }
        else
        {
          var widthScale = avatar.width/maxWidth;
          var heightScale = avatar.height/maxHeight;
          var scale = 0;
          if(widthScale > heightScale) {
            scale = widthScale;
          }
          else
          {
            scale = heightScale;
          }
          avatarWidth = avatar.width / scale;
          avatarHeight = avatar.height / scale;

        }

        // debug 3
        context.fillStyle="red";
        //context.fillRect(200,0, 100,200); 
        
        // draw avatar
        context.drawImage(avatar,
          ((canvas.width - avatarWidth)/2),
          ((canvas.height - avatarHeight)/4),
          avatarWidth,
          avatarHeight);
      }
    }

    // draw overlay
    context.fillStyle="#fff";
    //context.fillRect(0,0, 100,200); 

    // draw statusbar
  }

  $scope.toCustom = function() {
    $state.go('app.customize');
  }

  $scope.$on('$ionicView.afterEnter', function(){
    console.log('// calling draw');
    //$scope.draw();
  });

})

/* *********************************************************
 *
 * TEAM SELECTION PAGE
 *
 * ********************************************************/
.controller('TeamsCtrl', function($scope, $state, $http, stateData) {
  var state = stateData.get();

  function errorReader(err) {
    var errors = {
      101: "Your username and password combination is invalid.",
      110: "Your username does not meet the minimum length of 3 characters.",
      130: "You have not registered for any courses.",
      140: "You have already registered for this course.",
      180: "No student data was provided.",
      230: "The course for which you are trying to register is full. Contact your teacher to be added to the roster.",
      180: "No student data was provided."
     };

       return errors[err];
  }

  if ( state.loggedIn !== true) $state.go('app.login');

  console.log('// Entered customize state');

  $scope.test = '';
  $scope.message = '';
  $scope.error = true;

  $http({
    method: "POST",
    url:    rootURL + '/classes/teams/',
    data:   {CRN: state.others.crn, stu: state.userId}
  }).then(function(response)
    {
      console.log(response.data);
      if(response.data.returned == null)
      {
        $scope.message = "We're sorry, but an error occured while " + 
        "loading your class. Please check with your instructor to " +
        "confirm your CRN or try again later.";
        $scope.error = true;
      }
      if(response.data.status &&
         response.data.status=='good')
      {
        if(response.data.type === "ungrouped")
        {
          $state.go('app.classlist');
        }
        else if(response.data.type === "grouped" &&
                response.data.returned != null)
        {
          $scope.hasTeams = true;
          $scope.teams = response.data.returned;
        }
      }
      else if(response.data.status == "error")
      {
        $scope.error = true;
        $scope.message = errorReader(response.data.returned);
      }
      else 
      {
        $scope.message = "We're sorry, but an error occured while " + 
        "loading your class. Please check with your instructor to " +
        "confirm your CRN or try again later.";
        $scope.error = true;

      }
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
  $scope.toClasses = function() {
    $state.go('app.classes');
  }
    
})

/* *********************************************************
 *
 * CUSTOMIZE CONTROL
 *
 * ********************************************************/
.controller('CustomizeCtrl', function($scope, $state) {

    console.log('// Entered customize state');

    $scope.saveDetails = function() {
        $state.go('app.view');
    }

})

/* *********************************************************
 *
 * VIEW CONTROL
 *
 * ********************************************************/
.controller('ViewCtrl', function($scope, stateData) {

});
