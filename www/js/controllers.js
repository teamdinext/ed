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
var rootURL = 'http://www.engagingdragons.com/m/';
angular.module('starter.controllers', [])
.factory('stateData', function() {
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

  function init() {
    state = {
        loggedIn: false,
        userName: '',
        userId  : 0,
        team    : Object.create(null),
        others  : Object.create(null),
        classes : [
            { code: 'CRN 34567', title: '', id: 2, ce: 1 }
          ]
    };
  }


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

  function reset() {
    init();
    return state;
  }

  var returnObj = 
    {get:   getStatus,
     set:   setStatus,
     reset: reset}
   return returnObj;
  
})
.factory('errorHandler', function(){

    // TODO: reorganize error codes to have more logical numeric values
    // TODO: move error codes and definitions to database
    function read(err) {
      var errors = {
        // 100 - 200 user login/registration
        101: "Your username and password combination is invalid.",
        110: "Your username must be at least 3 characters and include only numbers and letters.",
        120: "Your username is already in use.",
        130: "Your email is already in use.",
        140: "Please enter a password.",
        150: "Please ensure that your passwords match.",
        // 200 - 300 course registration
        230: "You have not registered for any courses.",
        240: "You have already registered for this course.",
        280: "No student data was provided.",
        230: "The course for which you are trying to register is full. Contact your teacher to be added to the roster.",
        180: "No student data was provided."
       };

       return errors[err];
    }
    return {read: read};
})
.factory('courseManager', ['$http', 'errorHandler', function($http, errorHandler) {
/***********************************************************
 *
 * Register a Course
 * requires {stu: <STUDENT_ID>, CRN: <CRN>, id: <COURSE_ID>}
 * returns  {id: <COURSE_ID>, status: <STAT>, error: <ERR>}
 *
 **********************************************************/

  var course = {};
  // holds a reference to $scope
  var scopeRef = {};

  function set(params) {
    if(params && params.stu)
    {
      if(params.crn || params.id)
      {
        course = params;
      }
    }
    else
    {
      // insufficient data
    }
  }

  function get() {
    return params;
  }

  function register(param) {
    $http({
      method: "POST",
      url:    rootURL + '/classes/teams/',
      data:   {CRN: param.crn, stu: param.stu, id: param.id}
    }).then(function(response)
      {
        console.log(param);
        console.log(response.data);
        if(response.data.returned == null)
        {
          var message = "We're sorry, but an error occured while " + 
          "loading your class. Please check with your instructor to " +
          "confirm your CRN or try again later.";
        }
        if(response.data.status &&
           response.data.status=='good')
        {
          if(response.data.type === "ungrouped")
          {
            console.log('// course ungrouped');
            listInternal(param.stu, scopeRef.val);
          }
          else if(response.data.type === "grouped" &&
                  response.data.returned != null)
          {
            var hasTeams = true;
            var teams = response.data.returned;
          }
        }
        else if(response.data.status == "error")
        {
          var error = true;
          var message = errorHandler.read(response.data.returned);
        }
        else 
        {
          var message = "We're sorry, but an error occured while " + 
          "loading your class. Please check with your instructor to " +
          "confirm your CRN or try again later.";
          scopeRef.error = true;

        }
       },function(response)
       {
         console.log(response.data);
    });
  }

  function listInternal(id, scope) {
    console.log('listinternal');
    var returnObj = {};
    $http({
      method: "POST",
      url:    rootURL + '/classes/',
      data:   {stuId: id}
    }).then(function(response)
    {
        scopeRef.val = scope;
        scope.classes = response.data;
     },function(response)
     {
       return 'Connection error;';
     });
  }

  function listCanvas(id) {
    $http({
      method: "POST",
      url:    rootURL + '/canvas/courses/',
      data:   {id: id}
    }).then(function(response)
    {
       var list = response.data;
       var newList = [];
       var lenCanvas = list.length;
       for(var i = 0; i < lenCanvas; i++)
       {
         list[i].enrolled = false;
         var lenClasses = scopeRef.val.classes.length;
         for(var j = 0; j < lenClasses; j++)
         {
           if(list[i] == scopeRef.val.classes[j])
           {
             // identify this class as existing
             list[i].enrolled = true;
           }
         }
       }

       // loop through unenrolled class and register
       for(var i = 0; i < list.length; i++)
         if(list[i].enrolled == false)
         {
           console.log({stu: id, id: list[i].ClassID});
           register({stu: id, id: list[i].ClassID});
         }

       console.log(list);
     },function(response)
     {
       return 'Connection error;';
     });

  }
  return {set: set, get: get, internal: {list: listInternal}, canvas: {list: listCanvas}};
}
])
/* *********************************************************
 *
 * VIEW CONTROL
 *
 * ********************************************************/
.controller('AppCtrl', function($rootScope, $scope, $ionicModal, $timeout, $state, stateData ) {

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

});
