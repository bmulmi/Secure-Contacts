var express = require('express');
var router = express.Router();
var database = require('../database');

router.get('/', function (req, res){
    console.log("in contacts.");
    database.displayContacts(null, function(err, result){
        if (err) console.log(err)
        else if (result == null) console.log("empty database")
        else
            for(each of result){
                console.log(each.FirstName);
            }
            console.log("displaying contacts: "+ result);
            res.render('contacts', {contacts: result});
    });
});

module.exports = router;