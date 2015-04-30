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
        units: {
            1: {
                name: "peasant",
                power: 40,
                resources: 100,
                maintenance: 5
                
            },
            2: {
                name: "militiaman",
                power: 50,
                resources: 150,
                maintenance: 7
            },
            3: {
                name: "swordman",
                power: 80,
                resources: 250,
                maintenance: 12
            }
        },
        buildings: {
            1: {
                name: "farm",
                resources: 400,
                resourceId: null,
                maintenance: 5,
                bonuses: {
                    resourcesIncome: 50
                }
            },
            2: {
                name: "gold_mine",
                resources: 1000,
                resourceId: 1,
                maintenance: 0,
                bonuses: {
                    resourcesIncome: 150
                }
            },
            3: {
                name: "iron_mine",
                resources: 700,
                resourceId: 2,
                maintenance: 0,
                bonuses: {
                    resourcesIncome: 120
                }
            },
            4: {
                name: "smithy",
                resources: 800,
                resourceId: 2,
                maintenance: 30,
                bonuses: {
                    unitsAvailalbe: [3],
                    bonusToUnits: {
                        units: [1,2,3],
                        bonus: 5
                    }
                }
            }
        },
        resources: {
            1: {
                name: "gold"
            },
            2: {
                name: "iron"
            }
        },
        unitSkills: {}
    }
};

server.init = function(sockets) {
//    var Battle = require("./components/classes/Battle.js");
//    
//    var armiesInfo = {
//        1: {
//            1: {
//                1: 10,
//                2: 10
//            },
//            2: {
//                1: 30,
//                2: 0
//            }
//        },
//        2: {
//            3: {
//                1: 20,
//                2: 20
//            }
//        }
//    };
//    
    var unitsInfo = {
        
    };
    
    var self = this;
    this.sockets = sockets;
    this.config = require("./config");
    this.components = require("./components");
    
    require("./database").init(function(db) {
        self.db = db.collection('missions');
//        self.components.mission.createTestMission(server);

        self.components.mission.restoreMissionsFromDb(self);
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
};

module.exports = server;