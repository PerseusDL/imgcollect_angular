# GitHub projects involved

* https://github.com/caesarfeta/JackSON
	* Restful API for saving and retrieving JSON.
* https://github.com/caesarfeta/JackRDF
	* Triplestore and JSON-LD -- RDF converter
* https://github.com/PerseusDL/CITE-JSON-LD
	* CITE Collection JSON-LD templates and fake data generators.
* https://github.com/caesarfeta/imgcollect_angular
	* UI Angular JS
* https://github.com/caesarfeta/imgcollect
	* Image conversion resize code.
	* Need to refine this.
* https://github.com/caesarfeta/imgspect
	* Image annotation.

# Paths of importance

/var/www/JackSON
/var/www/JackRDF

/var/www/JackSON/templates/cite
/var/www/JackSON/public/apps/imgcollect

/var/www/JackSON/data/default

# imgcollect development

Watch for changes to SCSS

	cd /var/www/JackSON/public/apps/imgcollect
	bundle exec compass watch

Mostly developed with Angular JS

	/var/www/JackSON/public/apps/imgcollect/angular

Here's a quick breakdown of the application's source

Angular basics.

	./app.js
	./controllers.js
	./directives.js

All controllers are one of three types

	./lib/ctrl
	./lib/ctrl/edit_ctrl.js
	./lib/ctrl/list_ctrl.js
	./lib/ctrl/new_ctrl.js

Simplify communication with backend servers.

	./lib/serv
	
	# These are for SPARQL queries for grabbing data not available in the JSON-LD
	
	./lib/serv/annotation.js
	./lib/serv/collection.js
	./lib/serv/item.js
	./lib/serv/resize.js
	./lib/serv/serv.js
	./lib/serv/upload.js
	
	# Used for finding and claiming URNs
	
	./lib/serv/urn_serv.js
	
	# Current user
	
	./lib/serv/user.js

When writing to the the javascript console isn't enough.

	./lib/util
	./lib/util/stdout.js

These handle the basic communication with the JackSON API and Fuseki server.

	./lib/xhr
	./lib/xhr/host.js
	./lib/xhr/json.js
	./lib/xhr/sparql.js

# Theory / Pressures

Fake data generation before development
	practice is better than theory... always
	app performance testing
		is the app scalable?

Keeping separate databases for working and published data.
	Added complexity
	Continuous maintenance to keep them synchronized
	Avoid if at all possible

Datamodels should be application independent and as simple as possible.