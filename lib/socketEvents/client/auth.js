module.exports.bind = function(socket, server) {
    var requestHandler = function(data) { 
        server.log("Auth request from player.");
        var mId = data.mId;
        var playerId = data.playerId;
        var authKey = data.authKey;
        
        if (server.missions[mId] == null) {
            server.sendResponse(socket, "auth", false, "Mission not found");
            return;
        }
        
        var mission = server.missions[mId];
        var mPlayerId = mission.getMissionPlayerId(playerId);
        if (mPlayerId == null) {
            server.sendResponse(socket, "auth", false, "Player not found");
        }
        
        if (mission.players[mPlayerId].authKey != authKey) {
            server.sendResponse(socket, "auth", false, "Wrong auth key");
        }
        
        socket.join("Battle_" + mid);
        mission.players[mPlayerId].socket = socket;
        
        if (mission.isAllPlayersAuth()) {
            server.log("All players auth. Init battle: " + mId);
        }
    };
    
    socket.on('auth', requestHandler);
}


