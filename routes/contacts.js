var express = require('express');
var router = express.Router();
var database = require('../database');

router.get('/contacts', function(req, res){
    console.log('here'+req.body);
    var contact = database.displayContacts();
    console.log(contact);
    res.end();
})

module.exports = router;