var DatabaseModule = function(connection) {
    this.addNewBattle = function(battleId, mapInfo, callback) {
        var sql = "\
            INSERT INTO `battles_info`\n\
            SET `battle_id` = ?,\n\
                `map_info` = ?\n\
        ";    
        connection.query(sql, [battleId, mapInfo], function(err, result) {
            if (err) {
                callback(err);
            } 
            else {
                callback(true);
            }
        });
    };
    
    this.updateBattle = function(battleId, data, callback) {
        var updateData = [];
        for (var key in data) {
            updateData.push(key + "=" + connection.escape(data[key]));
        }
        
        var sql = "\n\
            UPDATE `battles_info`\n\
            SET " + updateData.join(",") + " \n\
            WHERE `battle_id` = ?\n\
            LIMIT 1\n\
        ";
        connection.query(sql, [battleId], function(err, result) {
            if (err) {
                callback(err);
            } 
            else {
                callback(true);
            }
        });
    };
    
    this.removeBattleInfo = function(battleId, callback) {
        battleId = connection.escape(battleId);
        var sql = "\n\
            DELETE `bI`, `bUs`, `bUn`, `bB`\n\
            FROM `battles_info` AS bI, \n\
                `battles_users` AS bUs, \n\
                `battles_units` AS bUn, \n\
                `battles_buildings` AS bB\n\
            WHERE bI.`battle_id` = "+battleId+"\n\
                AND bUs.`battle_id` = "+battleId+"\n\
                AND bUn.`battle_id` = "+battleId+"\n\
                AND bB.`battle_id` = "+battleId+"\n\
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


