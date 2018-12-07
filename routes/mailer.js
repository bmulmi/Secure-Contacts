var express = require('express');
var router = express.Router();
var database = require('../database');

function start (req, res){
    console.log("in Mailer.");
    res.render('mailer', { });
};

router.get('/mailer', start);
router.get('/', start);

router.post('/mailer', function(req, res){
    console.log(req.body);
    var post = getmessage(req.body);
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