var express = require('express');
var router = express.Router();
var geo = require('mapbox-geocoding');
var database = require('../database');

//geo.setAccessToken('pk.eyJ1IjoiYm11bG1pIiwiYSI6ImNqb2c2bm84ZzAxdmMzcXFsdzhudGI2bGwifQ.kdTqkiMEtZqC96gvz9liVQ');

var options = {
    provider: 'google',
    httpAdapter: 'https', 
    apiKey: 'AIzaSyDijxAW68wrNV0Jc6JVHGdoPgrRLFeStwg', 
    formatter: null
  };
 
var geocoder = NodeGeocoder(options);

function start (req, res){
    console.log("in Mailer.");
    res.render('mailer', { });
};

router.get('/mailer', start);
router.get('/', start);

router.post('/mailer', function(req, res){
    //console.log(req.body);
    var post = getmessage(req.body);
    var address = post.street + ', ' + post.city + ', ' + post.state + ', ' + post.zip;

    geo.geocode('mapbox.places', address, function(err, data){
        console.log(data.latlng);
    })
    
    res.render('submitted',{post:post});
    database.addContact(post);
});

function getmessage(msg){
    var body = {
        firstname: msg['firstname'],
        lastname: msg['lastname'],
        prefix: msg['prefix'],
        street: msg['street'],
        city: msg['city'],
        state: msg['state'],
        zip: msg['zip'],
        phone: msg['phone'],
        email: msg['email'],
    };
    
    if (msg['phonechk'] == "phone" || msg['any'] == 'any'){
        body['contactbyphone'] = true;
    }
    else{
        body['contactbyphone'] = false;
    }

    if (msg['mailchk'] == "mail" || msg['any'] == 'any'){
        body['contactbymail'] = true;
    }
    else{
        body['contactbymail'] = false;
    }

    if (msg['emailchk'] == "email" || msg['any'] == 'any'){
        body['contactbyemail'] = true;
    }
    else{
        body['contactbyemail'] = false;
    }

    return body;
}


module.exports = router;