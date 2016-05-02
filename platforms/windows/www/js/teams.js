/* *********************************************************
 *
 * TEAM SELECTION PAGE
 *
 * ********************************************************/
angular.module('starter.controllers')
.controller('TeamsCtrl', function($scope, $state, $http, stateData) {
  var state = stateData.get();


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
        $scope.message = errorHandler.read(response.data.returned);
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