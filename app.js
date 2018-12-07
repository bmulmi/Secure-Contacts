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

var index = require('./routes/index');
var mailer = require('./routes/mailer');
var contacts = require('./routes/contacts');

app.use('/', mailer);
app.use('/mailer', mailer);
app.use('/contacts', contacts);
app.use('/index', index);

//module.exports = app;

app.listen(3000);