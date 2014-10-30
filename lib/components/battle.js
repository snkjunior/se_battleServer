var Battle = require('./classes/Battle');

var md5 = require('MD5');

var component = {
    createNewBattle: function(battleId, users, map, units, buildings) {
        var usersInfo = {};
        for (var i = 0; i < users.length; i++) {
            var user = users[i];
            user.status = "not_auth";
            user.socket = null;
            usersInfo[user.userId] = user;
        }
        
        for (var j = 0; j < buildings.length; j++) {
            map[buildings[j].x + "," + buildings[j].y].buildingId = buildings[j].buildingId;
        }
        
        for (var k = 0; k < units.length; k++) {
            var unit = units[k];
            map[unit.x + "," + unit.y].units[unit.userId][unit.unitId] = unit.count;
        }
        
        return new Battle(battleId, usersInfo, map);
    },
    
    createTestBattle: function() {
        return this.createNewBattle(
            md5(new Date().getTime()), 
            [
                {
                    userId: 1,
                    authKey: "asdasdzxc",
                    resources: 10,
                    name: "Hunter",
                    turn: 1
                },
                {
                    userId: -1,
                    authKey: "",
                    resources: 10,
                    name: "Bot_1",
                    turn: 2
                }
            ],
            {
                "0,0": {
                    resources: 1,
                    userId: 1,
                    resourceId: 0
                },
                "0,1": {
                    resources: 1,
                    userId: 0,
                    resourceId: 0
                }
            }
        );
    }
};

module.exports = component;


