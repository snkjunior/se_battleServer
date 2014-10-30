var pathToModulesDir = "./databaseModules/";

var mysql = require("mysql");
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "gorinich",
    database: "bs_db"
});

module.exports.info = require(pathToModulesDir + "info").connect(connection);
module.exports.users = require(pathToModulesDir + "users").connect(connection);
module.exports.units = require(pathToModulesDir + "units").connect(connection);
module.exports.buildings = require(pathToModulesDir + "buildings").connect(connection);


