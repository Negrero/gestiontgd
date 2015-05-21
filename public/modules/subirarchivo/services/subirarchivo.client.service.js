'use strict';

//Filetgd service used for communicating with the fileTgd REST endpoints
angular.module('subirarchivo').
	factory('Filestgd', ['$resource',
	function($resource) {
		return $resource('file/save/', {filetgd: '@_id'}, {update: {method: 'PUT'}});
	}
]);
