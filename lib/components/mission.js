var Mission = require('./classes/Mission');

var md5 = require('MD5');

var component = {
    createNewMission: function(mId, missionInfo, playersMap) {
        return new Mission(mId, missionInfo, playersMap);
    },
    
    createTestMission: function(server) {
        var mId = 1232;
        var missionInfo = {
            players: {},
            map: {},
            events: []
        };
        
        missionInfo.players[1] = {
            isPlayer: true,
            resources: 100,
            side: 1,
            goals: {
                1: {
                    type: "destroy",
                    mPlayerId: 2
                }
            }
        };
        
        missionInfo.players[2] = {
            isPlayer: false,
            resources: 100,
            side: 2,
            goals: {
                2: {
                    type: "destroy",
                    mPlayerId: 1
                }
            }
        };
        
        missionInfo.map["0;0"] = {
            resources: 10,
            resourceId: null,
            ownerId: 1,
            buildingId: 1,
            units: {
                1: {
                    1: 10,
                    2: 10
                }
            }
        };
        
        missionInfo.map["0;1"] = {
            resources: 10,
            resourceId: null,
            ownerId: 0,
            buildingId: 0,
            units: {}
        };
        
        missionInfo.map["0;2"] = {
            resources: 10,
            resourceId: null,
            ownerId: 0,
            buildingId: 0,
            units: {}
        };
        
        missionInfo.map["1;0"] = {
            resources: 10,
            resourceId: null,
            ownerId: 0,
            buildingId: 0,
            units: {}
        };
        
        missionInfo.map["1;1"] = {
            resources: 10,
            resourceId: null,
            ownerId: 0,
            buildingId: 0,
            units: {}
        };
        
        missionInfo.map["1;2"] = {
            resources: 10,
            resourceId: null,
            ownerId: 0,
            buildingId: 0,
            units: {}
        };
        
        missionInfo.map["2;0"] = {
            resources: 10,
            resourceId: null,
            ownerId: 0,
            buildingId: 0,
            units: {}
        };
        
        missionInfo.map["2;1"] = {
            resources: 10,
            resourceId: null,
            ownerId: 0,
            buildingId: 0,
            units: {}
        };
        
        missionInfo.map["2;2"] = {
            resources: 10,
            resourceId: null,
            ownerId: 2,
            buildingId: 1,
            units: {
                1: {
                    1: 10,
                    2: 10
                }
            }
        };
        
        
        var playersMap = {
            1: {
                playerId: 10,
                name: "hunter",
                authKey: "asdzx197sdik1pza",
                socket: null,
                status: "not_auth"
            },
            2: {
                playerId: -2,
                name: "NPC-2"
            }
        };
        
        server.db.insert({
            mId: mId,
            info: missionInfo,
            playersMap: playersMap,
            logs: []
        }, function(err, result) {
            if (err != null) {
                return false;
            }
            
        });
        
        var mission = this.createNewMission(mId, missionInfo, playersMap);
        server.missions[mId] = mission;
        return mission;
    },
    
    restoreMissionsFromDb: function(server) {
        var self = this;
        server.db.find({}).toArray(function(err, result) {
            if (err != null) {
                console.log(err);
                return false;
            }
            
            for (var i = 0; i < result.length; i++) {
                var mission = self.createNewMission(result[i].mId, result[i].info, result[i].playersMap);
                server.missions[result[i].mId] = mission;
            }
            
            console.log(server.missions);
        });
        
        
    }
};

module.exports = component;


