var databaseModule = {
    db: null,
    
    init: function(callback) {
        var self = this;
        var mongoClient = require('mongodb').MongoClient;
        mongoClient.connect("mongodb://localhost:27017/world_explorers", function(err, db) {
            self.db = db;
            callback(db);
        });
    }
};

module.exports = databaseModule;




