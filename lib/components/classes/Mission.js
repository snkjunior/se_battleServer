var timeComponent = require("../time");

module.exports = function(mId, missionInfo, playersMap) {
    this.mId = mId;
    this.status = 'players_auth';
    this.info = missionInfo;
    this.playersMap = playersMap;
    
    this.currentTurn = {
        num: -1,
        turnStartTime: null,
        actions: {
            build: [], // {x, y, buildingId}
            hire: [], // {x, y, unitId, count}
            move: [] // {x, y, units: [{unitId, count}], dx, dy}
        }
    };
    
    this.isAllPlayersAuth = function() {
        for (var mPlayerId in this.players) {
            if (this.players[mPlayerId].playerId > 0 && this.players[mPlayerId].socket == null)
                return false;
        }
    };
    
//    this.redrawTurns = function() {
//        var turns = [];
//        for (var mPlayerId in this.players) {
//            if (!this.players[mPlayerId].isDefeated) {
//                turns[this.players[mPlayerId].turn] = playerId;
//            }
//        }
//        
//        for (var i = 0; i < turns.length; i++) {
//            if (i in turns) {
//                this.turns.push(turns[i]);
//            }
//        }
//    };
    
//    this.nextTurn = function() {
//        if (this.turns.length == this.currentTurn.num) {
//            this.currentTurn.num = 0;
//        }
//        else {
//            this.currentTurn.num++;
//        }
//        this.turnStartTime = timeComponent.getTime();
//        this.actions = {
//            build: [],
//            hire: [],
//            move: []
//        };
//    };
};


