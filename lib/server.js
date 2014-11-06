var server = {
    // Конфиг сервера
    config: null,
    
    // Сокеты пользователей, которые участвуют в сражении
    sockets: [],
    
    // Сокет для общения с основным сервером
    msSocket: null,

    // Объект для работы с коллекцией battles в mongoDB
    db: null,
    
    // Объект с компонентами
    components: null,
    
    // Активные миссии
    missions: {},
    
    // Информация по юнитам, зданиям и ресурсам
    gameObjectsInfo: null
};

server.init = function(sockets) {
    var self = this;
    this.config = require("./config");
    require("./database").init(function(db) {
        self.db = db.collection('battles');
        //console.log(self.components.mission.createTestMission(server));
        
        self.components.mission.restoreMissionsFromDb(self);
    });
    this.components = require("./components");

    this.sockets = sockets;
    
  //  this.createConnectionWithMainServer();
};

server.createConnectionWithMainServer = function() {
    var self = this;
    var socket = require("socket.io-client")(this.config.mainServer.url + ":" + this.config.mainServer.port);
    socket.on("connect", function() {
        self.msSocket = socket;
        self.addMainServerSocketEvents(socket);
        self.log("Connected to main server. Waiting for requests.");
    }).on('connect_error', function() {
        self.log("Can't connect to main server. Trying reconnect...");
    });
};

server.addMainServerSocketEvents = function(socket) {
    require("./socketEvents/mainServer/newBattleInit").bind(socket, this);
};

server.addPlayerAuthSocketEvents = function(socket) {
    require("./socketEvents/client/auth").bind(socket, this);
};

server.addPlayerBattleSocketEvent = function(socket, battleId, playerId) {
    
};

server.log = function(message) {
    console.log(this.components.time.getDatetime() + " - " + message);
};

server.sendResponse = function(socket, method, isSuccess, data) {
    var responseMessage = {
        isSuccess: isSuccess
    };
    
    if (isSuccess) {
        responseMessage.data = data;
    }
    else {
        responseMessage.error = data;
    }
    
    socket.emit(method, responseMessage);
};

module.exports = server;