// items

appControllers.controller( 'ItemListCtrl', [
  '$scope',
  '$injector',
  'onto',
  function( $scope, $injector, onto ){
    $scope.type = "item";  
    $scope.title = "Item List";
    $scope.keys = [ 'urn','label','desc','user','time' ];
    $injector.invoke( ListCtrl, this, { $scope: $scope } );
    
    // The fields you allow users to filter
    // are set with object keys in $scope.filter
    //
    // See lib/list_ctr.js: filter()
  
    var label = onto.with_prefix('label');  
    var desc = onto.with_prefix('description');
    var rep = onto.with_prefix('represents');
    $scope.init([label,desc,rep]);
    $scope.filter = { };
    $scope.filter[label] = null;
    $scope.filter[desc] = null;
    $scope.filter[rep] = null;
    
    
    // Applying the filter is the same as initializing..
    
    $scope.apply_filter = function(){
      $injector.invoke( ListCtrl, this, { $scope: $scope } );
      $scope.init([label,desc,rep]);
    }
  }
]);


// item/:urn

appControllers.controller( 'ItemCtrl', ['$scope','$injector','annotation', 'onto',
  function( $scope, $injector, annotation, onto ){
    $scope.title = "Item";
    var label = onto.with_prefix('label');  
    var desc = onto.with_prefix('description');
    var rep = onto.with_prefix('represents');
    var license = onto.with_prefix('rights');
    var keyword = onto.with_prefix('subject');
    $scope.form = {};
    $scope.form[label] = "";
    $scope.form[desc] = "";
    $scope.form[rep] = "";
    $scope.form[license] = "";
    $scope.form[keyword] = [];
    $injector.invoke( EditCtrl, this, { $scope: $scope } );
    $scope.init([label,desc,rep,license]);
    
    // Collection URN
    
    var collection = {}
    collection.urn = $scope.urn.substring( 0, $scope.urn.indexOf('.') )
    $scope.collections = [];
    $scope.collections[0] = collection;
    
    // Annotation URNs
    
    //$scope.annotations = [];
    //annotation.by_item( $scope.urn ).then(
    //  function( data ){ $scope.annotations = data }
    //);
  }
]);


// new/item/:urn

appControllers.controller( 'ItemNew', [
  '$scope',
  'urnServ',
  '$routeParams',
  'collection',
  '$location',
  'json',
  'stdout',
  'user',
  '$injector',
  'onto',
  function( $scope, urnServ, $routeParams, collection, $location, json, stdout, user, $injector, onto ){
    $scope.upload_urn = ( $routeParams.urn == undefined ) ? null : $routeParams.urn;
    $scope.type = "item";
    $scope.title = "Item New";
    $scope.urn = null;
    $scope.ready = false;
    $scope.collection = null;
    $scope.form = {};
    
    // Path to default item JSON
    
    $scope.src = 'default/'+$scope.type+'.json';    
    
    
    // User clicks collection to add upload
    
    $scope.add_to = function( urn ){
      $scope.collection = urn;
      
      // Create a new item URN
      
      urnServ.fresh( urn+".{{ id }}", fresh_callback );
    }
    
    
    // Get collections for the collection selector
    
    $scope.search = function(){
      var str = $scope.form.search;
      $scope.collections = [];
      collection.search( str ).then(
        function( data ){ $scope.collections = data }
      );
    }
    
    
    // Once you have a fresh item URN
    
    var fresh_callback = function( urn ){
      $scope.urn = urn;
      $scope.ready = true;
    }
    
    
    // User clicks edit item URN button
    
    $scope.create_item = function(){ default_json() }
    
    
    // Build the data path URL
  
    $scope.data_path = function( urn ){
      return $scope.type+'/'+urn
    }
    
    
    // Save the default after writing the most basic values
  
    var save = function(){
      touch();
      json.post( $scope.data_path( $scope.urn ), $scope.json ).then(
      	function( data ){
      	  
      	  // Congratulations!
      	  // You've added an upload to a collection
      	  // Go to Edit item view
      	  
      	  $location.path('item/'+$scope.urn );  
      	});
    }
  
  
    // Set basic values
  
    var touch = function(){
	  var src = onto.with_prefix('src');
	  var creator = onto.with_prefix('creator');
	  var memberOf = onto.with_prefix('memberOf');
	  var created = onto.with_prefix('created');
	  var license = onto.with_prefix('rights');
	  $scope.json['@id'] = $scope.urn;
	  $scope.json[src]['@id'] = $scope.upload_urn;
	  $scope.json[creator]['@id'] = user.id();
	  $scope.json[memberOf]['@id'] = $scope.collection;
	  $scope.json[created] = ( new TimeStamp ).xsd();
	  // TODO this is a hack -- we want to read default values
	  // and data types from the config
	  $scope.json[license]['@id'] = onto.default_value('rights');
    }
  
  
    // Load the default JSON data
  
    var default_json = function(){
      json.get( $scope.src ).then(
      function( data ){
        $scope.json = data;
        stdout.log( "Default JSON loaded from: "+$scope.src );
        save();
      });
    }
  }
]);
