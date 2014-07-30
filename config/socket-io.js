module.exports = function(app, server, secret) {
    var clients = {};
    console.log("initiating sockets...");

    var io = require('socket.io').listen(server);
    io.sockets.on('connection', function (socket) {
        clients[socket.id] = socket;
        console.log("...new connection: "+socket.client.id);
        socket.emit('identification', { data : socket.client.id });

        socket.on('newShoutOut', function(data) {
            var receptor    = data.idTo;
            var emiter      = socket.client.id;
            console.log("...new shout out from " +emiter+ " to "+receptor);
            var elem = findElement(io.sockets['sockets'], 'id', receptor);
            io.sockets.sockets[elem].emit('privateShoutout',{ data : data.data, from : emiter });
        });
        
        socket.on('disconnect', function() {
            //console.log("..."+socket.client.id + " disconnected");
        });
    });
};

function findElement(arr, propName, propValue) {
    for (var i=0; i < arr.length; i++) {
        if (arr[i].id === propValue)
            return i;
    };
}