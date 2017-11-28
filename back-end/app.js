var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var cors = require('cors');
require('./routes/passport')(passport);

var routes = require('./routes/index');
var users = require('./routes/users');
var mongoSessionURL = "mongodb://localhost:27017/login";
var expressSessions = require("express-session");
var mongoStore = require("connect-mongo/es5")(expressSessions);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSessions({
  secret: "CMPE273_passport",
  resave: false,
  saveUninitialized: false,
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 6 * 1000,
  store: new mongoStore({
    url: mongoSessionURL
  })
}));
app.use(passport.initialize());

app.use('/', routes);
app.use('/users', users);

app.post('/logout', function(req,res) {
  console.log(req.session.user);
  req.session.destroy();
  console.log('Session Destroyed');
  res.status(200).send();
});

app.post('/login', function(req, res, next) {
  passport.authenticate('login1', function(err, user, info) {
    if(err) {
      return next(err);
    }

    if(!user) {
      res.status(401).send();
    }

    req.logIn(user, {session:false}, function(err) {
      if(err) {
        return next(err);
      }

      req.session.user = user.username;
      console.log(req.session.user);
      console.log("session initilized")
      return res.status(201).send();
    })
  })(req, res, next);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

module.exports = app;
