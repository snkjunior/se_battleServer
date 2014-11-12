module.exports.bind = function(socket, server, mId, playerId) {
    var requestHandler = function(data) { 
        server.log("Init mission `"+mId+"` result from player `"+playerId+"`");
        
        if (!data.isSuccess)
            return;
        
        server.missions[mId].playersServerInfo[playerId].status = "ready_for_battle";
        if (server.missions[mId].isAllPlayersReadyForBattle()) {
            server.log("All players loaded map. Startig battle `"+mId+"`");
            
            server.sendMessageToAllPlayersInMission(mId, "startBattle", true, {});
        }
    };
    
    socket.on('initMissionResult', requestHandler);
};