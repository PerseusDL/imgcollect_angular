app.service( 'tmpl', [
'$http',
'config',
function( $http, config ) {
	
	return {
		get: get
	}
	
	function get( type ){
		return $http({
			method: 'GET',
			url: config.xhr.tmpl.url+'/'+type+'.json',
			headers: {
			    'Content-Type': 'application/json'
			}
		}).then( function( r ){
			return r.data;
		});
	}
	
}]);

/*

To run this in the console...

var tmpl = tserv('tmpl');
tmpl.get('resize').then( function(data){ console.log( data ) });

*/