const VILLAGE = "หมู่บ้านพฤกษ์ลดา 3 ตำบลลาดสวาย อำเภอลำลูกกา จังหวัดปทุมธานี 12150";

const localCoordinates = {
    "61/181": { lat: 13.975571320199736, lng: 100.67386432980723 },
};

document.getElementById("addressForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const houseNumber = document.getElementById("address").value.trim();
    const resultEl = document.getElementById("result");

    if (!houseNumber) {
        resultEl.textContent = "กรุณากรอกบ้านเลขที่";
        return;
    }

    if (localCoordinates[houseNumber]) {
        const loc = localCoordinates[houseNumber];
        const mapUrl = `https://www.google.com/maps?q=${loc.lat},${loc.lng}`;
        resultEl.innerHTML = `<p>บ้านเลขที่: <strong>${houseNumber}</strong></p><a href="${mapUrl}" target="_blank">เปิด Google Maps</a>`;
        return;
    }

    const fullAddress = `${houseNumber} ${VILLAGE}`;
    const mapUrl = `https://www.google.com/maps/search/${encodeURIComponent(fullAddress)}`;
    resultEl.innerHTML = `<p>บ้านเลขที่: <strong>${houseNumber}</strong></p><a href="${mapUrl}" target="_blank">เปิด Google Maps</a><p style="color:orange">ยังไม่มีพิกัดแม่นยำ ระบบใช้การค้นหาแทน</p>`;
});
