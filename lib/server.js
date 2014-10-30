var server = {
    // Конфиг сервера
    config: null,
    
    // Сокеты пользователей, которые участвуют в сражении
    sockets: [],
    
    // Сокет для общения с основным сервером
    msSocket: null,

    // Объект для работы с базой данных
    db: null,
    
    // Объект с компонентами
    components: null,
    
    // Сражения
    battles: {},
    
    // Информация по юнитам, зданиям и ресурсам
    gameObjectsInfo: null
};

server.init = function(sockets) {
    this.config = require("./config");
    this.db = require("./db");
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

server.addUserAuthSocketEvents = function(socket) {
    require("./socketEvents/client/auth").bind(socket, this);
};

server.addUserBattleSocketEvent = function(socket, battleId, userId) {
    
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