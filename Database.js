var mongoose = require("mongoose");
var Beer;

module.exports = (function () {
    var that = {},
        db = mongoose.connection,
        url,
        connected = false;

    function init(config) {
        url = "mongodb://" + config.host + ":" + config.port + "/" + config.database;

        // Model our Schema
        var BeerSchema = mongoose.Schema({
            name: String,
            producer: String,
            age: Date,
            city: String,
            tags: []
        });
        //Mongoose uses plural of model as collection, so collection name is "beers"
        Beer = mongoose.model("Beer", BeerSchema);
    }

    function connect() {
        return new Promise(function (resolve, reject) {
            mongoose.connect(url);
            db.on("error", function (err) {
                reject();
            });

            db.on("disconnect", function () {
                connected = false;
            });

            db.once("open", function () {
                connected = true;
                resolve();
            });
        });
    }

    function getAllBeers() {
        return new Promise(function (resolve, reject) {
            Beer.find({}, function (err, beer) {
                if (err) {
                    reject(err);
                } else {
                    resolve(beer);
                }
            });
        });
    }

    function getBeerByName(name) {

    }

    function getBeerByManufacturer(manufacturer) {

    }

    function insertBeer(beerObj) {
        var beer = new Beer(beerObj);
        return new Promise(function (resolve, reject) {
            beer.save(function (err, beer) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(beer);
                }
            });
        });
    }

    function addTagToBeer(id, tag) {
        return new Promise(function (resolve, reject) {
            Beer.findByIdAndUpdate(id, {$push: {tags: tag}}, {safe: true, upsert: true}, function (err, beer) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(beer);
                }
            })
        });
    }

    function deleteBeer(id) {
        return new Promise(function (resolve, reject) {
            Beer.findByIdAndRemove(id, function (err, beer) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(beer);
                }
            })
        });
    }

    function isConnected() {
        return connected;
    }

    that.init = init;
    that.connect = connect;
    that.getAllBeers = getAllBeers;
    that.insertBeer = insertBeer;
    that.deleteBeer = deleteBeer;
    that.addTagToBeer = addTagToBeer;
    that.isConnected = isConnected;
    return that;
})();
