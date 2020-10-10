// To create our basic plot I need to define a query and then my base map with a center (I chose Chicago) and zoom level


// We can store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Define map

  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5
  });


// I chose the satellitemap as my base layer map and define it below.

  var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
  }).addTo(myMap);


// I created a plot_earthquake function that adds style, circlemarkers and popups to each element in my geoJson layer which is compiled through the Leaflet function L.geoJson

function plot_earthquake (data) {
    var earthquake = L.geoJSON(data, {
    
    style: function(feature) {
        // This sets the color interpolation for the various degrees of earthquake depth
         var depth_color = "";
          if (feature.geometry.coordinates[2] > 90 ) 
          { depth_color = "#FF3333"}
          else if (feature.geometry.coordinates[2] >= 70 ) 
          { depth_coler = "#FF7433"} 
          else if (feature.geometry.coordinates[2] >= 50 ) 
          { depth_color = "#FFB533"}
          else if (feature.geometry.coordinates[2] >= 30 ) 
          { depth_color = "#FFF633"}
          else if (feature.geometry.coordinates[2] >= 10 ) 
          { depth_color = "#A5FF33"}
          else if (feature.geometry.coordinates[2] >= -10 ) 
          { depth_color = "#33FF33" }
          else { depth_color = "#86FF33"};  
        
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

// This final code adds the individual coordinates to my layer group    
   myMap.addLayer(earthquake)
};


// Having defined my functions I perform a d3 query and then iterate through the features of the data set in the plot_earthquake function to create my earthquake layer. 

d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  for (var i = 0; i < data.features.length; i++) {
        plot_earthquake(data.features[i]) ;
}
});

   
// This getColor fuction is taken from the leaflet documentation and sorts out my html color interpolation scheme for the legend.

    
function getColor(d) {
    return d > 90 ? "#FF3333" :
           d >= 70  ? "#FF7433" :
           d >= 50  ? "#FFB533" :
           d >= 30  ? "#FFF633" :
           d >= 10   ? "#A5FF33" :
           d >= -10   ? "#33FF33" :
                      "#86FF33";
};


// Add Legend to map I used the leaflet documentation and this help to get my final code https://gis.stackexchange.com/questions/133630/adding-leaflet-legend

// This sets my legend position.
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 10, 30, 50, 70, 90],
        labels = [];

    // some earthquakes had an undetermined magnituted which showed up as black on my map so I added this legend entry to explain the black dots.    
    
    div.innerHTML += '<i style="background:' + "#000000" +'"></i> Unknown Magnitude<br>'
    
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);


  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Satellite Map": satellitemap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

// Finall I can add a layer control that puts my base and overlay maps into the final plot

L.control.layers(baseMaps, overlayMaps).addTo(myMap);