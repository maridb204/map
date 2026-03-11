const localCoordinates = {
    "61/1-15": { lat: 13.912345, lng: 100.123456 },
    "61/16-46": { lat: 13.912567, lng: 100.123678 },
    "61/47-79": { lat: 13.912789, lng: 100.123890 },
    "61/80-154": { lat: 13.913012, lng: 100.124123 },
    "61/155-233": { lat: 13.913234, lng: 100.124345 },
    "61/234-261": { lat: 13.913456, lng: 100.124567 },
    "61/262-315": { lat: 13.913678, lng: 100.124789 }
};

document.getElementById('addressForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const address = document.getElementById('address').value.trim();

    // Check if the address exists in the localCoordinates
    if (localCoordinates[address]) {
        const location = localCoordinates[address];
        const mapUrl = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
        document.getElementById('result').innerHTML = `<a href="${mapUrl}" target="_blank">เปิด Google Maps</a>`;
        return;
    }

    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyDBqXGAc8L5hi8w5mjO9rE01cxEIM21bzw`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        if (!data.results || data.results.length === 0) {
            console.error('No results found:', data);
            document.getElementById('result').textContent = 'ไม่พบที่อยู่ใน Google Maps';
        } else {
            console.log('Location found:', data.results[0].geometry.location);
            const location = data.results[0].geometry.location;
            const mapUrl = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
            document.getElementById('result').innerHTML = `<a href="${mapUrl}" target="_blank">เปิด Google Maps</a>`;
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('result').textContent = 'เกิดข้อผิดพลาดในการเชื่อมต่อกับ Google Maps API';
    }
});