var socket = io();
var loggedIn = false;
var chrisStudents = [];
var johnStudents = [];

$('form', '#join').submit(function(){
  var taName = $('#name').val();
  setCookie("name", taName, 1);
  var pass = $('#password').val();
  if (pass != null && taName != null) {
    socket.emit('ta login', taName, pass);
  }
});

socket.on('success', function() {
  loggedIn = true;
  setCookie("loggedIn", true, 1);
  $('#join').hide();
  $('#helpAStudent').show();
  socket.emit('update');
});

function helpChrisStudent() {
  if (chrisStudents.length > 0) {
    var student = chrisStudents.shift();
    $('#currentlyHelping').text('You are currently helping: ' + student[0]);
    socket.emit('remove', student[1]);
  }
}

function helpJohnStudent() {
  if (johnStudents.length > 0) {
    var student = johnStudents.shift();
    $('#currentlyHelping').text('You are currently helping: ' + student[0]);
    socket.emit('remove', student[1]);
  }
}

function removeStudent(index) {
  socket.emit('remove', index);
}

function removeAllStudents() {
  if (confirm("Are you sure? Press OK")) {
    socket.emit('remove all');
  }
}

$(document).ready(function() {
  loggedIn = getCookie("loggedIn");
  if (loggedIn) {
    socket.emit('ta login', getCookie("name"), 107);
  }
});

socket.on('update players', function(msg) {
  if (loggedIn) {
    $('#helpChrisStudent').prop("disabled", true);
    $('#helpChrisStudent').text("No Students");
    $('#helpJohnStudent').prop("disabled", true);
    $('#helpJohnStudent').text("No Students");
    johnStudents = [];
    chrisStudents = [];
    $('#users').text('');
    $('#tas').text('There ' + (msg.numTAs == 1 ? 'is' : 'are') + ' currently ' + msg.numTAs + ' TA' + (msg.numTAs == 1 ? '' : 's') + ' on duty.')
    $('#students').text('There ' + (msg.numUsers == 1 ? 'is' : 'are') + ' currently ' + msg.numUsers + ' student' + (msg.numUsers == 1 ? '' : 's') + ' in the queue.')

    $('#studentList').empty();

    for (var i = 0; i < msg.usernames.length; i++) {
      $('#studentList').append("<tr><td>" + msg.usernames[i].username + 
        "</td><td>" + msg.usernames[i].professor + "</td><td><button class='btn btn-default btn-lg' onclick='removeStudent(" + i + ")'>Remove</button></td></tr>");
      if (msg.usernames[i].professor == "chris") {
        chrisStudents.push([msg.usernames[i].username, i]);
        $('#helpChrisStudent').prop("disabled", false);
        $('#helpJohnStudent').text("Help a Student");
      } else if (msg.usernames[i].professor == "john") {
        johnStudents.push([msg.usernames[i].username, i]);
        $('#helpJohnStudent').prop("disabled", false);
        $('#helpJohnStudent').text("Help a Student");
      }
    }

    if (msg.usernames.length > 0) {
      $('#removeAllButton').prop("disabled", false);
    } else {
      $('#removeAllButton').prop("disabled", true);
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
