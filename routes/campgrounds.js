var express = require("express");
var fse = require("fs-extra");
var multer = require("multer");
var path = require("path");

var middleware = require("../middleware");
var Campground = require("../models/campground");

var router = express.Router();

var storage = multer.diskStorage({
  filename: function(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
  destination: function(req, file, cb) {
    let filePath = path.resolve(__dirname, `../public/uploads`)

    fse.ensureDir(filePath, function() {
      cb(null, filePath)
    })
  }
});
var imageFilter = function(req, file, cb) {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};
var upload = multer({
  storage: storage,
  fileFilter: imageFilter
});

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

router.post("/", middleware.isLoggedIn, upload.single("image"), function(req, res) {
  if (req.file) {
    // 所有文件都保存在public目录下面
    let url = req.file.path.substring(req.file.path.indexOf('/public/') + 7)
    req.body.campground.image = url;
    req.body.campground.author = {
      id: req.user._id,
      username: req.user.username
    }

    Campground.create(req.body.campground, function(err, newlyCreated) {
      if (err) {
        req.flash("error", err.message);
        return res.redirect("back");
      } else {
        res.redirect("/campgrounds/" + newlyCreated._id);
      }
    });
  }
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