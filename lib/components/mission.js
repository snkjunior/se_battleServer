var Mission = require('./classes/Mission');

var md5 = require('MD5');

var component = {
    createNewMission: function(mId, info, playersMap) {
        return new Mission(mid, info, playersMap);
    },
    
    createTestMission: function() {
        return this.createNewMission(
            md5(new Date().getTime()), 
            [
                {
                    playerId: 1,
                    authKey: "asdasdzxc",
                    resources: 10,
                    name: "Hunter",
                    turn: 1
                },
                {
                    playerId: -1,
                    authKey: "",
                    resources: 10,
                    name: "Bot_1",
                    turn: 2
                }
            ],
            {
                "0,0": {
                    resources: 1,
                    playerId: 1,
                    resourceId: 0
                },
                "0,1": {
                    resources: 1,
                    playerId: 0,
                    resourceId: 0
                }
            }
        );
    }
};

module.exports = component;


