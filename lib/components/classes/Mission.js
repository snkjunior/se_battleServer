var timeComponent = require("../time");

module.exports = function(mId, missionInfo, playersMap, playersServerInfo) {
    for (var mPlayerId in missionInfo.players) {
        missionInfo.players[mPlayerId].isDefeated = false;
    }
    
    this.mId = mId;
    this.status = 'players_auth';
    this.info = missionInfo;
    this.playersMap = playersMap;
    this.playersServerInfo = playersServerInfo;
    
    this.currentTurn = {
        mPlayerId: -1,
        turnStartTime: null,
        actions: {
            build: [], // {x, y, buildingId}
            hire: [], // {x, y, unitId, count}
            move: [] // {x, y, units: [{unitId, count}], dx, dy}
        }
    };
    
    this.getNextPlayerTurn = function() {
        var currentTurn = 0;
        if (this.currentTurn.mPlayerId != -1) {
            currentTurn = this.info.players[this.currentTurn.mPlayerId].turn;
            if (currentTurn == Object.keys(this.info.players).length) {
                currentTurn = 0;
            }
        }
        
        for (var mPlayerId in this.info.players) {
            if (this.info.players[mPlayerId].turn == currentTurn + 1) {
                this.currentTurn.mPlayerId = mPlayerId;
                if (this.info.players[mPlayerId].isDefeated) {
                    this.getNextPlayerTurn();
                }
            }
        }
    };
    
    this.getMissionPlayerId = function(playerId) {
        for (var mPlayerId in this.playersMap) {
            if (this.playersMap[mPlayerId].playerId == playerId)
                return mPlayerId;
        }
        return null;
    };
    
    this.isAllPlayersAuth = function() {
        for (var playerId in this.playersServerInfo) {
            if (this.playersServerInfo[playerId].socket == null)
                return false;
        }
        return true;
    };
    
    this.isAllPlayersReadyForBattle = function() {
        for (var playerId in this.playersServerInfo) {
            if (this.playersServerInfo[playerId].status != "ready_for_battle") {
                return false;
            }
        }
        return true;
    };
};


