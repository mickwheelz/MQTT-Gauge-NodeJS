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
    //showSpinner();

}

function gmapInit() {
  var myLatlng = new google.maps.LatLng(-34.397, 150.644)

  // Google Maps initialization
  var mapOptions = {
    center: myLatlng,
    zoom: 17,
    disableDefaultUI: true,
    styles: [
     {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
     {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
     {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
     {
       featureType: 'administrative.locality',
       elementType: 'labels.text.fill',
       stylers: [{color: '#d59563'}]
     },
     {
       featureType: 'poi',
       elementType: 'labels.text.fill',
       stylers: [{color: '#d59563'}]
     },
     {
       featureType: 'poi.park',
       elementType: 'geometry',
       stylers: [{color: '#263c3f'}]
     },
     {
       featureType: 'poi.park',
       elementType: 'labels.text.fill',
       stylers: [{color: '#6b9a76'}]
     },
     {
       featureType: 'road',
       elementType: 'geometry',
       stylers: [{color: '#38414e'}]
     },
     {
       featureType: 'road',
       elementType: 'geometry.stroke',
       stylers: [{color: '#212a37'}]
     },
     {
       featureType: 'road',
       elementType: 'labels.text.fill',
       stylers: [{color: '#9ca5b3'}]
     },
     {
       featureType: 'road.highway',
       elementType: 'geometry',
       stylers: [{color: '#746855'}]
     },
     {
       featureType: 'road.highway',
       elementType: 'geometry.stroke',
       stylers: [{color: '#1f2835'}]
     },
     {
       featureType: 'road.highway',
       elementType: 'labels.text.fill',
       stylers: [{color: '#f3d19c'}]
     },
     {
       featureType: 'transit',
       elementType: 'geometry',
       stylers: [{color: '#2f3948'}]
     },
     {
       featureType: 'transit.station',
       elementType: 'labels.text.fill',
       stylers: [{color: '#d59563'}]
     },
     {
       featureType: 'water',
       elementType: 'geometry',
       stylers: [{color: '#17263c'}]
     },
     {
       featureType: 'water',
       elementType: 'labels.text.fill',
       stylers: [{color: '#515c6d'}]
     },
     {
       featureType: 'water',
       elementType: 'labels.text.stroke',
       stylers: [{color: '#17263c'}]
     }
   ]
  };
  map = new google.maps.Map(document.getElementById("map-canvas"),
      mapOptions);

  var goldStar = {
           path: 'M0,50 A50,50,0 1 1 100,50 A50,50,0 1 1 0,50 Z',
           fillColor: 'lightblue',
           fillOpacity: 0.8,
           scale: 0.125,
           strokeColor: 'blue',
           strokeWeight: 1
         };
  marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      icon: goldStar
  });
}

function changeMarkerPosition(marker,lat,lng) {
    var latlng = new google.maps.LatLng(lat,lng);
    marker.setPosition(latlng);
    map.panTo(latlng);
    latLngToAddress(lat,lng);
}

function refreshGauges() {

    $.get('/data', function(res){
      mode = res.mode;
      status = res.status;
      time = res.time;

      rpm = res.bikeData.RPM;
      temp = res.bikeData.Temp;

      speed = res.gpsData.MPH;
      lat = res.gpsData.LAT;
      lng = res.gpsData.LNG;
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

function latLngToAddress (lat,lng) {

  $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?latlng='+ lat + ',' + lng, function(data) {
    console.log(data.results[0].formatted_address);
    $("#address").html(data.results[0].formatted_address);
  });

 }

// speed, 5, "speed", 18,23,27,0
function gaugeBarUpdate(value,factor,gauge,zone1,zone2,zone3,leadingZeros) {

  value = parseInt(value);

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

function showSpinner() {
  var opts = {
      lines: 13 // The number of lines to draw
    , length: 28 // The length of each line
    , width: 14 // The line thickness
    , radius: 42 // The radius of the inner circle
    , scale: 0.5 // Scales overall size of the spinner
    , corners: 1 // Corner roundness (0..1)
    , color: '#FFF' // #rgb or #rrggbb or array of colors
    , opacity: 0.25 // Opacity of the lines
    , rotate: 0 // The rotation offset
    , direction: 1 // 1: clockwise, -1: counterclockwise
    , speed: 1 // Rounds per second
    , trail: 60 // Afterglow percentage
    , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
    , zIndex: 2e9 // The z-index (defaults to 2000000000)
    , className: 'spinner' // The CSS class to assign to the spinner
    , top: '50%' // Top position relative to parent
    , left: '50%' // Left position relative to parent
    , shadow: false // Whether to render a shadow
    , hwaccel: false // Whether to use hardware acceleration
    , position: 'absolute' // Element positioning
  }
  var target = document.getElementById('spinner')
  var spinner = new Spinner(opts).spin(target);
}
