// This service adds user and timestamp data to JSON sent to server

app.service( 'jsonPrep', [
'onto',
'user',
function( onto, user ) {
	
	return({
		post: post,
		put: put
	});
	
	function post( json ){
		
	}
	
	function put( json ){
		
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