var appControllers = angular.module('appControllers',[]);


// home

appControllers.controller( 'HomeCtrl', ['$scope','$injector','user','$rootScope',
	function( $scope, $injector, user, $rootScope ){
		
		$scope.title = "Home";
		$scope.type = "home";
		$scope.keys = [ 'urn', 'type', 'label', 'desc', 'time' ];
		
		$scope.apply_filter = function(){
			$injector.invoke( ListCtrl, this, { $scope: $scope } );
			$scope.init();
		}
		
		// Make sure user is logged in.
		
		$rootScope.$on( user.events.ok, function(){
			go();
			$scope.apply_filter();
		});
		
		function go(){
			$scope.number = "\
			SELECT count( distinct ?urn )\
			WHERE {\
				?urn <"+user.dir()+"> <"+user.url()+">\
			}";
			
			$scope.select = "\
			SELECT ?urn ?type ?label ?desc ?time\
			WHERE {\
				?urn <"+user.dir()+"> <"+user.url()+">\
				OPTIONAL { ?urn this:type ?type . }\
				OPTIONAL { ?urn rdf:label ?label . }\
				OPTIONAL { ?urn rdf:description ?desc . }\
				OPTIONAL { ?urn xml:dateTime ?time . }\
			}";
		}
		
		$scope.hide = true; // Hide default pagination buttons
	}
]);


// login

appControllers.controller( 'LoginCtrl', ['$scope', 'user',
	function( $scope, user ){
		
	}
]);


// resize/:urn

appControllers.controller( 'ResizeCtrl', ['$scope','$injector','user','$rootScope',
	function( $scope, $injector, user, $rootScope ){
		
		// Start once user event fires 
		
		$rootScope.$on( user.events.ok, function(){ go() });
		
		function go(){
		
			$scope.title = "Resize";
			$scope.form = {
				'rdf:label':"",
				'rdf:description':"",
				'this:keyword':[]
			};
			$injector.invoke( EditCtrl, this, { $scope: $scope } );
			
			$scope.run = function() {
				$scope.uploads = [];
				$scope.uploads[0] = { urn: $scope.json['this:upload']['@id'] };
			}
			
			$scope.init();
		}
	}
]);


// User

appControllers.controller( 'UserCtrl', ['$scope','$injector','user','$rootScope',
	function( $scope, $injector, user, $rootScope ){
		
		
		// Start once user event fires 
		
		$rootScope.$on( user.events.ok, function(){ go() });
		
		function go(){
			$scope.only = user.only;
			$scope.user = user.id();
		}
		
		$scope.switch = function( bool ){
			user.only = bool;
			go();
		}
	}
]);


// StdOut

appControllers.controller( 'StdOut', ['$scope','stdout',
	function( $scope, stdout ) {
		$scope.stdout = stdout;
		$scope.$watch('stdout.msg', function(){
			$scope.msg = stdout.msg;
		});
	}
]);


// JsonMsg
// Makes communication with JackSON server more transparent
// to the user.

appControllers.controller( 'JsonMsg', ['$scope','json',
	function( $scope, json ) {
		var update = function( method, url, stat, msg ){
			$scope.method = method;
			$scope.url = url;
			$scope.status = stat;
			$scope.msg = msg;
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
	}
]);