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
