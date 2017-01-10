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
            Tags: []
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

    function isConnected() {
        return connected;
    }

    that.init = init;
    that.connect = connect;
    that.getAllBeers = getAllBeers;
    that.isConnected = isConnected;
    return that;
})();
