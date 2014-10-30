module.exports.bind = function(socket, server) {
    var sendResponse = function(data) {
        socket.emit('newBattleInit', data);
    };
    
    var requestHandler = function(data) {        
        var battleId = data.battleId; 
        
        /*
         * [{
         *  userId, int         optional, user id
         *  name, string        required, name of user or bot
         *  isBot, bool         required, 0 - user, 1 - npc
         *  resources, int      required, player start resources
         *  turn, int           required, player turn
         * }]
         */
        var usersInfo = data.usersInfo;
        
        /*
         * 
         * {
         *  key: "x,y",
         *  data: { 
         *      resources, int      required, resources per round to owner
         *      userId, int         required, onwer of locations
         *      resourceId, int     optional, id of resource in location
         *  }
         * }         
         */
        var mapInfo = data.mapInfo;
        
        /*
         * [{
         *  userId, int         required, user id
         *  unitId, int         required, unit id
         *  count, int          required, count of units
         *  x, int              required, x coordinate of unit
         *  y, int              required, y coordinate of unit
         * }]
        */
        var unitsInfo = data.unitsInfo;
        
        /*
         * [{
         *  buildingId, int     required, building id
         *  x, int              required, x coordinate of unit
         *  y, int              required, y coordinate of unit
         * }]
        */
        var buildingsInfo = data.buildingsInfo;
        
        // Form users info
        var users = [];
        var usersAuthInfo = [];
        for (var i = 0; i < usersInfo.length; i++) {
            var userInfo = {
                name: usersInfo[i].name,
                resources: usersInfo[i].resources,
                turn: usersInfo[i].turn
            };

            if (!usersInfo[i].isBot) {
                userInfo.userId = usersInfo[i].userId;
                userInfo.authKey = server.components.auth.createAuthKeyForUser(battleId, usersInfo[i].userId);
                
                usersAuthInfo.push({
                    userId: userInfo.userId,
                    authKey: userInfo.authKey,
                });
            }
            else {
                userInfo.userId = -i;
                userInfo.authKey = '';
            }
            users.push(userInfo);
        }
        
        server.log("New battle init request from main server. Battle id: " + battleId + ".");
        var callback_addBattleInitDataToDb = server.components.multiCallback.create(["addBattleInfo", "addUsersInfo", "addUnitsInfo", "addBuildingsInfo"], function(data, mId) {
            if (data.__isSuccess) {
                server.log("Battle created. Waiting for users.");
                
                // Create new battle
                var battle = server.components.battle.createNewBattle(battleId, users, mapInfo, unitsInfo, buildingsInfo);            
                server.battles[battleId] = battle;
                
                // Return back users auth info to battle server
                server.sendResponse(socket, "newBattleInit", true, {auth: usersAuthInfo});
            }
            else {
                server.log("Battle was not created.");
                
                // Delete all data with battle
                server.db.info.removeBattleInfo(1, function(result) {});
                
                // Return back info that battle not created
                server.sendResponse(socket, "newBattleInit", false, "");
            }
            
            server.components.multiCallback.release(mId);
        });
        
        // Add info about new battle
        server.db.info.addNewBattle(battleId, mapInfo, function(result) {
            callback_addBattleInitDataToDb.process("addBattleInfo", result == true, result);
        });
        
        // Add info about users
        server.db.users.addBattleUsers(battleId, users, function(result) {
            callback_addBattleInitDataToDb.process("addUsersInfo", result == true, result);
        });
        
        // Add info about units
        server.db.units.addBattleUnits(battleId, unitsInfo, function(result) {
            callback_addBattleInitDataToDb.process("addUnitsInfo", result == true, result);
        });
        
        // Add info about building
        server.db.buildings.addBattleBuildings(battleId, buildingsInfo, function(result) {
            callback_addBattleInitDataToDb.process("addBuildingsInfo", result == true, result);
        });
    };
    
    socket.on('newBattleInit', requestHandler);
};


