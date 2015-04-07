'use strict';

var app = angular.module('app',[
'ngRoute',
'appControllers',
'appDirectives',
'angularFileUpload'
]);

app.config([
'$routeProvider',
function( $routeProvider ) {
  
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
  }).
  otherwise({
    redirectTo: '/uploads'
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
  
  
  // view
  
  $routeProvider.
  when('/view/:urn', {
	  templateUrl: 'partials/view.html',
	  controller: 'ViewCtrl'
  });
	
	
	// deleter
	
	$routeProvider.
	when('/delete/:urn', {
		templateUrl: 'partials/delete.html',
		controller: 'DeleteCtrl'
	}).
	when('/delete', {
		templateUrl: 'partials/pre_delete.html',
		controller: 'PreDeleteCtrl'
	});
	
	
	// imgspect
	
	$routeProvider.
	when('/imgspect/:urn', {
		templateUrl: 'partials/imgspect.html',
		controller: 'imgspect'
	})
  
}])
.run([
'$rootScope',
'$location',
'user',
'config',
function( $rootScope, $location, user, config ){
	
	// Some views are public
	
	function public_view(){
		var path = $location.path();
		var pub = config.access.public_views;
		for( var i=0; i<pub.length; i++ ){
			if ( path.indexOf( pub[i] ) == 0 ){
				return true
			}
		}
	}
        $rootScope.public_view = public_view;
	
	// If a user is logged-in they don't need to see the login view
	
	function logged_in(){
		var path = $location.path();
		if ( path.indexOf( config.access.logged_out ) == 0 ){
			$location.path( config.access.logged_in )
		}
	}
	
	// Run everytime scope changes
  
  $rootScope.$on('$routeChangeSuccess', function(){
    
    // Check for user data.
    
    user.check().then(

      // All is well
      
      function(){
				logged_in();
        $rootScope.$emit( user.events.ok );
      },
      
      // User is not logged in
      
      function(){
				if ( public_view() == true ){
					return;
				}
        $rootScope.$emit( user.events.error );
        $location.path( config.access.logged_out );
      }
	  
	);
	
})

}]);  // close app.config
