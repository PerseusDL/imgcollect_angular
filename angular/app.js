'use strict';

var app = angular.module('app',[
	'ngRoute',
	'appControllers',
	'appDirectives'
]);

app.config(['$routeProvider',
	function($routeProvider) {
		
		// Uploads
		$routeProvider.
		when('/uploads', {
			templateUrl: 'partials/upload-list.html',
			controller: 'UploadListCtrl'
		}).
		when('/uploads/:page', {
			templateUrl: 'partials/upload-list.html',
			controller: 'UploadListCtrl'
		}).
		when('/upload/:urn', {
			templateUrl: 'partials/upload.html',
			controller: 'UploadCtrl'
		}).
		when('/new/upload', {
			templateUrl: 'partials/upload-new.html',
			controller: 'UploadNew'
		});
		
		// Items
		$routeProvider.
		when('/items', {
			templateUrl: 'partials/item-list.html',
			controller: 'ItemListCtrl'
		}).
		when('/items/:page', {
			templateUrl: 'partials/item-list.html',
			controller: 'ItemListCtrl'
		}).
		when('/item/:urn', {
			templateUrl: 'partials/item.html',
			controller: 'ItemCtrl'
		});
		
		// Collections
		$routeProvider.
		when('/collections', {
			templateUrl: 'partials/collection-list.html',
			controller: 'CollectionListCtrl'
		}).
		when('/collections/:page', {
			templateUrl: 'partials/collection-list.html',
			controller: 'CollectionListCtrl'
		}).
		when('/collection/:urn', {
			templateUrl: 'partials/collection.html',
			controller: 'CollectionCtrl'
		});
		
		// Annotations
		$routeProvider.
		when('/annotations', {
			templateUrl: 'partials/annotation-list.html',
			controller: 'AnnotationListCtrl'
		}).
		when('/annotations/:page', {
			templateUrl: 'partials/annotation-list.html',
			controller: 'AnnotationListCtrl'
		}).
		when('/annotation/:urn', {
			templateUrl: 'partials/annotation.html',
			controller: 'AnnotationCtrl'
		});
		
		// Home
		$routeProvider.
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