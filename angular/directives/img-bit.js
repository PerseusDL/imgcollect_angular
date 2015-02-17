// img-bit functionality.
// see .img-bit in app.scss

appDirectives.directive('imgBit', 
function(){
  return {
    link: function( scope, elem, attr ){
		
			elem.bind('load', function(e){
		  
				// Build the necessary dom elements
				
				elem.wrap( '<div class="frame">' );
				var frame = elem.parent();
				
				frame.wrap( '<div class="img-bit">' );
		  	var wrap = elem.parent();
		  	
				var height = this.naturalHeight;
				var width = this.naturalWidth;
				var param = attr.ngParam.split(',');
		  	
		  	// CSS makes the magic happen
		  	
		  	wrap.css({
		  	  display: "inline-block"
		  	});
		  	 
				frame.css({
					width: parseInt( width*param[2] ),
					height: parseInt( height*param[3] ),
					position: "relative",
					overflow: "hidden"
				});
		  	   
				elem.css({
					position: "absolute",
					display: "block",
					"vertical-align": "baseline",
					"max-width": "none",
					"max-height": "none",
				  width: width,
				  height: height,
				  top: parseInt( param[1]*height*-1 ),
				  left: parseInt( param[0]*width*-1 ),
				});
	  	});
			
    }
  }
});