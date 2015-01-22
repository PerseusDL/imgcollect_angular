// new/collection

appControllers.controller( 'CollectionNew', [
  '$scope',
  '$injector', 
  'urnServ', 
  '$rootScope',
  'user', 
  'onto',
  function( $scope, $injector, urnServ, $rootScope, user, onto ){
    
    $scope.title = "Collection New";
    $scope.type = "collection";
    $scope.show_uniq = true;
    var label = onto.with_prefix('label');  
    var desc = onto.with_prefix('description');
    $scope.form = {};
    $scope.form[label] = onto.default_value('label');
    $scope.form[desc] = onto.default_value('description');
    
    // Run after user has been authorized
    
    $rootScope.$on( user.events.ok, function(){ go() });
    function go(){
      
      // Inherit from parent

      $injector.invoke( NewCtrl, this, { $scope: $scope } );
      $scope.init([label,desc]);
    }


    // Check CITE URN for uniqueness
    
    $scope.urn_uniq = function(){
      urnServ.uniq( $scope.urn, uniq_callback );
    }
    

    // $scope.urn_uniq callback function
    
    var uniq_callback = function( bool, urn ){
      $scope.show_uniq = !bool;
      if ( bool == true ){
        
        // This next line claims a CITE URN and JackSON /data URL
        // AND it retrieves default JSON-LD template
        
        // See lib/new_ctrl.js: $scope.claim
        
        $scope.claim( urn );
        return;
      }
      else {
        $scope.stdout += 'That URN is taken. Choose another.'
      }
    }
  }
]);


// collections

appControllers.controller( 'CollectionListCtrl', [
  '$scope',
  '$injector',
  'user',
  '$rootScope',
  'onto', 
  function( $scope, $injector, user, $rootScope, onto ){
    
    $scope.type = "collection";
    $scope.title = "Collection List";
    $scope.keys = [ 'urn','label','desc','user','time' ];

    
    var label = onto.with_prefix('label');  
    var desc = onto.with_prefix('description');
    
    // Run after user has been authorized
    
    $rootScope.$on( user.events.ok, function(){ go() });
    function go(){
      
      // Inherit from parent

      $injector.invoke( ListCtrl, this, { $scope: $scope } );
      $scope.init([label,desc]);
    }
    
    // The fields you allow users to filter
    // are set with object keys in $scope.filter
    
    // See lib/list_ctr.js: filter()
    $scope.filter = {};
    $scope.filter[label] = null;
    $scope.filter[desc] = null;
    
    // Applying the filter is the same as initializing..
    
    $scope.apply_filter = function(){
      $injector.invoke( ListCtrl, this, { $scope: $scope } );
      $scope.init([label,desc]);
    }
  }
]);


// collection/:urn

appControllers.controller( 'CollectionCtrl', [ 
  '$scope',
  '$injector',
  'item',
  'user',
  '$rootScope',
  'onto', 
  function( $scope, $injector, item, user, $rootScope, onto ){
    
    $scope.title = "Collection";
	
    var label = onto.with_prefix('label');  
    var desc = onto.with_prefix('description');
    var keyword = onto.with_prefix('subject');
    var imgViewer = onto.with_prefix('imgViewer');
    var imgServer = onto.with_prefix('imgServer');
	
    $scope.form = {};
    $scope.form[label] = '';
    $scope.form[desc] = '';
    $scope.form[keyword] = [];
    $scope.form[imgServer] = '';
    $scope.form[imgViewer] = '';
    
    // Run after user has been authorized
    
    $rootScope.$on( user.events.ok, function(){ go() });
    function go(){
      $injector.invoke( EditCtrl, this, { $scope: $scope } );
      $scope.init([label,desc,imgServer,imgViewer]);
      
      // Retrieve Collection Items
    
      item.by_collection( $scope.urn ).then(
        function( data ){ $scope.items = data }
      );
    }
  }
]);
