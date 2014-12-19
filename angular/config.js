app.service( 'config', [ 'host', function( host ){
	return({
		
		// ATTENTION! 
		
		// Configuration options should mirror application folder structure
		
		serv: {
			
			
			user: {
				
				// URL to Perseids user data object
				
				ping: 'conf/ping.js'
				// ping: 'http://sosol.perseids.org/sosol/dmm_api/ping'
			},
			
			urn_serv: {
				
				// CITE URN and namespace
				
				base: 'urn:cite:perseus:'
			},
			
			prefix: {}
			
		},
		xhr: {
			sparql: {
				
				// URL to SPARQL query endpoint
				
				url: host.url+'/query'
			},
			
			json: {
				
				// URL to JackSON server
				// JackSON server hosts JSON data and the application by default
				
				url: host.url 
			}
		},
	})
}])