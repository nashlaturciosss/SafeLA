async function initMap() {
    // Create the map centered at Los Angeles
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: { lat: 34.0522, lng: -118.2437 }, // Los Angeles center
    });

    // Fetch crime data from the backend
    const response = await fetch('/crime-data');
    const locations = await response.json();

    // Loop through locations to add markers
    locations.forEach(location => {
        const marker = new google.maps.Marker({
            position: { lat: location.latitude, lng: location.longitude },
            map: map,
        });

        // Add info window to display details when clicked
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div>
                    <strong>Crime Type:</strong> ${location.crime_type || 'Unknown'}<br>
                    <strong>Address:</strong> ${location.address || 'Unknown'}<br>
                    <strong>City:</strong> ${location.city || 'Unknown'}<br>
                    <strong>State:</strong> ${location.state || 'Unknown'}<br>
                    <strong>Report Time:</strong> ${location.report_time || 'Unknown'}
                </div>
            `,
        });

        // Show info window on marker click
        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });
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
        window.location.reload(); // Refresh the page to update the markers
    } else {
        alert('Error reporting crime. Please try again.');
    }
});

// Initialize the map when the page loads
window.onload = initMap;
