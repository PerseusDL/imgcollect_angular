var ListCtrl = 	['$scope', 'sparql', 'user', '$routeParams', function( $scope, sparql, user, $routeParams ){
	
	// Actual list data
	
	$scope.json = {};
	
	
	// SPARQL prefixes
	
	$scope.prefix = "\
	PREFIX this: <https://github.com/PerseusDL/CITE-JSON-LD/blob/master/templates/img/SCHEMA.md#>\
	PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\
	PREFIX xml: <http://www.w3.org/TR/xmlschema11-2/#>";
	
	
	// Needed for pagination
	
	$scope.page = ( $routeParams.page == undefined ) ? 1 : parseInt( $routeParams.page );
	$scope.order = "?time";
	$scope.limit = "10";
	$scope.pages = null;
	$scope.paginate = "\
	ORDER BY DESC( "+$scope.order+" )\
	LIMIT "+$scope.limit+"\
	OFFSET "+$scope.limit*($scope.page-1)+"\
	";
	
	
	// Needed to build SPARQL SELECT query
	// that will populate $scope.json.
	// See optionals() and handles()
	
	$scope.items = {
		"rdf:label": "?label",
		"rdf:description": "?desc",
		"xml:dateTime": "?time",
		"<http://data.perseus.org/sosol/users/>": "?user"
	};
	
	
	// Build the SPARQL SELECT query
	
	$scope.select = "\
	SELECT ?urn "+handles()+"\
	WHERE {\
		"+where()+"\
		"+filter()+"\
		"+optionals()+"\
	}";
	$scope.query = "";
	
	
	// Get record count
	
	$scope.number = "\
	SELECT count( distinct ?urn )\
	WHERE {\
		"+where()+"\
		"+filter()+"\
	}";
	
	$scope.init = function(){ init() }
	
	
	// Only your data or everyones?
	
	function where() {
		if ( user.only == true ){
			return "?urn this:type '"+$scope.type+"'.\
			?urn <http://data.perseus.org/sosol/users/> <http://data.perseus.org/sosol/users/"+user.id+">;";
		}
		return "?urn this:type '"+$scope.type+"';";
	}
	
	
	// Build a SPARQL filter clause
	
	function filter() {
		var items = [];
		var regex = [];
		var out = '';
		for ( var key in $scope.filter ){
			var check = $scope.filter[key];
			if ( check == null ) continue;
			var item = $scope.items[key];
			items.push( key+' '+item );
			regex.push( 'regex( '+item+', "'+check+'", "i" )' );
		}
		if ( items.length > 0 ){
			out = items.join(";\n")+"\nFILTER ( "+regex.join(" && ")+" )";
		}
		return out;
	}
	
	function handles() {
		var out = [];
		for ( var key in $scope.items ){
			out.push( $scope.items[key] );
		}
		return out.join(' ');
	}
	
	function optionals() {
		var out = [];
		for ( var key in $scope.items ){
			var obj = $scope.items[key];
			out.push( "OPTIONAL { ?urn "+key+" "+obj+" . }" );
		}
		return out.join("\n");
	}
	
	function list() {
		$scope.query = $scope.prefix + $scope.select + $scope.paginate;
		return sparql.search( $scope.query ).then( 
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
}];