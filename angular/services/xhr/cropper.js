app.service( 'cropper', [
'json',
'imgup',
'config',
'urnServ',
'onto',
function( json, imgup, config, urnServ, onto ) {
	
	return {
		add: add
	}
	
	function add( _urn, _x, _y, _w, _h ){
		max_width = _max_width;
		max_height = _max_height;
		urn = _urn;
		return upload_src()
	}
	

	
}]);

/*

To run this in the console...

var crop = tserv('cropper');
crop.add( 'urn:cite:perseus:upload.ry897TREW', 0.5, 0.5, 0.25, 0.25 );

*/