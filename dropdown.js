function closeDropdown() {

    document
        .querySelectorAll(".dropdown-wrapper-custom.open")
        .forEach(box => {

            box.classList.remove("open");

        });

}

function initDropdown(wrapperId, boxId, inputId) {

    const wrapper = document.getElementById(wrapperId);
    const box = document.getElementById(boxId);
    const input = document.getElementById(inputId);

    if (!wrapper || !box || !input) {
        console.warn("Dropdown missing:", wrapperId, boxId, inputId);
        return;
    }

    box.addEventListener("click", () => {
        wrapper.classList.toggle("open");
    });

    wrapper.querySelectorAll(".dropdown-item-custom").forEach(item => {

        item.addEventListener("click", () => {

            const val = item.textContent.trim();

            input.value = val; // ðŸ”¥ INI YANG HARUS MASUK

            input.dispatchEvent(new Event("change"));

            wrapper.classList.remove("open");

        });

    });

}


window.toggleCustomSelect = function (trigger) {

    const wrapper = trigger.closest(".dropdown-wrapper-custom");

    if (!wrapper) return;

    const opened = wrapper.classList.contains("open");

    closeDropdown();

    if (!opened) {

        wrapper.classList.add("open");

    }

};

document.addEventListener("click", e => {

    if (!e.target.closest(".dropdown-wrapper-custom")) {

        closeDropdown();
       
    }

});

window.selectFilterOption = function (
    item,
    inputId,
    value
) {

    const input = document.getElementById(inputId);

    input.value = item.textContent.trim();

    input.dataset.value = value;

    closeDropdown();

};

/* ==========================================================
   RENDER MENU
========================================================== */

function renderMenuSantri(list) {

    if (!list.length) {

        el.menuSantri.innerHTML = `
            <div class="dropdown-item-custom">
                Tidak ada data
            </div>
        `;

        return;

    }

    el.menuSantri.innerHTML =
        list.map(s => `

        <div
            class="dropdown-item-custom"
            data-id="${s.id}"
        >

            ${s.nama}

        </div>

    `).join("");

}

/* ==========================================================
   MENU SURAH
========================================================== */

function renderMenuSurah(list) {

    if (!list.length) {

        el.menuSurah.innerHTML = `
            <div class="dropdown-item-custom">
                Tidak ada data
            </div>
        `;

        return;

    }

    el.menuSurah.innerHTML = list.map(s => `

        <div
            class="dropdown-item-custom"
            data-id="${s.no}">

            ${s.no}. ${s.nama}

        </div>

    `).join("");

}

/* ==========================================================
   MENU AYAT
========================================================== */

function renderAyatMulai(total) {

    el.menuAyatMulai.innerHTML = "";

    for (let i = 1; i <= total; i++) {
        el.menuAyatMulai.innerHTML += `
            <div class="dropdown-item-custom" data-value="${i}">
                Ayat ${i}
            </div>
        `;
    }
}


function renderAyatSelesai(total) {

    el.menuAyatSelesai.innerHTML = "";

    for (let i = 1; i <= total; i++) {
        el.menuAyatSelesai.innerHTML += `
            <div class="dropdown-item-custom" data-value="${i}">
                Ayat ${i}
            </div>
        `;
    }
}


/* ==========================================================
   OPEN DROPDOWN
========================================================== */
// Buka dropdown pakai CLICK (bukan focus) supaya tidak race dengan blur
function bindOpenOnClick(triggerEl, wrapperEl) {
    if (!triggerEl || !wrapperEl) return;
    
    // Cari parent trigger (box), bukan input
    const box = triggerEl.closest(".select-custom-trigger") || triggerEl;
    
    box.addEventListener("click", (e) => {
        e.stopPropagation();
        
        // Tutup dropdown lain
        document.querySelectorAll(".dropdown-wrapper-custom.open").forEach(w => {
            if (w !== wrapperEl) w.classList.remove("open");
        });
        
        wrapperEl.classList.toggle("open");
    });
}

bindOpenOnClick(el.ayatMulai, wrapperMulai);
bindOpenOnClick(el.ayatSelesai, wrapperSelesai);
bindOpenOnClick(el.kelancaran, wrapKelancaran);
bindOpenOnClick(el.tahsin, wrapTahsin);
bindOpenOnClick(el.tajwid, wrapTajwid);

el.boxStatusKehadiran.addEventListener("click", () => {
    wrapperStatus.classList.add("open");
});

function closeDropdown() {

    document
        .querySelectorAll(".dropdown-wrapper-custom.open")
        .forEach(box => {
            box.classList.remove("open");
        });

    wrapKelancaran?.classList.remove("open");
    wrapTahsin?.classList.remove("open");
    wrapTajwid?.classList.remove("open");

}

wrapKelancaran.querySelector(".dropdown-menu-custom").addEventListener("click", (e) => {

    const item = e.target.closest(".dropdown-item-custom");
    if (!item) return;

    el.kelancaran.value = item.textContent.trim();

    wrapKelancaran.classList.remove("open");

});
        wrapTahsin.querySelector(".dropdown-menu-custom").addEventListener("click", (e) => {

    const item = e.target.closest(".dropdown-item-custom");
    if (!item) return;

    el.tahsin.value = item.textContent.trim();

    wrapTahsin.classList.remove("open");

});
        wrapTajwid.querySelector(".dropdown-menu-custom").addEventListener("click", (e) => {

    const item = e.target.closest(".dropdown-item-custom");
    if (!item) return;

    el.tajwid.value = item.textContent.trim();

    wrapTajwid.classList.remove("open");

});

el.menuStatusKehadiranDropdown.addEventListener("click", (e) => {

    const item = e.target.closest(".dropdown-item-custom");
    if (!item) return;

    el.statusKehadiran.value = item.dataset.value;
    el.boxStatusKehadiran.value = item.textContent.trim(); // jika ada input tampilan

    wrapperStatus.classList.remove("open");
    // atau bisa juga:
    // closeDropdown();

    e.stopPropagation();

});
    /* ==========================================================
   DROPDOWN AYAT MULAI
========================================================== */
(function() {
    const wrapper = document.getElementById("wrapperAyatMulai") 
                    || document.getElementById("boxDariAyat")?.closest(".dropdown-wrapper-custom");
    const box = document.getElementById("boxDariAyat");
    const menu = document.getElementById("menuAyatMulaiDropdown");
    const input = document.getElementById("ayat_mulai");
    
    if (!wrapper || !box || !menu || !input) {
        console.warn("❌ Dropdown Ayat Mulai: element missing", { wrapper, box, menu, input });
        return;
    }
    
    console.log("✅ Dropdown Ayat Mulai ready");
    
    // KLIK BOX → buka/tutup
    box.addEventListener("click", (e) => {
        e.stopPropagation();
        
        // Tutup dropdown lain
        document.querySelectorAll(".dropdown-wrapper-custom.open").forEach(w => {
            if (w !== wrapper) w.classList.remove("open");
        });
        
        wrapper.classList.toggle("open");
        console.log("Toggle:", wrapper.classList.contains("open"));
    });
    
    // KLIK ITEM → pilih & tutup
    menu.addEventListener("click", (e) => {
        e.stopPropagation();
        
        const item = e.target.closest(".dropdown-item-custom");
        if (!item) return;
        if (!item.dataset.value) return; // skip placeholder
        
        input.value = item.dataset.value;
        
        // Tandai aktif
        menu.querySelectorAll(".dropdown-item-custom").forEach(i => i.classList.remove("active"));
        item.classList.add("active");
        
        // Tutup
        wrapper.classList.remove("open");
        
        // Hitung ulang
        if (typeof hitungSetoran === "function") hitungSetoran();
        if (typeof updateAkumulasi === "function") updateAkumulasi();
        
        console.log("Selected Ayat Mulai:", input.value);
    });
})();

/* ==========================================================
   DROPDOWN AYAT SELESAI
========================================================== */
(function() {
    const wrapper = document.getElementById("wrapperAyatSelesai") 
                    || document.getElementById("boxSampaiAyat")?.closest(".dropdown-wrapper-custom");
    const box = document.getElementById("boxSampaiAyat");
    const menu = document.getElementById("menuAyatSelesaiDropdown");
    const input = document.getElementById("ayat_selesai");
    
    if (!wrapper || !box || !menu || !input) {
        console.warn("❌ Dropdown Ayat Selesai: element missing", { wrapper, box, menu, input });
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
        
        console.log("Selected Ayat Selesai:", input.value);
    });
})();