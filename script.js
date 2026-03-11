document.getElementById('addressForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const address = document.getElementById('address').value;

    try {
        const response = await fetch('https://maps.googleapis.com/maps/api/geocode/json', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address, key: 'AIzaSyDBqXGAc8L5hi8w5mjO9rE01cxEIM21bzw' }),
        });

        const data = await response.json();
        const location = data.results[0]?.geometry?.location;

        if (location) {
            const mapUrl = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
            document.getElementById('result').innerHTML = `<a href="${mapUrl}" target="_blank">เปิด Google Maps</a>`;
        } else {
            document.getElementById('result').textContent = 'ไม่พบที่อยู่ใน Google Maps';
        }
    } catch (error) {
        document.getElementById('result').textContent = 'เกิดข้อผิดพลาดในการเชื่อมต่อกับ Google Maps API';
    }
});