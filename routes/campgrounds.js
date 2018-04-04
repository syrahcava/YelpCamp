var express = require("express");

var middleware = require("../middleware");
var Campground = require("../models/campground");

var router = express.Router();

router.get("/", function(req, res) {
  if (req.query.search) {
    var regex = new RegExp(excapeRegex(req.query.search), "gi");
    Campground.find({
      name: regex
    }, function(err, campgrounds) {
      if (err) {
        console.log(err);
      } else {
        res.render("campgrounds/index", {
          campgrounds: campgrounds,
          page: "campgrounds",
        });
      }
    });
  } else {
    Campground.find({}, function(err, campgrounds) {
      if (err) {
        console.log(err);
      } else {
        res.render("campgrounds/index", {
          campgrounds: campgrounds,
          page: "campgrounds",
        });
      }
    });
  }
});

router.post("/", middleware.isLoggedIn, function(req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var price = req.body.price;
  var description = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newCampground = {
    name: name,
    price: price,
    image: image,
    description: description,
    author: author,
  };
  Campground.create(newCampground, function(err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("campgrounds");
    }
  });
});

router.get("/new", middleware.isLoggedIn, function(req, res) {
  res.render("campgrounds/new");
});

router.get("/:id", function(req, res) {
  var id = req.params.id;
  Campground.findById(id).populate("comments").exec(function(err, result) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/show", {
        campground: result
      });
    }
  });
});

router.get("/:id/edit", middleware.checkCampgroundsOwnership, function(req, res) {
  var id = req.params.id;
  Campground.findById(id, function(err, campground) {
    res.render("campgrounds/edit", {
      campground: campground
    });
  });
});

router.put("/:id", middleware.checkCampgroundsOwnership, function(req, res) {
  var id = req.params.id;
  var campground = req.body.campground;
  Campground.findByIdAndUpdate(id, campground, function(err, updatedCampground) {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds/" + id);
    }
  });
});

router.delete("/:id", middleware.checkCampgroundsOwnership, function(req, res) {
  var id = req.params.id;
  Campground.findByIdAndRemove(id, function(err) {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});

function excapeRegex(text) {
  return text.replace(/[-[\]{}*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;