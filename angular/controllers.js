var appControllers = angular.module('appControllers',[]);

appControllers.controller('ImageListCtrl', ['$scope','json','sparql', 
	function($scope){	
		$scope.title = "Image List";
	}
]);

// Collection List
appControllers.controller('CollectionListCtrl', ['$scope', '$injector',
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

appControllers.controller('AnnotationListCtrl', ['$scope','json','sparql',
	function( $scope ){
		$scope.title = "Annotation List";
	}
]);

appControllers.controller('AnnotationCtrl', ['$scope','json','sparql',
	function( $scope ){
		$scope.title = "Annotation";
	}
]);

appControllers.controller('HomeCtrl', ['$scope','json','sparql',
	function( $scope ){
		$scope.title = "Home";
	}
]);

appControllers.controller('UserCtrl', ['$scope','json','sparql',
	function( $scope ){
		$scope.user = "Username1"
	}
]);