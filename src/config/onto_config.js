app.service( 'onto_config', [ 
function(){ 
	return({
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
		x: {
		   term: "x",
		   ns: "https://github.com/PerseusDL/CITE-JSON-LD/blob/master/templates/img/SCHEMA.md#",
		   prefix: "this"
		},
		y: {
		   term: "y",
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
	});
}]);