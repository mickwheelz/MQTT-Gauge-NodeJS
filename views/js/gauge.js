
var marker;
var rpm;
var speed;
var lat;
var lng;
var temp;
var mode;

function initialize() {
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

    $.get('/data/time', function(res){
      $("#clock").html(res);
    });

    $.get('/data/speed', function(res){
      speed = parseInt(res);
    });

    $.get('/data/rpm', function(res){
      rpm = parseInt(res);
    });

    $.get('/data/lat', function(res){
      lat = parseInt(res);
    });

    $.get('/data/lng', function(res){
      lng = parseInt(res);
    });

    $.get('/data/temp', function(res){
      temp = parseInt(res);
    });

    console.log("rpm:" + rpm + " speed: " + speed + " lat: " + lat + " long: " +  lng + " temp: " + temp + " mode: " + mode);

    if(mode == 2) {
      changeMarkerPosition(marker,lat, lng);
    }

    //MODE
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
    }
    if(mode == 3) {
      $("#panel3").css('display', 'block');
      //HIDE OTHERS
      $("#panel1").css('display', 'none');
      $("#panel2").css('display', 'none');
      $("#panel4").css('display', 'none');
    }


    //RPM
    var rpmSingle = parseInt(rpm/500) + 4; //other elemnents, fix this later
    $("#rpmDiv").html(rpm);
    $("#rpmDivlg").html(rpm);
    $("#rpmMapDiv").html(rpm);

    if(rpm > 13000) {
      $("body").css('background', '#ff0000');
    }
    if(rpm < 13000) {
      $("body").css('background', '#000000');
    }
    if(rpmSingle < 23) { // GREEN ZONE 0-10000RPM
      $( ".barTachInner:nth-child(-n+" + rpmSingle + ")" ).css('background', '#31f40e');
      $( ".barTachInner:nth-child(-n+" + rpmSingle + ")" ).css('box-shadow', '0px 0px 8px #25c109');

      $( ".barTachInner:nth-child(n+" + rpmSingle + ")" ).css('background', '#557750');
      $( ".barTachInner:nth-child(n+" + rpmSingle + ")" ).css('box-shadow', '0px 0px 8px #7f7f7f');

      $( ".barTachInner:nth-child(n+" + 23 + ")" ).css('background', '#777750');
      $( ".barTachInner:nth-child(n+" + 23 + ")" ).css('box-shadow', '0px 0px 8px #777750');

      $( ".barTachInner:nth-child(n+" + 27 + ")" ).css('background', '#775050');
      $( ".barTachInner:nth-child(n+" + 27 + ")" ).css('box-shadow', '0px 0px 8px #775050');

      //LG SPEED TACH
      $( ".barTachInnerlg:nth-child(-n+" + rpmSingle + ")" ).css('background', '#31f40e');
      $( ".barTachInnerlg:nth-child(-n+" + rpmSingle + ")" ).css('box-shadow', '0px 0px 8px #25c109');

      $( ".barTachInnerlg:nth-child(n+" + rpmSingle + ")" ).css('background', '#557750');
      $( ".barTachInnerlg:nth-child(n+" + rpmSingle + ")" ).css('box-shadow', '0px 0px 8px #7f7f7f');

      $( ".barTachInnerlg:nth-child(n+" + 23 + ")" ).css('background', '#777750');
      $( ".barTachInnerlg:nth-child(n+" + 23 + ")" ).css('box-shadow', '0px 0px 8px #777750');

      $( ".barTachInnerlg:nth-child(n+" + 27 + ")" ).css('background', '#775050');
      $( ".barTachInnerlg:nth-child(n+" + 27 + ")" ).css('box-shadow', '0px 0px 8px #775050');
    }

    if(rpmSingle >= 23 && rpmSingle < 27) { //YELLOW ZONE 10000-12000RPM
      $( ".barTachInner:nth-child(-n+" + rpmSingle + ")" ).css('background', '#ffff00');
      $( ".barTachInner:nth-child(-n+" + rpmSingle + ")" ).css('box-shadow', '0px 0px 8px #ffff00');
      // grey
      $( ".barTachInner:nth-child(n+" + rpmSingle + ")" ).css('background', '#777750');
      $( ".barTachInner:nth-child(n+" + rpmSingle + ")" ).css('box-shadow', '0px 0px 8px #777750');

      $( ".barTachInner:nth-child(n+" + 27 + ")" ).css('background', '#775050');
      $( ".barTachInner:nth-child(n+" + 27 + ")" ).css('box-shadow', '0px 0px 8px #775050');

      //LG SPEED TACH
      $( ".barTachInnerlg:nth-child(-n+" + rpmSingle + ")" ).css('background', '#ffff00');
      $( ".barTachInnerlg:nth-child(-n+" + rpmSingle + ")" ).css('box-shadow', '0px 0px 8px #ffff00');
      // grey
      $( ".barTachInnerlg:nth-child(n+" + rpmSingle + ")" ).css('background', '#777750');
      $( ".barTachInnerlg:nth-child(n+" + rpmSingle + ")" ).css('box-shadow', '0px 0px 8px #777750');

      $( ".barTachInnerlg:nth-child(n+" + 27 + ")" ).css('background', '#775050');
      $( ".barTachInnerlg:nth-child(n+" + 27 + ")" ).css('box-shadow', '0px 0px 8px #775050');
    }

    if(rpmSingle >= 27) { //RED ZONE 12000-14000RPM
      $( ".barTachInner:nth-child(-n+" + rpmSingle + ")" ).css('background', '#ff0000');
      $( ".barTachInner:nth-child(-n+" + rpmSingle + ")" ).css('box-shadow', '0px 0px 8px #ff0000');

      $( ".barTachInner:nth-child(n+" + rpmSingle + ")" ).css('background', '#775050');
      $( ".barTachInner:nth-child(n+" + rpmSingle + ")" ).css('box-shadow', '0px 0px 8px #775050');

      //LG SPEED
      $( ".barTachInnerlg:nth-child(-n+" + rpmSingle + ")" ).css('background', '#ff0000');
      $( ".barTachInnerlg:nth-child(-n+" + rpmSingle + ")" ).css('box-shadow', '0px 0px 8px #ff0000');

      $( ".barTachInnerlg:nth-child(n+" + rpmSingle + ")" ).css('background', '#775050');
      $( ".barTachInnerlg:nth-child(n+" + rpmSingle + ")" ).css('box-shadow', '0px 0px 8px #775050');
    }

    //SPEED
    var speedSingle = parseInt(speed/5) + 4; //other elemnents, fix this later
    $("#speedDiv").html(speed);
    var leadingZeroSpeed;
    if(speed < 10) {
      leadingZeroSpeed = "00" + speed;
    }
    if(speed < 100) {
      leadingZeroSpeed = "0" + speed;
    }
    else {
      leadingZeroSpeed = speed;
    }
    $("#lgSpeed").html(leadingZeroSpeed);
    $("#speedMapDiv").html(speed);

    if(speedSingle < 23) { // GREEN ZONE 0-70MPH
      $( ".barSpeedInner:nth-child(-n+" + speedSingle + ")" ).css('background', '#31f40e');
      $( ".barSpeedInner:nth-child(-n+" + speedSingle + ")" ).css('box-shadow', '0px 0px 8px #25c109');

      $( ".barSpeedInner:nth-child(n+" + speedSingle + ")" ).css('background', '#557750');
      $( ".barSpeedInner:nth-child(n+" + speedSingle + ")" ).css('box-shadow', '0px 0px 8px #7f7f7f');

      $( ".barSpeedInner:nth-child(n+" + 18 + ")" ).css('background', '#777750');
      $( ".barSpeedInner:nth-child(n+" + 18 + ")" ).css('box-shadow', '0px 0px 8px #777750');

      $( ".barSpeedInner:nth-child(n+" + 23 + ")" ).css('background', '#775050');
      $( ".barSpeedInner:nth-child(n+" + 23 + ")" ).css('box-shadow', '0px 0px 8px #775050');
    }

    if(rpmSingle >= 18 && rpmSingle < 23) { //YELLOW ZONE 70-100MPH
      $( ".barSpeedInner:nth-child(-n+" + speedSingle + ")" ).css('background', '#ffff00');
      $( ".barSpeedInner:nth-child(-n+" + speedSingle + ")" ).css('box-shadow', '0px 0px 8px #ffff00');

      $( ".barSpeedInner:nth-child(n+" + speedSingle + ")" ).css('background', '#777750');
      $( ".barSpeedInner:nth-child(n+" + speedSingle + ")" ).css('box-shadow', '0px 0px 8px #777750');

      $( ".barSpeedInner:nth-child(n+" + 27 + ")" ).css('background', '#775050');
      $( ".barSpeedInner:nth-child(n+" + 27 + ")" ).css('box-shadow', '0px 0px 8px #775050');
    }

    if(rpmSingle >= 23) { //RED ZONE 100-140MPH
      $( ".barSpeedInner:nth-child(-n+" + speedSingle + ")" ).css('background', '#ff0000');
      $( ".barSpeedInner:nth-child(-n+" + speedSingle + ")" ).css('box-shadow', '0px 0px 8px #ff0000');

      $( ".barSpeedInner:nth-child(n+" + speedSingle + ")" ).css('background', '#775050');
      $( ".barSpeedInner:nth-child(n+" + speedSingle + ")" ).css('box-shadow', '0px 0px 8px #775050');
    }

    console.log("rpmBar:" + rpmSingle + " speedBar: " + speedSingle );//+ "tempBar: " + newTemp + "/" + tempSingle );

  }

function init() {

    showSpinner();

    var rpmMarkCount = 0;
    var speedMarkCount = 0;
    for(count = 0; count < 28; count++){

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
  
function latLngToAddress (lat,lng) {

  $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?latlng='+ lat + ',' + lng, function(data) {
    console.log(data.results[0].formatted_address);
    $("#address").html(data.results[0].formatted_address);
  });

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

$(document).ready(function() {
  setInterval('refreshGauges()', 100);
});
