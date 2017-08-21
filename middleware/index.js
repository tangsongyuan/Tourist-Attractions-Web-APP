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
                    req.flash("error", "You have no access to do this.")
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Please login first.");
        res.redirect("back");
    }
};

middlewareObj.checkPlaceOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Place.findById(req.params.id, function(err, findPlace) {
            if (err) {
                req.flash("error", "Place not found.");
                res.redirect("back");
            } else {
                if (req.user._id.equals(findPlace.author.id)) {
                // if (findPlace.author.id.equals(req.user._id)) {
                    next(); 
                } else {
                    req.flash("error", "You have no access to do this.")
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Please login first.");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please login first");
    res.redirect("/login");
};

module.exports = middlewareObj;