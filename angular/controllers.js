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

// Collection List
appControllers.controller('CollectionListCtrl', ['$scope','sparql','$routeParams',
	function($scope, sparql, $routeParams){
		$scope.title = "Collection List";
		$scope.order = "?time";
		$scope.limit = "10";
		$scope.page = ( $routeParams.page == undefined ) ? 1 : parseInt( $routeParams.page );
		$scope.list = null;
		$scope.pages = null;
		$scope.keys = [ 'urn','label','desc','user','time' ]

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
		OFFSET "+$scope.limit*($scope.page-1)+"\
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
					$scope.pages = Math.ceil( $scope.count / $scope.limit );
					$scope.prev = ( $scope.page > 1 ) ? true : false;
					$scope.next = ( $scope.page < $scope.pages ) ? true : false;
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

// Collection
appControllers.controller('CollectionCtrl', ['$scope','json','sparql','$routeParams',
	function( $scope, json, sparql, $routeParams ){
		$scope.title = "Collection";
		$scope.urn = ( $routeParams.urn == undefined ) ? null : $routeParams.urn;
		$scope.src = null;
		
		// Data and form
		// objects and methods
		$scope.json = {};
		$scope.form = {
			'@id':"",
			'rdf:label':"",
			'rdf:description':"",
			'this:keyword':[]
		};
		$scope.json_string = '';
		$scope.save = function(){ save() }
		$scope.change = function( key ){ change(key) }
		
		function change( key ) {
			if ( key in $scope.json ) {
				$scope.json[key] = $scope.form[key];
				json_to_str( $scope.json );
			}
		}
		
		function save() {
			json.put( $scope.src[0], $scope.json ).then(
				function(msg){ $scope.stdout = msg }
			);
		}
		
		function src() {
			json.urn( $scope.urn ).then( function( data ){
				$scope.src = data.src;
				get();
			});
		}
		
		function get() {
			json.get( $scope.src[0] ).then( function( data ){
				$scope.json = data;
				json_to_str( data );
			});
		}
		
		function json_to_str( data ) {
			$scope.json_string = angular.toJson( data, true );
		}
		
		function init() {
			src();
		}
		init();
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