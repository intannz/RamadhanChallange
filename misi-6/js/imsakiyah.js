document.addEventListener("DOMContentLoaded", () => {
    const kotaSelect = document.getElementById("kota-select");
    const loadingState = document.getElementById("loading-state");
    const errorState = document.getElementById("error-state");
    const tableContainer = document.getElementById("table-container");
    const tbody = document.getElementById("jadwal-tbody");

    // get tanggal hari ini format YYYY-MM-DD
    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1);
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // fetch API
    const fetchJadwal = async (kotaId) => {
        // loading, sembunyikan error & tabel
        loadingState.style.display = "block";
        errorState.style.display = "none";
        tableContainer.style.display = "none";
        tbody.innerHTML = "";

        // ambil tahun dan bulan saat ini
        const date = new Date();
        const tahun = date.getFullYear();
        const bulan = String(date.getMonth() + 1);

        try {
            const response = await fetch(`https://api.myquran.com/v2/sholat/jadwal/${kotaId}/${tahun}/${bulan}`);
            
            if (!response.ok) throw new Error("Gagal melakukan request API");
            
            const result = await response.json();

            // validasi format respons API
            if (result.status && result.data && result.data.jadwal) {
                renderTable(result.data.jadwal);
            } else {
                throw new Error("Format data API tidak valid");
            }
        } catch (error) {
            console.error("Terjadi kesalahan:", error);
            errorState.style.display = "block";
        } finally {
            loadingState.style.display = "none";
        }
    };

    // render baris tabel
    const renderTable = (jadwalList) => {
        const todayStr = getTodayDate();
        
        jadwalList.forEach(item => {
            const tr = document.createElement("tr");
            
            // jika tanggal API sama dengan hari ini, tambah class highlight 
            if (item.date === todayStr) {
                tr.classList.add("row-hari-ini");
            }

            tr.innerHTML = `
                <td>${item.tanggal}</td>
                <td><strong>${item.imsak}</strong></td>
                <td>${item.subuh}</td>
                <td>${item.dzuhur}</td>
                <td>${item.ashar}</td>
                <td>${item.maghrib}</td>
                <td>${item.isya}</td>
            `;
            tbody.appendChild(tr);
        });

        tableContainer.style.display = "block";
        
        // quto-scroll halus ke baris hari ini
        setTimeout(() => {
            const highlightRow = document.querySelector('.row-hari-ini');
            if(highlightRow) {
                highlightRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 300);
    };

    // dropdown kota
    kotaSelect.addEventListener("change", (e) => {
        fetchJadwal(e.target.value);
    });

    // fetch otomatis saat halaman pertama kali dimuat
    fetchJadwal(kotaSelect.value);
});