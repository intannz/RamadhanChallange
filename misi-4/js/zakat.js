document.addEventListener("DOMContentLoaded", () => {
    const jenisZakat = document.getElementById("jenis-zakat");
    const formPenghasilan = document.getElementById("form-penghasilan");
    const formEmas = document.getElementById("form-emas");
    
    const btnHitung = document.getElementById("btn-hitung");
    const btnReset = document.getElementById("btn-reset");
    
    const inputHargaEmas = document.getElementById("harga-emas");
    const inputGaji = document.getElementById("gaji");
    const inputPenghasilanLain = document.getElementById("penghasilan-lain");
    const inputJumlahEmas = document.getElementById("jumlah-emas");
    
    const resTotal = document.getElementById("res-total");
    const resStatus = document.getElementById("res-status");
    const resZakat = document.getElementById("res-zakat");
    
    const labelNisabTahunan = document.getElementById("label-nisab-tahunan");
    const resNisabTahunan = document.getElementById("res-nisab-tahunan");
    const rowNisabBulanan = document.getElementById("row-nisab-bulanan");
    const resNisabBulanan = document.getElementById("res-nisab-bulanan");

    // auto format rupiah
    const formatInputs = document.querySelectorAll('.format-rupiah');
    
    formatInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = this.value.replace(/[^0-9]/g, '');
            if (value !== '') {
                this.value = new Intl.NumberFormat('id-ID').format(value);
            } else {
                this.value = '';
            }
        });
    });

    const parseNumber = (str) => {
        if (!str) return 0;
        return parseFloat(str.replace(/\./g, '')) || 0;
    };

    const formatRupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(number);
    };

    const updateStatus = (text, type) => {
        resStatus.textContent = text;
        resStatus.className = `badge-status status-${type}`;
    };

    const resetOutput = () => {
        resTotal.innerText = "Rp 0";
        resNisabTahunan.innerText = "Rp 0";
        resNisabBulanan.innerText = "Rp 0";
        resZakat.innerText = "Rp 0";
        labelNisabTahunan.textContent = "Nilai Nisab (85 Gram Emas):";
        rowNisabBulanan.style.display = "none";
        updateStatus("Belum Dihitung", "abu");
    };

    // toggle form
    jenisZakat.addEventListener("change", (e) => {
        if (e.target.value === "penghasilan") {
            formPenghasilan.style.display = "block";
            formEmas.style.display = "none";
        } else {
            formPenghasilan.style.display = "none";
            formEmas.style.display = "block";
        }
        resetOutput();
    });

    // kalkulasi
    btnHitung.addEventListener("click", () => {
        const hargaEmas = parseNumber(inputHargaEmas.value);
        const tipeZakat = jenisZakat.value;

        if (hargaEmas <= 0) {
            updateStatus("Data Tidak Valid", "merah");
            alert("Mohon masukkan harga emas saat ini.");
            return;
        }

        // perhitungan nisab
        const nisabTahunan = hargaEmas * 85;
        const nisabBulanan = nisabTahunan / 12;
        
        let nisabYangDigunakan = 0;
        let totalHarta = 0;
        let nominalZakat = 0;

        // cetak nisab tahunan
        resNisabTahunan.innerText = formatRupiah(nisabTahunan);

        if (tipeZakat === "penghasilan") {
            const gaji = parseNumber(inputGaji.value);
            const lain = parseNumber(inputPenghasilanLain.value);
            
            if (gaji === 0 && lain === 0) {
                updateStatus("Form Kosong", "merah");
                return;
            }
            
            totalHarta = gaji + lain;
            nisabYangDigunakan = nisabBulanan;
            
            // penyesuaian UI zakat penghasilan
            labelNisabTahunan.textContent = "Nilai Nisab Tahunan (85 Gram):";
            rowNisabBulanan.style.display = "flex";
            resNisabBulanan.innerText = formatRupiah(nisabBulanan);

        } else if (tipeZakat === "emas") {
            const gramEmas = parseNumber(inputJumlahEmas.value);
            
            if (gramEmas <= 0) {
                updateStatus("Form Kosong", "merah");
                return;
            }
            
            totalHarta = gramEmas * hargaEmas;
            nisabYangDigunakan = nisabTahunan;
            
            // penyesuaian UI zakat emas
            labelNisabTahunan.textContent = "Nilai Nisab (85 Gram Emas):";
            rowNisabBulanan.style.display = "none";
        }

        // untuk menentukan wajib zakat atau tidak
        if (totalHarta >= nisabYangDigunakan) {
            nominalZakat = totalHarta * 0.025;
            updateStatus("Wajib Zakat", "hijau");
        } else {
            nominalZakat = 0;
            updateStatus("Belum Mencapai Nisab", "abu");
        }

        // cetak output akhir
        resTotal.innerText = formatRupiah(totalHarta);
        resZakat.innerText = `Rp ${new Intl.NumberFormat('id-ID').format(nominalZakat)}`;
    });

    // reset form
    btnReset.addEventListener("click", () => {
        inputHargaEmas.value = "";
        inputGaji.value = "";
        inputPenghasilanLain.value = "";
        inputJumlahEmas.value = "";
        resetOutput();
    });
});