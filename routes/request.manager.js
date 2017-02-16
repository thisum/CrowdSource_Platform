/**
 * Created by thisum on 1/17/2017.
 */

var frRequest = require('../models/frrequest');
var device = require('../models/device');
var constants = require('../util/constants.json');
var express = require('express');
var Constants = require('./constants');
var router = express.Router();


router.post('/', rawBody, function (req, res, next) {

    var buf = req.rawBody;

    if (buf && req.bodyLength > 0) {
        try {
            var img = buf.toString('base64');
            saveRequest(req.query, img, function (result) {
                res.json(result);
            });
        }
        catch (e) {
            console.error(e);
            res.json(constants.error.msg_save_error);
        }
    }
});

function rawBody(req, res, next) {
    var chunks = [];

    req.on('data', function (chunk) {
        chunks.push(chunk);
    });

    req.on('end', function () {
        var buffer = Buffer.concat(chunks);
        req.bodyLength = buffer.length;
        req.rawBody = buffer;
        next();
    });

    req.on('error', function (err) {
        console.error(err);
        res.json(constants.error.msg_image_failure);
    });
}

function saveRequest(query, img, callback) {

    var deviceId = query.device_id;
    var app_type = getAppName(parseInt(query.app_type));
    var responded = hasResponded(app_type);
    var api = query.api;
    var response = query.response;
    var question = query.question;
    var request_time = parseInt(query.request_time);
    var response_time = parseInt(query.response_time);
    var response_status = query.response_status;
    var user = query.user;

    findDevice( deviceId, function(result){
        if(!result){
            callback(constants.error.msg_save_error);
        }
        else{

            var newRequest = new frRequest({
                deviceId: result,
                requestType: app_type,
                requestTime: request_time,
                responded: responded,
                responseTime: response_time,
                question: question,
                response: response,
                image: img,
                api: api,
                responseStatus: response_status,
                user: user
            });


            newRequest.save(function (err, res) {
                if (err) {
                    console.error(err);
                    callback(constants.error.msg_save_error);
                } else {
                    callback(constants.success.msg_save_success);
                }
            });
        }

    });
}

function findDevice(deviceId, callback){

    device.findOne({deviceId: deviceId}, function (err, device) {
        if( err ){
            console.error(err);
            callback(null);
        }
        else if( !device ){
            callback(null);
        }
        else{
            callback(device);
        }

    });

}

function getAppName( app ) {
    switch(app){
        case 1000:
            return Constants.REQ_TYPE_OCR;
        case 2000:
            return Constants.REQ_TYPE_OBJD;
        case 3000:
            return Constants.REQ_TYPE_CRWD;
        default:
            return "";
    }
}

function hasResponded(appType){
    return appType != Constants.REQ_TYPE_CRWD;
}


module.exports = router;