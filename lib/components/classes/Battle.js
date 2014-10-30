var timeComponent = require("./time");

module.exports = function(battleId, users, map, units) {
    this.info = {
        battleId: battleId,                                
        status: 'users_auth'
    };
    this.users = usersInfo; // key: userId, data: {userId, name, authKey, turn, resources, isDefeated, socket}
    this.turns = []; // userIds
    this.currentTurn = {
        num: -1,
        turnStartTime: null,
        actions: {
            build: [], // {x, y, buildingId}
            hire: [], // {x, y, unitId, count}
            move: [] // {x, y, units: [{unitId, count}], dx, dy}
        }
    };
    this.map = map; // key: "x,y", data: {userId, resources, resourceId, buildingId, units: {userId: {unitId, count}}}
    
    this.isAllUsersAuth = function() {
        for (var userId in this.users) {
            if (this.users.userId > 0 && this.users.socket == null)
                return false;
        }
    };
    
    this.redrawTurns = function() {
        var turns = [];
        for (var userId in this.users) {
            if (!this.users[userId].isDefeated) {
                turns[this.users[userId].turn] = userId;
            }
        }
        
        for (var i = 0; i < turns.length; i++) {
            if (i in turns) {
                this.turns.push(turns[i]);
            }
        }
    };
    
    this.nextTurn = function() {
        if (this.turns.length == this.currentTurn.num) {
            this.currentTurn.num = 0;
        }
        else {
            this.currentTurn.num++;
        }
        this.turnStartTime = timeComponent.getTime();
        this.actions = {
            build: [],
            hire: [],
            move: []
        };
    };
};


