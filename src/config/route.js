app.config([
'$routeProvider',
function( $routeProvider ) {
  
  // uploads
  
  $routeProvider.
  when('/uploads', {
    templateUrl: 'html/upload/list.html',
    controller: 'UploadListCtrl'
  }).
  when('/uploads/:page', {
    templateUrl: 'html/upload/list.html',
    controller: 'UploadListCtrl'
  }).
  when('/upload/:urn', {
    templateUrl: 'html/upload/edit.html',
    controller: 'UploadCtrl'
  }).
  when('/new/upload', {
    templateUrl: 'html/upload/new.html',
    controller: 'UploadNew'
  }).
  when('/new_2/upload', {
    templateUrl: 'html/upload/new_2.html',
    controller: 'UploadNew2'
  }).
  otherwise({
    redirectTo: '/uploads'
  });
  
  
  // items
  
  $routeProvider.
  when('/items', {
    templateUrl: 'html/item/list.html',
    controller: 'ItemListCtrl'
  }).
  when('/items/:page', {
    templateUrl: 'html/item/list.html',
    controller: 'ItemListCtrl'
  }).
  when('/item/:urn', {
    templateUrl: 'html/item/edit.html',
    controller: 'ItemCtrl'
  }).
  when('/new/item/:urn', {
    templateUrl: 'html/item/new.html',
    controller: 'ItemNew'
  });
  
  
  // collections
  
  $routeProvider.
  when('/collections', {
    templateUrl: 'html/collection/list.html',
    controller: 'CollectionListCtrl'
  }).
  when('/collections/:page', {
    templateUrl: 'html/collection/list.html',
    controller: 'CollectionListCtrl'
  }).
  when('/collection/:urn', {
    templateUrl: 'html/collection/edit.html',
    controller: 'CollectionCtrl'
  }).
  when('/new/collection', {
    templateUrl: 'html/collection/new.html',
    controller: 'CollectionNew'
  });
  
  
  // roi search
  
  $routeProvider.
  when('/roi/search', {
    templateUrl: 'html/roi/search.html',
    controller: 'RoiSearch'
  });
  
  
  // resize
  
  $routeProvider.
  when('/resize/:urn', {
    templateUrl: 'html/resize.html',
    controller: 'ResizeCtrl'
  });
  
  
  // login
  
  $routeProvider.
  when('/login', {
    templateUrl: 'html/login.html',
    controller: 'LoginCtrl'
  });
  
  
  // view
  
  $routeProvider.
  when('/view/:urn', {
    templateUrl: 'html/view.html',
    controller: 'ViewCtrl'
  });
  
  
  // deleter
  
  $routeProvider.
  when('/delete/:urn', {
    templateUrl: 'html/delete.html',
    controller: 'DeleteCtrl'
  }).
  when('/delete', {
    templateUrl: 'html/pre_delete.html',
    controller: 'PreDeleteCtrl'
  });
  
  
  // imgspect
  
  $routeProvider.
  when('/imgspect/:urn', {
    templateUrl: 'html/imgspect.html',
    controller: 'imgspect'
  });
  
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
  
  // If a user is logged-in they don't need to see the login view
  
  function logged_in(){
    var path = $location.path();
    if ( path.indexOf( config.access.logged_out ) == 0 ){
      $location.path( config.access.logged_in )
    }
  }
  
  // Run everytime scope changes
  
  $rootScope.$on( '$routeChangeSuccess', function(){
    
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
