/*
  javascript to build and update the gauges based on incoming JSON data.
  gauges built entirely using CSS
*/
var marker;
var rpm;
var speed;
var lat;
var lng;
var temp;
var mode;
var status;
var time;

//gets ever 100ms. will change to event based
$(document).ready(function() {
  setInterval('refreshGauges()', 100);
});

function init() {

  var rpmMarkCount = 0;
  var speedMarkCount = 0;

  for(count = 0; count < 28; count++) {

    var rpmString = " ";
    rpmMarkCount++;
    if(rpmMarkCount == 4) {
      rpmString = (count+1)/2;
      rpmMarkCount = 0;
    }

    var speedString = " ";
    speedMarkCount++;
    if(speedMarkCount == 2) {
      speedString = (count+1)/2;
      speedMarkCount = 0;
    }

    $("#barTachMarker").append("<div class=\"barTachInnerMarker\">" + rpmString + "</div>");
    $("#barSpeedMarker").append("<div class=\"barSpeedInnerMarker\">" + speedString + "</div>");
    $("#barTempMarker").append("<div class=\"barTempInnerMarker\">" + rpmString + "</div>");
    $("#barTachMarkerlg").append("<div class=\"barTachInnerMarkerlg\">" + rpmString + "</div>");

    $("#barTach").append("<div class=\"barTachInner\">&nbsp;</div>");
    $("#barTachlg").append("<div class=\"barTachInnerlg\">&nbsp;</div>");
    $("#barSpeed").append("<div class=\"barSpeedInner\">&nbsp;</div>");
    $("#barTemp").append("<div class=\"barTempInner\">&nbsp;</div>");
  }
}

function refreshGauges() {

    $.get('/data', function(res){
      mode = res.mode;
      status = res.status;
      time = res.time;

      rpm = parseInt(res.bikeData.RPM);
      temp = parseInt(res.bikeData.Temp);

      speed = parseInt(res.gpsData.MPH);
      lat = res.gpsData.LAT;
      lng = res.gpsData.LNG;

      console.log(res);

     });


    console.log("rpm:" + rpm + " speed: " + speed + " lat: " + lat + " long: " +  lng + " temp: " + temp + " mode: " + mode);

    //MODE
    setMode();

    //SPEED
    gaugeBarUpdate(speed, 5,"Speed",18,23,27,0);
    //TEMP
    gaugeBarUpdate(temp, 5,"Temp",18,23,27,0);
    //RPM
    gaugeBarUpdate(rpm, 500,"Tach",18,23,27,0);
    //CLOCK
    setClock(time);
  }
  
function latLngToAddress (lat,lng) {

  $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?latlng='+ lat + ',' + lng, function(data) {
    console.log(data.results[0].formatted_address);
    $("#address").html(data.results[0].formatted_address);
  });

 }

function gaugeBarUpdate(value,factor,gauge,zone1,zone2,zone3,leadingZeros) {

  //value = parseInt(value);

  var valSingle = parseInt(value/factor) + 4; //other elemnents, fix this later
  var valLeadingZero;
  if(value < 10) {
    valLeadingZero = "00" + value;
  }
  if(value < 100) {
    valLeadingZero = "0" + value;
  }
  else {
    valLeadingZero = value;
  }
  $("#" + gauge + "Div").html(valLeadingZero);
  $("#" + gauge + "lgDiv").html(valLeadingZero);
  $("#" + gauge + "MapDiv").html(valLeadingZero);

  if(valSingle < zone2) { // GREEN ZONE 0-70MPH
    $( ".bar"+gauge+"Inner:nth-child(-n+" + valSingle + ")" ).css('background', '#31f40e');
    $( ".bar"+gauge+"Inner:nth-child(-n+" + valSingle + ")" ).css('box-shadow', '0px 0px 8px #25c109');

    $( ".bar"+gauge+"Inner:nth-child(n+" + valSingle + ")" ).css('background', '#557750');
    $( ".bar"+gauge+"Inner:nth-child(n+" + valSingle + ")" ).css('box-shadow', '0px 0px 8px #7f7f7f');

    $( ".bar"+gauge+"Inner:nth-child(n+" + zone1 + ")" ).css('background', '#777750');
    $( ".bar"+gauge+"Inner:nth-child(n+" + zone1 + ")" ).css('box-shadow', '0px 0px 8px #777750');

    $( ".bar"+gauge+"Inner:nth-child(n+" + zone2 + ")" ).css('background', '#775050');
    $( ".bar"+gauge+"Inner:nth-child(n+" + zone2 + ")" ).css('box-shadow', '0px 0px 8px #775050');
  }

  if(valSingle >= zone1 && valSingle < zone2) { //YELLOW ZONE 70-100MPH
    $( ".bar"+gauge+"Inner:nth-child(-n+" + valSingle + ")" ).css('background', '#ffff00');
    $( ".bar"+gauge+"Inner:nth-child(-n+" + valSingle + ")" ).css('box-shadow', '0px 0px 8px #ffff00');

    $( ".bar"+gauge+"Inner:nth-child(n+" + valSingle + ")" ).css('background', '#777750');
    $( ".bar"+gauge+"Inner:nth-child(n+" + valSingle + ")" ).css('box-shadow', '0px 0px 8px #777750');

    $( ".bar"+gauge+"Inner:nth-child(n+" + zone3 + ")" ).css('background', '#775050');
    $( ".bar"+gauge+"Inner:nth-child(n+" + zone3 + ")" ).css('box-shadow', '0px 0px 8px #775050');
  }

  if(valSingle >= zone2) { //RED ZONE 100-140MPH
    $( ".bar"+gauge+"Inner:nth-child(-n+" + valSingle + ")" ).css('background', '#ff0000');
    $( ".bar"+gauge+"Inner:nth-child(-n+" + valSingle + ")" ).css('box-shadow', '0px 0px 8px #ff0000');

    $( ".bar"+gauge+"Inner:nth-child(n+" + valSingle + ")" ).css('background', '#775050');
    $( ".bar"+gauge+"Inner:nth-child(n+" + valSingle + ")" ).css('box-shadow', '0px 0px 8px #775050');
  }

  }

function setMode(mode) {

  if(mode == 1) {
    $("#panel1").css('display', 'block');
    //HIDE OTHERS
    $("#panel2").css('display', 'none');
    $("#panel3").css('display', 'none');
    $("#panel4").css('display', 'none');
  }
  if(mode == 2) {
    $("#panel2").css('display', 'block');
    //HIDE OTHERS
    $("#panel1").css('display', 'none');
    $("#panel3").css('display', 'none');
    $("#panel4").css('display', 'none');
    changeMarkerPosition(marker,lat, lng);
  }
  if(mode == 3) {
    $("#panel3").css('display', 'block');
    //HIDE OTHERS
    $("#panel1").css('display', 'none');
    $("#panel2").css('display', 'none');
    $("#panel4").css('display', 'none');
  }
}

function setClock(time) {
  $("#clock").html(time);
}
