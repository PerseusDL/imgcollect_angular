var appDirectives = angular.module('appDirectives',[]);


// Build a filterbox in list controllers

appDirectives.directive('filterbox', function(){
	return {
		templateUrl: 'partials/share/filterbox.html',
	}
});