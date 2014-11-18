var ListCtrl = 	function( $scope, sparql, user, $routeParams ){
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
	
	$scope.select = "\
	SELECT ?urn ?label ?desc ?time ?user\
	WHERE {\
		"+where()+"\
		OPTIONAL { ?urn rdf:label ?label . }\
		OPTIONAL { ?urn rdf:description ?desc . }\
		OPTIONAL { ?urn xml:dateTime ?time . }\
		OPTIONAL { ?urn <http://data.perseus.org/sosol/users/> ?user . }\
	}";
	
	$scope.number = "\
	SELECT count( distinct ?urn )\
	WHERE {\
		"+where()+"\
	}";
	
	$scope.paginate = "\
	ORDER BY DESC( "+$scope.order+" )\
	LIMIT "+$scope.limit+"\
	OFFSET "+$scope.limit*($scope.page-1)+"\
	";
	
	// Only your data or everyones?
	function where() {
		if ( user.only == true ) {
			return "?urn this:type '"+$scope.type+"'.\
			?urn <http://data.perseus.org/sosol/users/> <http://data.perseus.org/sosol/users/"+user.id+">";
		}
		return "?urn this:type '"+$scope.type+"';";
	}
	
	function list() {
		var search = $scope.prefix + $scope.select + $scope.paginate;
		return sparql.search( search ).then( 
			function( data ){
				$scope.json = data;
			}
		);
	}
	
	function count() {
		var count = $scope.prefix + $scope.number;
		return sparql.search( count ).then(
			function( data ){
				$scope.count = data[0]['.1'].value;
				$scope.pages = Math.ceil( $scope.count / $scope.limit );
				$scope.prev = ( $scope.page > 1 ) ? true : false;
				$scope.next = ( $scope.page < $scope.pages ) ? true : false;
			}
		)
	}
	
	function init() {
		if ( !('type' in $scope) ){
			throw "$scope.type is not defined.";
		}
		count();
		list();
	}
}