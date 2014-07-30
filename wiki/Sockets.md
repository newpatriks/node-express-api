#SOCKETS

##Connection / Identification

In Sockets doesn't exist URL, they connect using ports and actions. The connection will be done initially, when the local application opens before login/register. The application will contact to the server opening a socket, and the server will be waiting for any connection.

###Backend side

```javascript
var io = require('socket.io').listen(server);
    io.sockets.on('connection', function (socket) {
		clients[socket.id] = socket;
		console.log("...new connection: "+socket.client.id);
		socket.emit('identification', { data : socket.client.id });

		socket.on('newShoutOut', function(data) {
			var receptor    = data.idTo;
			var emiter      = socket.client.id;
			var elem = findElement(io.sockets['sockets'], 'id', receptor);
			io.sockets.sockets[elem].emit('privateShoutout',{ data : data.data, from : emiter });
		});
			socket.on('disconnect', function() {
				console.log("user disconnected: "+socket.client.id);
			});
    });
```

###Frontend side

At the front end we need to read the socket.io library from any available CDN. After that we can wait for the "connection". This event will send to the frontend the ID of the socket. 

```javascript
<script src="https://cdn.socket.io/socket.io-1.0.6.js"></script>
...
<script>
	var socket = io('http://localhost'); // don't specify a PORT, it'll be automatic
	var users = [];
	var id_socket = "";
	socket.on('connection', function (data) {
		console.log("connected!");
	});
	socket.on('identification', function(data) {
		// Here the server are sending to the client his ID
		id_socket = data.data;
		console.log("your ID is "+id);
	});
   socket.on('privateShoutout', function(data) {
		// Here the server are sending to the client the private msg
		console.log("newShoutOut received!");
	});
</script>

<script>
	var idTo = XX; // ID of the user that we're sending a private shout out
	socket.emit('newShoutOut', { data : "Hey There!", idTo : idTo });
</script>
```

The idea is to save the ID of the socket to the user information that will send to the API to register/login the user

```javascript
data = {
    token: token,
    socketioID : id_socket,
    social: "facebook",
    "facebook": {
        "id": "10154355075120094",
        "email": "email@hotmail.co.uk",
        "first_name": "Name",
        ...
```