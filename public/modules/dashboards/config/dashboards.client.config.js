'use strict';

// Configuring the Articles module
angular.module('dashboards').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Dashboards', 'dashboards/list');

	}
]);
