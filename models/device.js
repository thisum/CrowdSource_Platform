/**
 * Created by Thisum on 14/11/2016.
 */
var mongoose = require('mongoose');

var deviceSchema = mongoose.Schema({

    deviceName      : String,
    deviceId        : String,
    registrationId  : String,
    deviceOwner     : String
});

module.exports = mongoose.model('device', deviceSchema);