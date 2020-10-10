// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
 

// app basic tilelayres 

  var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

var earthquakes = L.layerGroup();

function plot_layer (data, layer_group) {
    var layer_item = L.geoJSON(data, {
    
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

    
   layer_group.addLayer(layer_item);
};




d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  for (var i = 0; i < data.features.length; i++) {
        plot_layer(data.features[i], earthquakes) ;
}
});




var tectonic_plates = L.layerGroup();

var plates_query = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json"

d3.json(plates_query, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  for (var i = 0; i < data.features.length; i++) {
        plot_layer(data.features[i], tectonic_plates) ;
}
});

   
 var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
      layers: [satellitemap, earthquakes]
  });


    
function getColor(d) {
    return d > 90 ? "#FF3333" :
           d >= 70  ? "#FF7433" :
           d >= 50  ? "#FFB533" :
           d >= 30  ? "#FFF633" :
           d >= 10   ? "#A5FF33" :
           d >= -10   ? "#33FF33" :
                      "#86FF33";
}
// Add Legend to map https://gis.stackexchange.com/questions/133630/adding-leaflet-legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 10, 30, 50, 70, 90],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);
// Finally we can perform a d3.json call that runs each feature through the plot_earthquake function

  // Define a baseMaps object to hold our base layers


 var baseMaps = {
    "Satellite Map": satellitemap,
     "Dark Map": darkmap,
     "Street Map": streetmap
  };

    //Define overlay maps

var overlayMaps = {
  "Earthquakes": earthquakes,
    "Tectonic Plates": tectonic_plates
 };

L.control.layers(overlayMaps, baseMaps).addTo(myMap);






