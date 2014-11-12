module.exports.bind = function(socket, server) {
    var requestHandler = function(data) { 
        server.log("Auth request from player.");
        var mId = data.mId;
        var playerId = data.playerId;
        var authKey = data.authKey;
        
        if (server.missions[mId] == null) {
            server.sendMessage(socket, "auth", false, "Mission not found");
            return;
        }        
        
        var mission = server.missions[mId];
        if (mission.playersServerInfo[playerId] == null) {
            server.sendMessage(socket, "auth", false, "Player not found");
            return;
        }        
        
        var player = mission.playersServerInfo[playerId];
        if (player.authKey != authKey) {
            server.sendMessage(socket, "auth", false, "Wrong auth key");
            return;
        }
        
        socket.join("Mission_" + mId);
        player.socket = socket;
        player.status = "loading_map";
        
        server.addPlayerBattleSocketEvent(socket, mId, playerId);
        
        server.sendMessage(socket, "initMission", true, {
            mId: mission.mId,
            info: mission.info,
            playersMap: mission.playersMap
        });
        
        if (mission.isAllPlayersAuth()) {
            mission.status = "loading_map";
            server.log("All players auth. Init battle: " + mId);
        }
    };
    
    socket.on('auth', requestHandler);
};


