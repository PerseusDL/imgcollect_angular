app.service( 'config', [ 'host', function( host ){
  return({
    
    // ATTENTION! 
    
    // Configuration options should mirror application folder structure
    
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
        
                                //url: host.url+'/query' 
        url: 'http://services.perseids.org/fuseki/ds/query'
      },
      
      json: {
        
        // URL to JackSON server
        // JackSON server hosts JSON data and the application by default
      
                                //ur: host.url  ,
        url: 'http://www.perseids.org/jackson',
        
        // Add user value to data
        
        tack_on: [ 'user' ]
      }
    },
    imgup: {
                        //url: 'http://localhost:1234/upload'     
      url: 'http://www.perseids.org/imgup/upload'  
    },

                ontology: {
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
                     ns: "https://github.com/PerseusDL/CITE-JSON-LD/blob/master/templates/img/SCHEMA.md#",
                     prefix: "this"
                  },
                  src: {
                     term: "src",
                     ns: "https://github.com/PerseusDL/CITE-JSON-LD/blob/master/templates/img/SCHEMA.md#",
                     prefix: "this"
                  },
                  orig:  {
                     term: "orig",
                     ns: "https://github.com/PerseusDL/CITE-JSON-LD/blob/master/templates/img/SCHEMA.md#",
                     prefix: "this"
                  },
                  creator: {
                     term: "users/",
                     ns: "http://data.perseus.org/sosol/",
                     prefix: "user"
                  },
                  created: {
                     term: "dateTime",
                     ns: "http://www.w3.org/TR/xmlschema11-2/#",
                     prefix: "xsd"
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
                     term: "keyword",
                     ns: "https://github.com/PerseusDL/CITE-JSON-LD/blob/master/templates/img/SCHEMA.md#",
                     prefix: "this"
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
                  upload_ref: {
                     term: "upload",
                     ns: "https://github.com/PerseusDL/CITE-JSON-LD/blob/master/templates/img/SCHEMA.md#",
                     prefix: "this"
                  },
                  upload_src: {
                     term: "src",
                     ns: "https://github.com/PerseusDL/CITE-JSON-LD/blob/master/templates/img/SCHEMA.md#",
                     prefix: "this"
                  }
                }
  })
}])
