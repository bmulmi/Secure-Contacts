var express = require('express');
var router = express.Router();
var database = require('../database');

router.get('/mailer', start);
router.get('/', start);

function start (req, res){
    console.log("in Mailer.");
    res.render('mailer', { });
};

router.post('/mailer', function(req, res){
    console.log(req.body);
    var post = getmessage(req.body);
    res.render('submitted',{post:post});
    //database.addContact()
});

function getmessage(msg){
    var namemsg = msg['gender'] + ". " + msg['firstname'] + " " + msg['lastname'];
    var addmsg = msg['street'] + ", " + msg['city'] + ", " + msg['state'] + " " + msg['zip'];
    var body = {
        name: namemsg,
        address: addmsg,
        phone: msg['phone'],
        email: msg['email']
    }

    if (msg['phonechk'] == "phone" || msg['any'] == 'any'){
        body['contactbyphone'] = msg['phone'];
    }
    else{
        body['contactbyphone'] = "no";
    }

    if (msg['mailchk'] == "mail" || msg['any'] == 'any'){
        body['contactbymail'] = "yes";
    }
    else{
        body['contactbymail'] = "no";
    }

    if (msg['emailchk'] == "email" || msg['any'] == 'any'){
        body['contactbyemail'] = msg['email'];
    }
    else{
        body['contactbyemail'] = "no";
    }

    return body;
}

module.exports = router;