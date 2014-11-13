var Mission = require('./classes/Mission');

var md5 = require('MD5');

var component = {
    createNewMission: function(mId, missionInfo, playersMap, playersServerInfo) {
        return new Mission(mId, missionInfo, playersMap, playersServerInfo);
    },
    
    createTestMission: function(server) {
        var mId = 1;
        var missionInfo = {
            width: 12,
            height: 6,
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
        
        for (var y = 0; y < missionInfo.height; y++) {
            for (var x = 0; x < missionInfo.width; x++) {
                missionInfo.map[x + "x" + y] = {
                    resources: 10,
                    resourceId: null,
                    ownerId: 0,
                    buildingId: 0,
                    units: {}
                };
            }
        }
        
        missionInfo.map["1x4"].ownerId = 1;        
        missionInfo.map["1x4"].units = {
            1: {
                1: 10,
                2: 5
            }
        }; 
        missionInfo.map["10x1"].ownerId = 2;
        missionInfo.map["10x1"].units = {
            2: {
                1: 10,
                2: 5
            }
        }; 
        
        missionInfo.map["1x4"].buildingId = missionInfo.map["10x1"].buildingId = 1;
        
        var playersMap = {
            1: {
                playerId: 1,
                name: "hunter"
            },
            2: {
                playerId: -2,
                name: "NPC-2"
            }
        };
        
        var playersServerInfo = {
            1: {
                socket: null,
                authKey: "asdzx197sdik1pza",
                status: "not_auth"
            }
        };
        
        server.db.insert({
            mId: mId,
            info: missionInfo,
            playersMap: playersMap,
            playersServerInfo: playersServerInfo,
            logs: []
        }, function(err, result) {
            if (err != null) {
                return false;
            }
            
        });
        
        var mission = this.createNewMission(mId, missionInfo, playersMap, playersServerInfo);
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
                var mission = self.createNewMission(result[i].mId, result[i].info, result[i].playersMap, result[i].playersServerInfo);
                server.missions[result[i].mId] = mission;
            }
        });
    }
};

module.exports = component;


