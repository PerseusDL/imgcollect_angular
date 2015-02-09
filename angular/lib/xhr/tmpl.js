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

var crop = tserv('cropper');
crop.add( 'urn:cite:perseus:upload.ry897TREW', 0.5, 0.5, 0.25, 0.25 );

*/