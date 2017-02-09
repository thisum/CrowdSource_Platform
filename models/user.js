/**
 * Created by thisum on 1/17/2017.
 */

var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var userSchema = mongoose.Schema({
    
    email: {type: String, required: true, unique: true},
    firstName: String,
    lastName: String,
    password: {type: String, required: true},
    admin: Boolean
});

userSchema.plugin(uniqueValidator);
module.exports =  mongoose.model('User', userSchema);