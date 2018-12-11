var express = require('express');
var router = express.Router();
var database = require('../database');

router.get('/', function (req, res){
    console.log("in contacts.");
    database.displayContacts(null, function(err, result){
        if (err) console.log(err)
        else if (result == null) console.log("empty database")
        else
            for(each in result){
                console.log(result[each].Latitude);
            }
            console.log("displaying contacts: "+ result[0]._id);
            res.render('contacts', {contacts: result});
    });
});

module.exports = router;