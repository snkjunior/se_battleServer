var DatabaseModule = function(connection) {
    this.addBattleBuildings = function(battleId, buildings, callback) {
        var values = [];
        battleId = connection.escape(battleId);
        for (var i = 0; i < buildings.length; i++) {
            values.push("(" + battleId + "," 
                    + connection.escape(buildings[i].buildingId) + "," 
                    + connection.escape(buildings[i].x) + "," 
                    + connection.escape(buildings[i].y) + ")");
        }
        
        var sql = "\n\
            INSERT INTO `battles_buildings`\n\
                (`battle_id`, `building_id`, `x`, `y`)\n\
            VALUES\n\
                " + values.join(",") + "\n\
        ";
        
        connection.query(sql, [], function(err, result) {
            if (err) {
                callback(err);
            }
            else {
                callback(true);
            }
        });
    };
};

module.exports.connect = function(connection) {
    return new DatabaseModule(connection);
};


