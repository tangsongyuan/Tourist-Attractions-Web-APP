var express = require("express");
var router = express.Router({mergeParams: true}); // in case req.params.id cannot find
var Place = require("../models/place");
var Comment = require("../models/comment");

// ====================
// COMMENTS ROUTES
// ====================

// comments new
router.get("/new", isLoggedIn, function(req, res) {
    Place.findById(req.params.id, function(err, findPlace) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {place: findPlace});
        }
    });
});

// comments create
router.post("/", isLoggedIn, function(req, res) {
    Place.findById(req.params.id, function(err, findPlace) {
        if (err) {
            console.log(err);
        } else {
            // console.log(req.body.comment);
            Comment.create(req.body.comment, function(err, newComment) {
                if (err) {
                    console.log(err);
                    res.render("/places/" + req.params.id + "/comments/new"); ////
                } else {
                    findPlace.comments.push(newComment);
                    findPlace.save();
                    res.redirect("/places/" + req.params.id); ///
                }
            });
        }
    }); 
});

// middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/login");
    }
}

module.exports = router;