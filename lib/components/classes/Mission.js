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
    
    this.roundTime = 180;
    
    this.log = {};
    
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
        if (this.isAllPlayersEndTurn() || this.isTurnEndTime()) {
            // TODO: process players actions
            var battles = {
                inMove: {},
                inLocations: {}
            };
            var allMoveActions = {};
            for (var mPlayerId in this.currentTurn.actions) {
                for (var startLocationId in this.currentTurn.actions[mPlayerId].move) {
                    if (allMoveActions[startLocationId] == null) {
                        allMoveActions[startLocationId] = {};
                    }
                    for (var endLocationId in this.currentTurn.actions[mPlayerId].move[startLocationId]) {
                        if (allMoveActions[startLocationId][endLocationId] == null) {
                            allMoveActions[startLocationId][endLocationId] = {};
                        }
                        allMoveActions[startLocationId][endLocationId][mPlayerId] = this.currentTurn.actions[mPlayerId].move[startLocationId][endLocationId];
                    }
                }
            }
            
            for (var startLocationId in allMoveActions) {
                for (var endLocationId in allMoveActions[startLocationId]) {
                    // Если есть отряд, который двигается навстречу текущему отряду
                    if (allMoveActions[endLocationId] != null && allMoveActions[endLocationId][startLocationId] != null) {
                        // TODO: проверить, является ли отряд союзником
//                        if (isPersonageIsAlly) {
//                            continue;
//                        }

                        var battleId = null;
                        if (battles.inMove[startLocationId + "-" + endLocationId] != null) {
                            battleId = startLocationId + "-" + endLocationId;
                        } else if (battles.inMove[endLocationId + "-" + startLocationId]) {
                            battleId = endLocationId + "-" + startLocationId;
                        }
                        
                        if (battleId == null) {
                            battleId = startLocationId + "-" + endLocationId;
                            battles.inMove[battleId] = {};
                        }
                        
                        for (var mPlayerId in allMoveActions[startLocationId][endLocationId]) {
                            battles.inMove[battleId][mPlayerId] = {
                                moveTo: endLocationId,
                                units: allMoveActions[startLocationId][endLocationId][mPlayerId]
                            };
                        }
                    }
                }
            }
            
            for (var battleId in battles.inMove) {
                var mPlayerIds = [];
                for (var mPlayerId in this.battle.isMove[battleId]) {
                    mPlayerIds.push(mPlayerId);
                }
                
                if (this.isAllPlayersAlly(mPlayerIds)) {
                    continue;
                }
                
                // TODO: проводим сражение
            }
            
            this.initNewTurn();
        }
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
    
    // TODO
    this.isAllPlayersAlly = function(mPlayerIds) {
        return false;
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
    
    this.isTurnEndTime = function() {
        return (this.currentTurn.startTime + this.roundTime) <= timeComponent.getTime();
    };
};


