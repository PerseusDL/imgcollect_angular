// new/annotation/:urn

appControllers.controller( 'imgspect', ['$scope','$injector','$routeParams','json','annotation',
function( $scope, $injector, $routeParams, json, annotation ){
	
	
	
	// CONFIGURATION
	
	// Current URN
	
	$scope.urn = ( $routeParams.urn == undefined ) ? null : $routeParams.urn;
	
	
	// Stores all the JSON data
	
	$scope.json = {};
	

	$scope.config = {
		lite: {
			color:'#FF00FF',
			opa:0.4
		}
	};
	
	// state
	var orig = {};
	
	$scope.zoom = 1

	$scope.frame_w = 900;
	$scope.frame_h = 325;

	$scope.canvas_w = 900;
	$scope.canvas_h = 1100;
	$scope.canvas_x = 0;
	$scope.canvas_y = 0;
	
	$scope.drag_w = 0;
	$scope.drag_h = 0;
	$scope.drag_x = 0;
	$scope.drag_y = 0;
	
	$scope.nav_h = 325;
	
	
	
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
	
	function ready(){
		$scope.src = $scope.json.upload['this:src'];
		start();
	}
	
	
	
	// USER INTERACTION
		
	// selectors
	
	var frame = $( '.imgspect.frame' );
	var canvas = $( '.imgspect .canvas' );
	var nav = $( '.imgspect.nav' );
	var drag = $( '.imgspect.nav .drag' );
	var img = $('.imgspect.nav img')
		
	// once the image loads get started
		
	function start(){
		img.load( function(){
			orig.width = this.width;
			orig.height = this.height;

			drag_start();
			
			lite_start();
		});
	}
	
	// convert relative coordinates
	
	$scope.to_canvas_x = function( n ){ return n*$scope.canvas_w }
	$scope.to_canvas_y = function( n ){ return n*$scope.canvas_h }
	
	function lite_start(){
		canvas.on('touchstart mousedown', function(e){
			console.log( 'mousedown' );
		});
		canvas.on('touchmove mousemove', function(e){
			console.log( 'mousemove' );	
		});
		canvas.on('touchend mouseup', function(e){
			console.log( 'mouseup' );
		})
	}
	
	function drag_start(){
		drag.draggable({
			containment:'parent',
			scroll:false,
			drag:function(){ dragging() },
			stop:function(){ nav_diff() }
		});
		dragging();
	}
	
	function wr(){
		var wr = $scope.frame_w / $scope.canvas_w;
		wr = ( wr > 1 ) ? 1 : wr;
		return wr;
	}
	
	function hr(){
		var hr = $scope.frame_h / $scope.canvas_h;
		hr = ( hr > 1 ) ? 1 : hr;
		return hr;
	}
	
	$scope.drag_w = function(){
		return img.width() * wr();
	}
	
	$scope.drag_h = function(){
		return img.height() * hr();
	}
	
	function drag_move( nav, drag ){
		var x = drag.left - nav.left;
		var y = drag.top - nav.top;
		var left = x * $scope.zoom;
		var top = y * $scope.zoom;
		canvas_move( left, top );
	}
	
	function canvas_move( x, y ){
		$scope.canvas_x = x*-1;
		$scope.canvas_y = y*-1;
		$scope.refresh();
	}
	
	$scope.refresh = function(){
		$scope.$digest();
	}
	
	function dragging(){
		$scope.canvas_w = orig.width * $scope.zoom;
		$scope.canvas_h = orig.height * $scope.zoom;
		drag_move( nav.position(), drag.position() );
	}
	
	function nav_diff(){}
	
}]);