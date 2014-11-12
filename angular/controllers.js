var appControllers = angular.module('appControllers',[]);

appControllers.controller('ImageListCtrl', ['$scope','json','sparql', 
	function($scope){	
		$scope.title = "Image List";
	}
]);

appControllers.controller('ImageCtrl', ['$scope','json','sparql',
	function($scope){	
		$scope.title = "Image";
	}
]);

appControllers.controller('CollectionListCtrl', ['$scope','json','sparql',
	function($scope){
		$scope.title = "Collection List";
	}
]);

appControllers.controller('CollectionCtrl', ['$scope','json','sparql',
	function($scope){	
		$scope.title = "Collection";
	}
]);

appControllers.controller('HomeCtrl', ['$scope','json','sparql',
	function($scope){
		$scope.title = "Home";
	}
]);