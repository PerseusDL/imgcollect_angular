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
	function($scope, json, sparql){
		$scope.title = "Collection List";
		$scope.order = "?time";
		$scope.limit = "10";
		$scope.page = 0;
		$scope.list = null;
		
		function prefix() {
		return "\
		PREFIX this: <https://github.com/PerseusDL/CITE-JSON-LD/blob/master/templates/img/SCHEMA.md#>\
		PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\
		PREFIX xml: <http://www.w3.org/TR/xmlschema11-2/#>";
		}
		
		function paginate() {
		return "\
		ORDER BY DESC( "+$scope.order+" )\
		LIMIT "+$scope.limit+"\
		OFFSET "+$scope.limit*$scope.page+"\
		";
		}
		
		function list() {
			var query = prefix()+"\
			SELECT ?urn ?label ?desc ?time ?user\
			WHERE {\
				?urn this:type 'collection';\
				OPTIONAL { ?urn rdf:label ?label . }\
				OPTIONAL { ?urn rdf:description ?desc . }\
				OPTIONAL { ?urn xml:dateTime ?time . }\
				OPTIONAL { ?urn <http://data.perseus.org/sosol/users/> ?user . }\
			}\
			"+paginate();
			return sparql.search( query ).then( 
				function( data ) { 
					$scope.list = data;
				}
			);
		}
		
		function count() {
			var query = prefix()+"\
			SELECT count( distinct ?urn )\
			WHERE {\
				?urn this:type 'collection';\
			}";
			return sparql.search( query ).then(
				function( data ) {
					$scope.count = data[0]['.1'].value;
				}
			)
		}
		
		function init() {
			count();
			list();
		}
		init();
	}
]);

appControllers.controller('CollectionCtrl', ['$scope','json','sparql',
	function($scope){	
		$scope.title = "Collection";
	}
]);

appControllers.controller('AnnotationListCtrl', ['$scope','json','sparql',
	function($scope){
		$scope.title = "Annotation List";
	}
]);

appControllers.controller('AnnotationCtrl', ['$scope','json','sparql',
	function($scope){
		$scope.title = "Annotation";
	}
]);

appControllers.controller('HomeCtrl', ['$scope','json','sparql',
	function($scope){
		$scope.title = "Home";
	}
]);

appControllers.controller('UserCtrl', ['$scope','json','sparql',
	function($scope){
		$scope.user = "Username1"
	}
]);