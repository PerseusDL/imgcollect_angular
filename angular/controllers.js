var appControllers = angular.module('appControllers',[]);

appControllers.controller('HomeCtrl', ['$scope','$injector','user',
	function( $scope, $injector, user ){
		$scope.title = "Home";
		$scope.type = "home";
		$scope.keys = [ 'urn','label','desc','time' ];
		$injector.invoke( ListCtrl, this, { $scope: $scope } );
		$scope.number = "\
		SELECT count( distinct ?urn )\
		WHERE {\
			?urn <http://data.perseus.org/sosol/users/> <http://data.perseus.org/sosol/users/"+user.id+">\
		}";
		$scope.select = "\
		SELECT ?urn ?label ?desc ?time\
		WHERE {\
			?urn <http://data.perseus.org/sosol/users/> <http://data.perseus.org/sosol/users/"+user.id+">\
			OPTIONAL { ?urn rdf:label ?label . }\
			OPTIONAL { ?urn rdf:description ?desc . }\
			OPTIONAL { ?urn xml:dateTime ?time . }\
		}";
		$scope.init();
	}
]);

// Collection List
appControllers.controller('CollectionListCtrl', ['$scope','$injector',
	function( $scope, $injector ){
		$scope.type = "collection";
		$scope.title = "Collection List";
		$scope.keys = [ 'urn','label','desc','user','time' ];
		$injector.invoke( ListCtrl, this, { $scope: $scope } );
		$scope.init();
	}
]);

// Collection
appControllers.controller('CollectionCtrl', ['$scope','$injector',
	function( $scope, $injector ){
		$scope.title = "Collection";
		$scope.form = {
			'rdf:label':"",
			'rdf:description':"",
			'this:keyword':[]
		};
		$injector.invoke( EditCtrl, this, { $scope: $scope } );
		$scope.init();
	}
]);

// Upload list
appControllers.controller('UploadListCtrl', ['$scope','$injector',
	function( $scope, $injector ){
		$scope.type = "upload";
		$scope.title = "Upload List";
		$scope.keys = [ 'urn','label','desc','user','time' ];
		$injector.invoke( ListCtrl, this, { $scope: $scope } );
		$scope.init();
	}
]);

// Upload
appControllers.controller('UploadCtrl', ['$scope','$injector',
	function( $scope, $injector ){
		$scope.title = "Upload";
		$scope.form = {
			'rdf:label':"",
			'rdf:description':"",
			'this:keyword':[]
		};
		$injector.invoke( EditCtrl, this, { $scope: $scope } );
		$scope.init();
	}
]);

// Image List
appControllers.controller('ImageListCtrl', ['$scope','json','sparql', 
	function($scope){	
		$scope.title = "Image List";
	}
]);

// Image
appControllers.controller('ImageCtrl', ['$scope','$injector',
	function( $scope, $injector ){
		$scope.title = "Image";
		$scope.form = {
			'rdf:label':"",
			'rdf:description':"",
			'this:keyword':[]
		};
		$injector.invoke( EditCtrl, this, { $scope: $scope } );
		$scope.init();
	}
]);

// Annotation List
appControllers.controller('AnnotationListCtrl', ['$scope','$injector',
	function( $scope, $injector ){
		$scope.title = "Annotation List";
	}
]);

// Annotation
appControllers.controller('AnnotationCtrl', ['$scope','$injector',
	function( $scope, $injector ){
		$scope.title = "Annotation";
	}
]);

// User
appControllers.controller('UserCtrl', ['$scope','$injector','user',
	function( $scope, $injector, user ){
		$scope.user = user.id;
	}
]);