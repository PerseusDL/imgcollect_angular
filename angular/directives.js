var appDirectives = angular.module('appDirectives',[]);

appDirectives.directive('myPretty', function(){
	return {
		template: function( elem, attr ){
			return angular.toJson( elem.textContent, true );
		}
	}
});
