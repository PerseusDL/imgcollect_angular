// new/annotation/:urn

appControllers.controller( 'imgspect', ['$scope','$injector','$routeParams','json','annotation',
function( $scope, $injector, $routeParams, json, annotation ){
	
	
	
	// SELECTORS
	
	var frame = $( '.imgspect.frame' );
	var canvas = $( '.imgspect.frame .canvas' );
	var nav = $( '.imgspect.nav' );
	var drag = $( '.imgspect.nav .drag' );
	var img = $('.imgspect img')
	
	
	
	// CONFIGURATION
	
	// Current URN
	
	$scope.urn = ( $routeParams.urn == undefined ) ? null : $routeParams.urn;
	
	
	// Stores all the JSON data
	
	$scope.json = {};
	
	
	// Application state

	$scope.config = {
		lite: {
			color:'#FF00FF',
			opa:0.4
		}
	};	
	var orig = {};


	// Frame Size
	
	$scope.frame_w = function(){
		return frame.width();
	};
	$scope.frame_h = 325;
	
	
	// Canvas Size and position

	$scope.canvas_w = 900;
	$scope.canvas_h = 1100;
	$scope.canvas_x = 0;
	$scope.canvas_y = 0;
	$scope.zoom = 1
	
	
	// Ratios
	
	$scope.wr = function(){
		var wr = $scope.frame_w() / $scope.canvas_w;
		wr = ( wr > 1 ) ? 1 : wr;
		return wr;
	}
	
	$scope.hr = function(){
		var hr = $scope.frame_h / $scope.canvas_h;
		hr = ( hr > 1 ) ? 1 : hr;
		return hr;
	}
	
	
	// Dragger Position
	
	$scope.drag_x = 0;
	$scope.drag_y = 0;
	$scope.drag_w = function(){
		return $scope.nav_w() * $scope.wr();
	}
	$scope.drag_h = function(){
		return $scope.nav_h * $scope.hr();
	}
	
	
	// Navigation Size
	
	$scope.nav_h = 325;
	$scope.nav_w = function(){
		return $scope.nav_scale() * orig.width
	}
	$scope.nav_scale = function(){
		return $scope.nav_h / orig.height
	}
	
	
	
	// SERVER COMMUNICATION
	
	// Get the item JSON
	
	json.urn( $scope.urn ).then( function( data ){
		var src = data.src[0];
		json.get( src ).then( function( data ){
			$scope.json.item = data;
			upload_json( data['this:upload']['@id'] );
		});
	});
	
	
	// get the upload JSON
	
	function upload_json( urn ){
		json.urn( urn ).then( function( data ){
			var src = data.src[0];
			json.get( src ).then( function( data ){
				$scope.json.upload = data;
				annotations( $scope.urn );
			});
		});
	}
	
	
	// get the annotations
	
	function annotations( urn ){
		annotation.by_item( urn ).then( function( data ){
			$scope.json.annotations = [];
			for ( var i=0; i<data.length; i++ ){
				var urn = data[i].urn
				var params = urn.split(',');
				$scope.json.annotations.push({ 
					urn: urn, 
					x: params[1],
					y: params[2],
					w: params[3],
					h: params[4]
				});
			}
		})
		ready();
	}
	
	
	// Start the party
	
	function ready(){
		$scope.src = $scope.json.upload['this:src'];
		start();
	}
	
	
	
	// USER INTERACTION
		
	// Once the image loads get started
		
	function start(){
		img.load( function(){
			orig.width = this.width;
			orig.height = this.height;
			
			// Start it up
			
			drag_start();
			lite_start();
			
			// Image you are no longer needed!
			
			img.detach();
			
			// Initial display
			
			dragging();
		});
	}
	
	// Convert relative coordinates
	
	$scope.to_canvas_x = function( n ){ return n*$scope.canvas_w }
	$scope.to_canvas_y = function( n ){ return n*$scope.canvas_h }
	
	$scope.to_nav_x = function( n ){ return n*$scope.nav_w() }
	$scope.to_nav_y = function( n ){ return n*$scope.nav_h }
	
	
	// Start the hi-liter
	
	function lite_start(){
		canvas.on('touchstart mousedown', function(e){
			lite_down( e );
			console.log( 'mousedown' );
		});
		canvas.on('touchmove mousemove', function(e){
			console.log( 'mousemove' );	
		});
		canvas.on('touchend mouseup', function(e){
			console.log( 'mouseup' );
		})
	}
	
	function lite_down( e ){
		var pos = canvas_rel( e );
		console.log( pos );
	}
	
	function canvas_rel( e ){
		var pos = canvas.offset();
		var x = (e.pageX - pos.left) + $(window).scrollLeft();
		var y = (e.pageY - pos.top) + $(window).scrollTop();
		return { 'x':x/$scope.canvas_w, 'y':y/$scope.canvas_h }
	}
	
	
	// Start the dragger
	
	function drag_start(){
		drag.draggable({
			containment:'parent',
			scroll:false,
			drag:function(){ dragging() },
			stop:function(){ nav_diff() }
		});
	}
	
	
	// Move the canvas
	
	function canvas_move(){
		var pos = drag.position();
		var x =  pos.left/$scope.nav_scale();
		var y =  pos.top/$scope.nav_scale();
		$scope.canvas_x = x*-1*$scope.zoom;
		$scope.canvas_y = y*-1*$scope.zoom;
		$scope.refresh();
	}
	
	// What happens when dragger is moved
	
	function dragging(){
		$scope.canvas_w = orig.width*$scope.zoom;
		$scope.canvas_h = orig.height*$scope.zoom;
		canvas_move();
	}
	
	function nav_diff(){}
	
	
	$scope.refresh = function(){
		$scope.$digest();
	}
	
}]);