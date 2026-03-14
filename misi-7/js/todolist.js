document.addEventListener("DOMContentLoaded", () => {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.todo-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(btn.dataset.target).classList.add('active');
        });
    });

    // elements
    const mainProgressCircle = document.getElementById('main-progress-circle');
    const mainProgressText = document.getElementById('main-progress-text');
    const motivationStatus = document.getElementById('motivation-status');
    const streakDisplay = document.getElementById('streak-display');
    const btnSimpan = document.getElementById('btn-simpan-todo');

    // inputs
    const shalatChecks = document.querySelectorAll('.shalat-check');
    const dzikirChecks = document.querySelectorAll('.dzikir-check');
    const quranTarget = document.getElementById('quran-target');
    const quranRead = document.getElementById('quran-read');
    const quranBar = document.getElementById('quran-bar');
    const quranStatusText = document.getElementById('quran-status-text');
    const btnQuranDone = document.getElementById('btn-quran-done');
    const puasaTodayCheck = document.getElementById('puasa-today-check');
    const puasaCalendar = document.getElementById('puasa-calendar');

    const hariRamadhanText = document.getElementById('hari-ramadhan-text');
    const puasaBar = document.getElementById('puasa-bar');
    const puasaStatusText = document.getElementById('puasa-status-text');

    const startRamadhan = new Date("2026-02-19");
    const today = new Date();
    const diffTime = today - startRamadhan;
    let hariKe = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // Batasi hari 1-30
    if (hariKe < 1) hariKe = 1;
    if (hariKe > 30) hariKe = 30;
    const currentDayIdx = hariKe - 1;

    // load data
    let todoData = JSON.parse(localStorage.getItem('ramadhanTodo')) || {
        shalat: [false, false, false, false, false],
        dzikir: [false, false, false],
        quranTarget: 20,
        quranRead: 0,
        puasaToday: false,
        puasaHistory: Array(30).fill(false),
        streak: 0,
        lastSaved: null
    };

    function initUI() {
        const todayStr = new Date().toDateString();
        if (todoData.lastSaved !== todayStr) {
            todoData.puasaToday = false;
            todoData.shalat = [false, false, false, false, false];
            todoData.dzikir = [false, false, false];
            todoData.quranRead = 0;
        }

        shalatChecks.forEach((chk, i) => chk.checked = todoData.shalat[i]);
        dzikirChecks.forEach((chk, i) => chk.checked = todoData.dzikir[i]);
        quranTarget.value = todoData.quranTarget;
        quranRead.value = todoData.quranRead;
        puasaTodayCheck.checked = todoData.puasaToday;
        streakDisplay.innerText = `🔥 ${todoData.streak} Hari`;

        // render kalender
        puasaCalendar.innerHTML = '';
        todoData.puasaHistory.forEach((done, i) => {
            const dayDiv = document.createElement('div');
            dayDiv.className = `cal-day ${done ? 'done' : ''} ${i === currentDayIdx ? 'today' : ''}`;
            dayDiv.innerHTML = done ? '✔' : (i + 1);
            puasaCalendar.appendChild(dayDiv);
        });

        calculateProgress();
    }

    function calculateProgress() {
        // shalat (25%)
        const shalatDone = Array.from(shalatChecks).filter(c => c.checked).length;
        const shalatPct = (shalatDone / 5) * 100;

        // dzikir (25%)
        const dzikirDone = Array.from(dzikirChecks).filter(c => c.checked).length;
        const dzikirPct = (dzikirDone / 3) * 100;

        // Quran (25%)
        let qTarget = parseInt(quranTarget.value) || 1;
        let qRead = parseInt(quranRead.value) || 0;
        if (qRead > qTarget) qRead = qTarget;
        const quranPct = (qRead / qTarget) * 100;
        
        quranBar.style.width = `${quranPct}%`;
        quranStatusText.innerText = `${Math.round(quranPct)}% - ${quranPct === 100 ? 'Target Tercapai!' : quranPct >= 50 ? 'Hampir selesai!' : 'Masih bisa ditambah'}`;

        // puasa (25%)
        // Update Text Hari
        hariRamadhanText.innerText = `Hari ke-${hariKe} Ramadhan`;

        // Update Progress Puasa
        const puasaPct = puasaTodayCheck.checked ? 100 : 0;
        let puasaSelesai = todoData.puasaHistory.filter(d => d).length;
        
        // Visualisasi realtime: kalau centang puasa hari ini, bar bertambah
        if (puasaTodayCheck.checked && !todoData.puasaHistory[currentDayIdx]) {
            puasaSelesai += 1;
        }

        puasaBar.style.width = `${(puasaSelesai / 30) * 100}%`;
        puasaStatusText.innerText = `${puasaSelesai} / 30 Hari Puasa`;

        // total
        const totalProgress = Math.round((shalatPct + dzikirPct + quranPct + puasaPct) / 4);
        
        // circle
        mainProgressText.innerText = `${totalProgress}%`;
        mainProgressCircle.style.background = `conic-gradient(#069786 ${totalProgress}%, #e0e0e0 ${totalProgress}%)`;

        // motivation status
        motivationStatus.className = 'status-badge';
        if (totalProgress === 0) {
            motivationStatus.innerText = "Mulai ibadah hari ini bismillah!";
            motivationStatus.classList.add('status-abu');
        } else if (totalProgress < 40) {
            motivationStatus.innerText = "Belum optimal, ayo semangat!";
            motivationStatus.classList.add('status-merah');
        } else if (totalProgress < 80) {
            motivationStatus.innerText = "Cukup baik! Lanjutkan!";
            motivationStatus.style.backgroundColor = "#f1c40f";
            motivationStatus.style.color = "#fff";
        } else if (totalProgress < 100) {
            motivationStatus.innerText = "Hampir lengkap! Sedikit lagi!";
            motivationStatus.classList.add('status-hijau');
        } else {
            motivationStatus.innerText = "MasyaAllah! Semua ibadah lengkap!";
            motivationStatus.classList.add('status-hijau');
        }

        return totalProgress;
    }

    // kalkulasi realtime
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', calculateProgress);
        input.addEventListener('change', calculateProgress);
    });

    btnQuranDone.addEventListener('click', () => {
        quranRead.value = quranTarget.value;
        calculateProgress();
    });

    // Save
    btnSimpan.addEventListener('click', () => {
        const todayStr = new Date().toDateString();
        const progress = calculateProgress();

        // Update data harian
        todoData.shalat = Array.from(shalatChecks).map(c => c.checked);
        todoData.dzikir = Array.from(dzikirChecks).map(c => c.checked);
        todoData.quranRead = parseInt(quranRead.value);
        todoData.puasaToday = puasaTodayCheck.checked;

        // Update history di indeks yang benar (hari ke-24 = index 23)
        if (todoData.puasaToday) {
            todoData.puasaHistory[currentDayIdx] = true;
        }

        // Logika Streak (hanya bertambah sekali sehari)
        if (todoData.lastSaved !== todayStr) {
            if (progress >= 50) todoData.streak += 1;
            else todoData.streak = 0;
            todoData.lastSaved = todayStr;
        }

        localStorage.setItem('ramadhanTodo', JSON.stringify(todoData));
        initUI();

        // confetti if 100%
        if (progress === 100) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#069786', '#d4af37', '#ff7a00']
            });
        }

        const originalText = btnSimpan.innerText;
        btnSimpan.innerText = "Tersimpan!";
        btnSimpan.style.backgroundColor = "#2ecc71";
        setTimeout(() => {
            btnSimpan.innerText = originalText;
            btnSimpan.style.backgroundColor = "";
        }, 2000);
    });

    initUI();
});