// img-loc

appDirectives.directive('imgLoc',
function(){
  return {
	  link: function( scope, elem, attr ){
		  
		elem.bind('load', function(e){
			
			// Get the params you need
			
			var param = attr.ngParam.split(',');
			var height = this.naturalHeight;
			var width = this.naturalWidth;
			
			// Workout max width
			
			var max_width = param[4];
			var diff = max_width / width;
			if ( diff < 1 ){
				width = max_width
				height = height*diff
			}
			
			elem.wrap( '<div class="img-loc">' );
			var wrap = elem.parent();
			
			// CSS makes the magic happen
			// see .img-loc in app.scss to customize
		   
			wrap.css({
				width: parseInt( width ),
				height: parseInt( height ),
			  position: "relative",
			  overflow: "hidden"
			});
			
			elem.css({
				width: parseInt( width ),
			  height: parseInt( height )
			})
			
			wrap.append( '<div class="lite">' );
			var lite = elem.next();
			lite.css({
				position: "absolute",
				left: parseInt( width * param[0] ),
				top: parseInt( height * param[1] ),
				width: parseInt( width * param[2] ),
				height: parseInt( height * param[3] )
			});
			wrap.after( '<div class="clearfix"></div>' );
		});
		
	  }
  }
	
});