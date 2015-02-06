app.service( 'query', [
'sparql',
'config',
'onto',
function( sparql, config, onto ) {
	
	// Public methods
	
	var json = {
		array: [ '?urn', 'belongsTo', 'upload'],
		order_by: '?time',
		limit: 10,
		offset: 0
	}
	
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