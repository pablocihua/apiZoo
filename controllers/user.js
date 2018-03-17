'use strict'

// Modules
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var path = require('path');

// Models
var User = require('../models/user');

// Service jwt
var jwt = require('../services/jwt');

// Actions
function pruebas( req, res ){
    res.status( 200 ).send({
        message: 'Test user controller test method.',
        user: req.user
    });
}

function saveUser( req, res ){
    // Create  an user object.
    var user = new User();
    // Get request params.
    var params = req.body;

    if( params.password && params.name && params.surname && params.email ){
        // Asign values to user object.
        user.name = params.name;
        user.surname = params.surname;
        user.email = params.email;
        user.role = params.role;
        user.image = null;

        User.findOne({ email: user.email.toLowerCase() }, ( err, _user ) => {
            if( err ){
                res.status( 500 ).send({ message: 'Error al comprobar el usuario'});
            } else {
                if( !_user ){
                    // Encripting password
                    bcrypt.hash( params.password, null, null, ( err, hash ) => {
                        user.password = hash;
                        // Save user in database.
                        user.save(( err, userStored ) => {
                            if( err ){
                                res.status( 500 ).send({ message: 'Error al guardar el usuario'});
                            } else {
                                if( !userStored ){
                                    res.status( 404 ).send({ message: 'No se ha registrado el usuario'});
                                } else {
                                    res.status( 200 ).send({ user: userStored, message: 'Se ha registrado el usuario'});
                                }
                            }
                        });
                    });
                } else {
                    res.status( 200 ).send({
                        message: 'El usuario no puede registrarse.'
                    });
                }
            }
        });
    } else {
        res.status( 200 ).send({
            message: 'Intruduce los datos correctamente!'
        });
    }
}

function login( req, res ){
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({ email: email.toLowerCase() }, ( err, user ) => {
        if( err ){
            res.status( 500 ).send({ message: 'Error al comprobar el usuario'});
        } else {
            if( user ){
                bcrypt.compare( password, user.password, ( err, check ) => {
                    if( check ){
                        if( params.gettoken ){
                            // user.token = params.gettoken;
                            res.status( 200 ).send({
                                token: jwt.createToken( user )
                            });
                        } else {
                            res.status( 200 ).send({ user });
                        }
                    } else {
                        res.status( 200 ).send({
                            message: 'El usuario no podido loguearse correctamente'
                        });
                    }
                });
            } else {
                res.status( 404 ).send({
                    message: 'El usuario ha podido loguearse.'
                });
            }
        }
    });
}

function updateUser( req, res ){
    var userId = req.params.id;
    var update = req.body;
    delete update.password;

    if( userId == req.user.sub ){
        User.findByIdAndUpdate( userId, update, { new: true }, ( err, userUpdated ) => {
            if( err ){
                res.status( 500 ).send({ message: 'Error al actualizar usuario'});
            } else {
                if( userUpdated ){
                    res.status( 200 ).send({ user: userUpdated });
                } else {
                    res.status( 404 ).send({ message: 'Error al actualizar usuario'});
                }
            }
        });
    } else {
        res.status( 500 ).send({ message: 'No tienes permisos'});
    }
}

function uploadImage( req, res ){
    //res.status( 200 ).send({ message: 'Upload image' })
    var userId = req.params.id;
    var file_name = 'No subido';

    if( req.files ){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_split = file_path.split('/');
        var file_name = file_split[ 2 ];

        var ext_split = file_name.split('.');
        var file_ext = ext_split[ 1 ];

        if( file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif' ){

            if( userId != req.user.sub ){
                re.status( 500 ).send({ message: 'No tienes permiso para actualizar imagen'});
            }

            User.findByIdAndUpdate( userId, { image: file_name }, { new: true }, ( err, userUpdated ) => {
                if( err ){
                    res.status( 500 ).send({ message: 'Error al actualizar usuario'});
                } else {
                    if( userUpdated ){
                        res.status( 200 ).send({ user: userUpdated });
                    } else {
                        res.status( 404 ).send({ message: 'Error al actualizar usuario'});
                    }
                }
            });
        } else {
            fs.unlink( file_path, ( err ) => {
                if( err ){
                    res.status( 200 ).send({ message: 'Extención no valida y fichero no borrado'});
                } else 
                res.status( 200 ).send({ message: 'Extención no valida'});
            });
        }
    } else {
        res.status( 200 ).send({
            message: 'No se han subido archivos'
        });
    }
}

function getImageFile( req, res ){
    // res.status( 200 ).send({message: 'get file physic'});
    var imageFile =  req.params.imageFile;
    var path_file = './uploads/users/' + imageFile;

    fs.exists( path_file, function( exists ){
        if( exists ){
            res.sendFile( path.resolve( path_file ));
        } else {
            res.status( 404 ).send({message: 'La imagen no existe'});
        }
    })
}

function getKeepers( req, res ){
    User.find({ role: 'ROLE_ADMIN'}).exec(( err, users ) => {
        if( err ){
            res.status( 500 ).send({ message: 'Error on petition'});
        } else {
            if( users ){
                res.status( 200 ).send({ users });
            } else {
                res.status( 404 ).send({ message: 'No hay cuidadores'});
            }
        }
    });
}

module.exports = {
    pruebas,
    saveUser,
    login,
    updateUser,
    uploadImage,
    getImageFile,
    getKeepers
};