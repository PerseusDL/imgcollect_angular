var appDirectives = angular.module('appDirectives',[]);


// Build a filterbox in list controllers

appDirectives.directive('filterBox', function(){
	return {
		templateUrl: 'partials/share/filter-box.html'
	}
});

appDirectives.directive('userBox', function(){
	return {
		templateUrl: 'partials/share/user-box.html'
	}
});

appDirectives.directive('navBox', function(){
	return {
		templateUrl: 'partials/share/nav-box.html'
	}
});


// Builds a box for checking URN uniqueness
// You must implement a $scope.check_urn function
// in your controller.

// see controllers.js: CollectionNew

appDirectives.directive('urnCheckBox', function(){
	return {
		templateUrl: 'partials/share/urn-check-box.html'
	}
})