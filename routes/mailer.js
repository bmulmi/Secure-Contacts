var express = require("express");
var router = express.Router();
var MapboxClient = require("mapbox");
var client = new MapboxClient(
  "pk.eyJ1IjoiYm11bG1pIiwiYSI6ImNqcGhhMW13azB1aTIzcW9iZ200MjN6dGkifQ.9T6eRTfsY5qnBOPhnjyuWg"
);
var database = require("../database");

router.get("/", function (req, res) {
  res.render("mailer", {});
});

router.post("/mailer", function (req, res) {
  var post = getmessage(req.body);
  var address = post.street + ", " + post.city + ", " + post.state;

  client.geocodeForward(address, function (err, data, result) {
    if (data.features == undefined || data.features.length == 0)
      console.log("ADDRESS NOT FOUND!");
    else {
      post.longitude = data.features[0].geometry.coordinates[0];
      post.latitude = data.features[0].geometry.coordinates[1];
      database.addContact(post);
      res.render("submitted", { post: post });
    }
  });
});

/*---------------------serializes the data------------------------- */
function getmessage(msg) {
  var body = {
    firstname: msg["firstname"],
    lastname: msg["lastname"],
    prefix: msg["prefix"],
    street: msg["street"],
    city: msg["city"],
    state: msg["state"],
    zip: msg["zip"],
    phone: msg["phone"],
    email: msg["email"],
  };

  if (msg["phonechk"] == "phone" || msg["any"] == "any") {
    body["contactbyphone"] = true;
  } else {
    body["contactbyphone"] = false;
  }

  if (msg["mailchk"] == "mail" || msg["any"] == "any") {
    body["contactbymail"] = true;
  } else {
    body["contactbymail"] = false;
  }

  if (msg["emailchk"] == "email" || msg["any"] == "any") {
    body["contactbyemail"] = true;
  } else {
    body["contactbyemail"] = false;
  }

  return body;
}

module.exports = router;
