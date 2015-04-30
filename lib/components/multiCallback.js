var md5 = require('MD5');

var MultiCallback = require("./classes/MultiCallback");

var component = {
    multiCallbacks: {},
    
    create: function(callIds, callback) {
        var mId = md5(new Date().toString());
        var multiCallback = new MultiCallback(mId, callIds, callback);
        this.multiCallbacks[mId] = multiCallback;
        return multiCallback;
    },
    
    release: function(mId) {
        delete this.multiCallbacks[mId];
    }   
};

module.exports = component;


