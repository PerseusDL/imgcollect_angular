app.service( 'onto', [ 
  'config',
  function(config) {
    var self = this;	

    function precheck(a_term) {
      return angular.isDefined(config.ontology[a_term]);
    } 

    this.with_prefix = function(a_term) {
      if (precheck(a_term)) {
        return config.ontology[a_term].prefix + ":" + config.ontology[a_term].term;
      } else {
        console.log("Missing ontology term " + a_term);
        return null;
      }
    }

    this.with_ns = function(a_term) {
      if (precheck(a_term)) {
        return config.ontology[a_term].ns + config.ontology[a_term].term;
      } else {
        console.log("Missing ontology term " + a_term);
        return null;
      }
    }

    this.prefixes = function() {
      var pfx_query = "";
      var seen = {};
      angular.forEach(Object.keys(config.ontology), function(term,i) {
        if (! seen[config.ontology[term].prefix]) {
          pfx_query = pfx_query + " PREFIX " + config.ontology[term].prefix + ": <" + config.ontology[term].ns + ">";
        }
        seen[config.ontology[term].prefix] = 1;
      });
      // backwards compatibility
      pfx_query = pfx_query + " PREFIX this: <https://github.com/PerseusDL/CITE-JSON-LD/blob/master/templates/img/SCHEMA.md#>";
      return pfx_query;
    }
  }
]);
