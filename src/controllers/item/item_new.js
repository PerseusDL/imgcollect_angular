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
'tmpl',
function( $scope, urnServ, $routeParams, collection, $location, json, stdout, user, $injector, onto, tmpl ){
  $scope.upload_urn = ( $routeParams.urn == undefined ) ? null : $routeParams.urn;
  $scope.type = "item";
  $scope.title = "Item New";
  $scope.urn = null;
  $scope.ready = false;
  $scope.collection = null;
  $scope.form = {};
	$scope.user_collections = null;
  
  
  // User clicks collection to add upload
  
  $scope.add_to = function( urn ){
    $scope.collection = urn;
    
    // Create a new item URN
    
    urnServ.fresh( urn+".{{ id }}", fresh_callback );
  }
	
	// Get the user's collections
	
	collection.mine().then( function( data ){
		$scope.user_collections = data;
	});
  
  
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
    touch().then( function(){
    	json.post( $scope.data_path( $scope.urn ), $scope.json ).then(
    	function( data ){
    	  
    	  // Congratulations!
    	  // You've added an upload to a collection
    	  // Go to Edit item view
    	  
    	  $location.path('item/'+$scope.urn );  
    	});
		});
  }


  // Set basic values
	// Some values will get their default value from
	// the upload.

  var touch = function(){
		return json.urn( $scope.upload_urn ).then( function( data ){
			return json.get( data.src[0] ).then( function( data ){
				
		  	var src = onto.with_prefix('src');
		  	var creator = onto.with_prefix('creator');
		  	var memberOf = onto.with_prefix('memberOf');
		  	var created = onto.with_prefix('created');
		  	var license = onto.with_prefix('rights');
				var label = onto.with_prefix('label');
				var desc = onto.with_prefix('description');
				
		  	$scope.json['@id'] = $scope.urn;
		  	$scope.json[src]['@id'] = $scope.upload_urn;
		  	$scope.json[creator]['@id'] = user.id();
		  	$scope.json[memberOf]['@id'] = $scope.collection;
		  	$scope.json[created] = ( new TimeStamp ).xsd();
				$scope.json[label] = data[label];
				$scope.json[desc] = data[desc]
				
		  	// TODO this is a hack -- we want to read default values
		  	// and data types from the config
		
		  	$scope.json[license]['@id'] = onto.default_value('rights');
			})
		});
	}

  // Load the default JSON data

  var default_json = function(){
    tmpl.get( $scope.type ).then(
    function( data ){
      $scope.json = data;
      stdout.log( "Default "+ $scope.type +" JSON loaded" );
      save();
    });
  }
	
}]);
