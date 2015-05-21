'use strict';

// Configuring the Articles module
angular.module('dashboards').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Dashboards', 'dashboards', 'dropdown', '/dashboards(/create)?');
		Menus.addSubMenuItem('topbar', 'dashboards', 'List Dashboards', 'dashboards/list');
		Menus.addSubMenuItem('topbar', 'dashboards', 'New Dashboard', 'dashboards/create');
	}
]);
