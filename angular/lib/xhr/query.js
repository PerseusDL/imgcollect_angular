app.service( 'query', [
'sparql',
'config',
'onto',
function( sparql, config, onto ) {
	
	// Public methods
	
	return {
		items: items,
		get: get
	}
	
	function items(){
		return 'items'
	}
	
	function get(){
		return 'get'
	}
	
	
	
}]);