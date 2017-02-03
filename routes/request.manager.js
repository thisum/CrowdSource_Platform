/**
 * Created by thisum on 1/17/2017.
 */

var frRequest = require('../models/frrequest');
var constants = require('../util/constants.json');
var express = require('express');
var Constants = require('./constants');
var router = express.Router();


router.post('/', rawBody, function (req, res, next) {

    var app = req.query.app_type;
    var question = req.query.question;
    var deviceId = req.query.device_id;
    var buf = req.rawBody;

    if (req.rawBody && req.bodyLength > 0) {
        try {
            var img = buf.toString('base64');
            saveRequest(deviceId, getAppName(parseInt(app)), question, img, function (result) {
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

function saveRequest(deviceId, reqType, question, img, callback) {

    var newRequest = new frRequest({

        deviceId: deviceId,
        requestType: reqType,
        requestTime: Date.now(),
        question: question,
        image: img
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

module.exports = router;