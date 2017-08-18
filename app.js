var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");

var Place = require("./models/place");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");

mongoose.connect("mongodb://localhost/yelp_places", {useMongoClient: true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
seedDB();

// passport configuration
app.use(require("express-session")({
    secret: "TSY",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

app.get("/", function(req, res){
    res.render("homepage");
});

// INDEX - show all places
app.get("/places", function(req, res){
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
app.post("/places", function(req, res){
    // res.send("post successfully");
    // get data from form and add data to array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newPlace = {name: name, image: image, description: description};
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

//NEW - show form to create new campground
app.get("/places/new", function(req, res) {
    res.render("places/new");
});

// SHOW - shows more info about one campground
app.get("/places/:id", function(req, res) {
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

// ====================
// COMMENTS ROUTES
// ====================

app.get("/places/:id/comments/new", isLoggedIn, function(req, res) {
    Place.findById(req.params.id, function(err, findPlace) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {place: findPlace});
        }
    });
});

app.post("/places/:id/comments", isLoggedIn, function(req, res) {
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

//============
// AUTH ROUTE
//============

// show register form
app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            res.render("register");
        } else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/places");
            });
        }
    });
});

// show login form
app.get("/login", function(req, res) {
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/places",
    failureRedirect: "/login"
}), function(req, res) {
});

// logout route
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/places");
});

// middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/login");
    }
}


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Yelp Camp server get started!");
});
