module.exports = function(armies, unitsInfo, locationsInfo) {
    this.armies = armies;
    this.unitsInfo = unitsInfo;
    this.locationsInfo = locationsInfo;
    
    this.process = function() {
        var armiesInfo = [];
        for (var side in this.armies) {
            var armyInfo = {
                side: side,
                power: 0,
                unitsPower: {}
            };
            
            var units = this.getAllArmyUnits(side);
            for (var unitId in units) {
                var unitPower = this.calcUnitPower(side, unitId);
                armyInfo.unitsPower[unitId] = unitPower;
                armyInfo.power += unitPower * units[unitId];
            }
            
            armiesInfo.push(armyInfo);
        }
        
        var survivors = 1 - armiesInfo[1].power / armiesInfo[0].power;
        var winner = 0;
        if (armiesInfo[1].power > armiesInfo[0].power) {
            winner = 1;
            survivors = 1 - armiesInfo[0].power / armiesInfo[1].power;
        }

        
        var losses = this.getAllUnitsCount(armiesInfo[winner].side) - Math.round(this.getAllUnitsCount(armiesInfo[winner].side) * survivors);
        var restUnits = this.getSurviveUnitsBySurvivorsCount(armiesInfo[winner], losses, this.getAllArmyUnits(armiesInfo[winner].side));

        var restUnitsByPlayers = this.getSurviveUnitsByPlayers(restUnits, armiesInfo[winner].side);
        
        return {
            winnerSide: armiesInfo[winner].side,
            winnerPower: armiesInfo[winner].power,
            defeatSide: this.getEnemySide(armiesInfo[winner].side),
            defeatPower: armiesInfo[!winner].power,
            playersUnits: restUnitsByPlayers
        };
    };
    
    this.getSurviveUnitsByPlayers = function(surviveUnits, side) {
        var survivorUnitsByPlayers = {};
        var unitsPercentCount = this.getUnitsPercentCountByPlayers(side);
        for (var unitId in unitsPercentCount) {
            if (surviveUnits[unitId] != 0) {
                var restUnits = surviveUnits[unitId];
                var currentPlayerNum = 1;
                for (var playerId in unitsPercentCount[unitId]) {
                    if (survivorUnitsByPlayers[playerId] == null) {
                        survivorUnitsByPlayers[playerId] = {};
                    }
                    
                    var playerUnitRest = Math.round(surviveUnits[unitId] * unitsPercentCount[unitId][playerId]);
                    if (Object.keys(unitsPercentCount).length == currentPlayerNum) {
                        playerUnitRest = restUnits;
                    }
                    survivorUnitsByPlayers[playerId][unitId] = playerUnitRest;

                    restUnits -= playerUnitRest;
                    currentPlayerNum++;
                }
            }
        }

        return survivorUnitsByPlayers;
    };
    
    this.calcUnitPower = function(unitSide, unitId) {
        var power = 0;
        
        var unitInfo = this.unitsInfo[unitId];
        if (unitInfo != null) {
            power = unitInfo.power;
            for (var i = 0; i < unitInfo.params; i++) {
               switch (unitInfo.params[i]) {
                   default:
                       break;
               }
            }
        }
        return power;
    };
    
    this.getEnemySide = function(yourSide) {
        for (var side in this.armies) {
            if (side != yourSide) {
                return side;
            }
        }
        return null;
    };
    
    this.getSurviveUnitsBySurvivorsCount = function(armyInfo, losses, restUnits) {
        var totalUnitsPower = 0;
        for (var unitId in armyInfo.unitsPower) {
            totalUnitsPower += this.unitsInfo[unitId].power;
        }
        
        var priorityOfLosses = [];
        for (var unitId in armyInfo.unitsPower) {
            priorityOfLosses.push({
                unitId: unitId,
                priority: totalUnitsPower / armyInfo.unitsPower[unitId]
            });
        }
        
        
        
        var totalPriorityOfLosses = 0;
        for (var i = 0; i < priorityOfLosses.length; i++) {
            totalPriorityOfLosses += priorityOfLosses[i].priority;
        }
        
        priorityOfLosses.sort(function(unit1, unit2) {
            if (unit1.priority < unit2.priority) {
                return -1;
            }
            if (unit1.priority > unit2.priority) {
                return 1;
            }
            return 0;
        });
        
        var lossesRest = losses;
        var unitsLosses = {};
        for (var i in priorityOfLosses) {
            var unitLosses = Math.round(losses * priorityOfLosses[i].priority / totalPriorityOfLosses);
            if (i == priorityOfLosses.length - 1) {
                unitLosses = lossesRest;
            }
            unitsLosses[priorityOfLosses[i].unitId] = unitLosses;
            lossesRest -= unitLosses;
        }
        
        var needRecalc = false;
        for (var unitId in unitsLosses) {
            restUnits[unitId] -= unitsLosses[unitId];
            losses -= unitsLosses[unitId];
            if (restUnits[unitId] < 0) {
                losses -= restUnits[unitId];
                restUnits[unitId] = 0;
                needRecalc = true;
            }
        }
        
        if (needRecalc) {
            restUnits = this.getSurviveUnitsBySurvivorsCount(armyInfo, losses, restUnits);
        }
        
        return restUnits;
    };
    
    this.getUnitsPercentCountByPlayers = function(side) {
        var unitsPercentCount = {};
        var allArmyUnits = this.getAllArmyUnits(side);
        for (var unitId in allArmyUnits) {
            var unitsCount = {};
            for (var playerId in this.armies[side]) {
                var count = 0;
                if (this.armies[side][playerId][unitId] != null) {
                    count = this.armies[side][playerId][unitId];
                }
                unitsCount[playerId] = count;
            }
            
            for (var playerId in unitsCount) {
                unitsCount[playerId] = unitsCount[playerId] / allArmyUnits[unitId];
            }
            unitsPercentCount[unitId] = unitsCount;
        }
        
        return unitsPercentCount;
    }
    
    this.getArmyUnitsCountByParams = function(side, params) {
        var count = 0;
        var units = this.getAllArmyUnits(side);
        for (var unitId in units) {
            var isMatched = true;
            for (var i in params) {
                if (this.unitsInfo[unitId].params.indexOf(params[i]) == -1) {
                    isMatched = false;
                    break;
                }
            }
            
            if (isMatched) {
                count += units[unitId];
            }
        }
        
        return count;
    };
    
    this.getAllUnitsCount = function(side) {
        var count = 0;
        var units = this.getAllArmyUnits(side);
        for (var unitId in units) {
            count += units[unitId];
        }
        return count;
    };
    
    this.getAllArmyUnits = function(side) {
        var units = {};
        var playersUnits = this.armies[side];
        for (var mPlayerId in playersUnits) {
            for (var unitId in playersUnits[mPlayerId]) {
                if (units[unitId] == null) {
                    units[unitId] = 0;
                }
                units[unitId] += playersUnits[mPlayerId][unitId];
            }
        }
        return units;
    };
};