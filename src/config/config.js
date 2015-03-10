app.service( 'config', [ 
'host',
function( host ){ return({
    
    serv: {
      
      user: {
        
        // URL to Perseids user data object
        
        ping: 'dev/ping.js'
        //ping: 'http://sosol.perseids.org/sosol/dmm_api/ping'
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
				
				url: 'http://localhost:4321/ds/query'
        //url: 'http://services.perseids.org/fuseki/ds/query'
				
      },
      
      json: {
        
        // URL to JackSON server
				
				url: 'http://localhost:4567'
        //url: 'http://www.perseids.org/jackson',
        
      },
			
			tmpl: {
				url: 'http://localhost:4567/apps/imgcollect/json_ld'
			}
			
    },
    imgup: {
			
			url: 'http://localhost:1234'
      //url: 'http://www.perseids.org/imgup/upload'
			
    },
		
		// Config user access
		
		access: {
			public_views: [ '/view' ],
			logged_in: '/upload',
			logged_out: '/login'
		}
  })
}])
