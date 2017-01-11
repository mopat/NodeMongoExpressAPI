var database = require("./Database.js");
var config = require("./Config.json");
var express = require("express");
var bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies

/*
 DEFAULT URL WITH PORT 8000: localhost:8000/beer
 */

/*
 GET Routes
 */
app.get("/", function (req, res) {
    res.end("Welcome to the amazing Beer API");
});

// function goes to next when manufacturer is not defined
// get beer by Manufacturer
app.get("/beer", function (req, res, next) {
    if (req.query.manufacturer != undefined) {
        database.getBeerByManufacturer(req.query.manufacturer).then(function (beer) {
            if (beer.length == 0) {
                res.end('No beer in database for manufacturer "' + req.query.manufacturer + '"');
            }
            else {
                res.json(beer);
            }

        }).catch(function (err) {
            res.sendStatus(500);
        });
    }
    else next(); // go to next route
});

// function goes to next when name is not defined
// get beer by Name
app.get("/beer", function (req, res, next) {
    if (req.query.name != undefined) {
        database.getBeerByName(req.query.name).then(function (beer) {
            if (beer.length != 0) {
                res.end('No beer in database for name "' + req.query.name + '"');
            }
            else
                res.json(beer);
        }).catch(function (err) {
            console.log(err);
            res.sendStatus(500);
        });
    } else next();  // go to next route
});

//get all beers
app.get("/beer", function (req, res) {
    database.getAllBeers().then(function (beers) {
        if (beers.length == 0) {
            res.end('No beer in database');
        }
        else
            res.json(beers);
    }).catch(function (err) {
        console.log(err);
        res.sendStatus(500);
    });
});

/*
 POST and DELETE ROUTES
 */

// insert beer in database
app.post("/beer", function (req, res, next) {
    var contentType = "application/json";
    //CHECK HEADER
    if (req.get('content-type') != contentType) {
        res.end('Wrong header, only accept ' + contentType);
        return next();
    }
    database.insertBeer(req.body).then(function (beer) {
        if (beer.length == 0) {
            res.end('Beer name already exists');
        }
        else
            res.json(beer);
    }).catch(function (err) {
        console.log(err);
        res.sendStatus(500);
    })
});

// insert tag in database by given /id/tag
app.post("/beer/:id/:tag", function (req, res, next) {
    var contentType = "application/json";
    //CHECK HEADER
    if (req.get('content-type') != contentType) {
        res.end('Wrong header, only accept ' + contentType);
        return next();
    }
    database.addTagToBeer(req.params.id, req.params.tag).then(function (beer) {
        if (beer.length == 0) {
            res.end('Tag "' + req.params.tag + '" already exists for beer with id "' + req.params.id + '"');
        } else
            res.json(beer);
    }).catch(function (err) {
        console.log(err);
        res.sendStatus(500);
    })
});

// delete beer by id
app.delete("/beer/:id", function (req, res) {
    database.deleteBeer(req.params.id).then(function (beer) {
        if (beer == null) {
            res.end('Beer with id "' + req.params.id + '" does not exist');
        } else
            res.json(beer);
    }).catch(function (err) {
        console.log(err);
        res.sendStatus(500);
    })
});

database.init(config);
database.connect().then(function () {
    console.log("Database connection success!");
}).catch(function (err) {
    console.log("There was an error!");
    console.log(err);
});

app.listen(8000, function () {
    console.log('Listening To Port 8000');
});
