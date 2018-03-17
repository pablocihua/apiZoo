'use strict'

var mongoose = require('mongoose');
var app = require('./app');

var port = process.env.PORT || 3789;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/zoo', ( err, res ) => {
    if( err ){
        throw err;
    } else {
        console.log('Conexion exitosa!');
        app.listen( port, () => {
            console.log("Local service is running successfully!");
        });
    }
});

/*mongoose.connect('mongodb://localhost:27017/zoo', { useMongoClient: true })
.then(() => {
    console.log('Conexion success !');
})
.catch( err => console.log( err ));*/

