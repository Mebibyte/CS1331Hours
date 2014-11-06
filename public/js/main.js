var socket = io();

var myName = '';

$('form', '#join').submit(function(){
  myName = $('#name').val();
  if (myName != '') {
    socket.emit('join queue', myName);
    $('#join').hide();
  }
  return false;
});

socket.on('update players', function(msg) {
  $('#users').text('');
  $('#students').text('There ' + (msg.numUsers == 1 ? 'is' : 'are') + ' currently ' + msg.numUsers + ' student' + (msg.numUsers == 1 ? '' : 's') + ' in the queue.')
  var spot = 0;
  for (var key in msg.usernames) {
    if (msg.usernames[key].username == myName) {
      $('#mySpot').text("You are currently at position " + spot + " in the queue.");
    }
    spot++;
  }
});