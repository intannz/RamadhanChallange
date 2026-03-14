document.addEventListener("DOMContentLoaded", () => {
    // fitur countdown
    const ramadhanStart = new Date("March 19, 2026")
    const today = new Date()

    const diffTime = today - ramadhanStart
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1

    const totalRamadhan = 30

    const countdownEl = document.getElementById("countdown")
    const titleEl = document.getElementById("countdown-title")

    if (diffDays < 1) {

        const before = Math.ceil((ramadhanStart - today) / (1000 * 60 * 60 * 24))
        titleEl.innerText = "Menuju Ramadhan"
        countdownEl.innerText = `Sisa ${before} hari lagi`

    } 
    else if (diffDays <= totalRamadhan) {

        const sisaHari = totalRamadhan - diffDays
        titleEl.innerText = "Ramadhan"

        countdownEl.innerText = `Hari ke-${diffDays} Ramadhan • ${sisaHari} hari lagi menuju Idul Fitri`

    } 
    else {

        titleEl.innerText = "Alhamdulillah"
        countdownEl.innerText = "Selamat Idul Fitri!"

    }

    // integrasi progres todolist.js
    const savedData = JSON.parse(localStorage.getItem('ramadhanTodo'));

    if (savedData) {
        // Shalat (25%)
        const shalatDone = savedData.shalat.filter(c => c).length;
        const shalatPct = (shalatDone / 5) * 100;

        // Dzikir (25%)
        const dzikirDone = savedData.dzikir.filter(c => c).length;
        const dzikirPct = (dzikirDone / 3) * 100;

        // Quran (25%)
        let qRead = savedData.quranRead || 0;
        let qTarget = savedData.quranTarget || 1;
        const quranPct = (Math.min(qRead, qTarget) / qTarget) * 100;

        // puasa (25%)
        const puasaPct = savedData.puasaToday ? 100 : 0;

        // total
        const totalProgress = Math.round((shalatPct + dzikirPct + quranPct + puasaPct) / 4);

        // update UI
        const progressText = document.getElementById("progress-text");
        const progressFill = document.getElementById("landing-progress-fill");

        if (progressText && progressFill) {
            progressText.innerText = `${totalProgress}%`;
            progressFill.style.width = `${totalProgress}%`;
        }
    }
});