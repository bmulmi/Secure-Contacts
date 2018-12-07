var express = require('express');
var router = express.Router();
var database = require('../database');

var mailer = function(req, res){
    console.log("in Mailer!");
    res.render('mailer', { });
};

router.get('/mailer', mailer);