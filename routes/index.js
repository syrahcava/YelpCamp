var async = require("async");
var crypto = require("crypto");
var express = require("express");
var nodemailer = require("nodemailer");
var passport = require("passport");

var User = require("../models/user");
var Campground = require("../models/campground");

var router = express.Router();

router.get("/", function(req, res) {
  res.render("landing");
});

router.get("/register", function(req, res) {
  res.render("register", {
    page: "register"
  });
});

router.post("/register", function(req, res) {
  var newUser = new User({
    username: req.body.username,
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    avatar: req.body.avatar,
  });
  if (req.body.adminCode === "secretcode123") {
    newUser.isAdmin = true;
  }
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      req.flash("error", err.message);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function() {
      req.flash("success", "Welcome to YelpCamp " + user.username);
      res.redirect("/campgrounds");
    });
  });
});

router.get("/login", function(req, res) {
  res.render("login", {
    page: "login"
  });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/campgrounds",
  failureRedirect: "/login",
}), function(req, res) {});

router.get("/logout", function(req, res) {
  req.logout();
  req.flash("success", "Logged you out!");
  res.redirect("/campgrounds");
});

router.get("/forgot", function(req, res) {
  res.render("forgot");
});

router.post("/forgot", function(req, res, next) {

});

// User profile
router.get("/users/:id", function(req, res) {
  User.findById(req.params.id, function(err, foundUser) {
    if (err) {
      req.flash("error", err.message);
      res.redirect("/");
    }
    Campground.find().where("author.id").equals(foundUser._id).exec(function(err, campgrounds) {
      if (err) {
        req.flash("error", err.message);
        res.redirect("/");
      }
      res.render("/users/show", {
        user: foundUser,
        campgrounds: campgrounds,
      });
    });
  });
});

module.exports = router;