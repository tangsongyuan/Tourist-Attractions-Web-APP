var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_places", {useMongoClient: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// schema setup
var placeSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});
var Place = mongoose.model("Place", placeSchema);

// Place.create({
//     name : "Grand Central Terminal", 
//     image : "https://source.unsplash.com/_UHEB459oB0",
//     description: "Grand Central Terminal is a commuter, rapid transit, and intercity railroad terminal at 42nd Street and Park Avenue in Midtown Manhattan in New York City, United States."
// }, function(err, place) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("Successfully create a new place in DB: ");
//         console.log(place);
//     }
// });
    
app.get("/", function(req, res){
    res.render("homepage");
});

app.get("/places", function(req, res){
    // GET ALL PLACES FROM DB
    Place.find({}, function(err, allPlaces){
        if (err) {
            console.log(err);
        } else {
            res.render("index", {places: allPlaces});
        }
    });
});

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

app.get("/places/new", function(req, res) {
    res.render("new");
});

app.get("/places/:id", function(req, res) {
    Place.findById(req.params.id, function(err, findPlace) {
        if (err) {
            console.log(err);
        } else {
            res.render("show", {place: findPlace});
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Yelp Camp server get started!");
});
