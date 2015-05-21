'use strict';

//Setting up route
angular.module('subirarchivo').config(['$stateProvider',
	function($stateProvider) {
		// Subirarchivo state routing
		$stateProvider.
		state('subirarchivo', {
			url: '/subirarchivo',
			templateUrl: 'modules/subirarchivo/views/subirarchivo.client.view.html'
		});
	}
]);
