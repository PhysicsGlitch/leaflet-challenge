// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +
  "2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";


// Define map

  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5
  });

var earthquakeData = {
"type": "FeatureCollection",                                                                          
"features": [
{"type":"Feature","properties":{"mag":0.56,"place":"5km WNW of Cobb, CA","time":1602082251250,"updated":1602082349815,"tz":null,"url":"https://earthquake.usgs.gov/earthquakes/eventpage/nc73467841","detail":"https://earthquake.usgs.gov/earthquakes/feed/v1.0/detail/nc73467841.geojson","felt":null,"cdi":null,"mmi":null,"alert":null,"status":"automatic","tsunami":0,"sig":5,"net":"nc","code":"73467841","ids":",nc73467841,","sources":",nc,","types":",nearby-cities,origin,phase-data,","nst":8,"dmin":0.00599,"rms":0.01,"gap":118,"magType":"md","type":"earthquake","title":"M 0.6 - 5km WNW of Cobb, CA"},"geometry":{"type":"Point","coordinates":[-122.7785034,38.836834,2.15]},"id":"nc73467841"}
]
};
// app basic tilelayres 

  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });





var earthquakes = L.geoJSON(earthquakeData, {
         
      
      style: function(feature) {
        return {
        color: "green"
        };
    },
      
    pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, {
        radius: 10, 
        fillOpacity: 0.85
        });
    },
      
    onEachFeature: function (feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
   "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }
  });


  // Create our map, giving it the streetmap and earthquakes layers to display on load

myMap.addLayer(earthquakes);




