var appControllers = angular.module('appControllers',[]);

// login

appControllers.controller( 'LoginCtrl', [
'$scope',
'user',
function( $scope, user ){}]);


// resize/:urn

appControllers.controller( 'ResizeCtrl', [
'$scope',
'$injector',
'user',
'$rootScope',
'onto',
function( $scope, $injector, user, $rootScope, onto ){
  
  // Start once user event fires 
  
  $rootScope.$on( user.events.ok, function(){ go() });
  
  function go(){
    var label = onto.with_prefix('label');
    var desc = onto.with_prefix('description');
    var keyword = onto.with_prefix('subject');
    $scope.title = "Resize";
    $scope.form = {};
    $scope.form[label] = "";
    $scope.form[desc] = "";
    $scope.form[subject] = [];
    $injector.invoke( EditCtrl, this, { $scope: $scope } );
    
    $scope.run = function() {
      $scope.uploads = [];
      $scope.uploads[0] = { 
		  urn: $scope.json[onto.with_prefix('src')]['@id'] 
	  };
    }
    
    $scope.init();
  }
}]);


// User

appControllers.controller( 'UserCtrl', [
'$scope',
'$injector',
'user',
'$rootScope',
function( $scope, $injector, user, $rootScope ){    
  
  // Start once user event fires 
  
  $rootScope.$on( user.events.ok, function(){ go() });
  
  function go(){
    $scope.only = user.only;
    $scope.user = user.id();
    $scope.username = user.name();
  }
  
  $scope.switch = function( bool ){
    user.only = bool;
    go();
  }
}]);


// StdOut

appControllers.controller( 'StdOut', [
'$scope',
'stdout',
function( $scope, stdout ){
	$scope.stdout = stdout;
	$scope.$watch('stdout.msg', function(){
		$scope.msg = stdout.msg;
	});
}]);


// JsonMsg
// Makes communication with JackSON server more transparent
// to the user.

appControllers.controller( 'JsonMsg', [
'$scope',
'json',
function( $scope, json ){
	
	var update = function( method, url, stat, msg ){
		$scope.method = method;
		$scope.url = url;
		$scope.status = stat;
		$scope.msg = msg;
		$scope.hide = false;
		switch( $scope.status ){
			case json.state().success:
				$scope.mode = 'success'
				break;
			case json.state().error:
				$scope.mode = 'alert'
				break;
			default:
				$scope.mode = 'secondary'
		}
	}
	
	json.on_change( update );
}]);


// Sparql Msg
// Makes communcation with SPARQL endpoint more transparent

appControllers.controller( 'SparqlMsg', [
'$scope',
'sparql',
function( $scope, sparql ){
	
	$scope.query = '';
	var update = function( status, query ){
		$scope.query = query;
	}
	sparql.on_change( update );
	
}]);


// Talk to URN server

appControllers.controller( 'urnServ',[
'$scope',
'urnServ',
function( $scope, urnServ ){}])


// View

appControllers.controller( 'ViewCtrl', [
'$scope',
'$routeParams',
'json',
function( $scope, $routeParams, json ){
	
  // Get the URN
  
  $scope.urn = ( $routeParams.urn == undefined ) ? null : $routeParams.urn;
  
  // Get the coords
  
  var urn = $scope.urn.split("@");
  $scope.coords = urn[1].split(',');
  get_src( urn[0] )
  
  $scope.max_width = 600;
  
	
  // What's the src JSON?
  
  function get_src( urn ){
    json.urn( urn ).then( function( data ){
  	  get_json( data['src'][0] );
  	});
  }
  
  
  // Check the type
  
  function check_type( data ){
  	var type = data['dct:type']
  	switch( type ){
      case 'upload':
        $scope.src = data['dct:references']['@id']
      break;
      case 'item':
        get_src( data['dct:references']['@id'] )
      break;
  	}
  }
  
  
  // Get the src JSON
  
  function get_json( src ){
    json.get( src ).then( function( data ){
      check_type( data );
  	});
  }
  
}]);


// Delete things
// delete/upload/:urn

appControllers.controller( 'DeleteCtrl', [
'$scope',
'$injector',
'json',
'$routeParams',
'deleter',
function( $scope, $injector, json, $routeParams, deleter, urn_serv ){
  $scope.urn = ( $routeParams.urn == undefined ) ? null : $routeParams.urn;
	$scope.refs = []
	$scope.show_refs = false;
	$scope.urn_invalid = false;
	
	
	// Check if URN is valid
	
	urn_valid();
	function urn_valid(){
		json.urn( $scope.urn ).then( function( data ){
			if ( 'error' in data ){
				$scope.urn_invalid = true;
			}
		});
	}
	
	
	// Find all references to the URN
	
	$scope.get_refs = function(){
		deleter.refs( $scope.urn ).then( function( data ){
			$scope.refs = data;
			$scope.show_refs = true;
		});
	}
	
	
	// Delete
	
	$scope.delete = function(){
		deleter.urn( $scope.urn ).then( function( data ){
			console.log( data );
		});
	}
}]);