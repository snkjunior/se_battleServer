module.exports.bind = function(socket, server, mId, playerId) {
    var requestHandler = function(data) { 
        server.log("End turn message in mission `"+mId+"` from player `"+playerId+"`");

        var mission = server.missions[mId];
        
        // TODO: Validate player actions data
        
        
        mission.savePlayerAction(playerId, data);
        
        mission.processTurnActions();
    };
    
    socket.on('endTurn', requestHandler);
};