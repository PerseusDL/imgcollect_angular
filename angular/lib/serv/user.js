app.service( 'user', [ function() {
	
	this.id = 'adamt';
	this.base = 'http://data.perseus.org/sosol/users';
	this.url = this.base+'/'+this.id;
	
	return({
		id: this.id,
		base: this.base,
		url: this.url,
		only: true
	});
	
}]);