var appControllers = angular.module('appControllers',[]);


// home

appControllers.controller( 'HomeCtrl', ['$scope','$injector','user','$rootScope',
	function( $scope, $injector, user, $rootScope ){
		
		$scope.title = "Home";
		$scope.type = "home";
		$scope.keys = [ 'urn', 'type', 'label', 'desc', 'time' ];
		
		
		// Make sure user is logged in.
		
		$rootScope.$on( user.events.ok, function(){
			go();
			$injector.invoke( ListCtrl, this, { $scope: $scope } );
			$scope.init();
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
		
		$scope.apply_filter = function(){
			$injector.invoke( ListCtrl, this, { $scope: $scope } );
			$scope.init();
		}
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


// STDOUT

appControllers.controller( 'StdOut', ['$scope','stdout',
	function( $scope, stdout ) {
		$scope.stdout = stdout;
		$scope.$watch('stdout.msg', function(){
			$scope.msg = stdout.msg;
		});
	}
]);