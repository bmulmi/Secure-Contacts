var express = require('express');
var router = express.Router();
var MapboxClient = require('mapbox');
var client = new MapboxClient('API KEY GOES HERE');
var database = require('../database');

var ensureLoggedIn = function(req, res, next) {
    if (req.user) {
        return next();
    } else {
        console.log("Not logged in!");
        console.log(req['user']);
        res.redirect('/login');
    }
}

router.get('/', ensureLoggedIn, function (req, res){
    //console.log("in contacts.");
    database.displayContacts(null, function(err, result){
        if (err) console.log(err)
        else if (result == null) console.log("empty database")
        else
            //for(each in result){
                //console.log(result[each].Latitude);
            //}
            //console.log("displaying contacts: "+ result[0]._id);
            res.render('contacts', {contacts: result});
    });
});

router.post('/read', ensureLoggedIn, function(req, res){
    database.displayContacts(null, function(err, result){
        if (err) console.log(err)
        else if (result == null) console.log("empty database")
        else {
            //console.log(result);
            for(each of result){
                //console.log(each);
            }
            res.send(result);
        }
    });
});

router.post('/create', ensureLoggedIn, function(req,res){
    var post = getUpdateData(req.body);
    //console.log("CREATING   ")
    //console.log(post);
    var address = post.street + ', ' + post.city + ', ' + post.state;

    client.geocodeForward(address, function(err, data, resp){
        if(data.features) console.log("ADDRESS NOT FOUND");
        else{
            //console.log("data returned");
            //console.log(data);
            post.longitude = data.features[0].geometry.coordinates[0];
            post.latitude = data.features[0].geometry.coordinates[1];
            //console.log(post.contactbyemail)
            database.addContact(post);
            res.end(JSON.stringify({result: 'success'}));
        }
    });
})

router.post('/delete', ensureLoggedIn, function (req, res){
    console.log(req.body.id);
    database.deleteContact( req.body.id , function (err, result){
        if (err) console.log(err);
        else res.end();
    })
})

router.post('/update', ensureLoggedIn, function(req,res){
    //var da = req.body;
    //console.log(da);
    //console.log(da['formdata[id]']);

    var post = getUpdateData(req.body);

    var address = post.street + ', ' + post.city + ', ' + post.state;
    console.log("geocoding address" + address);

    client.geocodeForward(address, function(err, data, resp){
        post.longitude = data.features[0].geometry.coordinates[0];
        post.latitude = data.features[0].geometry.coordinates[1];
        
        database.updateContact(post, function(err, result){
            if (err) console.log(err);
            else res.end(JSON.stringify({result: 'success'}));
        })
    });
});

function getUpdateData(data){
    var details = {};
    details.prefix = data['formdata[prefix]'];
    details.firstname = data['formdata[firstname]'];
    details.lastname = data['formdata[lastname]'];
    details.street = data['formdata[street]'];
    details.city = data['formdata[city]'];
    details.state = data['formdata[state]'];
    details.zip = data['formdata[zip]'];
    details.phone = data['formdata[phone]'];
    details.email = data['formdata[email]'];
    details.id = data['formdata[id]'];
    details.latitude = data['formdata[latitude]'];
    details.longitude = data['formdata[longitude]'];

    if (data['formdata[any]'] == 'any' || data['formdata[phonechk]'] == 'phone'){
        details.contactbyphone = true;
    }
    else {
        details.contactbyphone = false;

    }

    if (data['formdata[any]'] == 'any' || data['formdata[mailchk]'] == 'mail'){
        details.contactbymail = true;
    }
    else details.contactbymail = false;

    if (data['formdata[any]'] == 'any' || data['formdata[emailchk]'] == 'email'){
        details.contactbyemail = true;
    }
    else details.contactbyemail = false;

    return details;
}

router.get('/logout', function (req, res){
    res.redirect('/logout');
});

module.exports = router;
