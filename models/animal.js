'use strict'

var mongoose =  require('mongoose');
var Schema = mongoose.Schema;

var AnimalSchema = Schema({
    name: String,
    description: String,
    year: Number,
    image: String,
    user_fk: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Animal', AnimalSchema );