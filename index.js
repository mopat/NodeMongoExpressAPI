var database = require("./Database.js");
var config = require("./Config.json");
var express = require("express");
var bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies

app.get("/beer", function (req, res) {
    // console.log(JSON.stringify(req.headers));
    var beers = database.getAllBeers().then(function (beers) {
        //res.send(req);
        //res.send('manufacturer: ' + req.query.manufacturer);
        // res.send('name: ' + req.query.name);
        res.json(beers);
    }).catch(function (err) {
        console.log(err);
        res.sendStatus(500);
    })
});

/*
 GET Routes
 */
app.get("/", function (req, res) {
    res.end("Hello World");
});


app.get("/beer/:id", function (req, res) {
    res.send('beer id: ' + req.params.id);
});


var testObj = {
    name: "Mooser Liesl",
    producer: "Arobräu",
    age: 2000,
    city: "Mooos",
    Tags: ["Moos", "Liesl", "Helles"]
};
/*
 POST and DELETE ROUTES
 */
app.post("/beer", function (req, res) {
    console.log(req.headers);
    res.set({
        "Content-Type": "application/json",
        "Accept": "JSON"
    });
    console.log(res.headers);
    database.insertBeer(req.body).then(function (beer) {
        res.json(beer);
    }).catch(function (err) {
        console.log(err);
        res.sendStatus(500);
    })
});

app.post("/beer/:id/:tag", function (req, res) {
    console.log(req.params);
    database.addTagToBeer(req.params.id, req.params.tag).then(function (beer) {
        res.json(beer);
    }).catch(function (err) {
        console.log(err);
        res.sendStatus(500);
    })
});

app.delete("/beer/:id", function (req, res) {
    database.deleteBeer(req.params.id).then(function (beer) {
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
