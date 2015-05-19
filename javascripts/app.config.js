(function (module) {

	"use strict";

	module.config(function ($mdThemingProvider) {
		$mdThemingProvider.theme('default').primaryPalette('blue-grey').accentPalette('blue');
	});

}(angular.module("app")));