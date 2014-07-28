module.exports = function(app, server, secret) {
    var clients = {};
    //console.log("initiating sockets...");
    var sio = require('socket.io').listen(server);

    sio.sockets.on('connection', function (socket) {
        clients[socket.id] = socket;
        //console.log("...new connection: "+socket.client.id);
        socket.emit('identification', { data : socket.client.id });

        socket.on('newShoutOut', function(data) {
            var receptor    = data.idTo;
            var emiter      = socket.client.id;
            //console.log("...new shout out from " +emiter+ " to "+receptor);
            var elem = findElement(sio.sockets['sockets'], 'id', receptor);
            sio.sockets.sockets[elem].emit('privateShoutout',{ data : data.data, from : emiter });
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