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
    image: String
});
var Place = mongoose.model("Place", placeSchema);

// Place.create({
//     name: "Time Square", image: "https://source.unsplash.com/h7rOzTmGxWE"
// }, function(err, place) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("Successfully create a new place in DB: ");
//         console.log(place);
//     }
// })

var places = [
    {name: "the Statue of Liberty", image: "https://source.unsplash.com/X3qI2GLC-gg"},
    {name: "Empire State Building", image: "https://source.unsplash.com/RokFUDqlTIo"},
    {name: "Brooklyn Bridge", image: "https://source.unsplash.com/bITjK6W2Alw"},
    {name: "Time Square", image: "https://source.unsplash.com/h7rOzTmGxWE"},
    {name: "the Statue of Liberty", image: "https://source.unsplash.com/X3qI2GLC-gg"},
    {name: "Empire State Building", image: "https://source.unsplash.com/RokFUDqlTIo"},
    {name: "Brooklyn Bridge", image: "https://source.unsplash.com/bITjK6W2Alw"},
    {name: "Time Square", image: "https://source.unsplash.com/h7rOzTmGxWE"},
    {name: "the Statue of Liberty", image: "https://source.unsplash.com/X3qI2GLC-gg"},
    {name: "Empire State Building", image: "https://source.unsplash.com/RokFUDqlTIo"},
    {name: "Brooklyn Bridge", image: "https://source.unsplash.com/bITjK6W2Alw"},
    {name: "Time Square", image: "https://source.unsplash.com/h7rOzTmGxWE"}
];
    
app.get("/", function(req, res){
    res.render("homepage");
});

app.get("/places", function(req, res){
    res.render("places", {places: places});
});

app.post("/places", function(req, res){
    // res.send("post successfully");
    // get data from form and add data to array
    var name = req.body.name;
    var image = req.body.image;
    var newPlace = {name: name, image: image};
    places.push(newPlace);
    // redirect to home page
    res.redirect("/places");
});

app.get("/places/new", function(req, res) {
    res.render("new");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Yelp Camp server get started!");
});
