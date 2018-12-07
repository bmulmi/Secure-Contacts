var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var url = 'mongodb://cmps369:cmps369@ds127644.mlab.com:27644/contacts';

exports.build = function(){
    MongoClient.connect(url, function(err, db){
        if (err){
            console.error(err);
            return;
        }
        console.log("Established connection to the database");

        database = db.db("contacts");
        database.createCollection('contacts');
    })
}

exports.addContact = function(contact, callback){
    database.collection('contacts').insertOne({
        FirstName: contact['firstname'],
        LastName: contact['lastname'],
        Prefix: contact['prefix'],
        Street: contact['street'],
        City: contact['city'],
        State: contact['state'],
        Zip: contact['zip'],
        Phone: contact['phone'],
        Email: contact['email'],
        ContactbyMail: contact['contactbymail'],
        ContactbyEmail: contact['contactbyemail'],
        ContactbyPhone: contact['contactbyphone']
    }, function(err, result){
        console.log('ID returned: '+ result.insertedId);
    })
}

exports.displayContacts = function(callback){
    database.collection('contacts').find().toArray(function(err, result){
        if(err){
            callback(null, err);
        }
        else if (result.length > 0){
            var dataset = [];
            console.log(result);
            return result;

            //for(each, index of result)
             //   dataset[index] = each;
             
        }
    })
}