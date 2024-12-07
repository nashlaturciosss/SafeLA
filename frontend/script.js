async function initMap() {
    // Create the map centered at Los Angeles
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: { lat: 34.0522, lng: -118.2437 }, // Los Angeles center
    });

    // Fetch crime data from the backend
    const response = await fetch('/crime-data');
    const locations = await response.json();

    // Convert locations to Google Maps LatLng objects
    const heatmapData = locations.map(location => new google.maps.LatLng(location.lat, location.lng));

    // Create and display the heatmap
    new google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        map: map,
    });
}

// Handle form submission for reporting a crime
document.getElementById('crimeForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const crimeData = {
        address: formData.get('address'),
        city: formData.get('city'),
        state: formData.get('state'),
        report_time: formData.get('report_time'),
        crime_type: formData.get('crime_type'),
        latitude: parseFloat(formData.get('latitude')),
        longitude: parseFloat(formData.get('longitude')),
    };

    // Send crime report to the backend
    const response = await fetch('/report-crime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(crimeData),
    });

    if (response.ok) {
        alert('Crime reported successfully');
        window.location.reload(); // Refresh the page to update the heatmap
    } else {
        alert('Error reporting crime. Please try again.');
    }
});

// Initialize the map when the page loads
window.onload = initMap;
