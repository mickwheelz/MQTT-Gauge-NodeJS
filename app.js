var http = require('http');
var express = require('express');
var mqtt = require('mqtt')

var app = express();

var client  = mqtt.connect('mqtt://127.0.0.1')

app.get('env');
app.set('view engine', 'ejs');  //tell Express we're using EJS
app.use(express.static(__dirname + '/views'));

var mqttBuffer;

client.subscribe('presence')

client.on('message', function (topic, message) {
  mqttBuffer = message.toString().split("|");
  console.log(mqttBuffer);
})

//get some server data for sending it to the client
var currentSpeed = function() {
  if (typeof mqttBuffer == 'undefined') {
      return '0';
    }
    else {
      return mqttBuffer[0];
    }
}
var currentRPM = function() {
  if (typeof mqttBuffer == 'undefined'){
    return '0';
  }
  else {
    return mqttBuffer[1];
  }
}
var currentLat = function() {
  if (typeof mqttBuffer == 'undefined'){
    return '0';
  }
  else {
    return mqttBuffer[2];
  }
}
var currentLng = function() {
  if (typeof mqttBuffer == 'undefined'){
    return '0';
  }
  else {
    return mqttBuffer[3];
  }
}
var currentTemp = function() {
  if (typeof mqttBuffer == 'undefined'){
    return '0';
  }
  else {
    return mqttBuffer[4];
  }
}
var currentMode = function() {
  if (typeof mqttBuffer == 'undefined') {
    return '0';
  }
  else {
    return mqttBuffer[5];
  }
}


app.get('/', function(req, res) {
    //render index.ejs file
    res.render('index')//, {val: getData()});
});

app.get('/data/speed', function(req, res) {
    res.send(currentSpeed());
});

app.get('/data/rpm', function(req, res) {
    res.send(currentRPM());
});

app.get('/data/lat', function(req, res) {
    res.send(currentLat());
});

app.get('/data/lng', function(req, res) {
    res.send(currentLng());
});

app.get('/data/temp', function(req, res) {
    res.send(currentTemp());
});
app.get('/data/mode', function(req, res) {
    res.send(currentMode());
});

app.get('/data/mode', function(req, res) {
    res.send(currentMode());
});

app.get('/data/time', function(req, res) {
    var date = new Date();
    var time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    res.send(time);
});

http.createServer(app).listen(3000);
