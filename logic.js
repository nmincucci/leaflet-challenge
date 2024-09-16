// Initialize the map
var map = L.map('map').setView([37.7749, -122.4194], 5); // Center on the US

// Add a tile layer (base map)
var streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// URL for the earthquake dataset
const earthquakeDataUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Fetch the earthquake data
fetch(earthquakeDataUrl)
    .then(response => response.json())
    .then(data => {
        // Create a GeoJSON layer for the earthquakes
        var earthquakesLayer = L.geoJSON(data, {
            onEachFeature: function(feature, layer) {
                layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
            },
            pointToLayer: function(feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: getRadius(feature.properties.mag), // Adjust size based on magnitude
                    fillColor: getColor(feature.geometry.coordinates[2]), // Color based on depth
                    fillOpacity: 0.7,
                    stroke: false
                });
            }
        }).addTo(map);

        // Create a legend
        createLegend();
    })
    .catch(error => console.error('Error fetching the GeoJSON data:', error));

// Function to determine the radius based on magnitude
function getRadius(magnitude) {
    return magnitude * 2; // Adjust multiplier as needed
}

// Function to determine color based on depth
function getColor(depth) {
    return depth > 100 ? '#ff0000' :
           depth > 50  ? '#ff7f00' :
           depth > 20  ? '#ffff00' :
           depth > 0   ? '#7fff00' :
                         '#00ff00';
}

// Function to create a legend
function createLegend() {
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'legend');
        div.innerHTML += '<h4>Depth Legend</h4>';
        div.innerHTML += '<i style="background: #ff0000"></i><span> > 100 km</span><br>';
        div.innerHTML += '<i style="background: #ff7f00"></i><span> 50 - 100 km</span><br>';
        div.innerHTML += '<i style="background: #ffff00"></i><span> 20 - 50 km</span><br>';
        div.innerHTML += '<i style="background: #7fff00"></i><span> 0 - 20 km</span><br>';
        div.innerHTML += '<i style="background: #00ff00"></i><span> < 0 km</span><br>'; // Optional for negative depth
        return div;
    };

    legend.addTo(map);
}