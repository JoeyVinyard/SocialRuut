
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var clients = [];
io.on('connection', function(client){
	console.log("connect");
	//console.log(clients.length);
	client.emit('userCreated', clients.length);
	console.log('CREATING USER WITH ID ' + (clients.length + 1));
	clients.push(client.id);
	for(items in clients){
		if(clients[items] != client.id){
			//console.log("TRANSMITTING USER ADDED TO USER ID " + (Number(items) + 1))
			io.sockets.connected[clients[Number(items)]].emit('userAdded', clients.length);
		}
	}
	client.on('mouseMove', function(mousePos){
		//console.log("RECEIVING MOUSE MOVE FROM USER ID " + (clients.indexOf(client.id) + 1))
		for(items in clients){
			if(clients[items] != client.id){
				var idMouse = mousePos;
				newID = Number((clients.indexOf(client.id) + 1));
				//console.log(newID);
				idMouse.push(newID)
				io.sockets.connected[clients[items]].emit('mouseMoved', idMouse);
			}
		}
	});
	// io.on('mouseMove', function(mousePos){
	// 	for(items in clients){
	// 		console.log(clients[items], socket.id, console.log(clients.indexOf(socket.id)));
	// 		if(clients[items] != socket.id){
	// 			clients[items].emit('repositionBox');
	// 		}
	// 	}
	// });
});

http.listen(3001, function(){
  console.log('listening on *:3001');
});