'use strict';

/**
 * Module dependencies.
 * Para la gestion de los archivos interpretados de un usuario registrado
 */

var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Dashboard = mongoose.model('FileTgd'),
	_ = require('lodash');

/**
 * Nos graba en base de datos el archivo interpretado
 * @param req
 * @param res
 */
exports.create = function(req, res) {
	var dashboard = new Dashboard(req.body);
	dashboard.user = req.user;

	dashboard.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dashboard);
		}
	});
};

/**
 * Nos devuelve los datos de un archivo
 * @param req
 * @param res
 */
exports.read = function(req, res) {
	res.jsonp(req.dashboard);
};

/**
 * Update a Dashboard
 */
exports.update = function(req, res) {
	var dashboard = req.dashboard ;

	dashboard = _.extend(dashboard , req.body);

	dashboard.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dashboard);
		}
	});
};

/**
 * Borra un archivo de la base de datos
 * @param req
 * @param res
 */
exports.delete = function(req, res) {
	var dashboard = req.dashboard ;

	dashboard.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dashboard);
		}
	});
};

/**
 * Lista los archivos interpretados
 * @param req
 * @param res
 */
exports.list = function(req, res) { 
	Dashboard.find().sort('-created').populate('user', 'displayName').exec(function(err, dashboards) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dashboards);
		}
	});
};

/**
 * * Buscar un archivo en concreto
 * @param req
 * @param res
 * @param next
 * @param id
 */
exports.dashboardByID = function(req, res, next, id) {
	Dashboard.findById(id).populate('user', 'displayName').exec(function(err, dashboard) {
		if (err) return next(err);
		if (! dashboard) return next(new Error('Failed to load Dashboard ' + id));
		req.dashboard = dashboard ;
		next();
	});
};

/**
 * Dashboard authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.dashboard.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
/**
 * List of nameFile devuelve solo el listado de los nombre de ficheros guardados en base de datos
 */
exports.list_nameFile = function(req, res) {
	Dashboard.find().select('nameFile _id').where('user').equals(req.user._id).exec(function(err, dashboards) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dashboards);
		}
	});

};
/**
 * Devuelve el listado de bloque del fichero correspondiente
 * @param req
 * @param res
 * @param next
 * @param id
 */
exports.lista_bloque = function(req, res, next, id) {


	//Dashboard.findById(id).select('lista_bloque').exec(function(err, dashboard) {

	Dashboard.findById(id).exec(function(err, dashboard) {
		if (err) return next(err);
		if (! dashboard) return next(new Error('Failed to load Dashboard ' + id));


		res.jsonp(dashboard.lista_bloque);
	});

};
