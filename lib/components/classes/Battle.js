module.exports = function(armies, unitsInfo, locationsInfo) {
    this.armies = armies;
    this.unitsInfo = unitsInfo;
    
    this.process = function() {
        
    };
    
    this.getEnemySide = function(yourSide) {
        for (var side in this.armies) {
            if (side != yourSide) {
                return side;
            }
        }
        return null;
    };
    
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
    
    this.getAllArmyUnits = function(side) {
        var units = {};
        var playersUnits = this.armies[side];
        for (var playerId in playersUnits) {
            for (var unitId in playersUnits[playerId]) {
                if (units[unitId] == null) {
                    units[unitId] = 0;
                }
                units[unitId] += playersUnits[playerId][unitId];
            }
        }
        return units;
    };
};