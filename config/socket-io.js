module.exports = function(app, server, secret) {
    var clients = {};
    console.log("initiating sockets...");
    var sio = require('socket.io').listen(server, {'log level': 2});

    sio.on('connection', function (socket) {
        clients[socket.id] = socket;
        console.log("...new connection: "+socket.client.id);
        socket.emit('identification', { data : socket.client.id });

        socket.on('newShoutOut', function(data) {
            var receptor    = data.idTo;
            var emiter      = socket.client.id;
            console.log("...new shout out from " +emiter+ " to "+receptor);

            //socket.broadcast.emit('newShoutOut', { data : data.data, from : emiter });
            //sio.sockets.sockets(receptor).emit(data);
            sio.sockets.in(receptor).send({ data : data.data, from : emiter });
        });
        
        socket.on('disconnect', function() {
            console.log("..."+socket.client.id + " disconnected");
        });
        
        socket.on('privateShoutout', function(msg, toId) {
            console.log(msg);
            console.log(toId);
            //allSockets[toId-1].emit('newPrivateShoutout_response', { data : msg });
        });

        //console.log(socket.client.id, 'connected');      
    });
};