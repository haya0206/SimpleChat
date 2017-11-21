var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var userNum = 0;
var userId1;
var userId2;
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    console.log('a user connected');
    console.log(userNum);
    io.to(socket.id).emit('connected');
    userNum++;
    if (userNum > 1) {
        userNum = 0;
        userId2 = socket.id;
        io.to(userId1).emit('match', userId2);
        io.to(userId2).emit('match', userId1);
    } else {
        userId1 = socket.id;
    }
    socket.on('chat message', function (msg) {  
        console.log(msg);
        io.to(msg.id).emit('chat message', msg);
    });
    socket.on('disconnect', function () {
        userNum=0;
        console.log('user disconnected');
        console.log(socket.id);
        io.emit('disconnected',socket.id);
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});
