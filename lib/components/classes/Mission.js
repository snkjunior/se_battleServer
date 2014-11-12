var timeComponent = require("../time");

module.exports = function(mId, missionInfo, playersMap, playersServerInfo) {
    this.mId = mId;
    this.status = 'players_auth';
    this.info = missionInfo;
    this.playersMap = playersMap;
    this.playersServerInfo = playersServerInfo;
    
    this.currentTurn = {
        num: -1,
        turnStartTime: null,
        actions: {
            build: [], // {x, y, buildingId}
            hire: [], // {x, y, unitId, count}
            move: [] // {x, y, units: [{unitId, count}], dx, dy}
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


