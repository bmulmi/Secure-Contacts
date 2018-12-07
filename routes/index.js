var express = require('express');
var router = express.Router();
var database = require('../database');

var mailer = function(req, res, next){
    console.log("in Mailer!");
    res.render('mailer', { });
};

router.get('/mailer', mailer);

module.exports = router;