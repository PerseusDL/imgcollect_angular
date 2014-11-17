var ListCtrl = 	function($scope, sparql, $routeParams){
	$scope.page = ( $routeParams.page == undefined ) ? 1 : parseInt( $routeParams.page );
	$scope.order = "?time";
	$scope.limit = "10";
	$scope.json = {};
	$scope.pages = null;
	$scope.init = function(){ init() }
	
	$scope.prefix = "\
	PREFIX this: <https://github.com/PerseusDL/CITE-JSON-LD/blob/master/templates/img/SCHEMA.md#>\
	PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\
	PREFIX xml: <http://www.w3.org/TR/xmlschema11-2/#>";
	
	$scope.query = $scope.prefix+"\
	SELECT ?urn ?label ?desc ?time ?user\
	WHERE {\
		?urn this:type '"+$scope.type+"';\
		OPTIONAL { ?urn rdf:label ?label . }\
		OPTIONAL { ?urn rdf:description ?desc . }\
		OPTIONAL { ?urn xml:dateTime ?time . }\
		OPTIONAL { ?urn <http://data.perseus.org/sosol/users/> ?user . }\
	}\
	"+paginate();
	
	function paginate() {
	return "\
	ORDER BY DESC( "+$scope.order+" )\
	LIMIT "+$scope.limit+"\
	OFFSET "+$scope.limit*($scope.page-1)+"\
	";
	}
	
	function list() {
		return sparql.search( $scope.query ).then( 
			function( data ) { 
				$scope.json = data;
			}
		);
	}
	
	function count() {
		var query = $scope.prefix+"\
		SELECT count( distinct ?urn )\
		WHERE {\
			?urn this:type '"+$scope.type+"';\
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
		if ( !('type' in $scope) ) {
			throw "$scope.type is not defined.";
		}
		count();
		list();
	}
}