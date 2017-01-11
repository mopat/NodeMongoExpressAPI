var database = require("./Database.js");
var config = require("./Config.json");
var express = require("express");
var bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies


/*
 GET Routes
 */
app.get("/beer", function (req, res) {
    if (req.query.manufacturer != undefined) {
        database.getBeerByManufacturer(req.query.manufacturer).then(function (beer) {
            res.json(beer);
        }).catch(function (err) {
            console.log(err);
            res.sendStatus(500);
        });
    }
    if (req.query.name != undefined) {
        database.getBeerByName(req.query.name).then(function (beer) {
            res.json(beer);
        }).catch(function (err) {
            console.log(err);
            res.sendStatus(500);
        });
    }
    else {
        database.getAllBeers().then(function (beers) {
        }).catch(function (err) {
            console.log(err);
            res.sendStatus(500);
        })
    }
});


app.get("/", function (req, res) {
    res.end("Hello World");
});


app.get("/beer/:id", function (req, res) {
    res.send('beer id: ' + req.params.id);
});

/*
 POST and DELETE ROUTES
 */
app.post("/beer", function (req, res) {
    var contentType = "application/json";
    if(req.get('content-type') != contentType){
        res.end('Wrong header, only accept '+ contentType);
        return;
    }

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
