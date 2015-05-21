'use strict';

//Dashboards service used to communicate Dashboards REST endpoints
angular.module('dashboards').factory('Dashboards', ['$resource',
	function($resource) {
		return $resource('dashboards/:dashboardId', { dashboardId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
angular.module('dashboards').factory('NameFile', ['$resource',
	function($resource) {
		return $resource('nameFile/:fileId', { fileId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
