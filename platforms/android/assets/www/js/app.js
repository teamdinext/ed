"use strict"
angular.module("starter",["ionic","starter.controllers"]).run(function(t){t.ready(function(){window.cordova&&window.cordova.plugins.Keyboard&&(cordova.plugins.Keyboard.hideKeyboardAccessoryBar(!0),cordova.plugins.Keyboard.disableScroll(!0)),window.StatusBar&&StatusBar.style(1)})}).config(function(t,e){t.state("app",{url:"/app","abstract":!0,templateUrl:"templates/menu.html",controller:"AppCtrl"}).state("app.login",{url:"/login",views:{menuContent:{templateUrl:"templates/login.html",controller:"LoginCtrl"}}}).state("app.register",{url:"/register",views:{menuContent:{templateUrl:"templates/register.html",controller:"RegisterCtrl"}}}).state("app.view",{url:"/view",views:{menuContent:{templateUrl:"templates/view.html",controller:"ViewCtrl"}}}).state("app.customize",{url:"/customize",views:{menuContent:{templateUrl:"templates/customize.html",controller:"CustomizeCtrl"}}}).state("app.classes",{url:"/classes",views:{menuContent:{templateUrl:"templates/classes.html",controller:"ClassesCtrl"}}}).state("app.teams",{url:"/teams",views:{menuContent:{templateUrl:"templates/team.html",controller:"TeamsCtrl"}}}).state("app.class",{url:"/class",views:{menuContent:{templateUrl:"templates/class.html",controller:"ClassCtrl"}}}),e.otherwise("/app/login")})
