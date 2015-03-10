// Build a delete button

appDirectives.directive('deleteUrn', 
function(){
return {
  link: function( scope, elem, attr ){
		var urn = attr.ngParam;
		elem.wrap( '<a href="#/delete/'+urn+'"></a>' );
  }
}
});