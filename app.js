var express = require('express');
var path = require('path')
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var ex_session = require('express-session');

require('./database').build();

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(ex_session({secret: 'secure-contacts'}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));

var index = require('./routes/index');
var mailer = require('./routes/mailer');
var contacts = require('./routes/contacts');

app.use('/', mailer);
app.use('/mailer', mailer);
app.use('/contacts', contacts);
app.use('/index', index);
//module.exports = app;

var methodOverride = require('method-override');
var bcrypt = require('bcrypt');
var expressValidator = require('express-validator');
var flash = require('connect-flash');

var username = "cmps369";
var password = "finalproject";

bcrypt.genSalt(10, function(err, salt){
    bcrypt.hash(password, salt, function(err, hash){
        password = hash;
        console.log("hashed password generated: " + password);
    })
})

app.use(methodOverride());
//app.use(expressValidator());

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
    {
        usernameField: 'username',
        passwordField: 'password'
    },

    function(user, pswd, done){
        if (user != username){
            console.log("Username does not exist!");
            return done(null, false);
        }

        bcrypt.compare(pswd, password, function(err, isMatch){
            if (err) return done(err);
            if (!isMatch) console.log("Entered wrong password");
            else console.log("Valid Credentials!");
            done(null, isMatch);
        });
    }
));

passport.serializeUser(function(username, done){
    console.log("serilized: " + username);
    done(null, username);
});

passport.deserializeUser(function(username, done){
    console.log("deserialized: " + username);
    done(null, username);
});

app.get('/login', function (req, res){
    res.render('login', {});
});

app.post('/login',
passport.authenticate('local', { successRedirect: '/',
                                 failureRedirect: '/failedlogin',
                              })
);

app.get('/login_fail', function(req,res){
    req.logout();
    res.redirect('/login');
});

app.get('/failedlogin', function (req,res){
    res.render('login_fail');
})

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/login');
});


app.listen(3000);