const VILLAGE = "หมู่บ้านพฤกษ์ลดา 3 ตำบลลาดสวาย อำเภอลำลูกกา จังหวัดปทุมธานี 12150";

// Anchors: 61/180=13.97557340,100.67394944  61/181=13.97556204,100.67385545
// Step per house: lng=+0.000093994 (~10.1m), lat=+0.000011362
// --- Coordinate Generation ---

// Helper function for linear interpolation
function interpolateCoordinates(startNum, endNum, startCoord, endCoord) {
    const coordinates = {};
    const numHouses = Math.abs(endNum - startNum);
    if (numHouses === 0) {
        coordinates[`61/${startNum}`] = startCoord;
        return coordinates;
    }

    const latStep = (endCoord.lat - startCoord.lat) / numHouses;
    const lngStep = (endCoord.lng - startCoord.lng) / numHouses;

    for (let i = 0; i <= numHouses; i++) {
        const currentNum = startNum < endNum ? startNum + i : startNum - i;
        const lat = startCoord.lat + (latStep * i);
        const lng = startCoord.lng + (lngStep * i);
        coordinates[`61/${currentNum}`] = { lat, lng };
    }
    return coordinates;
}

// Generate all coordinates based on anchor points
function generateAllCoordinates() {
    const anchorPoints = {
        "61/1": { lat: 13.975223407073297, lng: 100.6844212661014 },
        "61/15": { lat: 13.975604872404451, lng: 100.68286467868656 },
        "61/16": { lat: 13.975673222071347, lng: 100.68326104381724 },
        "61/46": { lat: 13.97591102613842, lng: 100.68223687270752 },
        "61/47": { lat: 13.97586438673665, lng: 100.6806041261245 },
        "61/63": { lat: 13.975959207710762, lng: 100.67889775972462 },
        "61/80": { lat: 13.975962871747324, lng: 100.67696127914469 },
        "61/117": { lat: 13.976040085843536, lng: 100.67308671958625 },
        "61/118": { lat: 13.976061761566964, lng: 100.67298657981546 },
        "61/154": { lat: 13.97575159218996, lng: 100.676939852697 },
        "61/155": { lat: 13.975473219269206, lng: 100.67694178682412 },
        "61/174": { lat: 13.975556632947127, lng: 100.67463774092636 },
        "61/183": { lat: 13.975565397044347, lng: 100.67352616594182 },
        "61/233": { lat: 13.97530292246387, lng: 100.67767738265299 },
        "61/234": { lat: 13.975559130446413, lng: 100.67788934488512 },
        "61/247": { lat: 13.975637562779024, lng: 100.67947201125963 },
        "61/248": { lat: 13.975645684091461, lng: 100.67968166716581 },
        "61/261": { lat: 13.975627917452021, lng: 100.6812225762573 },
        "61/262": { lat: 13.975381524642245, lng: 100.68121067779917 },
        "61/289": { lat: 13.975285716907926, lng: 100.67795962416803 },
        "61/291": { lat: 13.975309085542008, lng: 100.6784782720961 },
        "61/315": { lat: 13.975269298004882, lng: 100.68126332503321 },
    };

    const ranges = [
        // Main horizontal roads
        { start: 16, end: 46 }, { start: 47, end: 63 },
        { start: 80, end: 117 }, { start: 118, end: 154 },
        // Cul-de-sacs (sorted by visual location)
        { start: 1, end: 15 },
        { start: 248, end: 261 }, { start: 234, end: 247 },
        { start: 262, end: 289 }, { start: 291, end: 315 },
        { start: 155, end: 174 }, { start: 183, end: 233 },
    ];

    let allCoordinates = { ...anchorPoints };
    ranges.forEach(range => {
        const startNum = range.start;
        const endNum = range.end;
        const startCoord = anchorPoints[`61/${startNum}`];
        const endCoord = anchorPoints[`61/${endNum}`];

        if (startCoord && endCoord) {
            const interpolated = interpolateCoordinates(startNum, endNum, startCoord, endCoord);
            allCoordinates = { ...allCoordinates, ...interpolated };
        }
    });

    // Also add the user-verified coordinates that might be outside the ranges
    allCoordinates["61/175"] = { lat: 13.9756207050, lng: 100.6745632629 };
    allCoordinates["61/176"] = { lat: 13.9756112440, lng: 100.6744404993 };
    allCoordinates["61/177"] = { lat: 13.9756017831, lng: 100.6743177357 };
    allCoordinates["61/178"] = { lat: 13.9755923221, lng: 100.6741949720 };
    allCoordinates["61/179"] = { lat: 13.9755828612, lng: 100.6740722084 };
    allCoordinates["61/180"] = { lat: 13.975573400228946, lng: 100.67394944478055 };
    allCoordinates["61/181"] = { lat: 13.975562038208807, lng: 100.67385545064592 };
    allCoordinates["61/182"] = { lat: 13.9755544783, lng: 100.6737039175 };

    return allCoordinates;
}

const localCoordinates = generateAllCoordinates();

// --- End of Coordinate Generation ---

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