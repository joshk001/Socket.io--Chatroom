var express = require('express');
var app = express();

app.use(express.static(__dirname + "/static"));

var server = app.listen(7777);
console.log("The server is on Port 7777")

var io = require('socket.io').listen(server);

var users = [];

io.sockets.on('connection', function(socket){

	socket.on('newUser', function(userData){
		users.push({
			socketID: socket.id,
			name: userData.userName
		})
		io.emit('updateUserList', users);
		io.emit('updateMessageBoard', {msg: ('<p>' + userData.userName + " has just entered the room." + '</p>') })

	})
	
	socket.on('newMessage', function(userData){
		console.log(userData);
		console.log(userData.msg);
		io.emit('updateMessageBoard', userData);
	})

	//(Action) Emit to Client - Response to Client who emitted 'button_clicked'
	//  socket.emit('server_response', {response: "Working!"})

	//(Action) Broadcast to ALL Clients who emitted 'button_clicked'
	//  socket.broadcast.emit('server_response', {response: "Working!"})

	//(Action) Broadcast to all including Client who emitted 'button_clicked'
	//  io.emit('server_response', {response: "Working!"})

	socket.on('disconnect', function(){
		for (index in users){
			if(users[index].socketID == socket.id) {
				io.emit('updateMessageBoard', {msg: ('<p>' + users[index].name + "has just left the room." + '</p>') })
				users.splice(index, 1);
				io.emit('updateUserList', users);
			}
		}
	})
});




