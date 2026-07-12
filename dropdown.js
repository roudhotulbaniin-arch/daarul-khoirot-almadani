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
el.ayatMulai.addEventListener("focus", () => {
    wrapperMulai.classList.add("open");
});

el.ayatSelesai.addEventListener("focus", () => {
    wrapperSelesai.classList.add("open");
});

el.kelancaran.addEventListener("focus", () => {
    wrapKelancaran.classList.add("open");
});

el.tahsin.addEventListener("focus", () => {
    wrapTahsin.classList.add("open");
});

el.tajwid.addEventListener("focus", () => {
    wrapTajwid.classList.add("open");
});

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
   CLICK AYAT MULAI (EVENT DELEGATION)
========================================================== */

el.menuAyatMulai.addEventListener("click", (e) => {

    const item = e.target.closest(".dropdown-item-custom");
    if (!item) return;

    el.ayatMulai.value = item.dataset.value;

    wrapperMulai.classList.remove("open");

    hitungSetoran();
    updateAkumulasi();

    e.stopPropagation();

});

/* ==========================================================
   CLICK AYAT SELESAI (EVENT DELEGATION)
========================================================== */

el.menuAyatSelesai.addEventListener("click", (e) => {

    const item = e.target.closest(".dropdown-item-custom");
    if (!item) return;

    el.ayatSelesai.value = item.dataset.value;

    wrapperSelesai.classList.remove("open");

    hitungSetoran();
    updateAkumulasi();

    e.stopPropagation();

});