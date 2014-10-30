module.exports.bind = function(socket, server) {
    var sendResponse = function(data) {
        socket.emit('auth', data);
    };
    
    var requestHandler = function(data) { 
        var battleId = data.battleId;
        var playerId = data.playerId;
        var authKey = data.authKey;
        
        if (server.battles[battleId] == null) {
            server.sendResponse(socket, "auth", false, "Battle not found");
            return;
        }
        
        var battle = server.battles[battleId];
        if (battle.players[playerId] == null) {
            server.sendResponse(socket, "auth", false, "player not found");
        }
        
        if (battle.players[playerId].authKey != authKey) {
            server.sendResponse(socket, "auth", false, "Wrong auth key");
        }
        
        socket.join("Battle_" + battleId);
        battle.players[playerId].socket = socket;
        
        if (battle.isAllplayersAuth()) {
            
        }
    };
    
    socket.on('auth', requestHandler);
}


