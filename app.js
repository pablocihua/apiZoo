'use strict'

var express = require('express');
var bodyParser =  require('body-parser');

var app = express();

// Load routes.
var user_routes = require('./routes/user');
var animal_routes = require('./routes/animal');

// Middlewares of body-parser
app.use( bodyParser.urlencoded({ extended: false }))
app.use( bodyParser.json() );

// Config head and cors
app.use(( req, res, next ) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Accept-Control-Allow-Request-Method');
    res.header('Access-control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// Routes body-parser

app.use('/api', user_routes );
app.use('/api', animal_routes );

/*app.post('/test', ( req, res ) => {
    res.status( 200 ).send({ message: 'Method testing'})
});*/

module.exports = app;