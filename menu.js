// File: menu.js
// Script khusus untuk menu (TANPA type="module")

console.log("✅ menu.js LOADED");

document.addEventListener("DOMContentLoaded", function() {

    console.log("✅ DOM READY");

    var menuToggle  = document.getElementById("menu-toggle");
    var menuClose   = document.getElementById("menu-close");
    var menuOverlay = document.getElementById("menu-overlay");
    var mainNav     = document.getElementById("main-nav");

    console.log("menu-toggle:", menuToggle);
    console.log("menu-close:", menuClose);
    console.log("menu-overlay:", menuOverlay);
    console.log("main-nav:", mainNav);

    function openMenu() {
        console.log("🟢 openMenu dipanggil");
        if (mainNav) mainNav.classList.add("show");
        if (menuOverlay) menuOverlay.classList.add("show");
        document.body.style.overflow = "hidden";
    }

    function closeMenu() {
        console.log("🔴 closeMenu dipanggil");
        if (mainNav) mainNav.classList.remove("show");
        if (menuOverlay) menuOverlay.classList.remove("show");
        document.body.style.overflow = "";
    }

    if (menuToggle) {
        menuToggle.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log("🖱️ Menu toggle DIKLIK");
            openMenu();
        };
    }

    if (menuClose) {
        menuClose.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log("🖱️ Menu close DIKLIK");
            closeMenu();
        };
    }

    if (menuOverlay) {
        menuOverlay.onclick = function() {
            console.log("🖱️ Overlay DIKLIK");
            closeMenu();
        };
    }

    // Tutup saat klik link menu
    if (mainNav) {
        var links = mainNav.querySelectorAll("a");
        for (var i = 0; i < links.length; i++) {
            links[i].addEventListener("click", function() {
                closeMenu();
            });
        }
    }

    // Escape untuk tutup
    document.addEventListener("keydown", function(e) {
        if (e.key === "Escape") closeMenu();
    });

});