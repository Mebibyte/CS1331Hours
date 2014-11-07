var socket = io();

var loggedIn = false;

$('form', '#join').submit(function(){
  var taName = $('#name').val();
  var pass = $('#password').val();
  if (pass != null && taName != null) {
    socket.emit('ta login', taName, pass);
  }
  return false;
});

socket.on('success', function() {
  loggedIn = true;
  $('#join').hide();
  socket.emit('update');
});

function assist(index) {
  socket.emit('helping', index);
}

function removeStudent(index) {
  socket.emit('remove', index);
}

function removeAllStudents() {
  socket.emit('remove all');
}

socket.on('update players', function(msg) {
  $('#users').text('');
  $('#tas').text('There ' + (msg.numTAs == 1 ? 'is' : 'are') + ' currently ' + msg.numTAs + ' TA' + (msg.numTAs == 1 ? '' : 's') + ' on duty.')
  $('#students').text('There ' + (msg.numUsers == 1 ? 'is' : 'are') + ' currently ' + msg.numUsers + ' student' + (msg.numUsers == 1 ? '' : 's') + ' in the queue.')
  if (loggedIn) {
    $('#studentList').empty();
    for (var i = 0; i < msg.usernames.length; i++) {
      if (!msg.usernames[i].helped) {
        $('#studentList').append("<tr><td>" + msg.usernames[i].username + 
          "</td><td><button class='btn btn-default btn-lg' onclick='assist(" + i + ")'>Assist</button></td><td><button class='btn btn-default btn-lg' onclick='removeStudent(" + i + ")'>Remove</button></td></tr>");
      } else {
        $('#studentList').append("<tr><td>" + msg.usernames[i].username +
          "</td><td>Being Helped</td><td><button class='btn btn-default btn-lg' onclick='removeStudent(" + i + ")'>Remove</button></td></tr>");      
      }
    }
  }
});