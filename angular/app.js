'use strict';

var app = angular.module('app',[
	'ngRoute',
	'appControllers'
]);

app.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/images', {
			templateUrl: 'partials/image-list.html',
			controller: 'ImageListCtrl'
		}).
		when('/images/:imageId', {
			templateUrl: 'partials/image.html',
			controller: 'ImageCtrl'
		}).
		when('/collections', {
			templateUrl: 'partials/collection-list.html',
			controller: 'CollectionListCtrl'
		}).
		when('/collections/:collectionId', {
			templateUrl: 'partials/collection.html',
			controller: 'CollectionCtrl'
		}).
		when('/annotations', {
			templateUrl: 'partials/annotation-list.html',
			controller: 'AnnotationListCtrl'
		}).
		when('/annotations/:annotationId', {
			templateUrl: 'partials/annotation.html',
			controller: 'AnnotationCtrl'
		}).
		when('/home', {
			templateUrl: 'partials/home.html',
			controller: 'HomeCtrl'
		}).
		otherwise({
			redirectTo: '/home'
		});
	}
]);