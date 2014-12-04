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
    gameObjectsInfo: {
        units: {},
        buildings: {},
        resources: {}
    }
};

server.init = function(sockets) {
    var self = this;
    this.sockets = sockets;
    this.config = require("./config");
    this.components = require("./components");
    
    require("./database").init(function(db) {
        self.db = db.collection('missions');
        //self.components.mission.createTestMission(server);

        self.components.mission.restoreMissionsFromDb(self.gameObjectsInfo);
    });
    
//    this.createConnectionWithMainServer(function() {
//        
//    });
};

server.createConnectionWithMainServer = function(callback) {
    var self = this;
    var socket = require("socket.io-client")(this.config.mainServer.url + ":" + this.config.mainServer.port);
    socket.on("connect", function() {
        self.msSocket = socket;
        self.addMainServerSocketEvents(socket);
        self.log("Connected to main server. Waiting for requests.");
        callback(true);
    }).on('connect_error', function() {
        self.log("Can't connect to main server. Trying reconnect...");
    });
};

server.addMainServerSocketEvents = function(socket) {
    require("./socketEvents/mainServer/newMissionInit").bind(socket, this);
};

server.addPlayerAuthSocketEvents = function(socket) {
    require("./socketEvents/client/auth").bind(socket, this);
};

server.addPlayerBattleSocketEvent = function(socket, mId, playerId) {
    require("./socketEvents/client/initMissionResult").bind(socket, this, mId, playerId);
    require("./socketEvents/client/endTurn").bind(socket, this, mId, playerId);
};

server.log = function(message) {
    console.log(this.components.time.getDatetime() + " - " + message);
};

server.sendMessage = function(socket, method, isSuccess, data) {
    var message = {
        isSuccess: isSuccess
    };
    
    if (isSuccess) {
        message.data = data;
    }
    else {
        message.error = data;
    }
    socket.emit(method, message);
};

server.sendMessageToAllPlayersInMission = function(mId, method, isSuccess, data) {
    var message = {
        isSuccess: isSuccess
    };
    
    if (isSuccess) {
        message.data = data;
    }
    else {
        message.error = data;
    }
    
    this.sockets.to("Mission_" + mId).emit(method, message);
}

module.exports = server;