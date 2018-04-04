var bodyParser = require("body-parser");
var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var express = require("express");
var session = require('express-session');
var flash = require("connect-flash");
var methodOverride = require("method-override");
var mongoose = require("mongoose");
var mongoStore = require('connect-mongo')(session);
var logger = require("morgan");
var path = require("path");
var passport = require("passport");
var localStrategy = require("passport-local");

var seedDB = require("./seeds");

var User = require("./models/user");

var commentRoutes = require("./routes/comments");
var campgroundsRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
// app.use(express.urlencoded({
//   extended: false
// }));
app.use(methodOverride("_method"));
app.use(flash());

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());

app.locals.moment = require("moment");

// mongoose.connect("mongodb://localhost/yelp_camp");
var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp";
mongoose.connect(url);
// 初始化数据
// seedDB();

// passport configuration
app.use(session({
  secret: "wadsads1231535d65f",
  store: new mongoStore({
    mongooseConnection: mongoose.connection
  }),
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;