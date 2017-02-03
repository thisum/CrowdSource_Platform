/**
 * Created by thisum on 09/01/2017.
 */

var mongoose = require('mongoose');

var frRequestSchema = mongoose.Schema({

    deviceId        : String,
    requestType     : String,
    requestTime     : Date,
    responded       : {type:Boolean, required: true, default: false},
    responseTime    : Date,
    question        : String,
    response        : String,
    respondedBy     : String,
    image           : String,
    api             : String
});

module.exports = mongoose.model('frrequest', frRequestSchema);