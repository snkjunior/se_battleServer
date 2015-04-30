module.exports.bind = function(socket, server) {
    var sendResponse = function(data) {
        socket.emit('newMissionInitResult', data);
    };
    
    var requestHandler = function(data) {        
        var mId = data.mId; 
        var missionInfo = data.missionInfo;
        var playersMap = data.playersMap;
        
        // TODO: validate info
        
        server.db.insert({
            mId: mId,
            info: missionInfo,
            playersMap: playersMap,
            logs: []
        }, function(err, result) {
            if (err != null) {
                return false;
            }
            
            var playersAuthInfo = [];
            for (var missionPlayerId in playersMap) {
                if (playersMap[missionPlayerId].playerId > 0) {
                    var authKey = server.components.auth.createAuthKeyForPlayer(mId, playersMap[missionPlayerId].playerId);
                    playersMap[missionPlayerId].authKey = authKey;
                    playersMap[missionPlayerId].socket = null;
                    playersMap[missionPlayerId].status = "not_auth";
                    playersAuthInfo.push({
                        playerId: playersMap[missionPlayerId].playerId,
                        authKey: authKey
                    });
                }
            }
            var mission = server.components.mission.createNewMission(mId, missionInfo, playersMap, playersAuthInfo, server.gameObjectsInfo);
            server.missions[mId] = mission;
            
            sendResponse({
                mId: mId,
                playersAuthInfo: playersAuthInfo
            });
        });
    };
    
    socket.on('newMissionInit', requestHandler);
};


