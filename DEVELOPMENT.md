Here is how this application is organized.

## directories

* /bower_components
	* Built Javascript and CSS dependencies.  Created using bower package manager.  See bower.json
* /dev
	* Files user for development but aren't used by production.
* /dist
	* Concatenated and minified Javascript files.
* /html
	* AngularJS templates
* /img
	* Images used by the interface
* /json_ld
	* JSON_LD templates.  Your model classes essentially.
* /node_modules
	* Holds scripts and binaries used by Grunt tasks.
* /scss
	* SCSS files are used by compass to build CSS files in /stylesheets.
* /spec
	* Test suite.
* /src
	* Javascript files.
* /stylesheets
	* Compass takes files in /scss and builds the CSS files in here.

## files

* bower.json
	* Javascript dependencies.
* config.rb
	* Compass, ( a SCSS to CSS builder ), config.
* foundation.html
	* Foundation front-end framework reference.
* Gemfile
	* Ruby gem dependency list
* Gemfile.lock
	* Ruby gem dependency list
* Gruntfile.js
	* Grunt task definitions.  Handles concatentation and minification.
* humans.txt
* index.html
	* The HTML entry point to the whole application.
* Rakefile
	* Run tasks... install and run test suite.
* robots.txt

While developing remember to run...

	grunt watch

...also if you want useful error messages in your console open index.html and flip the commented line.

	<!-- <script src="dist/imgcollect_angular.js"></script>	-->
	<script src="dist/imgcollect_angular.min.js"></script>
