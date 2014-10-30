var DatabaseModule = function(connection) {
    this.addBattleUsers = function(battleId, users, callback) {
        var values = [];
        battleId = connection.escape(battleId);
        for (var i = 0; i < users.length; i++) {
            values.push("(" + battleId + "," 
                    + connection.escape(users[i].userId) + ","  
                    + connection.escape(users[i].name) + "," 
                    + connection.escape(users[i].authKey) + "," 
                    + connection.escape(users[i].resources) + "," 
                    + connection.escape(users[i].turn) + ")");
        }
        
        var sql = "\n\
            INSERT INTO `battles_users`\n\
                (`battle_id`, `user_id`, `name`, `auth_key`, `resources`, `turn`)\n\
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
    
    this.updateUser = function(battleId, userId, resources, isDefeated, callback) {
        var sql = "\n\
            UPDATE `battles_users`\n\
            SET `resources` = ?,\n\
                is_defeated = ?\n\
            WHERE `battle_id` = ? \n\
                AND `user_id` = ?\n\
            LIMIT 1\n\
        ";
        connection.query(sql, [resources, isDefeated, battleId, userId], function(err, result) {
            if (err) {
                callback(err);
            }
            else {
                callback(true);
            }
        });
    };
    
    this.clearUsers = function(battleId, callback) {
       var sql = "\n\
            DELETE FROM `battles_users`\n\
            WHERE `battle_id` = ?\n\
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
};

module.exports.connect = function(connection) {
    return new DatabaseModule(connection);
};


