var express = require("express");

var middleware = require("../middleware");
var Campground = require("../models/campground");
var Comment = require("../models/comment");

var router = express.Router({
  mergeParams: true
});

router.get("/new", middleware.isLoggedIn, function(req, res) {
  var id = req.params.id;
  Campground.findById(id, function(err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", {
        campground: campground
      });
    }
  });
});

router.post("/", middleware.isLoggedIn, function(req, res) {
  var id = req.params.id;
  var comment = req.body.comment;
  Campground.findById(id, function(err, campground) {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(comment, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          req.flash("success", "Created a comment!");
          result.author.id = req.user._id;
          result.author.username = req.user.username;
          result.save();
          campground.comments.push(result);
          campground.save();
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
  var campground_id = req.params.id;
  var comment_id = req.params.comment_id;
  Comment.findById(comment_id, function(err, comment) {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      res.render("comments/edit", {
        campground_id: campground_id,
        comment: comment
      });
    }
  });
});

router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
  var campground_id = req.params.id;
  var comment_id = req.params.comment_id;
  Comment.findByIdAndUpdate(comment_id, req.body.comment, function(err, updatedComment) {
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + campground_id);
    }
  });
});

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
  var campground_id = req.params.id;
  var comment_id = req.params.comment_id;
  Comment.findByIdAndRemove(comment_id, function(err) {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      req.flash("success", "Comment deleted");
      res.redirect("/campgrounds/" + campground_id);
    }
  });
});

module.exports = router;