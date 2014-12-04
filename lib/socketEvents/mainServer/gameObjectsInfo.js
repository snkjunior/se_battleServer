module.exports.bind = function(socket, server) {
    var sendResponse = function(data) {
        socket.emit('gameObjectsInfo', data);
    };
    
    var requestHandler = function(data) {   
        /*
         * {
         *  units: {
         *      key: unitId,
         *      data: {
         *          name                string
         *          description         string
         *          price               int
         *          maintenance         int
         *          params              array, list of unit params
         *      }
         *  },
         *  buildings: {
         *      key: buildingId,
         *      data: {
         *          name                string
         *          description         string
         *          resourceId          int
         *          price               int
         *          maintenance         int
         *          params: []          array, list of building bonuses
         *      }
         *  },
         *  resources: {
         *      key: resourceId,
         *      data: {
         *          name                string
         *          description         string
         *      }
         *  }
         * }
         */
        server.gameObjectsInfo = data;
        server.log("Received game objects data from main server.");
    };
    
    socket.on('gameObjectsInfo', requestHandler);
};
    