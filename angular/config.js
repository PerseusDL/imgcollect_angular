app.service( 'config', [ 'host', function( host ){
return({
    
    serv: {
      
      user: {
        
        // URL to Perseids user data object
        
        ping: 'conf/ping.js'
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
        
      }
    },
    imgup: {
			
			url: 'http://localhost:1234'
      //url: 'http://www.perseids.org/imgup/upload'
			
    },
		ontology: {
		  imgViewer: {
		    term: "imageViewer",
		    ns: "http://data.perseus.org/rdfvocab/cite/",
		    prefix: "citex"
		  },
		  imgServer: {
		    term: "imageServer",
		    ns: "http://data.perseus.org/rdfvocab/cite/",
		    prefix: "citex"
		  },
		  label:  {
		     term: "label",
		     ns: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
		     prefix: "rdf"
		  },
		  description: {
		     term: "description",
		     ns: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
		     prefix: "rdf"
		  }, 
		  type: {
		     term: "type",
		     ns: "http://purl.org/dc/terms/",
		     prefix: "dct"
		  },
		  src: {
		     term: "references",
		     ns: "http://purl.org/dc/terms/",
		     prefix: "dct"
		  },
		  orig:  {
		     term: "orig",
		     ns: "https://github.com/PerseusDL/CITE-JSON-LD/blob/master/templates/img/SCHEMA.md#",
		     prefix: "this"
		  },
		  owner: {
		     term: "publisher",
		     ns: "http://purl.org/dc/terms/",
		     prefix: "dct"
		  },
		  creator: {
		     term: "creator",
		     ns: "http://purl.org/dc/terms/",
		     prefix: "dct"
		  },
			identifier: {
				term: "dct:identifier",
	     ns: "http://purl.org/dc/terms/",
	     prefix: "dct"
			},
		  contributor: {
		     term: "contributor",
		     ns: "http://purl.org/dc/terms/",
		     prefix: "dct"
		  },
		  created: {
		     term: "created",
		     ns: "http://purl.org/dc/terms/",
		     prefix: "dct"
		  },
		  modified: {
		     term: "modified",
		     ns: "http://purl.org/dc/terms/",
		     prefix: "dct"
		  },
		  width: {
		     term: "width",
		     ns: "https://github.com/PerseusDL/CITE-JSON-LD/blob/master/templates/img/SCHEMA.md#",
		     prefix: "this"
		  },
		  height: {
		     term: "height",
		     ns: "https://github.com/PerseusDL/CITE-JSON-LD/blob/master/templates/img/SCHEMA.md#",
		     prefix: "this"
		  },
		  subject: {
		     term: "subject",
		     ns: "http://purl.org/dc/terms/",
		     prefix: "dct"
		  },
		  memberOf: {
		     term: "belongsTo",
		     ns: "http://www.homermultitext.org/cite/rdf/",
		     prefix: "cite"
		  },
		  represents: {
		     term: "P138_represents",
		     ns: "http://www.cidoc-crm.org/cidoc-crm/",
		     prefix: "crm"
		  },
		  rights: {
		     term: "license",
		     ns: "http://www.homermultitext.org/cite/rdf/",
		     prefix: "cite",
		     default_value: "http://creativecommons.org/licenses/by-nc-sa/4.0/"
		  }
		},
		
		// Config user access
		
		access: {
			public_views: [ '/view' ],
			logged_in: '/upload',
			logged_out: '/login'
		}
  })
}])
