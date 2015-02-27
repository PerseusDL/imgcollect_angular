app.service( 'resizer', [
'json',
'imgup',
'config',
'urnServ',
'onto',
'tmpl',
function( json, imgup, config, urnServ, onto, tmpl ) {
	
	var max_width = null;
	var max_height = null;
	var src = null;
	var upload = null;
	var resize_urn = null;
	var res_tmpl = null;
	var urn = null;
	
	return {
		add: add
	}
	
	function add( _urn, _max_width, _max_height ){
		max_width = _max_width;
		max_height = _max_height;
		urn = _urn;
		return upload_src()
	}
	
	function upload_src(){
		return json.urn( urn ).then( 
		function( data ){
			src = data['src'][0];
			return upload_json();
		});
	}
	
	function upload_json(){
		return json.get( src ).then(
		function( data ){
			upload = data;
			return get_urn();
		});
	}
	
	function get_urn(){
		return urnServ.fresh( urnServ.base+"resize.{{ id }}", 
		function( urn ){
			resize_urn = urn;
			return resize_tmpl();
		});
	}
	
	function resize_tmpl(){
		return tmpl.get( 'resize' ).then( 
		function( data ){
			res_tmpl = data;
			return set_vals();
		});
	}
	
	function set_vals(){
		res_tmpl['@id'] = resize_urn;
		res_tmpl[onto.with_prefix('memberOf')]['@id'] = upload['@id'];
		return send();
	}
	
	function send(){
		var save_to = config.xhr.json.url+'/data/resize/'+resize_urn;
		var img = upload[ onto.with_prefix('src') ]['@id'];
		return imgup.resize( img, 200, 200, save_to, res_tmpl ).then( 
		function( data ){
			return data;
		});
	}
	
}]);

/*

To run this in the console...

var r = tserv('resizer')
r.add('urn:cite:perseus:upload.QAlWThSWNU1', 200, 200)

*/