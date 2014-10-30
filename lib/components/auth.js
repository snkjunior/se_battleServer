var md5 = require('MD5');
var timeComponent = require("./time");

var component = {
    createAuthKeyForUser: function(battleId, userId) {
        return md5(timeComponent.getTime().toString() + battleId + userId);
    }
};

module.exports = component;