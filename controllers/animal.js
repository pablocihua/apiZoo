'use strict'

// Modules
var fs = require('fs');
var path = require('path');

// Modules
var User = require('../models/user');
var Animal = require('../models/animal');

// Actions
function pruebas( req, res ){
    res.status( 200 ).send({
        message: 'Testing animals controller and test action.',
        user: req.user
    });
}

function saveAnimal( req, res ){
    var animal = new Animal();

    var params = req.body;

    if( params.name ){
        animal.name = params.name;
        animal.description = params.description;
        animal.year = params.year;
        animal.image = null;
        animal.user_fk = req.user.sub;

        animal.save(( err, animalStored ) => {
            if( err ){
                res.status( 500 ).send({
                    message: 'Erro in server'
                });
            } else {
                if( animalStored ){
                    res.status( 200 ).send({ animal: animalStored });
                } else {
                    res.status( 404 ).send({
                        message: 'No se guardo el registro de animal'
                    });
                }
            }
        });
    } else {
        res.status( 200 ).send({
            message: 'El nombde del animal es obligatorio'
        });
    }
}

function getAnimals( req, res ){
    Animal.find({}).populate({ path: 'user_fk'}).exec(( err, animals ) => {
        if( err ){
            res.status( 500 ).send({
                message: 'Error en la perición'
            });
        } else {
            if( animals ){
                res.status( 200 ).send({
                    animals
                });
            } else {
                res.status( 404 ).send({
                    message: 'No hay animales'
                }); 
            }
        }
    });
}

function getAnimal( req, res ){
    var animalId = req.params.id;

    Animal.findById( animalId ).populate({ path: 'user_fk'}).exec(( err, animal ) => {
        if( err ){
            res.status( 500 ).send({
                message: 'Error en la petición'
            });
        } else {
            if( animal ){
                res.status( 200 ).send({
                    animal
                });
            } else {
                res.status( 404 ).send({
                    message: 'El animal no existe'
                }); 
            }
        }
    });
}

function updateAnimal( req, res ){
    var animalId = req. params.id;
    var update = req.body;

    Animal.findByIdAndUpdate( animalId, update, { new: true }, ( err, animalUpdated ) => {
        if( err ){
            res.status( 500 ).send({
                message: 'Error en la petición'
            });
        } else {
            if( animalUpdated ){
                res.status( 200 ).send({
                    animal: animalUpdated
                });
            } else {
                res.status( 404 ).send({
                    message: 'No se ha actulaizado el animal'
                }); 
            }
        }
    });
}

function uploadImage( req, res ){
    var animalId = req.params.id;
    var file_name = 'No subido';

    if( req.files ){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_split = file_path.split('/');
        var file_name = file_split[ 2 ];

        var ext_split = file_name.split('.');
        var file_ext = ext_split[ 1 ];

        if( file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif' ){
            Animal.findByIdAndUpdate( animalId, { image: file_name }, { new: true }, ( err, animalUpdated ) => {
                if( err ){
                    res.status( 500 ).send({ message: 'Error al actualizar animal'});
                } else {
                    if( animalUpdated ){
                        res.status( 200 ).send({ animal: animalUpdated, image: file_name });
                    } else {
                        res.status( 404 ).send({ message: 'Error al actualizar animal'});
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
    var imageFile =  req.params.imageFile;
    var path_file = './uploads/animals/' + imageFile;

    fs.exists( path_file, function( exists ){
        if( exists ){
            res.sendFile( path.resolve( path_file ));
        } else {
            res.status( 404 ).send({message: 'La imagen no existe'});
        }
    })
}

function deleteAnimal( req, res ){
    var animalId = req.params.id;

    Animal.findByIdAndRemove( animalId, ( err, animalRemoved ) => {
        if( err ){
            res.status( 500 ).send({ message: 'Error en la periticón'});
        } else {
            if( animalRemoved ){
                res.status( 200 ).send({ animal: animalRemoved });
            } else {
                res.status( 404 ).send({ message: 'NO se ha borrado el animal'});
            }
        }
    });
}

module.exports = {
    pruebas,
    saveAnimal,
    getAnimals,
    getAnimal,
    updateAnimal,
    uploadImage,
    getImageFile,
    deleteAnimal
};