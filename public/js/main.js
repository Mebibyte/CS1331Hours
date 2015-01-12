var socket = io();

var myName = '';

$('form', '#join').submit(function(){
  myName = $('#name').val();
  prof = $('input[name=professor]:checked').val();
  console.log(prof);
  if (myName != '' && prof) {
    socket.emit('join queue', myName, prof);
  }
  return false;
});

function removeStudent(index) {
  console.log("removing");
  socket.emit('remove', index);
}

socket.on('update players', function(msg) {
  $('#users').text('');
  $('#tas').text('There ' + (msg.numTAs == 1 ? 'is' : 'are') + ' currently ' + msg.numTAs + ' TA' + (msg.numTAs == 1 ? '' : 's') + ' on duty.')
  $('#students').text('There ' + (msg.numUsers == 1 ? 'is' : 'are') + ' currently ' + msg.numUsers + ' student' + (msg.numUsers == 1 ? '' : 's') + ' in the queue.')
  var found = false
  for (var i = 0; i < msg.usernames.length; i++) {
    if (msg.usernames[i].username == myName) {
      $('#mySpot').html("You are currently at position " + i + " in the queue.<br>If you no longer need help, click here: <button class='btn btn-default btn-lg' onclick='removeStudent(" + i + ")'>Remove</button>");
      found = true;
    }
  }
  if (!found) {
    $('#mySpot').text("You are not currently in the queue.");
    $('#join').show();
  } else {
    $('#join').hide();
  }
});

socket.on('debug', function(msg) {
  console.log(msg);
});