const navbarContent = `
        <ul class="nav-links">
            <li><a href="index.html">Beranda</a></li>
            <li><a href="index.html#doa-makan">Do'a Makan</a></li>
            <li><a href="index.html#sahur">Sahur</a></li>
            <li><a href="index.html#buka-puasa">Buka Puasa</a></li>
            <li><a href="dzikir.html">Hitung Zikir</a></li>
        </ul>
`;
const footerContent = `
    <p>&copy; 2026 Kumpulan Do'a Ramadhan</p>
`;

document.addEventListener("DOMContentLoaded", () => {
    const navPlaceholder = document.getElementById("navbar-placeholder");
    const footerPlaceholder = document.getElementById("footer-placeholder");

    if (navPlaceholder) navPlaceholder.innerHTML = navbarContent;
    if (footerPlaceholder) footerPlaceholder.innerHTML = footerContent;
});