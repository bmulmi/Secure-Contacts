var express = require('express');
var router = express.Router();
var database = require('../database');

router.get('/contacts', function(req, res){
    res.render('contacts', { });
    console.log('here'+req.body);
    var contact = database.displayContacts();
    console.log(contact);
    res.end();
})

router.post('/contacts', function(a, b){
    console.log("Post here");
    b.end();
})
module.exports = router;