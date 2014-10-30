var databaseModule = {
    init: function(callback) {
        var mongoClient = require('mongodb').MongoClient;
        mongoClient.connect("mongodb://localhost:27017/battles", function(err, db) {
            callback(db);
        });
    }
};

module.exports = databaseModule;




