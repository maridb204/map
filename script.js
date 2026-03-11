const VILLAGE = "หมู่บ้านพฤกษ์ลดา 3 ตำบลลาดสวาย อำเภอลำลูกกา จังหวัดปทุมธานี 12150";

// Anchors: 61/180=13.97557340,100.67394944  61/181=13.97556204,100.67385545
// Step per house: lng=+0.000093994 (~10.1m), lat=+0.000011362
const localCoordinates = {
    // Accurate coordinates confirmed by user
    "61/175": { lat: 13.9756207050, lng: 100.6745632629 },
    "61/176": { lat: 13.9756112440, lng: 100.6744404993 },
    "61/177": { lat: 13.9756017831, lng: 100.6743177357 },
    "61/178": { lat: 13.9755923221, lng: 100.6741949720 },
    "61/179": { lat: 13.9755828612, lng: 100.6740722084 },
    "61/180": { lat: 13.975573400228946, lng: 100.67394944478055 },
    "61/181": { lat: 13.975562038208807, lng: 100.67385545064592 },
    "61/182": { lat: 13.9755544783, lng: 100.6737039175 },
};

document.getElementById("addressForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const houseNumber = document.getElementById("address").value.trim();
    const resultEl = document.getElementById("result");
    if (!houseNumber) {
        resultEl.textContent = "กรุณากรอกบ้านเลขที่";
        return;
    }

    // 1. Check local coordinates first
    if (localCoordinates[houseNumber]) {
        const loc = localCoordinates[houseNumber];
        const mapUrl = `https://www.google.com/maps?q=${loc.lat},${loc.lng}`;
        resultEl.innerHTML = `<p>บ้านเลขที่: <strong>${houseNumber}</strong> (จากฐานข้อมูล)</p><a href="${mapUrl}" target="_blank">📍 เปิด Google Maps</a>`;
        return;
    }

    // 2. If not found, fallback to OpenStreetMap (Nominatim) API
    resultEl.textContent = "กำลังค้นหาพิกัด...";
    const fullAddress = `${VILLAGE} ${houseNumber}`;
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&countrycodes=th&limit=1`;

    try {
        const response = await fetch(nominatimUrl, {
            headers: {
                'Accept': 'application/json'
            }
        });
        const data = await response.json();

        if (data && data.length > 0) {
            const loc = data[0];
            const mapUrl = `https://www.google.com/maps?q=${loc.lat},${loc.lon}`;
            resultEl.innerHTML = `<p>บ้านเลขที่: <strong>${houseNumber}</strong> (ค้นหาออนไลน์)</p><a href="${mapUrl}" target="_blank">📍 เปิด Google Maps</a>`;
        } else {
            // 3. If OpenStreetMap fails, fallback to Google's own text search as a last resort
            const googleSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
            resultEl.innerHTML = `<p>ไม่พบพิกัดที่แม่นยำสำหรับ <strong>${houseNumber}</strong><br>ลองค้นหาโดยตรงบน Google Maps:</p><a href="${googleSearchUrl}" target="_blank">📍 ค้นหาด้วยชื่อที่อยู่</a>`;
        }
    } catch (error) {
        console.error("Error fetching from Nominatim:", error);
        resultEl.textContent = "เกิดข้อผิดพลาดในการค้นหา";
    }
});