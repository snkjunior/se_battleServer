var Mission = require('./classes/Mission');

var md5 = require('MD5');

var component = {
    createNewMission: function(mId, missionInfo, playersMap, playersServerInfo) {
        return new Mission(mId, missionInfo, playersMap, playersServerInfo);
    },
    
    createTestMission: function(server) {
        var missionInfo = {
            "mId" : 1,
            "info" : {
                "width" : 12,
                "height" : 6,
                "players" : {
                    "1" : {
                        "turn" : 1,
                        "isPlayer" : true,
                        "resources" : 100,
                        "side" : 1,
                        "goals" : {
                            "1" : {
                                "type" : "destroy",
                                "mPlayerId" : 2
                            }
                        }
                    },
                    "2" : {
                        "turn" : 2,
                        "isPlayer" : true,
                        "resources" : 100,
                        "side" : 2,
                        "goals" : {
                            "2" : {
                                "type" : "destroy",
                                "mPlayerId" : 1
                            }
                        }
                    }
                },
                "map" : {
                    "0x0" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "1x0" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "2x0" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "3x0" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "4x0" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "5x0" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "6x0" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "7x0" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "8x0" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "9x0" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "10x0" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "11x0" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "0x1" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "1x1" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "2x1" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "3x1" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "4x1" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "5x1" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "6x1" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "7x1" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "8x1" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "9x1" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "10x1" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 2,
                        "buildingId" : 1,
                        "units" : {
                            "2" : {
                                "1" : 10,
                                "2" : 5
                            }
                        }
                    },
                    "11x1" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "0x2" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "1x2" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "2x2" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "3x2" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "4x2" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "5x2" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "6x2" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "7x2" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "8x2" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "9x2" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "10x2" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "11x2" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "0x3" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "1x3" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "2x3" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "3x3" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "4x3" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "5x3" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "6x3" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "7x3" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "8x3" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "9x3" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "10x3" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "11x3" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "0x4" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "1x4" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 1,
                        "buildingId" : 1,
                        "units" : {
                            "1" : {
                                "1" : 10,
                                "2" : 4
                            }
                        }
                    },
                    "2x4" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "3x4" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "4x4" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "5x4" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "6x4" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "7x4" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "8x4" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "9x4" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "10x4" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "11x4" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "0x5" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "1x5" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "2x5" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "3x5" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "4x5" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "5x5" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "6x5" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "7x5" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "8x5" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "9x5" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "10x5" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    },
                    "11x5" : {
                        "resources" : 10,
                        "resourceId" : null,
                        "ownerId" : 0,
                        "buildingId" : 0,
                        "units" : {}
                    }
                },
                "events" : []
            },
            "playersMap" : {
                "1" : {
                    "playerId" : 1,
                    "name" : "User 1"
                },
                "2" : {
                    "playerId" : 2,
                    "name" : "User 2"
                }
            }
        };
        
        server.db.insert({
            mId: missionInfo.mId,
            info: missionInfo.info,
            playersMap: missionInfo.playersMap,
            playersServerInfo: missionInfo.playersServerInfo,
            logs: []
        }, function(err, result) {
            if (err != null) {
                return false;
            }
            
        });
        
//        var mission = this.createNewMission(mId, missionInfo, playersMap, playersServerInfo);
//        server.missions[mId] = mission;
        //return mission;
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


