/**
 * Created by thisum on 1/17/2017.
 */

var Device = require('../models/device');
var constants = require('../util/constants.json');
var express = require('express');
var router = express.Router();

router.post('/', function (req, res, next) {

    var deviceName = req.body.deviceName;
    var deviceId = req.body.deviceId;
    var registrationId = req.body.registrationId;

    if (typeof deviceName == 'undefined' || typeof deviceId == 'undefined' || typeof registrationId == 'undefined') {
        console.error(constants.error.msg_invalid_param.message);
        res.json(constants.error.msg_invalid_param);
    }
    else if (!deviceName.trim() || !deviceId.trim() || !registrationId.trim()) {
        console.error(constants.error.msg_empty_param.message);
        res.json(constants.error.msg_empty_param);
    }
    else {
        registerDevice(deviceName, deviceId, registrationId, function(result) {
            res.json(result);
        })
    }
});

function registerDevice(deviceName, deviceId, registrationId, callback) {

    var newDevice = new Device({
        deviceName: deviceName,
        deviceId: deviceId,
        registrationId: registrationId
    });

    Device.findOne({deviceId: deviceId}, function (err, device) {

        if( err ){
            console.error(err);
            callback(constants.error.msg_reg_failure);
        }
        if (!device) {
            newDevice.save(function (err) {
                if (err) {
                    console.error(err);
                    callback(constants.error.msg_reg_failure);
                } else {
                    callback(constants.success.msg_reg_success);
                }
            });
        }
        else {
            device.registrationId = registrationId;
            device.markModified('registrationId');
            
            device.save(function (err) {
                if (err) {
                    console.error(err);
                    callback(constants.error.msg_reg_failure);
                } else {
                    callback(constants.success.msg_reg_success);
                }
            });
        }
    });
}

module.exports = router;