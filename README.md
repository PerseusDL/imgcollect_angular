# Foundation Compass Template

The easiest way to get started with Foundation + Compass.

## Requirements

  * Ruby 1.9+
  * [Node.js](http://nodejs.org)
  * [compass](http://compass-style.org/): `gem install compass`
  * [bower](http://bower.io): `npm install bower -g`

## Quickstart

  * [Download this starter compass project and unzip it](https://github.com/zurb/foundation-compass-template/archive/master.zip)
  * Run `bower install` to install the latest version of Foundation
  
Then when you're working on your project, just run the following command:

```bash
bundle exec compass watch
```

## Upgrading

If you'd like to upgrade to a newer version of Foundation down the road just run:

```bash
bower update
```

## Notes
Get all collections URNs.

	PREFIX this: <https://github.com/PerseusDL/CITE-JSON-LD/blob/master/templates/img/SCHEMA.md#>
	SELECT ?s
	WHERE { ?s this:type 'collection' }

Get all collection labels and description.

	PREFIX this: <https://github.com/PerseusDL/CITE-JSON-LD/blob/master/templates/img/SCHEMA.md#>
	PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
	SELECT ?s ?label ?desc
	WHERE { 
		?s this:type 'collection'; 
			rdf:label ?label;
			rdf:description ?desc
	}


Get all collection labels and description, user, keywords, and time.

	PREFIX this: <https://github.com/PerseusDL/CITE-JSON-LD/blob/master/templates/img/SCHEMA.md#>
	PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
	PREFIX xml: <http://www.w3.org/TR/xmlschema11-2/#>
	PREFIX user: <http://data.perseus.org/sosol/users/>
	SELECT ?s ?label ?desc ?time ?user
	WHERE { 
		?s this:type 'collection'; 
		OPTIONAL { ?s rdf:label ?label . }
		OPTIONAL { ?s rdf:description ?desc . }
		OPTIONAL { ?s xml:dateTime ?time . }
		OPTIONAL { ?s user ?user }
	}
	

Okay now how would I paginate this?

	PREFIX this: <https://github.com/PerseusDL/CITE-JSON-LD/blob/master/templates/img/SCHEMA.md#>
	PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
	PREFIX xml: <http://www.w3.org/TR/xmlschema11-2/#>
	SELECT ?s ?label ?desc ?time ?user ?keyword
	WHERE { 
		?s this:type 'collection'; 
		OPTIONAL { ?s rdf:label ?label . }
		OPTIONAL { ?s rdf:description ?desc . }
		OPTIONAL { ?s xml:dateTime ?time . }
		OPTIONAL { ?s <http://data.perseus.org/sosol/users/> ?user . }
		OPTIONAL { ?s this:keyword ?keyword }
	}
