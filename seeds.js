var mongoose = require("mongoose");

var Campground = require("./models/campground");

var data = [{
    name: "Salmon Creek",
    image: "https://invinciblengo.org/photos/event/slider/manali-girls-special-adventure-camp-himachal-pradesh-1xJtgtx-1440x810.jpg",
    description: "",
  },
  {
    name: "Granite Hill",
    image: "https://www.salemaecocamp.com/images/slideshow/salema-camp/salema-camp-2.jpg",
    description: "",
  },
  {
    name: "Mountain Goat's Rest",
    image: "https://adventures365.in/media/catalog/product/cache/1/thumbnail/9df78eab33525d08d6e5fb8d27136e95/c/a/camp-oak-view-bir-billing-4.jpg",
    description: "",
  },
  {
    name: "HolidayIQ",
    image: "https://c1.hiqcdn.com/customcdn/500x500/blog/sites/default/files/camping-te.jpg",
    description: "",
  },
  {
    name: "Sápmi Nature Camp",
    image: "http://www.sapminature.com/wp-content/uploads/2017/06/SapmiNatureCamp_auroraslider.jpg",
    description: "",
  },
  {
    name: "Invincible NGO",
    image: "https://invinciblengo.org/photos/event/slider/manali-girls-special-adventure-camp-himachal-pradesh-1xJtgtx-1440x810.jpg",
    description: "Manali Girl's Special Adventure Camp"
  }
];

function seedDB() {
  Campground.remove({}, function(err) {
    if (err) {
      console.log(err);
    }
    console.log("removed campgrounds!");

    data.forEach(function(seed) {
      Campground.create(seed, function(err, data) {
        if (err) {
          console.log(err);
        } else {
          console.log("added a campground");
        }
      });
    });
  });
}

module.exports = seedDB;