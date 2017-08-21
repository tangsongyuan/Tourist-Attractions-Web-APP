var express = require("express");
var router = express.Router({mergeParams: true}); // in case req.params.id cannot find
var Place = require("../models/place");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// ====================
// COMMENTS ROUTES
// ====================

// comments new
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Place.findById(req.params.id, function(err, findPlace) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {place: findPlace});
        }
    });
});

// comments create
router.post("/", middleware.isLoggedIn, function(req, res) {
    Place.findById(req.params.id, function(err, findPlace) {
        if (err) {
            console.log(err);
        } else {
            // console.log(req.body.comment);
            Comment.create(req.body.comment, function(err, newComment) {
                if (err) {
                    req.flash("error", "Something went wrong.");
                    console.log(err);
                    res.render("/places/" + req.params.id + "/comments/new"); ////
                } else {
                    // add username and id to comment
                    newComment.author.username = req.user.username;
                    newComment.author.id = req.user._id;
                    // save comment
                    newComment.save();
                    findPlace.comments.push(newComment);
                    findPlace.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect("/places/" + req.params.id); ///
                }
            });
        }
    }); 
});

// EDIT COMMENT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    // res.render("comments/edit");
    Comment.findById(req.params.comment_id, function(err, findComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {place_id: req.params.id, comment: findComment});
        }
    });
});

// UPDATE COMMENT ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, findComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/places/" + req.params.id);
        }
    });
});

// DESTORY COMMENT ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment successfully deleted");
            res.redirect("back");
        }
    });
});

module.exports = router;