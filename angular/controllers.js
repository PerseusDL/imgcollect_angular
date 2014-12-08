var appControllers = angular.module('appControllers',[]);


// home

appControllers.controller( 'HomeCtrl', ['$scope','$injector','user',
	function( $scope, $injector, user ){
		$scope.title = "Home";
		$scope.type = "home";
		$scope.keys = [ 'urn', 'type', 'label', 'desc', 'time' ];
		$injector.invoke( ListCtrl, this, { $scope: $scope } );
		
		$scope.number = "\
		SELECT count( distinct ?urn )\
		WHERE {\
			?urn <"+user.base+"/> <"+user.url+">\
		}";
		
		$scope.select = "\
		SELECT ?urn ?type ?label ?desc ?time\
		WHERE {\
			?urn <"+user.base+"/> <"+user.url+">\
			OPTIONAL { ?urn this:type ?type . }\
			OPTIONAL { ?urn rdf:label ?label . }\
			OPTIONAL { ?urn rdf:description ?desc . }\
			OPTIONAL { ?urn xml:dateTime ?time . }\
		}";
		
		$scope.hide = true; // Hide default pagination buttons
		
		$scope.init();
	}
]);


// new/collection

appControllers.controller( 'CollectionNew', ['$scope','$injector', 'urnServ',
	function( $scope, $injector, urnServ ){
	
		$scope.title = "Collection New";
		$scope.type = "collection";
		$scope.show_uniq = true;				


		// Check CITE URN for uniqueness
		
		$scope.urn_uniq = function(){
			urnServ.uniq( $scope.urn, uniq_callback );
		}
		

		// $scope.urn_uniq callback function
		
		var uniq_callback = function( bool, urn ){
			$scope.show_uniq = !bool;
			if ( bool == true ){
				
				// This next line claims a CITE URN and JackSON /data URL
				// AND it retrieves default JSON-LD template
				
				// See lib/new_ctrl.js: $scope.claim
				
				$scope.claim( urn );
				return;
			}
			else {
				$scope.stdout += 'That URN is taken. Choose another.'
			}
		}
		
		// Inherit from parent
		
		$injector.invoke( NewCtrl, this, { $scope: $scope } );
	}
]);


// collections

appControllers.controller( 'CollectionListCtrl', ['$scope','$injector',
	function( $scope, $injector ){
		$scope.type = "collection";
		$scope.title = "Collection List";
		$scope.keys = [ 'urn','label','desc','user','time' ];
		$injector.invoke( ListCtrl, this, { $scope: $scope } );
		$scope.init();
		
		// The fields you allow users to filter
		// are set with object keys in $scope.filter
		
		// See lib/list_ctr.js: filter()
		
		$scope.filter = {
			"rdf:label": null,
			"rdf:description": null
		}
		
		
		// Applying the filter is the same as initializing..
		
		$scope.apply_filter = function(){
			$injector.invoke( ListCtrl, this, { $scope: $scope } );
			$scope.init();
		}
	}
]);


// collection/:urn

appControllers.controller( 'CollectionCtrl', ['$scope','$injector','item',
	function( $scope, $injector, item ){
		$scope.title = "Collection";
		$scope.form = {
			'rdf:label':'',
			'rdf:description':'',
			'this:keyword':[]
		};
		$injector.invoke( EditCtrl, this, { $scope: $scope } );
		$scope.init();
		
		// Retrieve Collection Items
		
		item.by_collection( $scope.urn ).then(
			function( data ){ $scope.items = data }
		);
	}
]);


// new/upload

appControllers.controller( 'UploadNew', ['$scope','$injector','urnServ','json','stdout','user',
	function( $scope, $injector, urnServ, json, stdout, user ){
		$scope.title = "Upload New";
		$scope.stdout = "";
		$scope.form = {
			'rdf:label':'',
			'rdf:description':'',
			'this:src':''
		}
		$scope.type = 'upload';
		$injector.invoke( NewCtrl, this, { $scope: $scope } );
		$scope.change = function(key){ change(key) }
		
		
		// Once you have a fresh item URN
		
		var fresh_callback = function( urn ){
			$scope.urn = urn;
			touch();
			json.post( $scope.data_path( $scope.urn ), $scope.json ).then(
				function( data ){
					stdout.log( data );
				}
			);
		}
		
		
		function touch (){
			$scope.json['@id'] = $scope.urn;
			$scope.json['user']['@id'] = 'user:'+user.id;
			$scope.json['dateTime'] = ( new TimeStamp ).xsd();
		}
		
		
		// Update JSON when form changes
	
		function change( key ) {
			if ( key in $scope.json ) {
				$scope.json[key] = $scope.form[key];
				json_to_str( $scope.json );
			}
		}
	
	
		// Update the form with JSON data
	
		function form() {
			for ( var key in $scope.json ) {
				if ( key in $scope.form ) {
					$scope.form[key] = $scope.json[key];
				}
			}
		}
		
		
		// Turn JSON into pretty-printed string
	
		function json_to_str( data ) {
			var disp = json.disp( data );
			$scope.context = disp[0];
			$scope.json_string = disp[1];
		}
		
		
		// Save your new upload
		
		$scope.save = function(){
			
			// Retrieve a new upload URN
			
			urnServ.fresh( urnServ.base+"upload.{{ id }}", fresh_callback );
		}
		
			
		// Load the default JSON
		
		function default_json(){
			json.get( $scope.src ).then(
			function( data ){
				$scope.json = data;
				json_to_str( $scope.json );
				stdout.log( "Default JSON loaded from: "+$scope.src );
				$scope.ready = true;
			});
		}
		default_json();
	}
]);


// uploads

appControllers.controller( 'UploadListCtrl', ['$scope','$injector',
	function( $scope, $injector ){
		$scope.type = "upload";
		$scope.title = "Upload List";
		$scope.keys = [ 'urn','label','desc','user','time' ];
		$injector.invoke( ListCtrl, this, { $scope: $scope } );
		$scope.init();
		
		// The fields you allow users to filter
		// are set with object keys in $scope.filter
		//
		// See lib/list_ctr.js: filter()
		
		$scope.filter = {
			"rdf:label": null,
			"rdf:description": null
		}
		
		
		// Applying the filter is the same as initializing..
		
		$scope.apply_filter = function(){
			$injector.invoke( ListCtrl, this, { $scope: $scope } );
			$scope.init();
		}
	}
]);


// upload/:urn

appControllers.controller( 'UploadCtrl', ['$scope','$injector','resize','item',
	function( $scope, $injector, resize, item ){
		$scope.title = "Upload";
		$scope.form = {
			'rdf:label':"",
			'rdf:description':"",
			'this:keyword':[]
		};
		$injector.invoke( EditCtrl, this, { $scope: $scope } );
		$scope.init();
		
		// Resize
		
		$scope.resize = [];
		resize.get( $scope.urn ).then(
			function( data ){ $scope.resize = data }
		);
		
		// Items
		
		$scope.items = [];
		item.by_upload( $scope.urn ).then(
			function( data ){ $scope.items = data }
		);
		
	}
]);


// items

appControllers.controller( 'ItemListCtrl', ['$scope','$injector', 
	function( $scope, $injector ){
		$scope.type = "item";	
		$scope.title = "Item List";
		$scope.keys = [ 'urn','label','desc','user','time' ];
		$injector.invoke( ListCtrl, this, { $scope: $scope } );
		$scope.init();
		
		// The fields you allow users to filter
		// are set with object keys in $scope.filter
		//
		// See lib/list_ctr.js: filter()
		
		$scope.filter = {
			"rdf:label": null,
			"rdf:description": null
		}
		
		
		// Applying the filter is the same as initializing..
		
		$scope.apply_filter = function(){
			$injector.invoke( ListCtrl, this, { $scope: $scope } );
			$scope.init();
		}
	}
]);


// item/:urn

appControllers.controller( 'ItemCtrl', ['$scope','$injector','annotation',
	function( $scope, $injector, annotation ){
		$scope.title = "Item";
		$scope.form = {
			'rdf:label':"",
			'rdf:description':"",
			'this:keyword':[]
		};
		$injector.invoke( EditCtrl, this, { $scope: $scope } );
		$scope.init();
		
		// Collection URN
		
		var collection = {}
		collection.urn = $scope.urn.substring( 0, $scope.urn.indexOf('.') )
		$scope.collections = [];
		$scope.collections[0] = collection;
		
		// Annotation URNs
		
		$scope.annotations = [];
		annotation.by_item( $scope.urn ).then(
			function( data ){ $scope.annotations = data }
		);
	}
]);


// new/item/:urn

appControllers.controller( 'ItemNew', ['$scope','urnServ','$routeParams','collection',
	'$location','json','stdout','user',
	function( $scope, urnServ, $routeParams, collection, $location, json, stdout,user ){
		$scope.upload_urn = ( $routeParams.urn == undefined ) ? null : $routeParams.urn;
		$scope.type = "item";
		$scope.title = "Item New";
		$scope.urn = null;
		$scope.ready = false;
		$scope.collection = null;
		$scope.form = {};
		
		// Path to default item JSON
		
		$scope.src = 'default/'+$scope.type+'.json';		
		
		
		// User clicks collection to add upload
		
		$scope.add_to = function( urn ){
			$scope.collection = urn;
			
			// Create a new item URN
			
			urnServ.fresh( urn+".{{ id }}", fresh_callback );
		}
		
		
		// Get collections for the collection selector
		
		$scope.search = function(){
			var str = $scope.form.search;
			$scope.collections = [];
			collection.search( str ).then(
				function( data ){ $scope.collections = data }
			);
		}
		
		
		// Once you have a fresh item URN
		
		var fresh_callback = function( urn ){
			$scope.urn = urn;
			$scope.ready = true;
		}
		
		
		// User clicks edit item URN button
		
		$scope.create_item = function(){ default_json() }
		
		
		// Build the data path URL
	
		$scope.data_path = function( urn ){
			return $scope.type+'/'+urn
		}
		
		
		// Save the default after writing the most basic values
	
		var save = function(){
			touch();
			json.post( $scope.data_path( $scope.urn ), $scope.json ).then(
			function( data ){
				
				// Congratulations!
				// You've added an upload to a collection
				// Go to Edit item view
				
				$location.path('item/'+$scope.urn );	
			});
		}
	
	
		// Set basic values
	
		var touch = function(){
			$scope.json['@id'] = $scope.urn;
			$scope.json['this:upload']['@id'] = $scope.upload_urn;
			$scope.json['user']['@id'] = 'user:'+user.id;
			$scope.json['cite:belongsTo']['@id'] = $scope.collection;
			$scope.json['dateTime'] = ( new TimeStamp ).xsd();
		}
	
	
		// Load the default JSON data
	
		var default_json = function(){
			json.get( $scope.src ).then(
			function( data ){
				$scope.json = data;
				stdout.log( "Default JSON loaded from: "+$scope.src );
				save();
			});
		}
	}
]);


// annotations

appControllers.controller( 'AnnotationListCtrl', ['$scope','$injector',
	function( $scope, $injector ){
		$scope.type = "annotation";
		$scope.title = "Annotation List";
		$scope.keys = [ 'urn','label','desc','user','time' ];
		$injector.invoke( ListCtrl, this, { $scope: $scope } );
		$scope.init();
		
		// The fields you allow users to filter
		// are set with object keys in $scope.filter
		//
		// See lib/list_ctr.js: filter()
		
		$scope.filter = {
			"rdf:label": null,
			"rdf:description": null
		}
		
		// Applying the filter is the same as initializing..
		
		$scope.apply_filter = function(){
			$injector.invoke( ListCtrl, this, { $scope: $scope } );
			$scope.init();
		}
	}
]);


// annotation/:urn

appControllers.controller( 'AnnotationCtrl', ['$scope','$injector','annotation',
	function( $scope, $injector, annotation ){
		$scope.title = "Annotation";
		$scope.form = {
			'rdf:label':"",
			'rdf:description':"",
			'this:keyword':[]
		};
		$injector.invoke( EditCtrl, this, { $scope: $scope } );
		
		
		// Run once data is retrieved
		
		$scope.run = function(){
			
			// Item URN
			
			$scope.items = [];
			$scope.items[0] = { urn: $scope.json['cite:belongsTo']['@id'] };
			
			// Get the upload
			
			annotation.upload_src( $scope.urn ).then(
				function( data ){
					$scope.src = data[0].src;
				}
			);
		}
		
		$scope.init();
	}
]);


// new/annotation/:urn

appControllers.controller( 'AnnotationNew', ['$scope','$injector',
	function( $scope, $injector ){
		$scope.title = "Annotation New"
		
		$scope.src = "http://placecage.com/900/1100";
		$scope.frame_w = 900;
		$scope.frame_h = 325;
		$scope.draw_w = 900;
		$scope.draw_h = 1100;
		$scope.draw_l = -100;
		$scope.draw_t = 0;
		$scope.nav_h = 325;
		
	}
]);


// resize/:urn

appControllers.controller( 'ResizeCtrl', ['$scope','$injector',
	function( $scope, $injector ){
		$scope.title = "Resize";
		$scope.form = {
			'rdf:label':"",
			'rdf:description':"",
			'this:keyword':[]
		};
		$injector.invoke( EditCtrl, this, { $scope: $scope } );
		
		$scope.run = function() {
			$scope.uploads = [];
			$scope.uploads[0] = { urn: $scope.json['this:upload']['@id'] };
		}
		
		$scope.init();
	}
]);


// User

appControllers.controller( 'UserCtrl', ['$scope','$injector','user',
	function( $scope, $injector, user ){
		$scope.user = user.id;
		$scope.switch = function( bool ){
			user.only = bool;
			init();
		}
		function init(){
			$scope.only = user.only;
		}
		init();
	}
]);


// STDOUT

appControllers.controller( 'StdOut', ['$scope','stdout',
	function( $scope, stdout ) {
		$scope.stdout = stdout;
		$scope.$watch('stdout.msg', function(){
			$scope.msg = stdout.msg;
		});
	}
]);