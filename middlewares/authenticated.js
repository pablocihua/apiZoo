'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'key_secret_angular_4_advanced';

exports.ensureAuth =  function( req, res, next ){
    if( !req.headers.authorization ){
        res.status( 403 ).send({
            message: 'Le petición no tiene la cabecera!'
        });
    }

    var token = req.headers.authorization.replace(/['"]+/g, '');

    try {
        var payload = jwt.decode( token, secret );
        if( payload.exp <= moment.unix() ){
            res.status( 401 ).send({
                message: 'La sessión ha expirado!'
            });
        }
    } catch( ex ){
        res.status( 404 ).send({
            message: 'Sessión no valida'
        });
    }

    req.user = payload;

    next();
}