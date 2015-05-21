'use strict';
var subir = require('../controllers/subirarchivo.server.controller');
module.exports = function(app) {


    app.route('/file').post(subir.upload);
    app.route('/file/save').post(subir.create);
    app.route('/file').put(subir.create);

};
