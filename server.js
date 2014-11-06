var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 1337;
var path = require('path');

var host = '';
var usernames = {};
var numUsers = 0;

// Index
app.get('/', function(req, res){
  res.sendFile('index.html', {root: __dirname});
});
// Index
app.get('/TA', function(req, res){
  res.sendFile('index.html', {root: __dirname});
});
// Static Files
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', function(socket){
  var addedUser = false;
  updatePlayers();
  socket.on('join queue', function(username){
    socket.username = username;
    usernames[socket.username] = {
      username: socket.username,
      ready: false
    };
    ++numUsers;
    addedUser = true;
    updatePlayers();
  });

  socket.on('disconnect', function() {
    if (addedUser) {
      if (usernames[socket.username].ready) {
        for (var key in roles) {
          roles[key] = 0;
        }
      }
      delete usernames[socket.username];
      if (host == socket.username) {
        var keyArray = Object.keys(usernames);
        var len = keyArray.length;
        if (len == 0) {
          host = '';
        } else {
          host = usernames[keyArray[Math.floor(Math.random() * len)]].username;
        }
      }
      numUsers--;
      updatePlayers();
    }
  });
});

function updatePlayers() {
  for (var key in usernames) {
    if (usernames[key].username == undefined) {
      delete usernames[key];
    }
  }
  io.emit('update players', {
    numUsers: numUsers,
    usernames: usernames,
    host: host
  });
};

http.listen(port, function(){});