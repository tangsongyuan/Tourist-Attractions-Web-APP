var mongoose = require("mongoose");
var Place = require("./models/place");
var Comment = require("./models/comment")

var data = [
    {
        name : "the Statue of Liberty",
        image : "https://source.unsplash.com/X3qI2GLC-gg", 
        description: "The Statue of Liberty is a colossal neoclassical sculpture on Liberty Island in New York Harbor in New York City, in the United States."
    },
    {
        name : "Empire State Building", 
        image : "https://source.unsplash.com/RokFUDqlTIo", 
        description: "The Empire State Building is a 102-story skyscraper located on Fifth Avenue between West 33rd and 34th Streets in Midtown, Manhattan, New York City."
    },
    {
        name : "Brooklyn Bridge", 
        image : "https://source.unsplash.com/bITjK6W2Alw", 
        description: "The Brooklyn Bridge is a hybrid cable-stayed/suspension bridge in New York City and is one of the oldest bridges in the United States."
    },
    {
        name : "Time Square", 
        image : "https://source.unsplash.com/h7rOzTmGxWE", 
        description: "Times Square is a major commercial intersection, tourist destination, entertainment center and neighborhood in the Midtown Manhattan section of New York City at the junction of Broadway and Seventh Avenue."
    },
    {
        name : "Grand Central Terminal", 
        image : "https://source.unsplash.com/_UHEB459oB0",
        description: "Grand Central Terminal is a commuter, rapid transit, and intercity railroad terminal at 42nd Street and Park Avenue in Midtown Manhattan in New York City, United States."
    }
];

var comment = [
    {
        text: "haha",
        author: "tsy"
    },
    {
        text: "hehe",
        author: "tang"
    }
]

function seedDB() {
    // remove all places
    Place.remove({}, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("All places are removed!");
            // add some places
            data.forEach(function(seed) {
                Place.create(seed, function(err, place) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("add one place");
                        // create a comment
                        Comment.create(comment[0], function(err, comment) {
                            if (err) {
                                console.log(err);
                            } else {
                                place.comments.push(comment);
                                place.save();
                                console.log("create a comment");
                            }
                        });
                        // Comment.create(comment[1], function(err, comment) {
                        //     if (err) {
                        //         console.log(err);
                        //     } else {
                        //         place.comments.push(comment);
                        //         place.save();
                        //         console.log("create a comment");
                        //     }
                        // });
                    }
                });
            });
        }
    });
    
}

module.exports = seedDB;