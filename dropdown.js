/* ==========================================================
   UTIL — closeDropdown
========================================================== */
function closeDropdown() {
    document.querySelectorAll(".dropdown-wrapper-custom.open").forEach(box => {
        box.classList.remove("open");
    });
}

/* ==========================================================
   GENERIC INIT DROPDOWN
========================================================== */
function initDropdown(wrapperId, boxId, inputId) {
    const wrapper = document.getElementById(wrapperId);
    const box = document.getElementById(boxId);
    const input = document.getElementById(inputId);

    if (!wrapper || !box || !input) {
        console.warn("Dropdown missing:", wrapperId, boxId, inputId);
        return;
    }

    box.addEventListener("click", (e) => {
        e.stopPropagation();
        closeDropdown();
        wrapper.classList.toggle("open");
    });

    wrapper.querySelectorAll(".dropdown-item-custom").forEach(item => {
        item.addEventListener("click", (e) => {
            e.stopPropagation();
            const val = item.textContent.trim();
            input.value = val;
            input.dispatchEvent(new Event("change"));
            wrapper.classList.remove("open");
        });
    });
}

/* ==========================================================
   TOGGLE MANUAL (dari HTML onclick)
========================================================== */
window.toggleCustomSelect = function (trigger) {
    const wrapper = trigger.closest(".dropdown-wrapper-custom");
    if (!wrapper) return;

    const opened = wrapper.classList.contains("open");
    closeDropdown();
    if (!opened) {
        wrapper.classList.add("open");
    }
};

/* ==========================================================
   CLOSE saat klik luar
========================================================== */
document.addEventListener("click", e => {
    if (!e.target.closest(".dropdown-wrapper-custom")) {
        closeDropdown();
    }
});

/* ==========================================================
   SELECT FILTER (bulan/tahun)
========================================================== */
window.selectFilterOption = function (item, inputId, value) {
    const input = document.getElementById(inputId);
    input.value = item.textContent.trim();
    input.dataset.value = value;
    closeDropdown();
};

/* ==========================================================
   RENDER MENU SANTRI
========================================================== */
function renderMenuSantri(list) {
    if (!list.length) {
        el.menuSantri.innerHTML = `<div class="dropdown-item-custom">Tidak ada data</div>`;
        return;
    }
    el.menuSantri.innerHTML = list.map(s => `
        <div class="dropdown-item-custom" data-id="${s.id}">${s.nama}</div>
    `).join("");
}

/* ==========================================================
   RENDER MENU SURAH
========================================================== */
function renderMenuSurah(list) {
    if (!list.length) {
        el.menuSurah.innerHTML = `<div class="dropdown-item-custom">Tidak ada data</div>`;
        return;
    }
    el.menuSurah.innerHTML = list.map(s => `
        <div class="dropdown-item-custom" data-id="${s.no}">${s.no}. ${s.nama}</div>
    `).join("");
}

/* ==========================================================
   RENDER AYAT
========================================================== */
function renderAyatMulai(total) {
    el.menuAyatMulai.innerHTML = "";
    for (let i = 1; i <= total; i++) {
        el.menuAyatMulai.innerHTML += `
            <div class="dropdown-item-custom" data-value="${i}">Ayat ${i}</div>
        `;
    }
}

function renderAyatSelesai(total) {
    el.menuAyatSelesai.innerHTML = "";
    for (let i = 1; i <= total; i++) {
        el.menuAyatSelesai.innerHTML += `
            <div class="dropdown-item-custom" data-value="${i}">Ayat ${i}</div>
        `;
    }
}

/* ==========================================================
   DROPDOWN AYAT MULAI
========================================================== */
(function() {
    const box = document.getElementById("boxDariAyat");
    const menu = document.getElementById("menuAyatMulaiDropdown");
    const input = document.getElementById("ayat_mulai");
    const wrapper = box?.closest(".dropdown-wrapper-custom");

    if (!wrapper || !box || !menu || !input) {
        console.warn("❌ Dropdown Ayat Mulai: element missing");
        return;
    }
    console.log("✅ Dropdown Ayat Mulai ready");

    box.addEventListener("click", (e) => {
        e.stopPropagation();
        document.querySelectorAll(".dropdown-wrapper-custom.open").forEach(w => {
            if (w !== wrapper) w.classList.remove("open");
        });
        wrapper.classList.toggle("open");
    });

    menu.addEventListener("click", (e) => {
        e.stopPropagation();
        const item = e.target.closest(".dropdown-item-custom");
        if (!item) return;
        if (!item.dataset.value) return;

        input.value = item.dataset.value;

        menu.querySelectorAll(".dropdown-item-custom").forEach(i => i.classList.remove("active"));
        item.classList.add("active");

        wrapper.classList.remove("open");

        if (typeof hitungSetoran === "function") hitungSetoran();
        if (typeof updateAkumulasi === "function") updateAkumulasi();
    });
})();

/* ==========================================================
   DROPDOWN AYAT SELESAI
========================================================== */
(function() {
    const box = document.getElementById("boxSampaiAyat");
    const menu = document.getElementById("menuAyatSelesaiDropdown");
    const input = document.getElementById("ayat_selesai");
    const wrapper = box?.closest(".dropdown-wrapper-custom");

    if (!wrapper || !box || !menu || !input) {
        console.warn("❌ Dropdown Ayat Selesai: element missing");
        return;
    }
    console.log("✅ Dropdown Ayat Selesai ready");

    box.addEventListener("click", (e) => {
        e.stopPropagation();
        document.querySelectorAll(".dropdown-wrapper-custom.open").forEach(w => {
            if (w !== wrapper) w.classList.remove("open");
        });
        wrapper.classList.toggle("open");
    });

    menu.addEventListener("click", (e) => {
        e.stopPropagation();
        const item = e.target.closest(".dropdown-item-custom");
        if (!item) return;
        if (!item.dataset.value) return;

        input.value = item.dataset.value;

        menu.querySelectorAll(".dropdown-item-custom").forEach(i => i.classList.remove("active"));
        item.classList.add("active");

        wrapper.classList.remove("open");

        if (typeof hitungSetoran === "function") hitungSetoran();
        if (typeof updateAkumulasi === "function") updateAkumulasi();
    });
})();

/* ==========================================================
   DROPDOWN NILAI HAFALAN (Kelancaran, Tahsin, Tajwid)
========================================================== */
function initNilaiDropdown(wrapperEl, inputEl) {
    if (!wrapperEl || !inputEl) return;

    const box = wrapperEl.querySelector(".select-custom-trigger");
    const menu = wrapperEl.querySelector(".dropdown-menu-custom");
    if (!box || !menu) return;

    box.addEventListener("click", (e) => {
        e.stopPropagation();
        document.querySelectorAll(".dropdown-wrapper-custom.open").forEach(w => {
            if (w !== wrapperEl) w.classList.remove("open");
        });
        wrapperEl.classList.toggle("open");
    });

    menu.addEventListener("click", (e) => {
        e.stopPropagation();
        const item = e.target.closest(".dropdown-item-custom");
        if (!item) return;

        inputEl.value = item.textContent.trim();

        menu.querySelectorAll(".dropdown-item-custom").forEach(i => i.classList.remove("active"));
        item.classList.add("active");

        wrapperEl.classList.remove("open");
    });
}

initNilaiDropdown(wrapKelancaran, el.kelancaran);
initNilaiDropdown(wrapTahsin, el.tahsin);
initNilaiDropdown(wrapTajwid, el.tajwid);

/* ==========================================================
   DROPDOWN STATUS KEHADIRAN
========================================================== */
(function() {
    if (!el.boxStatusKehadiran || !wrapperStatus || !el.menuStatusKehadiranDropdown) return;

    el.boxStatusKehadiran.addEventListener("click", (e) => {
        e.stopPropagation();
        document.querySelectorAll(".dropdown-wrapper-custom.open").forEach(w => {
            if (w !== wrapperStatus) w.classList.remove("open");
        });
        wrapperStatus.classList.toggle("open");
    });

    el.menuStatusKehadiranDropdown.addEventListener("click", (e) => {
        e.stopPropagation();
        const item = e.target.closest(".dropdown-item-custom");
        if (!item) return;

        el.statusKehadiran.value = item.dataset.value || item.textContent.trim();
        
        // Kalau ada input tampilan
        if (el.boxStatusKehadiran.value !== undefined) {
            el.boxStatusKehadiran.value = item.textContent.trim();
        }

        el.menuStatusKehadiranDropdown.querySelectorAll(".dropdown-item-custom").forEach(i => i.classList.remove("active"));
        item.classList.add("active");

        wrapperStatus.classList.remove("open");
    });
})();