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
    
    this.getMissionPlayerId = function(playerId) {
        for (var mPlayerId in this.players) {
            if (this.players[mPlayerId].playerId == playerId)
                return mPlayerId;
        }
        return null;
    };
    
    this.isAllPlayersAuth = function() {
        for (var mPlayerId in this.players) {
            if (this.players[mPlayerId].playerId > 0 && this.players[mPlayerId].socket == null)
                return false;
        }
        return true;
    };
};


