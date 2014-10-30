var io = require("socket.io")(8000);

var server = require("./lib/server");
server.init(io.sockets);

io.on('connection', function(socket) {
    console.log("New client connected. Id: " + socket.id);
    server.addplayerAuthSocketEvents(socket);
});



