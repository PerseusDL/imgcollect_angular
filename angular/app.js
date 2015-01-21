'use strict';

var app = angular.module('app',[
'ngRoute',
'appControllers',
'appDirectives',
'angularFileUpload'
]);

app.config(['$routeProvider',
function($routeProvider) {
  
  // uploads
  
  $routeProvider.
  when('/uploads', {
    templateUrl: 'partials/upload/list.html',
    controller: 'UploadListCtrl'
  }).
  when('/uploads/:page', {
    templateUrl: 'partials/upload/list.html',
    controller: 'UploadListCtrl'
  }).
  when('/upload/:urn', {
    templateUrl: 'partials/upload/edit.html',
    controller: 'UploadCtrl'
  }).
  when('/new/upload', {
    templateUrl: 'partials/upload/new.html',
    controller: 'UploadNew'
  });
  
  
  // items
  
  $routeProvider.
  when('/items', {
    templateUrl: 'partials/item/list.html',
    controller: 'ItemListCtrl'
  }).
  when('/items/:page', {
    templateUrl: 'partials/item/list.html',
    controller: 'ItemListCtrl'
  }).
  when('/item/:urn', {
    templateUrl: 'partials/item/edit.html',
    controller: 'ItemCtrl'
  }).
  when('/new/item/:urn', {
    templateUrl: 'partials/item/new.html',
    controller: 'ItemNew'
  });
  
  
  // collections
  
  $routeProvider.
  when('/collections', {
    templateUrl: 'partials/collection/list.html',
    controller: 'CollectionListCtrl'
  }).
  when('/collections/:page', {
    templateUrl: 'partials/collection/list.html',
    controller: 'CollectionListCtrl'
  }).
  when('/collection/:urn', {
    templateUrl: 'partials/collection/edit.html',
    controller: 'CollectionCtrl'
  }).
  when('/new/collection', {
    templateUrl: 'partials/collection/new.html',
    controller: 'CollectionNew'
  });
  
  
  // annotations
  
  $routeProvider.
  when('/annotations', {
    templateUrl: 'partials/annotation/list.html',
    controller: 'AnnotationListCtrl'
  }).
  when('/annotations/:page', {
    templateUrl: 'partials/annotation/list.html',
    controller: 'AnnotationListCtrl'
  }).
  when('/annotation/:urn', {
    templateUrl: 'partials/annotation/edit.html',
    controller: 'AnnotationCtrl'
  }).
  when('/new/annotation/:urn', {
    templateUrl: 'partials/imgspect.html',
    controller: 'imgspect'
  });
  
  
  // resize
  
  $routeProvider.
  when('/resize/:urn',{
    templateUrl: 'partials/resize.html',
    controller: 'ResizeCtrl'
  });
  
  
  // login
  
  $routeProvider.
  when('/login', {
    templateUrl: 'partials/login.html',
    controller: 'LoginCtrl'
  });
  
  
  // home
  
  $routeProvider.
  when('/home', {
    templateUrl: 'partials/home.html',
    controller: 'HomeCtrl'
  }).
  when('/home/:page', {
    templateUrl: 'partials/home.html',
    controller: 'HomeCtrl'
  }).
  otherwise({
    redirectTo: '/home'
  });
  
  // view
  
  $routeProvider.
  when('/view/:urn', {
	  templateUrl: 'partials/view.html',
	  controller: 'ViewCtrl'
  })
  
}])
.run([
'$rootScope',
'$location',
'user',
function( $rootScope, $location, user ){
  
  // Run everytime scope changes
  
  $rootScope.$on('$routeChangeSuccess', function(){
    
    // Check for user data.
    
    user.check().then(

      // All is well
      
      function(){
        $rootScope.$emit( user.events.ok );
      },
      
      // User is not logged in
      
      function(){
        $rootScope.$emit( user.events.error );
        $location.path('/login');
      }
	  
	);
})
}]);
