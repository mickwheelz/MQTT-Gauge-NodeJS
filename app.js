/*

Simple NodeJS express server to recieve data from Serial port in JSON format,
and pass it to webpage to display on a dashboard.

Also handles power management and data entry of raspberry pi

M.Wheeler - March 2017

Dependancies;
serialport - npm install serialport
express - npm install express
ejs - npm install ejs

Execution:

node app.js *Serial Port* *http port*
e.g; node app.js /dev/ttyS0 8000

*/
//LIBRARIES
var http = require('http');
var express = require('express');
var SerialPort = require("serialport");
var childProcess = require('child_process');

//GLOBAL VARS
var serialPortName;
var serialBaudRate;
var httpPortNumber;
var port;
var serialDataBuffer;
var powerStatus;

//SETUP EXPRESS SERVER
var app = express();
app.get('env');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));

function getArgs() {
  var args = process.argv.slice(2);
  if(args.length == 3) {
    serialPortName = args[0];
    serialBaudRate = args[1];
    httpPortNumber = args[2];
    return true;
  }
  else {
    console.log("Please run the app with the following arguements: serialPort baudrate http port" );
    console.log("e.g node app.js /dev/ttyS0 115200 8000" );
    return false;
  }
}

function initServices() {
  console.log("Server Running! - Serial Port: " + serialPortName + " ,Baud Rate: " + serialBaudRate + " ,HTTP Port: " + httpPortNumber);
  //init serial port
  port = new SerialPort(serialPortName, {
    baudRate: Number(serialBaudRate),
    parser: SerialPort.parsers.readline('\r\n')
  });
  //init web server
  http.createServer(app).listen(httpPortNumber);
  // serve pages from root dir
  app.get('/', function(req, res) {
    res.render('index');
  });
  // serve json data from arduino
  app.get('/data', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(serialDataBuffer);
  });
}

function parseSerialData(data) {
    console.log('Recieved: ' + data);
    powerStatus = JSON.parse(data).bikeData.Power;
    serialDataBuffer = data;
  }

function powerManagement() {
  if(!powerStatus) {
    //childProcess.exec('shutdown now', console.log);
    console.log("Shutting Down RPI");
  }
}

//RUN THE APP
if(getArgs()) {
  //initalize services
  initServices();
  //event for data recieved from serial port
  port.on('data', function (data) {
    parseSerialData(data);
    powerManagement();
  });


}
