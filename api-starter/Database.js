var mongoose = require("mongoose");
var Kitten;

module.exports = (function() {
    var that = {},
        db = mongoose.connection,
        url,
        connected = false;

    function init(config) {
        url = "mongodb://" + config.host + ":" + config.port + "/" + config.database;

        // Model our Schema
        var kittySchema = mongoose.Schema({
            name: String,
            age: Number
        });

        Kitten = mongoose.model("Kitten", kittySchema);
    }

    function connect() {
        return new Promise(function(resolve, reject) {
            mongoose.connect(url);
            db.on("error", function(err) {
                reject();
            });

            db.on("disconnect", function() {
                connected = false;
            });

            db.once("open", function() {
                connected = true;
                resolve();
            });
        });
    }

    function getAllKitten() {
        return new Promise(function(resolve, reject) {
            Kitten.find({}, function(err, kitten) {
                if(err) {
                    reject(err);
                } else {
                    resolve(kitten);
                }
            });
        });
    }

    function isConnected() {
        return connected;
    }

    that.init = init;
    that.connect = connect;
    that.getAllKitten = getAllKitten;
    that.isConnected = isConnected;
    return that;
})();
