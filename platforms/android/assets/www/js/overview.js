/* *********************************************************
 *
 * CUSTOMIZE CONTROL
 *
 * ********************************************************/
angular.module('starter.controllers')
.controller('OverviewCtrl', function($scope, $state, $http, stateData) {
  var state = stateData.get();

  // kick from addresss if not qualified
  if (state.loggedIn !== true) $state.go('app.login');
  if (state.others.currentClass == undefined) $state.go('app.classes');
  var classId = state.others.currentClass;

  $scope.message = '';
  $scope.teams   = [{"id": 0, "name": "", "level": 0}];

  $http({
    method: "POST",
    url:    rootURL + '/overview/',
    data:   {id: classId, stu: state.userId},
  }).then(function(response)
    {
      if(response.data.status &&
         response.data.status=='good')
      {
        if(response.data.returned != null)
        {
          $scope.teams = response.data.returned;
          console.log($scope.teams);
        }
      }
      else if(response.data.status == "error")
      {
        $scope.message = errorHandler.read(response.data.returned);
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

  $scope.toAvatar = function(id) {
      console.log('ID passed into change Avatar: ' + id);
      if (state.others == undefined)
        state.others = Object.create(null);

      // why is state not set?
      state.others.currentTeam= id;
      state.others.currentClass = null;
      stateData.set(state);
      $state.go('app.avatar');
  }

});
