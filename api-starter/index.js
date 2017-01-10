var database = require("./Database.js");
var config = require("./Config.json");
var express = require("express");

var app = express();

app.get("/kitten", function(req, res) {
    console.log("Connected; " + database.isConnected());
    var kitten = database.getAllKitten().then(function(kitten) {
        res.json(kitten);
    }).catch(function(err) {
        console.log("There was an error!");
        res.sendStatus(500);
    })
});

database.init(config);
database.connect().then(function() {
    console.log("Connection success!");
}).catch(function(err) {
    console.log("There was an error!");
    console.log(err);
});

app.listen(8000);
