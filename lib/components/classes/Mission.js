var timeComponent = require("../time");

module.exports = function(mId, missionInfo, playersMap, playersServerInfo) {
    for (var mPlayerId in missionInfo.players) {
        missionInfo.players[mPlayerId].isDefeated = false;
    }
    
    this.mId = mId;
    this.status = 'players_auth';
    this.info = missionInfo;
    this.playersMap = playersMap; // key: mPlayerId, data: playerId, name
    this.playersServerInfo = playersServerInfo; // key: playerId, data: socket, authKey, status
    
    this.currentTurn = {
        round: 0,
        startTime: null,
        actions: {}
    };
    
    this.initNewTurn = function() {
        this.currentTurn.round++;
        this.currentTurn.startTime = timeComponent.getTime();
        this.currentTurn.actions = {};
        for (var playerId in this.playersServerInfo) {
            this.playersServerInfo[playerId].status = "actions_planning";
        }
    };
    
    this.processTurnActions = function() {
        
        
        this.initNewTurn();
    };
    
    this.savePlayerAction = function(playerId, actions) {
        var mPlayerId = this.getMissionPlayerId(playerId);
        this.currentTurn.actions[mPlayerId] = actions;
        this.playersServerInfo[playerId].status = 'end_turn';
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
    
    this.isAllPlayersEndTurn = function() {
        for (var playerId in this.playersServerInfo) {
            if (this.playersServerInfo[playerId].status != "end_turn") {
                return false;
            }
        }
        return true;
    };
};


