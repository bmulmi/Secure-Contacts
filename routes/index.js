var express = require('express');
var router = express.Router();
var database = require('../database');

function start (req, res){
    console.log("in index.");
    res.end();
};

router.get('/', start);

module.exports = router;