var Comment = require("../models/comment");
var Place = require("../models/place");

var middlewareObj = {};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, findComment) {
            if (err) {
                res.redirect("back");
            } else {
                // if (req.user._id.equals(findComment.author.id)) {
                if (findComment.author.id.equals(req.user._id)) {
                    next(); 
                } else {
                    // res.send("you have no access to this place");
                    res.redirect("back");
                }
            }
        });
    } else {
        // res.send("you need to login first");
        res.redirect("back");
    }
};

middlewareObj.checkPlaceOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Place.findById(req.params.id, function(err, findPlace) {
            if (err) {
                res.redirect("back");
            } else {
                if (req.user._id.equals(findPlace.author.id)) {
                // if (findPlace.author.id.equals(req.user._id)) {
                    next(); 
                } else {
                    // res.send("you have no access to this place");
                    res.redirect("back");
                }
            }
        });
    } else {
        // res.send("you need to login first");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/login");
    }
};

module.exports = middlewareObj;