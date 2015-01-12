var socket = io();
var loggedIn = false;

$('form', '#join').submit(function(){
  var taName = $('#name').val();
  setCookie("name", taName, 1);
  var pass = $('#password').val();
  if (pass != null && taName != null) {
    socket.emit('ta login', taName, pass);
  }
  return false;
});

socket.on('success', function() {
  loggedIn = true;
  setCookie("loggedIn", true, 1);
  $('#join').hide();
  $('#removeAllButton').show();
  socket.emit('update');
});

function removeStudent(index) {
  socket.emit('remove', index);
}

function removeAllStudents() {
  socket.emit('remove all');
}

$(document).ready(function() {
  loggedIn = getCookie("loggedIn");
  if (loggedIn) {
    socket.emit('ta login', getCookie("name"), 107);
  }
});

socket.on('update players', function(msg) {
  $('#users').text('');
  $('#tas').text('There ' + (msg.numTAs == 1 ? 'is' : 'are') + ' currently ' + msg.numTAs + ' TA' + (msg.numTAs == 1 ? '' : 's') + ' on duty.')
  $('#students').text('There ' + (msg.numUsers == 1 ? 'is' : 'are') + ' currently ' + msg.numUsers + ' student' + (msg.numUsers == 1 ? '' : 's') + ' in the queue.')
  if (loggedIn) {
    $('#studentList').empty();
    for (var i = 0; i < msg.usernames.length; i++) {
      $('#studentList').append("<tr><td>" + msg.usernames[i].username + 
        "</td><td>" + msg.usernames[i].professor + "</td><td><button class='btn btn-default btn-lg' onclick='removeStudent(" + i + ")'>Remove</button></td></tr>");
    }
  }
});

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
    }
    return "";
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}
