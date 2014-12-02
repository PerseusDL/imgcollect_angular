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

appDirectives.directive('jsonOut', function(){
	return {
		templateUrl: 'partials/share/json-out.html'
	}
});

appDirectives.directive('urnInfo', function(){
	return {
		templateUrl: 'partials/share/urn-info.html'
	}
});

appDirectives.directive('collectionItems', function(){
	return {
		templateUrl: 'partials/share/collection-items.html'
	}
});

appDirectives.directive('resizeItems', function(){
	return {
		templateUrl: 'partials/share/resize-items.html'
	}
});

appDirectives.directive('uploadItems', function(){
	return {
		templateUrl: 'partials/share/upload-items.html'
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