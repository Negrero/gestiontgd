'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    FileTgd = mongoose.model('FileTgd'),
    _ = require('lodash');

/**
 * Create a Subirarchivo guarda en base de datos los archivos interpretados
 */
exports.create = function(req, res) {
    console.info('Intentando grabar: ',req.body.nameFile);
    var filetgd = new FileTgd(req.body);
    filetgd.user = req.user;
    filetgd.nameFile=req.body.nameFile;
    filetgd.lista_bloque=req.body.lista_bloque;
    console.log("grabando datos");
    filetgd.save(function(err) {
        if (err) {
            return res.status(304).send();
        } else {
            res.json(filetgd);
        }
    })

};

/**
 * Show the current Subirarchivo
 */
exports.read = function(req, res) {

};

/**
 * Update a Subirarchivo
 */
exports.update = function(req, res) {

};

/**
 * Delete an Subirarchivo
 */
exports.delete = function(req, res) {

};

/**
 * List of Subirarchivos
 */
exports.list = function(req, res) {


};
var request = require('request');
var busboy = require('connect-busboy');
/**
 * Encargado de recibir los archivos en el request para enviarlos al servidor
 * server.valdepeace.com:8080 para su interpretacion y respuesta en json
 *
 * @param req
 * @param res
 * @param next
 */
exports.upload=function(req,res,next){
    req.files = {};

    req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        if (!filename) {
            // If filename is not truthy it means there's no file
            return;
        }
        // Create the initial array containing the stream's chunks
        file.fileRead = [];
        //file.fichero;

        file.on('data', function (chunk) {
            // Push chunks into the fileRead array
            this.fileRead.push(chunk);
            //this.fichero=chunk;
            //console.log('data:',chunk);
        });

        file.on('error', function (err) {
            console.log('Error while buffering the stream: ', err);
        });

        file.on('end', function () {
            // Concat the chunks into a Buffer
            var finalBuffer = Buffer.concat(this.fileRead);
            req.fichero=finalBuffer;
            req.files[fieldname] = {
                buffer: finalBuffer,
                size: finalBuffer.length,
                filename: filename,
                mimetype: mimetype
            };
        });
    });
    req.busboy.on('error', function(err) {
        console.error('Error while parsing the form: ', err);
        next(err);
    });
    req.busboy.on('finish', function() {
        //console.log('buffer:%s length: %d!' , req.fichero,req.fichero.length);
        // When everythin's done, render the view
       //var r = request.post('http://localhost:8081/ServiceCardFile/filecard', function optionalCallback(err, httpResponse, body) {
        var r = request.post('http://server.valdepeace.com:8080/ServiceCardFile/filecard', function optionalCallback(err, httpResponse, body) {

            if (err) {
                console.error('upload failed:', err);
                return res.status(httpResponse.statusCode).send(body);
            }
            if(httpResponse){
                res.status(httpResponse.statusCode).send(body);
                if(httpResponse>300){
                    console.error(body);
                }

            }
            //console.log('REQUEST RESULTS:', err, httpResponse.statusCode,body);
        });
        var form = r.form();

        form.append('file', req.files['file'].buffer, {
            filename: req.files['file'].filename,
            contentType: req.files['file'].mimetype,
            knownLength: req.files['file'].size
        });


    });
    req.pipe(req.busboy);
};
