/**
 * Created by thisum on 1/18/2017.
 */
var express = require('express');
var tokenGenerator = require('jsonwebtoken');
var gcm = require('node-gcm');
var request = require('request');
var frRequest = require('../models/frrequest');
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

    hasRequestNotServed(requestId, response, respondedBy, function (registrationId) {
        var ans = '';

        if (registrationId == -1) {
            ans = "Error while sending the response. Try again later";
            return res.status(500).json({status: Constants.RESPONSE_CODE_FAIL, message: ans});
        }
        else if (registrationId == 0) {
            ans = "Request has already served";
            return res.status(500).json({status: Constants.RESPONSE_CODE_WARNING, message: ans});
        }
        else {
            sendMessage(response, registrationId, requestId, function (result) {
                console.log(result);
                ans = "Response sent to the device successfully";
                return res.status(200).json({status: Constants.RESPONSE_CODE_SUCCESS, result: ans});
            });
        }
    });

});

function hasRequestNotServed(requestId, response, respondedBy, callback) {

    frRequest.findOne({_id: requestId, responded: false})
        .populate('deviceId')
        .exec(function (err, frReq) {
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
                    else if(!updatedReq){
                        callback(-1);
                    }
                    else {
                        callback(updatedReq.deviceId.registrationId);
                    }
                });
            }
            else {
                callback(0);
            }
        });
}


function sendMessage(message, registrationId, requestId, callback) {

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
            updateRequestStatus(requestId, "FAIL", error);
            callback(error);
        }
        else if (response.statusCode >= 400) {
            var error = 'HTTP Error: ' + response.statusCode + ' - ' + response.statusMessage + '\n' + body;
            console.error(error);
            updateRequestStatus(requestId, "FAIL", error);
            callback(response.statusCode);
        }
        else {
            console.log('Done!');
            updateRequestStatus(requestId, "SUCCESS", "");
            callback(response);
        }
    });
}

function updateRequestStatus(requestId, status, remarks){

    frRequest.findOne({_id: requestId}, function (err, frReq) {
        if (err) {
            console.error(err);
        }
        else if (frReq) {

            frReq.responseStatus = status;
            frReq.remarks = remarks;

            frReq.save(function (err, updatedReq) {
                if (err) {
                    console.error(err);
                }
                else {
                    console.log(status);
                }
            });
        }
    });
}


module.exports = router;