"use strict"
function userState(){function e(e){void 0!==e.loggedIn&&(o.loggedIn=e.loggedIn),void 0===e.userName&&""===e.userName||(o.userName=e.userName),void 0===e.userId&&""===e.userId||(o.userId=e.userId),void 0===e.others&&""===e.others||(o.others=e.others),void 0===e.team&&""===e.team||(o.team=e.team)}function t(){return o}var o={loggedIn:!1,userName:"",userId:0,team:Object.create(null),others:Object.create(null)},n={get:t,set:e}
return n}var rootURL="http://www.engagingdragons.com/m/"
angular.module("starter.controllers",[]).factory("stateData",userState).controller("AppCtrl",function(e,t,o,n,s){e.loginData={},t.fromTemplateUrl("templates/login.html",{scope:e}).then(function(t){e.modal=t}),e.closeLogin=function(){e.modal.hide()},e.login=function(){e.modal.show()},e.doLogin=function(){console.log("Doing login",e.loginData),o(function(){e.closeLogin()},1e3)}}).controller("LoginCtrl",function(e,t,o,n,s){e.responseText="",e.login=function(t){var a=e.loginData,l=rootURL+"/login/",r={username:a.username,password:a.password}
Object.create(null)
s({url:l,method:"POST",data:r}).then(function(t){if(e.responseText=t.data,t.data.loggedIn){var s={}
a=t.data,console.log(a),1==a.loggedIn&&(s=t.data,n.set(s),o.go("app.classes"))}},function(t){e.responseText='<span style="colour:#fff">pipipipip</span>'})},e.register=function(){var t=e.loginData
console.log(t)
var o=({username:t.username,password:t.password},Object.create(null)),a=rootURL+"register/"
s({url:a,method:"POST",data:t}).then(function(s){e.responseText=s.data,t=s.data,console.log(t),"y"==t&&(o=s.data,n.set(o),e.login())},function(t){e.responseText='<span style="colour:#fff">pipipipip</span>'})},e.isRegistering=null,e.enableRegister=function(){e.isRegistering=!0}}).controller("RegisterCtrl",function(e,t,o){e.isVerified=o.activated,console.log("Entered register state"),e.toClasses=function(e){console.log("Classes: "+e),o.hasClasses=e,t.go("app.classes")},e.register=function(){}}).controller("ClassesCtrl",function(e,t,o,n,s,a){var l=n.get()
l.loggedIn!==!0&&o.go("app.login"),e.classes=[{code:"CRN 34567",title:"ED 101",id:2,ce:1}],e.newClassId="",s({method:"POST",url:rootURL+"/classes/",data:{stuId:l.userId}}).then(function(t){e.classes=t.data,""!==t.data&&void 0!==t.data||(e.classes=new Array),console.log("//good news for classes"),console.log(t)},function(e){console.log(e.data)}),e.hasClasses=function(){return e.classes.length>0},e.changeClass=function(e){console.log("//business"),void 0==l.others&&(l.others=Object.create(null)),l.others.currentClass=e,o.go("app.class")},e.showPopup=function(t){e.data={}
a.show({template:'<input type="text" ng-model="data.newCourseId">',title:"New Course CRN",subTitle:"Please enter the CRN number of your course.",scope:e,buttons:[{text:"Cancel",type:"button-stable"},{text:"<b>Enter</b>",type:"button-assertive",onTap:function(t){if(e.data.newCourseId){console.log("// else")
var s=n.get()
return void 0===s.others&&(s.others=Object.create(null)),s.others.crn=e.data.newCourseId,n.set(s),console.log("// trying to go to teams"),o.go("app.teams"),e.data.newCourseId}}}]})}}).controller("ClassCtrl",function(e,t,o,n){var s=n.get()
s.loggedIn!==!0&&t.go("app.login"),void 0==s.others.currentClass&&t.go("app.classes"),console.log(s.others),e.classInfo={},e.levelPercent=function(){var t=e.classInfo,o=t.points-t.prevLvl,n=t.nextLvl-t.prevLvl
return console.log(o+" / "+n),parseInt(o/n*100)+"%"},o({method:"POST",url:rootURL+"/class/",data:{id:s.userId,classId:s.others.currentClass}}).then(function(t){var o=t.data
e.classes=o
var n=""
"Red"==o.color?n="#c00":"Blue"==o.color?n="#00c":"Green"==o.color&&(n="#0c0"),o.color=n
var a=o.scale,l="ToLvl"+o.level
if(1==o.level)var r=0
else var r=a[l]
var i="ToLvl"+parseInt(parseInt(o.level)+1),c=a[i]
console.log(c),o.prevLvl=r,o.nextLvl=c,e.classInfo=o,s.team=o,console.log(e.classInfo),e.draw()},function(e){console.log(e.data)}),void 0===s.team&&(s.team={},s.team.level=4),void 0===s.team.level&&(s.team.level=2)
var a=function(e,t,o,n){function s(){return{x:e,y:t}}function a(){return{x:o,y:n}}function l(){return o-e}function r(){return n-t}function i(){return[{x:e,y:t},{x:o,y:n}]}return e=e,o=o,t=t,n=n,{origin:s,destination:a,width:l,height:r,points:i}}
console.log("Entered view state")
var l=document.createElement("canvas")
e.draw=function(){var e=s.team.level,t="draco",o=rootURL+"img/"+t+"/levels/",n=o+e+".png"
console.log("// draw called"),l.width=window.innerWidth,l.height=.85*window.innerHeight,document.getElementById("canvasParent").appendChild(l)
var r=new Image
r.src="img/"+t+"/bg.png"
var i=new a(0,0,window.innerWidth,window.innerHeight),c=l.getContext("2d")
r.onload=function(){var e=(l.width-r.width)/2,t=(l.height-r.height)/2
console.log("("+e+","+t+")"),c.drawImage(r,e,t,r.width,r.height)
var o=new Image
o.src=n,o.onload=function(){var e=.45*i.width(),t=.45*i.height(),n=0,s=0
if(o.width<e&&o.height<t)n=o.width,s=o.height
else{var a=o.width/e,r=o.height/t,d=0
d=a>r?a:r,n=o.width/d,s=o.height/d}c.fillStyle="red",c.drawImage(o,(l.width-n)/2,(l.height-s)/2,n,s)}},c.fillStyle="#fff"},e.$on("$ionicView.afterEnter",function(){console.log("// calling draw")})}).controller("TeamsCtrl",function(e,t,o,n){var s=n.get()
s.loggedIn!==!0&&t.go("app.login"),console.log("// Entered customize state"),e.test="",o({method:"POST",url:rootURL+"/classes/teams/",data:{CRN:s.others.crn}}).then(function(t){console.log(t.data),e.teams=t.data,e.hasTeams=!0},function(e){console.log(e.data)}),e.selectTeam=function(e){console.log(e),console.log(s.userId),o({method:"POST",url:rootURL+"/classes/register/",data:{stuId:s.userId,teamId:e}}).then(function(e){console.log(e.data),"success"===e.data&&t.go("app.classes")},function(e){console.log(e.data)})}}).controller("CustomizeCtrl",function(e,t){console.log("// Entered customize state"),e.saveDetails=function(){t.go("app.view")}}).controller("ViewCtrl",function(e,t){})
