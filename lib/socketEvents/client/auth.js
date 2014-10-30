module.exports.bind = function(socket, server) {
    var sendResponse = function(data) {
        socket.emit('auth', data);
    };
    
    var requestHandler = function(data) { 
        var battleId = data.battleId;
        var userId = data.userId;
        var authKey = data.authKey;
        
        if (server.battles[battleId] == null) {
            server.sendResponse(socket, "auth", false, "Battle not found");
            return;
        }
        
        var battle = server.battles[battleId];
        if (battle.users[userId] == null) {
            server.sendResponse(socket, "auth", false, "User not found");
        }
        
        if (battle.users[userId].authKey != authKey) {
            server.sendResponse(socket, "auth", false, "Wrong auth key");
        }
        
        socket.join("Battle_" + battleId);
        battle.users[userId].socket = socket;
        
        if (battle.isAllUsersAuth()) {
            
        }
    };
    
    socket.on('auth', requestHandler);
}


