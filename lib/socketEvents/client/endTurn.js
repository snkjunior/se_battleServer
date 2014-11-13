module.exports.bind = function(socket, server, mId, playerId) {
    var requestHandler = function(data) { 
        server.log("End turn message in mission `"+mId+"` from player `"+playerId+"`");
        console.log(data);
    };
    
    socket.on('endTurn', requestHandler);
};