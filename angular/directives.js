var appDirectives = angular.module('appDirectives',[]);


// Build a filterbox in list controllers

appDirectives.directive('filterbox', function(){
	return {
		templateUrl: 'partials/share/filterbox.html'
	}
});

appDirectives.directive('userbox', function(){
	return {
		templateUrl: 'partials/share/userbox.html'
	}
});

appDirectives.directive('navbox', function(){
	return {
		templateUrl: 'partials/share/navbox.html'
	}
});