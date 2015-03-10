// This service adds user and timestamp data to JSON sent to server

app.service( 'jsonPrep', [
'onto',
'user',
function( onto, user ) {
	
	return({
		post: post,
		put: put
	});
	
	
	// Prepare json for an HTTP POST
	
	function post( json ){
		
		// get creator, created, and modified 
		// data keys from onto
		
		// creator can be single object or array
		
		var creator = onto.pre('creator');
		var created = onto.pre('created');
		
		json[ creator ] = user.node();
		json[ created ] = time_it();
	}
	
	
	// Prepare json for an HTTP PUT
	
	function put( json ){
		
		// should creator be used
		// is there another dublin core ontology term
		// that's a better fit?
		
		var contributor = onto.pre('contributor');
		var modified = onto.pre('modified');
		
		// modified
		
		json[ contributor ] = [];
		json[ modified ] = [];
	}
	
	
	// Return a timestamp in xsd format
	
	function time_it(){
		return ( new TimeStamp ).xsd()
	}
	
	// Add time 
	
	function add_time(){
		
	}
	
	
	// Add a contributor
	
	function add_user( json, key ){
		
		// is a key an object or an array of objects
		
		if ( json[key] == user.node() ){
			return
		}
		
		// if it's an array add check if it exists
		
		for( var i=0; i<json[key].length; i++ ){
			if ( json[key] == user.node() ){
				return
			}
		}
		
		/*
		if ( type json[key] == Array ){
			json[key].push( user.node() );
		}
		else if ( json[key] == null || json[key] == '' ){
			json[key] = user.node();
		}
		else if ( type json[key] == Object ){
			json[key] = [ json[key], user.node() ];
		}
		*/
	}
	
}]);

/*

To test this...

var tmpl = tserv( 'tmpl' );
var json = null;
tmpl.get( 'collection' ).then(
function( json ){
	console.log
});


*/