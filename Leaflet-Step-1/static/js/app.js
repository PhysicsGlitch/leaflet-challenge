// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Perform a GET request to the query URL


// Define map

  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5
  });


// app basic tilelayres 

  var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
  }).addTo(myMap);


function plot_earthquake (data) {
    var earthquake = L.geoJSON(data, {
    
    style: function(feature) {
        // This sets the color interpolation for the various degrees of earthquake depth
         var depth_color = "";
          if (feature.geometry.coordinates[2] > 90 ) 
          { depth_color = "#FF5733"}
          else if (feature.geometry.coordinates[2] >= 80 ) 
          { depth_coler = "#FF6B33"} 
          else if (feature.geometry.coordinates[2] >= 70 ) 
          { depth_color = "#FFDD33"}
          else if (feature.geometry.coordinates[2] >= 60 ) 
          { depth_color = "#F0FF33"}
          else if (feature.geometry.coordinates[2] >= 50 ) 
          { depth_color = "#D7FF33"}
          else if (feature.geometry.coordinates[2] >= 40 ) 
          { depth_color = "#CEFF33"}
          else if (feature.geometry.coordinates[2] >= 30 ) 
          { depth_color = "#BBFF33"}
          else if (feature.geometry.coordinates[2] >= 20 ) 
          { depth_color = "#93FF33"}
          else if (feature.geometry.coordinates[2] >= 10 ) 
          { depth_color = "#71FF33"}
          else if (feature.geometry.coordinates[2] > -15 ) 
          { depth_color = "#33FF52"};  
        
        
        return {
        color: depth_color
        };},
      
    pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, {
        radius: 2.5*feature.properties.mag, 
        fillOpacity: 0.85
        });
    },
      
    onEachFeature: function (feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
   "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }
  })

    
   myMap.addLayer(earthquake)
};

// Finalize our Plot

d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  for (var i = 0; i < data.features.length; i++) {
        plot_earthquake(data.features[i]) ;
}
});



  // Create our map, giving it the streetmap and earthquakes layers to display on load






