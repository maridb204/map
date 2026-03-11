document.getElementById('addressForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const address = document.getElementById('address').value;

    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyDBqXGAc8L5hi8w5mjO9rE01cxEIM21bzw`, {
            method: 'GET',
        });

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