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
    templateUrl: 'partials/share/std-out.html'
  }
});

appDirectives.directive('jsonOut', 
function(){
  return {
    templateUrl: 'partials/share/json-out.html'
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
		
		elem.bind('load', 
		function(e){
          elem.wrap( '<div class="frame">' );
          var frame = elem.parent();
          frame.wrap( '<div class="img-bit">' );
          var height = this.naturalHeight;
          var width = this.naturalWidth;
          var param = attr.ngParam.split(',');
		     
          frame.css({
            width: parseInt( width*param[2] ),
            height: parseInt( height*param[3] )
          });
		     
          elem.css({
            width: width,
            height: height,
            top: parseInt( param[1]*height*-1 ),
            left: parseInt( param[0]*width*-1 )
          });
	  	});
		
    }
  }
});