'use strict';

const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
//passport stuff
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const passport_config = require('./routes/passport_config');
//file upload
const multer = require('multer');
//db stuff
require('dotenv').config();
const mongoose = require('mongoose');
const dbSource ='mongodb://localhost/customers' ||  process.env.MONGO_URI;
const db = mongoose.connect(dbSource);
//routes
const routes = require('./routes/index');
const users = require('./routes/users');
const videos = require('./routes/videos');

//initialize app
const app = express();

// view engine setup
app.set('view engine', 'jade');

//handle file upload
app.use(multer({dest: 'public/uploads'}).single('profileImage'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//handle sessions
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));
//passport middleware
app.use(passport.initialize());
app.use(passport.session());
//passport configuration
//serializeUser
//deserializeUser
passport_config();
// validator
app.use(expressValidator({
  errorFormatter: (param, msg, value) => {
      let namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use(require('connect-flash')());
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.get('*', (req, res, next) => {
  res.locals.user = req.user || null;
  next();
});


app.get('/', routes.dashboard);
app.get('/video/:id', routes.displayVideo);
app.get('/video/like/:id', passport_config.ensureAuthenticated, routes.likeVideo);
app.post('/video/addcomment/:id', routes.addcomment);
app.get('/users/login', users.displayLogin);
app.post('/users/login', passport.authenticate('local', {failureRedirect: '/users/login', failureFlash: 'Invalid Username or Password'}), users.loginUser);
app.get('/users/register', users.displayRegister);
app.post('/users/register', users.registerUser);
app.get('/users/logout', users.logoutUser);
app.get('/videos/upload', passport_config.ensureAuthenticated, videos.displayUpload);
app.post('/videos/upload', passport_config.ensureAuthenticated, videos.uploadVideo);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


console.log('Wooo! Here we go!....');
module.exports = app;
