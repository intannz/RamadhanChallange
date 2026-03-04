document.addEventListener("DOMContentLoaded", () => {
    const countNumber = document.getElementById("count-number");
    const currentCountText = document.getElementById("current-count");
    const targetDisplay = document.getElementById("target-display");
    const targetSelect = document.getElementById("target");
    const btnAdd = document.getElementById("btn-add");
    const btnReset = document.getElementById("btn-reset");
    const badgeNotification = document.getElementById("badge-notification");

    let count = parseInt(localStorage.getItem("dzikirCount")) || 0;
    let target = parseInt(localStorage.getItem("dzikirTarget")) || 33;

    targetSelect.value = target;
    updateUI();

    // tambah dzikir
    btnAdd.addEventListener("click", () => {
        count++;
        saveData();
        updateUI();
        triggerAnimation();
    });

    // reset dzikir
    btnReset.addEventListener("click", () => {
        if (count > 0) {
            const yakin = confirm("Yakin ingin mereset hitungan dzikir? Progres kamu saat ini akan hilang lho");
            if (yakin) {
                count = 0;
                saveData();
                updateUI();
                badgeNotification.classList.remove("show");
            }
        }
    });

    // ubah target
    targetSelect.addEventListener("change", (e) => {
        target = parseInt(e.target.value);
        saveData();
        updateUI();
    });

    // update UI
    function updateUI() {
        countNumber.innerText = count;
        currentCountText.innerText = count;
        targetDisplay.innerText = target;
        if (count >= target && count !== 0) {
            badgeNotification.classList.add("show");
        } else {
            badgeNotification.classList.remove("show");
        }
    }

    // simpan ke local storage
    function saveData() {
        localStorage.setItem("dzikirCount", count);
        localStorage.setItem("dzikirTarget", target);
    }

    // animasi
    function triggerAnimation() {
        countNumber.classList.add("pop-anim");
        setTimeout(() => {
            countNumber.classList.remove("pop-anim");
        }, 150);
    }
});