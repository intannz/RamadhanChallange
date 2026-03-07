const navbarContent = `
    <div class="nav-container">
        <a href="index.html" class="nav-logo">
            <img src="img/logo-navbar.png" alt="Beranda">
        </a>
        
        <div class="menu-toggle" id="mobile-menu">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
        </div>

        <ul class="nav-links" id="nav-menu">
            <li><a href="doa.html">Do'a Puasa</a></li>
            <li><a href="dzikir.html">Hitung Dzikir</a></li>
            <li><a href="zakat.html">Kalkulator Zakat</a></li>
            <li><a href="todolist.html">To-Do List</a></li>
        </ul>
    </div>
`;
const footerContent = `
    <p>&copy; 2026 Kumpulan Do'a Ramadhan</p>
`;

document.addEventListener("DOMContentLoaded", () => {
    const navPlaceholder = document.getElementById("navbar-placeholder");
    const footerPlaceholder = document.getElementById("footer-placeholder");

    if (navPlaceholder) navPlaceholder.innerHTML = navbarContent;
    if (footerPlaceholder) footerPlaceholder.innerHTML = footerContent;

    // toggle menubar
    const mobileMenu = document.getElementById("mobile-menu");
    const navMenu = document.getElementById("nav-menu");

    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener("click", () => {
            navMenu.classList.toggle("active");
            mobileMenu.classList.toggle("is-active");
        });

        // tutup menu otomatis jika user klik di luar area navbar 
        document.addEventListener("click", (e) => {
            if (!mobileMenu.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove("active");
                mobileMenu.classList.remove("is-active");
            }
        });
    }
});