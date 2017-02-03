/**
 * Created by thisum on 1/18/2017.
 */
var express = require('express');
var tokenGenerator = require('jsonwebtoken');
var gcm = require('node-gcm');
var request = require('request');
var frRequest = require('../models/frrequest');
var Device = require('../models/device');
var Constants = require('./constants');
var router = express.Router();


router.use('/', function (req, res, next) {

    tokenGenerator.verify(req.header('auth-token'), Constants.AUTH_PRIVATE_KEY, function (err, decoded) {
        if (err) {
            return res.status(401).json({status: Constants.RESPONSE_CODE_FAIL, message: "Authentication failed"});
        }
        else if (!decoded.user) {
            return res.status(401).json({status: Constants.RESPONSE_CODE_FAIL, message: "No user found"});
        }

        req.body.user = decoded.user;
        next();
    });
});

router.get('/load', function (req, res, next) {

    frRequest.find({responded: false, requestType: Constants.REQ_TYPE_CRWD }, function (err, docs) {
        if (err) {
            return res.status(500).json({status: Constants.RESPONSE_CODE_FAIL, message: err});
        }
        else if (!docs) {
            return res.status(500).json({status: Constants.RESPONSE_CODE_FAIL, message: "No Requests Found"});
        }
        else {
            return res.status(200).json({status: Constants.RESPONSE_CODE_SUCCESS, result: docs});
        }
    });
});

router.patch('/answer', function (req, res, next) {

    var requestId = req.body.requestId;
    var response = req.body.response;
    var respondedBy = req.body.user.email;

    hasRequestNotServed(requestId, response, respondedBy, function (deviceId) {
        var ans = '';

        if (deviceId == -1) {
            ans = "Error while sending the response. Try again later";
            return res.status(500).json({status: Constants.RESPONSE_CODE_FAIL, message: ans});
        }
        else if (deviceId == 0) {
            ans = "Request has already served";
            return res.status(500).json({status: Constants.RESPONSE_CODE_WARNING, message: ans});
        }
        else {
            findDevice(deviceId, function (registrationId) {
                if (registrationId == -1) {
                    ans = "Error while searching responding device";
                    return res.status(500).json({status: Constants.RESPONSE_CODE_FAIL, message: ans});
                }
                else if (registrationId == -2) {
                    ans = "Responding device cannot be found";
                    return res.status(500).json({status: Constants.RESPONSE_CODE_FAIL, message: ans});
                }
                else {
                    sendMessage(response, registrationId, function (result) {
                        console.log(result);
                        ans = "Response sent to the device successfully";
                        return res.status(200).json({status: Constants.RESPONSE_CODE_SUCCESS, result: ans});
                    });
                }
            })
        }
    });

});

function hasRequestNotServed(requestId, response, respondedBy, callback) {

    frRequest.findOne({_id: requestId, responded: false}, function (err, frReq) {
        if (err) {
            console.error(err);
            callback(-1);
        }
        else if (frReq) {

            frReq.responded = true;
            frReq.responseTime = Date.now();
            frReq.response = response;
            frReq.respondedBy = respondedBy;

            frReq.save(function (err, updatedReq) {
                if (err) {
                    console.error(err);
                    callback(-1);
                }
                else {
                    callback(updatedReq.deviceId);
                }
            });
        }
        else {
            callback(0);
        }
    });
}

function findDevice(deviceId, callback) {

    Device.findOne({deviceId: deviceId}, function (err, device) {
        if (err) {
            console.error(err);
            callback(-1);
        }
        else if (!device) {
            console.error("no device found");
            callback(-2);
        }
        else {
            callback(device.registrationId);
        }
    });
}

function sendMessage(message, registrationId, callback) {


    request({
        url: 'https://fcm.googleapis.com/fcm/send',
        method: 'POST',
        headers: {
            'Content-Type': ' application/json',
            'Authorization': 'key=AIzaSyB2FlJF2_l5UYjkR87saEh9O70PdJZmZRU'
        },
        body: JSON.stringify({
            "to": registrationId,
            "data": {
                "description": message,
                "title": "Crowdsource Response"
            }
        })
    }, function (error, response, body) {
        if (error) {
            console.error(error, response, body);
            callback(error);
        }
        else if (response.statusCode >= 400) {
            console.error('HTTP Error: ' + response.statusCode + ' - ' + response.statusMessage + '\n' + body);
            callback(response.statusCode);
        }
        else {
            console.log('Done!')
            callback(response);
        }
    });

}

module.exports = router;