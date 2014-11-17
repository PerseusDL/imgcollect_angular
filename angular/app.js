'use strict';

var app = angular.module('app',[
	'ngRoute',
	'appControllers',
	'appDirectives'
]);

app.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/uploads', {
			templateUrl: 'partials/upload-list.html',
			controller: 'UploadListCtrl'
		}).
		when('/upload/:urn', {
			templateUrl: 'partials/upload.html',
			controller: 'UploadCtrl'
		}).
		when('/images', {
			templateUrl: 'partials/image-list.html',
			controller: 'ImageListCtrl'
		}).
		when('/image/:urn', {
			templateUrl: 'partials/image.html',
			controller: 'ImageCtrl'
		}).
		when('/collections/:page', {
			templateUrl: 'partials/collection-list.html',
			controller: 'CollectionListCtrl'
		}).
		when('/collection/:urn', {
			templateUrl: 'partials/collection.html',
			controller: 'CollectionCtrl'
		}).
		when('/annotations', {
			templateUrl: 'partials/annotation-list.html',
			controller: 'AnnotationListCtrl'
		}).
		when('/annotation/:urn', {
			templateUrl: 'partials/annotation.html',
			controller: 'AnnotationCtrl'
		}).
		when('/home', {
			templateUrl: 'partials/home.html',
			controller: 'HomeCtrl'
		}).
		when('/home/:page', {
			templateUrl: 'partials/home.html',
			controller: 'HomeCtrl'
		}).
		otherwise({
			redirectTo: '/home'
		});
	}
]);