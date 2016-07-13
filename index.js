
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');

});

var clients = [];
io.on('connection', function(client){
	console.log("connect");
	client.emit('userCreated', clients.length);
	console.log('CREATING USER WITH ID ' + (clients.length + 1));
	clients.push(client.id);
	for(items in clients){
		if(clients[items] != client.id){
			io.sockets.connected[clients[Number(items)]].emit('userAdded', clients.length);
		}
	}
	client.on('mouseMove', function(mousePos){
		for(items in clients){
			if(clients[items] != client.id){
				var idMouse = mousePos;
				newID = Number((clients.indexOf(client.id) + 1));
				idMouse.push(newID)
				io.sockets.connected[clients[items]].emit('mouseMoved', idMouse);
			}
		}
	});
	client.on('disconnect', function(){
		console.log("user left");
		var id = client.id;
		var indexOfLeave = clients.indexOf(id);
		clients.splice(indexOfLeave, 1)
		for(items in clients){
			if(clients[items] != client.id){
				io.sockets.connected[clients[items]].emit('clientLeft', indexOfLeave);
			}
		}
	})
});

http.listen(process.env.PORT || 3001, function(){
  console.log('listening on *:3001');
});