var database = require("./Database.js");
var config = require("./Config.json");
var express = require("express");

var app = express();

app.get("/beer", function(req, res) {
    var beer = database.getAllBeers().then(function(beer) {
        //res.send(req);
        //res.send('manufacturer: ' + req.query.manufacturer);
        res.send('name: ' + req.query.name);
       // res.json(beer);
    }).catch(function(err) {
        res.sendStatus(500);
    })
});

app.get("/", function(req, res){
    res.end("Hello World");
});

app.post("/", function(req, res){
    res.end("Hello World");
});

app.get('/beer/:id', function(req, res) {
    res.send('beer id: ' + req.params.id);
});


database.init(config);
database.connect().then(function() {
    console.log("Database connection success!");
}).catch(function(err) {
    console.log("There was an error!");
    console.log(err);
});

app.listen(8000, function(){
    console.log('Listening To Port 8000');
});
