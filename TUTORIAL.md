I've been working on an image collection tool.
It is built on top of a backend I built.
I called it JackSON.

With it you can save JSON-LD to a server.
That JSON-LD will be saved to the filesystem as it was received.
The JSON-LD will then be converted to RDF on-the-fly and saved to a triple-store.

You have two ways of retrieving data with this system.
Grabbing the JSON-LD file you originally saved.
And querying the triple-store over HTTP.

Changing the JSON-LD on the server will change the RDF in the triple-store.
Deleting the JSON-LD deletes the RDF in the triple-store.
Essentially the triple-store is kept in sync with JSON-LD saved on the filesystem.

This means...

* You can write web applications that produce RDF triples entirely in Javascript.
	* I have some Javascript libraries that make this process very easy.
	
* Changing data-models is as easy as changing JSON-LD files.
	* You don't have to issue CREATE or ALTER TABLE queries or modify model classes.
	
* You don't have to write an API to publish machine actionable data as you would if you were using a relational database.
	* everything is queryable at the SPARQL endpoint, because that's what the application is using.
	

It has flaws...

* It's not secure... AT ALL.
	* Anyone could change anyone else's data... potentially.
	* It's missing a data validation system.

* No versioning.
	* Integration with GIT in the future :)

* It hasn't been adequately load tested.
	* Concerns
		* JackSON's handling concurrent writes to the filesystem .
		* SPARQL queries requesting lots of records.


...but even in its infant state it's a great prototyping tool.

So let me show you a prototype application I built on top of JackSON called imgcollect.

	GIVE DEMO


## What's happening behind the curtain.

imgcollect creates new data like this.

1. GET JSON_LD template.
2. Fill out the template.
3. POST the data to JackSON

[Here are the JSON-LD templates, which define the data model.](https://github.com/PerseusDL/imgcollect_angular/tree/master/json_ld)

So let me show you my development environment, 
we'll generate a bunch of test records,
and we'll build some queries to retrieve our data.

You know... the basics :)


## Set up development environment

I use four terminal windows stacked on one another.
It's nice to see server activity.

JackSON is a sinatra server for saving and retrieving JSON.

	/var/www/JackSON
		rake start

JackRDF handles the JSON-LD to RDF conversion.
It also has an installer for a Fuseki server, 
and tasks to run and interact with it.

	/var/www/JackRDF
		rake start

imgup is a server that saves images, serves them.

It can also run various background image processing jobs.
Resizing, format conversion, cropping, potentially OCR, and can communicate with JackSON.

	/var/www/imgup
		rake start



	/var/www/JackSON/public/apps/imgcollect
		compass watch
		grunt watch
		mate .


## Clear-out my data

[Here's all of my triple-store data.](http://localhost:4321/ds/query?query=select+%3Fs+%3Fp+%3Fo%0D%0Awhere+%7B+%3Fs+%3Fp+%3Fo+%7D&output=text&stylesheet=)

For demonstration purposes I'm going to clear it out...

	cd /var/www/JackSON
	rake triple:destroy

Don't worry it's not gone for good!
I can regenerate all my triples from the saved JSON-LD with this command...

	rake triple:make


## Javascript libraries

Let me show you some of the Javascript libraries that imgcollect is built-on.

	var tmpl = tserv( 'tmpl' );

GET a JSON_LD template.

	tmpl.get( 'collection' ).then(
	function( r ){
	  data = r;
	});

Fill out the template.

	data['@id'] = 'urn:cite:perseus:collection.234567';
	data['rdf:label'] = 'This is a new rcord';

POST the data to the JackSON server.

	var json = tserv( 'json' );
	json.post( 'test/'+data['@id'], data ).then(
	function( r ){
		console.log( r );
	});

GET the data back...

	json.urn( 'urn:cite:perseus:collection.234567' ).then(
	function( r ){
		src = r['src'][0];
	});

	json.get( src ).then(
	function( r ){
		data = r;
	});

Change the data...

	data['rdf:label'] = 'This is a brand spanking new record';

	json.put( 'test/'+data['@id'], data ).then(
	function( r ){
		console.log( r );
	});

Delete the data...

	json.delete( 'test/'+data['@id'] ).then(
	function( r ){
		console.log( r );
	});

So that's how we can create and change individual records.
Now let's create lots of fake records, 1024 is a nice number, so I can show you how to query this data.
We'll use chance.js, a random data generation library, to help with the task.

	function randId(){
	return chance.string({ 
		length:11, 
		pool:'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0987654321' 
	})}
	
	function record(){
		var d = angular.copy( data );
		d['@id'] = 'urn:cite:perseus:collection.'+randId();
		d['rdf:label'] = chance.name();
		d['rdf:description'] = chance.sentence();
		return d
	}
	
	for ( var i=0; i<10024; i++ ){
		d = record();
		json.post( 'test/'+d['@id'], d );
		d = null;
	}

And just like that we created over a thousand collection records.
Now let's write a SPARQL query and retrieve some data.
I've created an abstraction of SPARQL which makes writing these queries a bit easier.

	var query = tserv( 'query' );

If you're familiar with SPARQL this shouldn't look too strange.
I'm retrieving all the collection records and their labels and description.

	var q = {
		where:[
			[ '?urn', 'type', '"collection"' ],
			[ '?urn', 'label', '?label' ],
			[ '?urn', 'description', '?desc' ]
		]
	};

	query.get( q ).then(
	function( r ){
		console.log( r );
	});

Let's add a filter to our query...

	var q = {
		where:[
			[ '?urn', 'type', '"collection"' ],
			[ '?urn', 'label', '?label' ],
			[ '?urn', 'description', '?desc', 
				{ filter: 'regex( ?desc, "ego", "i" )' } ]
		]
	};

	query.get( q ).then(
	function( r ){
		console.log( r );
	});

So using this service you can build search interfaces like this one with pagination and filtering.
Pretty easily.  
Take a look at this code.

	https://github.com/PerseusDL/imgcollect_angular/blob/master/src/controllers/collection/collection_list_ctrl.js

It's what drives this display.

	http://localhost:4567/apps/imgcollect/index.html#/collections

You can see it doesn't take too much to wire an interface to build a SPARQL query with pagination and filtering.

## Remove test data and rebuild your triples.

Removing your test records.

	rake triple:destroy

Delete your test data.

	rm -rf /var/www/JackSON/data/test

Rebuild your triple-store from the JSON-LD

	rake triple:make

## Databases perform two related but very different functions.

1. Meticulous record keeping.
	* Record goes in.  Person wants specific record.  Asks for it.  Record comes out unchanged.

2. Exploration.
	* Person wants to browse and search related data.
	
Getting one database system to perform both functions flawlessly is very hard.
JackSON keeps these functions separate.

1. JSON-LD is received from the client and stored on the filesystem as it is received.
2. Data exploration is handled by the triplestore.


## Merging data

Keeping separate development and production instances of a relational database is a pain, 
because of keys and internal indexes.
Keys are typically unsigned integers that get assigned when the record is created.
You can design relational database schemas that don't use unsigned integers as your keys,
but you'll take a significant performance hit for that so no one really does it.

That key is effectively the database's internal identifier for that record.
And this is why merging data from different instances of the same schema is a pain,
because these keys, the database's internal identifiers, will inevitably collide.
They're all counting up from 1 after all.

You may be wondering why this is an issue.
When do databases actually merge?
Is this a far off concern?

I don't think it is.
We have production systems and development systems.
A production db and development db forking is a very common problem.

If we're using JackSON though, we're using a triplestore, and its internal ids are the public ids, which is the CITE URN.
And since the CITE URNs are namespaced 
and the flavor of CITE URN I'm using is an 11 digit, cased, alpha numeric sequence 
appended to the namespace the chance of an id collision is 
1 in ((26*2)+10)^11 = 62^11, excluding the namespace.

This means merging data is easy.  
Winning the lottery is more likely than an id collision.
Which means the data they produce can be merged into one triple-store 
and then meaningfully searched 
with little to no programming effort.

All you have to do is copy or rsync over the JSON-LD files and run a task to build the triples.
That means refreshing development databases with production data is easy, 
and merging data produced by others is easy.

Data sets can grow from the bottom up without having to accomodate the new data with new tables and columns in order to meaningfully query them.


## Image job queue

imgup is the image upload server used by imgcollect.
It also resizes images.

The problem with any kind of image processing is that it typically uses more computing resources than shuffling text in and out of a database.

The typical server interaction ( client sends server data, server does some processing and returns response to the client in real-time ) isn't sufficient for these kinds of tasks.

The server needs to queue the processing requested by the client so the server's isn't temporarily overwhelmed resulting in the client application becoming slow and unresponsive.

imgup has a job queuing system.
The way it works is interesting and it's not that difficult to extend.
Here's how it works.

	imgup job queue system.

With a little more development it could be used for submitting OCR jobs,
and data produced by the jobs can be sent to JackSON using JSON-LD.

I've been thinking about automating manuscript transcription.
Complete OCR'ing of manuscripts is difficult,
but finding word boundaries in manuscripts is an easier problem.
The same JSON-LD template used by the imgspect app 
could be filled with this word boundary data, 
and submitted to JackSON to be checked with human eye-balls and brains 
through an application like imgcollect.