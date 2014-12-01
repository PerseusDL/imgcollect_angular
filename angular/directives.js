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

appDirectives.directive('listMetaBox', function(){
	return {
		templateUrl: 'partials/share/list-meta-box.html'
	}
});

appDirectives.directive('navBox', function(){
	return {
		templateUrl: 'partials/share/nav-box.html'
	}
});

appDirectives.directive('stdOut', function(){
	return {
		templateUrl: 'partials/share/std-out.html'
	}
});


// Builds a box for checking URN uniqueness
// You must implement a $scope.urn_uniq function
// in your controller.

// see controllers.js: CollectionNew

appDirectives.directive('urnUniqBox', function(){
	return {
		templateUrl: 'partials/share/urn-uniq-box.html'
	}
});