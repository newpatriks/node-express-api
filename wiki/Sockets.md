#SOCKETS

##Connection / Identification

In Sockets doesn't exist URL, they connect using ports and actions. The connection will be done initially, when the local application opens before login/register. The application will contact to the server opening a socket, and the server will be waiting for any connection.

###Backend side

```javascript
var allSockets = [];
var sio = require('socket.io').listen(server, {'log level': 2});
sio.on('connection', function (socket) {
	socket.emit('identification', { data : socket.client.id });
});
```

###Frontend side

At the front end we need to read the socket.io library from any available CDN. After that we can wait for the "connection". This event will send to the frontend the ID of the socket. 

```javascript
<script src="https://cdn.socket.io/socket.io-1.0.6.js"></script>
...
<script>
	var socket = io('http://localhost:3000');
	var id_socket;
	socket.on('connection', function (res) {
		id_socket = res.data;
	});
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


##Shout out action

When a user is doing a shout out, from the front end 