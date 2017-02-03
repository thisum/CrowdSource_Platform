/**
 * Created by thisum on 1/17/2017.
 */
var User = require('./../models/user');
var constants = require('../util/constants.json');
var passwordHash = require('password-hash');
var tokenGenerator = require('jsonwebtoken');
var express = require('express');
var Constants = require('./constants');
var router = express.Router();

router.post('/signup', function(req, res, next){

    var user = new User({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: passwordHash.generate(req.body.password)
    });

    user.save(function(err, result){
        if(err){
            res.status(404).json({status: Constants.RESPONSE_CODE_FAIL, message: "Error occurred while sign up"});
        }
        else{
            res.status(201).json({status: Constants.RESPONSE_CODE_SUCCESS, result: result});
        }
    });
});


router.post('/signin', function(req, res, next){

    User.findOne({email: req.body.email}, function(err, user){
        if(err){
            return res.status(404).json({status: Constants.RESPONSE_CODE_FAIL, message: "Error occurred while sign in"});
        }
        if(!user){
            return res.status(404).json({status: Constants.RESPONSE_CODE_FAIL, message: "User could not be found"});
        }
        if(!passwordHash.verify(req.body.password, user.password)){
            return res.status(404).json({status: Constants.RESPONSE_CODE_FAIL, message: "Invalid password"});
        }

        var token = tokenGenerator.sign({user: user}, Constants.AUTH_PRIVATE_KEY, {expiresIn: 7200});
        res.status(200).json({status: Constants.RESPONSE_CODE_SUCCESS, token: token, email: user.email, admin: user.admin});
    });

});

module.exports = router;