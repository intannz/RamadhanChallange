document.addEventListener("DOMContentLoaded", () => {
    // fitur countdown
    const ramadhanDate = new Date("March 22, 2026").getTime();
    const today = new Date().getTime();
    const gap = ramadhanDate - today;

    const diffDays = Math.ceil(gap / (1000 * 60 * 60 * 24));
    const countdownEl = document.getElementById("countdown");
    const titleEl = document.getElementById("countdown-title");

    if (diffDays > 0) {
        countdownEl.innerText = `Sisa ${diffDays} Hari Lagi`;
    } else if (diffDays <= 0 && diffDays >= -30) {
        titleEl.innerText = "Alhamdulillah";
        countdownEl.innerText = `Hari ke-${Math.abs(diffDays) + 1} Ramadhan`;
    } else {
        countdownEl.innerText = "Selamat Idul Fitri!";
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