/* **********************************************************
 *
 * CLASS PAGE
 *
 * *********************************************************/
angular.module('starter.controllers')
.controller('AvatarCtrl', function($scope, $state, $http, stateData) {
  var state = stateData.get();
  console.log(state);
  if (state.loggedIn !== true) $state.go('app.login');
  if (state.others.currentClass == undefined && 
      state.others.currentTeam == undefined) 
  {
    console.log('current team: ' + state.others.currentTeam);
    console.log('current class: ' + state.others.currentClass);
    $state.go('app.classes');
  }

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
  // if currentClass is null, current team must be set
  if(state.others.currentClass == null)
    var payload ={id: state.userId, teamId: state.others.currentTeam} ;
  else
    var payload ={id: state.userId, classId: state.others.currentClass} ;
  console.log('\n\npayload');
  console.log(payload);
  console.log(state.others);
  $http({
    method: "POST",
    url:    rootURL + '/avatar/',
    data: payload 
  }).then(function(response)
  {
    // success function
    var data = response.data;
    // TODO: move this logic to the server
    $scope.classes = data;
    $scope.world = data.world;
    console.log($scope.world);
    console.log(data.world);

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
    var world = $scope.world;
    //var world = 'draco';
    //var levelImages = 'img/' + world + '/levels/';
    var levelImages = rootURL + 'img/' + world + '/levels/';
    var levelImageSrc = levelImages + level + '.png';

    console.log('// draw called');

    // append Canvas element 
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.85;
    document.getElementById("canvasParent").appendChild(canvas);
  
    var source = new Image();
    source.src = rootURL + 'img/' + world + '/bg.png';

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

  $scope.toOverview = function() {
    $state.go('app.overview');
  }

  $scope.$on('$ionicView.afterEnter', function(){
    console.log('// calling draw');
    //$scope.draw();
  });

});
