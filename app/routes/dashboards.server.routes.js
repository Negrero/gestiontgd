'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var dashboards = require('../../app/controllers/dashboards.server.controller');

	// Dashboards Routes
	app.route('/dashboards')
		.get(dashboards.list)
		.post(users.requiresLogin, dashboards.create);

	app.route('/dashboards/:dashboardId')
		.get(dashboards.read)
		.put(users.requiresLogin, dashboards.hasAuthorization, dashboards.update)
		.delete(users.requiresLogin, dashboards.hasAuthorization, dashboards.delete);

	app.route('/nameFile')
		.get(dashboards.list_nameFile);
	app.route('/nameFile/:fileId').
		get(dashboards.lista_bloque);
	// Finish by binding the Dashboard middleware
	app.param('dashboardId', dashboards.dashboardByID);
	app.param('fileId',dashboards.lista_bloque);
};
