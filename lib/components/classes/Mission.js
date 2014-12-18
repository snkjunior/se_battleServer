var timeComponent = require("../time");

module.exports = function(mId, missionInfo, playersMap, playersServerInfo, gameObjectsInfo) {
    for (var mPlayerId in missionInfo.players) {
        missionInfo.players[mPlayerId].isDefeated = false;
    }
    
    this.mId = mId;
    this.status = 'players_auth';
    this.info = missionInfo;
    this.playersMap = playersMap; // key: mPlayerId, data: playerId, name
    this.playersServerInfo = playersServerInfo; // key: playerId, data: socket, authKey, status
    this.gameObjectsInfo = gameObjectsInfo;
    
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
            var log = {
                battles: {
                    inMove: {},
                    inLocations: {}
                },
                changedLocationOwner: {
                    
                }
            };
            
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
                        // Если отряды союзные, то ничего не делаем
                        if (this.info.players[allMoveActions[endLocationId][startLocationId][Object.keys(allMoveActions[endLocationId][startLocationId])[0]]].side == this.info.players[allMoveActions[startLocationId][endLocationId][Object.keys(allMoveActions[startLocationId][endLocationId])[0]]].side) {
                            continue;
                        }

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
                                moveFrom: startLocationId,
                                moveTo: endLocationId,
                                units: allMoveActions[startLocationId][endLocationId][mPlayerId]
                            };
                        }
                    }
                }
            }
            
            // Проводим сражения, которые произошли между встречными отрядами
            for (var battleId in battles.inMove) {
                var armies = {};
                for (var mPlayerId in battles.isMove[battleId]) {
                    var side = this.info.players[mPlayerId].side;
                    if (armies[side] == null) {
                        armies[side] = {};
                    }
                    
                    armies[side][mPlayerId] = battles.isMove[battleId][mPlayerId];
                }
                
                var battle = new Battle(armies, this.gameObjectsInfo.units);
                var result = battle.process();
                
                log.battles.inMove[battleId] = {
                    winner: result.winnerSide,
                    defeat: result.defeatSide
                };
                
                // Убираем из движения отряды, который проиграли в сражении между локациями
                for (var mPlayerId in armies[result.defeatSide]) {
                    var info = armies[result.defeatSide][mPlayerId];
                    delete allMoveActions[info.moveFrom][info.moveTo][mPlayerId];
                }
            
                // Победителям устанавливаем выживших юнитов
                for (var mPlayerId in armies[result.winnerSide]) {
                    var info = armies[result.winnerSide][mPlayerId];
                    allMoveActions[info.moveFrom][info.moveTo][mPlayerId].units = result.playersUnits[mPlayerId];
                }                
            }
            
            // Перемещаем все передвигающиеся отряды в конечные локации
            var endLocationList = [];
            for (var startLocationId in allMoveActions) {
                for (var endLocationId in allMoveActions[startLocationId]) {
                    for (var mPlayerId in allMoveActions[startLocationId][endLocationId]) {
                        this.addPlayerUnitsToLocations(mPlayerId, endLocationId, allMoveActions[startLocationId][endLocationId][mPlayerId]);
                        if (endLocationList.indexOf(endLocationId) == -1) {
                            endLocationList.push(endLocationId);
                        }
                    }
                }
            }
            
            // Проверяем все локации, куда пришли войска
            for (var locationId in endLocationList) {
                if (this.isPlayersFromDifferentSidesInLocation(locationId)) {
                    var armies = {};
                    for (var mPlayerId in this.info.map[locationId].units) {
                        var side = this.info.players[mPlayerId].side;
                        if (armies[side] == null) {
                            armies[side] = {};
                        }
                        armies[side][mPlayerId] = this.info.map[locationId].units[mPlayerId];
                    }
                    
                    var battle = new Battle(armies, this.gameObjectsInfo.units);
                    var result = battle.process();
                    
                    log.battles.inLocations[locationId] = {
                        winner: result.winnerSide,
                        defeat: result.defeatSide
                    };
                    
                    // Убираем игроков, которые проиграли в сражении из локации
                    for (var mPlayerId in armies[result.defeatSide]) {
                        delete this.info.map[locationId].units[mPlayerId];
                    }
                    
                    // Победителям устанавливаем выживших юнитов и устанавливаем владельцами локации
                    for (var mPlayerId in armies[result.winnerSide]) {
                        this.info.map[locationId].units[mPlayerId] = result.playersUnits[mPlayerId];                        
                    }

                    var newLocationOwner = this.info.map[locationId].units[Object.keys(this.info.map[locationId].units)[0]];
                    if (Object.keys(this.info.map[locationId].units).length > 1) {
                        // TODO: оставим на будущее - надо будет продумать, кому отдавать локацию, если в ней отряды двух или более союзных игроков
                    }
                    
                    if (this.info.players[this.info.map[locationId].ownerId].side != this.info.players[newLocationOwner].side) {
                        log.changedLocationOwner[locationId] = newLocationOwner;
                        this.info.map[locationId].ownerId = newLocationOwner;
                    }
                }
            }
            
            
            
            this.initNewTurn();
        }
    };
    
    this.isPlayersFromDifferentSidesInLocation = function(locationId) {
        var sidesInLocation = [];
        for (var mPlayerId in this.info.map[locationId].units) {
            if (sidesInLocation.indexOf(this.info.players[mPlayerId].side) == -1) {
                sidesInLocation.push(this.info.players[mPlayerId].side);
            }
        }
        return sidesInLocation.length > 1;
    };
    
    this.addPlayerUnitsToLocations = function(mPlayerId, locationId, units) {
        if (this.info.map[locationId] == null) {
            return;
        }
        
        if (this.info.map[locationId].units[mPlayerId] == null) {
            this.info.map[locationId].units[mPlayerId] = units;
        } else {
            for (var unitId in units) {
                if (this.info.map[locationId].units[mPlayerId][unitId] == null) {
                    this.info.map[locationId].units[mPlayerId][unitId] = units[unitId];
                } else {
                    this.info.map[locationId].units[mPlayerId][unitId] += units[unitId];
                }
            }  
        }
    };
    
    this.savePlayerAction = function(playerId, actions) {
        var mPlayerId = this.getMissionPlayerId(playerId);
        this.currentTurn.actions[mPlayerId] = actions;
        this.playersServerInfo[playerId].status = 'end_turn';
    };
    
    this.getMissionPlayerId = function(playerId) {
        for (var mPlayerId in this.playersMap) {
            if (this.playersMap[mPlayerId].playerId == playerId) {
                return mPlayerId;
            }
        }
        return null;
    };
    
    this.isAllPlayersAuth = function() {
        for (var playerId in this.playersServerInfo) {
            if (this.playersServerInfo[playerId].socket == null) {
                return false;
            }
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
    
    this.isTurnEndTime = function() {
        return (this.currentTurn.startTime + this.roundTime) <= timeComponent.getTime();
    };
};