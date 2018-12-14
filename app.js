var express = require('express');
var path = require('path')
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var ex_session = require('express-session');

/*--------------for authentication--------------*/
var methodOverride = require('method-override');
var bcrypt = require('bcrypt');
var flash = require('connect-flash');

/*--------------username and password--------------*/
var username = "cmps369";
var password = "finalproject";
bcrypt.genSalt(10, function(err, salt){
    bcrypt.hash(password, salt, function(err, hash){
        password = hash;
        console.log("hashed password generated: " + password);
    })
})


var index = require('./routes/index');
var mailer = require('./routes/mailer');
var contacts = require('./routes/contacts');

require('./database').build();

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride());
app.use(cookieParser());
app.use(ex_session({secret: 'secure-contacts'}));
app.use(express.static(path.join(__dirname, 'public')));

/*---------------set up passport--------------- */
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password'
    },

    function(user, pswd, done) {
        if ( user != username ) {
            console.log("Username does not exist!");
            return done(null, false);
        }

        bcrypt.compare(pswd, password, function(err, isMatch) {
            if (err) return done(err);
            
            if ( !isMatch ) console.log("You have entered the wrong Password");
            else console.log("Valid credentials!");
    
            done(null, isMatch);
        });
      }
  ));

  passport.serializeUser(function(username, done) {
      done(null, username);
  });

  passport.deserializeUser(function(username, done) {
      done(null, username);
   });


app.post('/login',
    passport.authenticate('local', { successRedirect: '/contacts',
                                     failureRedirect: '/login_fail',
                                  })
);

app.get('/login', function (req, res) {
  res.render('login', {});
});

app.get('/login_fail', function (req, res) {
  res.render('login_fail', {});
});

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/login');
});

/*---------------routes---------------*/
app.use('/', mailer);
app.use('/mailer', mailer);
app.use('/contacts', contacts);
app.use('/index', index);

app.listen(3000);