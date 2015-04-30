var md5 = require('MD5');
var timeComponent = require("./time");

var component = {
    createAuthKeyForPlayer: function(mId, playerId) {
        return md5(timeComponent.getTime().toString() + mId + playerId);
    }
};

module.exports = component;