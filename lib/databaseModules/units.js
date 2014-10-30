var DatabaseModule = function(connection) {
    this.addBattleUnits = function(battleId, units, callback) {
        var values = [];
        battleId = connection.escape(battleId);
        for (var i = 0; i < units.length; i++) {
            values.push("(" + battleId + "," 
                    + connection.escape(units[i].userId) + ","  
                    + connection.escape(units[i].unitId) + "," 
                    + connection.escape(units[i].count) + "," 
                    + connection.escape(units[i].x) + "," 
                    + connection.escape(units[i].y) + ")");
        }
        
        var sql = "\n\
            INSERT INTO `battles_units`\n\
                (`battle_id`, `user_id`, `unit_id`, `count`, `x`, `y`)\n\
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


