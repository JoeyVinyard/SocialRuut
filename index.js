//Add packages needed to run
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//Include the index.html file
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');

});

var clients = [];//Initialize a new array to hold all the clients

//Fire whenever a new client connects
io.on('connection', function(client){
	//Transmit to the new client that it was created
	client.emit('userCreated', clients.length);
	//Add the new client to the end of the client list
	clients.push(client.id);
	//Loop through the client list, telling them there was a new client added
	for(items in clients){
		if(clients[items] != client.id){
			io.sockets.connected[clients[Number(items)]].emit('userAdded', clients.length);
		}
	}

	//Fires when the client moves its mouse
	client.on('mouseMove', function(mousePos){
		//Loop through the clients and transmit to all of them that a client has moved
		for(items in clients){
			//Ignores the client that moved its mouse
			if(clients[items] != client.id){
				var idMouse = mousePos;
				newID = Number((clients.indexOf(client.id) + 1));
				idMouse.push(newID)
				io.sockets.connected[clients[items]].emit('clientMoved', idMouse);
			}
		}
	});

	//Fires when a client disconnects
	client.on('disconnect', function(){
		var id = client.id;
		var indexOfLeave = clients.indexOf(id);
		//Removes the disconnected client from the list
		clients.splice(indexOfLeave, 1)
		for(items in clients){
			if(clients[items] != client.id){
				//Tells each of the remaining clients that somebody left
				io.sockets.connected[clients[items]].emit('clientLeft', indexOfLeave);
			}
		}
	})
});

//Opens the port 3001, as weell as the server port
http.listen(process.env.PORT || 3001, function(){
  console.log('listening on *:3001');
});