# A better way to issue SPARQL queries:
## Where am I constructing SPARQL queries currently?

	./angular/controllers.js
	./angular/lib/ctrl/item.js
	./angular/lib/ctrl/meta/list_ctrl.js
	./angular/lib/model/annotation.js
	./angular/lib/model/collection.js
	./angular/lib/model/item.js
	./angular/lib/model/resize.js
	./angular/lib/model/upload.js
	./angular/lib/serv/urn_serv.js

	Let's see what this wackiness looks like?

## ./angular/controllers.js

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

## ./angular/lib/ctrl/meta/list_ctrl.js

			$scope.prefix = "\
			PREFIX this: <https://github.com/PerseusDL/CITE-JSON-LD/blob/master/templates/img/SCHEMA.md#>\
			PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\
			PREFIX xml: <http://www.w3.org/TR/xmlschema11-2/#>";
    		
			$scope.paginate = "\
			ORDER BY DESC( "+$scope.order+" )\
			LIMIT "+$scope.limit+"\
			OFFSET "+$scope.limit*($scope.page-1)+"\
			";

			$scope.select = "\
			SELECT ?urn "+handles()+"\
			WHERE {\
				"+where()+"\
				"+filter()+"\
				"+optionals()+"\
			}";
			$scope.query = "";

			$scope.number = "\
			SELECT count( distinct ?urn )\
			WHERE {\
				"+where()+"\
				"+filter()+"\
			}";

			function where() {
				if ( user.only == true ){
					return "?urn this:type '"+$scope.type+"'.\
					?urn <"+user.dir()+"> <"+user.url()+">;";
				}
				return "?urn this:type '"+$scope.type+"';";
			}
			
			function filter(){
				...
				regex.push( 'regex( '+item+', "'+check+'", "i" )' );
				...
				out = items.join(";\n")+"\nFILTER ( "+regex.join(" && ")+" )";
				...
			}

			function optionals() {
				...
				out.push( "OPTIONAL { ?urn "+key+" "+obj+" . }" );
				...
			}

## ./angular/lib/model/annotation.js

			function config() {
				return {
				'this': 'https://github.com/PerseusDL/CITE-JSON-LD/blob/master/templates/img/SCHEMA.md#',
				cite: 'http://www.homermultitext.org/cite/rdf/',
				rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
				user: 'http://data.perseus.org/sosol/users/'
				};
			}

			function prefix(){
				...
				pre.push( 'PREFIX '+key+': <'+conf[key]+'>' );
				...
			}

			function query( where ){
			return "\
			"+prefix()+"\
			SELECT ?urn ?p ?o\
			WHERE {\
				?urn this:type 'annotation'.\
				"+where+"\
			}"
			}

			return query( "?urn cite:belongsTo <"+urn+">" );

			function more_query( urn ){
				var where = "?urn cite:belongsTo <"+urn+">.\
						     ?urn ?p ?o";
				return query( where );
			}

			function upload_src_query( urn ){
			return "\
			"+prefix()+"\
			SELECT ?src\
			WHERE {\
				<"+urn+"> cite:belongsTo ?item .\
				?item this:upload ?upl .\
				?upl this:src ?src\
			}"
			}

## ./angular/lib/model/collection.js

			function prefix(){
			return "\
			PREFIX this: <https://github.com/PerseusDL/CITE-JSON-LD/blob/master/templates/img/SCHEMA.md#>";
			}

			function get_query(){
			return "\
			"+prefix()+"\
			SELECT ?urn\
			WHERE {\
				?urn this:type 'collection'\
			}"
			}

			function search_query( str ){
			return "\
			"+prefix()+"\
			SELECT ?urn\
			WHERE {\
				?urn this:type 'collection'\
				FILTER regex( str(?urn), \""+str+"\" )\
			}"
			}

## ./angular/lib/model/item.js

			function prefix() {
			return "\
			PREFIX this: <https://github.com/PerseusDL/CITE-JSON-LD/blob/master/templates/img/SCHEMA.md#>\
			PREFIX cite: <http://www.homermultitext.org/cite/rdf/>";
			}

			function query( where ){
			return "\
			"+prefix()+"\
			SELECT ?urn\
			WHERE {\
				?urn this:type 'item'.\
				"+where+"\
			}"
			}

			function upload_query( urn ){
			return query( "?urn this:upload <"+urn+">" );
			}

			function collection_query( urn ){
				return query( "?urn cite:belongsTo <"+urn+">" );		
			}

## ./angular/lib/model/resize.js

			function prefix() {
			return "\
			PREFIX this: <https://github.com/PerseusDL/CITE-JSON-LD/blob/master/templates/img/SCHEMA.md#>";
			}
			
			function query( urn ) {
			return "\
			"+prefix()+"\
			SELECT ?urn ?width ?height\
			WHERE {\
				?urn this:type 'resize'.\
				?urn this:upload <"+urn+">\
				OPTIONAL { ?urn this:width ?width . }\
				OPTIONAL { ?urn this:height ?height . }\
			}"
			}

## ./angular/lib/model/upload.js

			function prefix() {
			return "\
			PREFIX this: <https://github.com/PerseusDL/CITE-JSON-LD/blob/master/templates/img/SCHEMA.md#>\
			PREFIX cite: <http://www.homermultitext.org/cite/rdf/>";
			}

			function annotation_query( urn ) {
			return "\
			"+prefix()+"\
			SELECT ?urn\
			WHERE {\
				<"+urn+"> cite:belongsTo ?item .\
				?item this:upload ?urn\
			}"
			}

## ./angular/lib/serv/urn_serv.js

			function query( urn ) {
			return "\
			SELECT count( distinct ?o )\
			WHERE { <"+urn+"> ?p ?o }"
			}



## a sketch of what i'll need.

		optional: {
			'?type': 'this:type',
			'?label': 'rdf:label',
			'?desc': 'rdf:description',
			'?time': 'xml:dateTime'
		},
		required: {
			
		}
	
	count()
		SELECT count( distinct ?urn )

	query()
		SELECT terms
