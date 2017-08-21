var express = require("express");
var router = express.Router();
var Place = require("../models/place");
var middleware = require("../middleware")


// INDEX - show all places
router.get("/", function(req, res){
    // console.log(req.user);
    // GET ALL PLACES FROM DB
    Place.find({}, function(err, allPlaces){
        if (err) {
            console.log(err);
        } else {
            res.render("places/index", {places: allPlaces});
        }
    });
});

// CREATE - add new place to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // res.send("post successfully");
    // get data from form and add data to array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newPlace = {name: name, image: image, description: description, author: author};
    // places.push(newPlace);
    // CREATE A NEW PLACE AND SAVE IT TO DB
    Place.create(newPlace, function(err, newPlace) {
        if (err) {
            console.log(err);
        } else {
            console.log("Successfully add a new place:");
            console.log(newPlace);
            res.redirect("/places");
        }
    });
});

//NEW - show form to create new place
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("places/new");
});

// SHOW - shows more info about one place
router.get("/:id", function(req, res) {
    Place.findById(req.params.id).populate("comments").exec(function(err, findPlace) {
    // Place.findById(req.params.id, function(err, findPlace) {
        if (err) {
            console.log(err);
        } else {
            // console.log(findPlace);
            res.render("places/show", {place: findPlace});
        }
    });
});

// EDIT PLACE ROUTE
router.get("/:id/edit", middleware.checkPlaceOwnership, function(req, res) {
    Place.findById(req.params.id, function(err, findPlace) {
        if (err) {
            res.redirect("/places");
        } else {
            res.render("places/edit", {place: findPlace});
        }
    });
});

// UPDATE PLACE ROUTE
router.put("/:id", middleware.checkPlaceOwnership, function(req, res) {
    Place.findByIdAndUpdate(req.params.id, req.body.place, function(err, updatedPlace) {
        if (err) {
            // console.log(err);
            res.redirect("/places");
        } else {
            res.redirect("/places/" + req.params.id);
        }
    });
});

// DESTORY PLACE ROUTE
router.delete("/:id", middleware.checkPlaceOwnership, function(req, res) {
    Place.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/places");
        } else {
            res.redirect("/places");
        }
    });
});

module.exports = router;