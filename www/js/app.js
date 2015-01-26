// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('memorize', ['ionic','memorize.controllers', 'memorize.services', 'monospaced.elastic'])

.run(function($ionicPlatform, Texts) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // if none of the below states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/home');

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
  .state('home', {
      url: '/home',
      templateUrl: 'templates/home.html',
      controller:'HomeCtrl',
      cache:false,
      resolve:{
        texts:function(Texts){
          return function(){
            return Texts.all();
          }
        },
        removeText:function(Texts){
          return function(text){
            Texts.removeText(text);
          }
        }
      }
    }).state('memorize', {
      url: '/memorize/:textID',
      controller:'MemorizeCtrl',
      templateUrl: 'templates/memorize.html',
      resolve: {
        text: function($stateParams, Texts) {
          return Texts.getText($stateParams.textID);
        }
      }
    })
    .state('add', {
      url: '/add',
      cache:false,
      controller:'AddCtrl',
      templateUrl: 'templates/add.html',
      resolve:{
        text:function(Texts){
          return Texts.newText();
        },
        saveText:function(Texts){
          return function(text){
            return Texts.addText(text);
          }
        }
      }
    });
});
