var appDirectives = angular.module('appDirectives',[]);


// Build a filterbox in list controllers

appDirectives.directive('filterBox', 
function(){
  return {
    templateUrl: 'partials/share/filter-box.html'
  }
});

appDirectives.directive('userBox', 
function(){
  return {
    templateUrl: 'partials/share/user-box.html'
  }
});

appDirectives.directive('listMetaBox', 
function(){
  return {
    templateUrl: 'partials/share/list-meta-box.html'
  }
});

appDirectives.directive('navBox', 
function(){
  return {
    templateUrl: 'partials/share/nav-box.html'
  }
});

appDirectives.directive('stdOut', 
function(){
  return {
    templateUrl: 'partials/share/msg/std-out.html'
  }
});

appDirectives.directive('jsonOut', 
function(){
  return {
    templateUrl: 'partials/share/msg/json-out.html'
  }
});

appDirectives.directive('jsonMsg',
function(){
	return {
		templateUrl: 'partials/share/msg/json-msg.html'
	}
});

appDirectives.directive('jsonMsgMini',
function(){
	return {
		templateUrl: 'partials/share/msg/json-msg-mini.html'
	}
});

appDirectives.directive('sparqlMsg',
function(){
	return {
		templateUrl: 'partials/share/msg/sparql-msg.html'
	}
});

appDirectives.directive('urnServMsg',
function(){
	return {
		templateUrl: 'partials/share/msg/urn-serv-msg.html'
	}
});

appDirectives.directive('urnInfo', 
function(){
  return {
    templateUrl: 'partials/share/urn-info.html'
  }
});

appDirectives.directive('collectionItems', 
function(){
  return {
    templateUrl: 'partials/share/collection-items.html'
  }
});

appDirectives.directive('resizeItems', 
function(){
  return {
    templateUrl: 'partials/share/resize-items.html'
  }
});

appDirectives.directive('uploadItems', 
function(){
  return {
    templateUrl: 'partials/share/upload-items.html'
  }
});

appDirectives.directive('imgUploader', 
function(){
  return {
    templateUrl: 'partials/share/img-uploader.html'
  }
});


// Builds a box for checking URN uniqueness
// You must implement a $scope.urn_uniq function
// in your controller.

// see controllers.js: CollectionNew

appDirectives.directive('urnUniqBox', 
function(){
  return {
    templateUrl: 'partials/share/urn-uniq-box.html'
  }
});

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
		  })
		   
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
