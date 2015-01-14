var appControllers = angular.module('appControllers',[]);


// home

appControllers.controller( 'HomeCtrl', ['$scope','$injector','user','$rootScope','onto',
	function( $scope, $injector, user, $rootScope, onto ){
		
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
                        var creator = onto.with_ns('creator');
                        var created = onto.with_ns('created');
                        var type = onto.with_ns('type');
                        var label = onto.with_ns('label');
                        var description = onto.with_ns('description');
			$scope.number = "\
			SELECT count( distinct ?urn )\
			WHERE {\
				?urn <" + creator + "> <"+user.url()+">\
			}";
			
			$scope.select = "\
			SELECT ?urn ?type ?label ?desc ?time\
			WHERE {\
				?urn <"+ creator +"> <"+user.url()+">\
				OPTIONAL { ?urn <" + type +"> ?type . }\
				OPTIONAL { ?urn <" + label +"> ?label . }\
				OPTIONAL { ?urn <" + description +">?desc . }\
				OPTIONAL { ?urn <" + created + "> ?time . }\
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

appControllers.controller( 'ResizeCtrl', ['$scope','$injector','user','$rootScope','onto',
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
				$scope.uploads[0] = { urn: $scope.json[onto.with_prefix('src')]['@id'] };
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
