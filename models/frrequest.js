/**
 * Created by thisum on 09/01/2017.
 */

var mongoose = require('mongoose');

var frRequestSchema = mongoose.Schema({

    deviceId        : {type: mongoose.Schema.Types.ObjectId, ref: 'device'},
    requestType     : String,
    requestTime     : Number,
    responded       : {type:Boolean, required: true, default: false},
    responseTime    : Number,
    question        : String,
    response        : String,
    respondedBy     : String,
    image           : String,
    api             : String,
    responseStatus : String
});

module.exports = mongoose.model('frrequest', frRequestSchema);