console.log("✅ laporan_santri.js LOADED");

/* ==========================================================
   VARIABEL GLOBAL
========================================================== */
let semuaSantri = [];

/* ==========================================================
   FUNGSI KONVERSI NILAI
========================================================== */
function nilaiToAngka(label) {
    if (typeof label !== "string") return 0;
    label = label.trim().toLowerCase();
    switch (label) {
        case "sangat baik": return 95;
        case "baik":        return 80;
        case "cukup":       return 70;
        case "kurang":      return 50;
    }
    if (label.startsWith("a")) return 95;
    if (label.startsWith("b")) return 80;
    if (label.startsWith("c")) return 70;
    if (label.startsWith("d")) return 50;
    return 0;
}

function angkaKeHuruf(nilai) {
    nilai = Number(nilai) || 0;
    if (nilai >= 90) return { angka: nilai, predikat: "Mumtaz",        arab: "ممتاز",     kelas: "predikat-mumtaz" };
    if (nilai >= 80) return { angka: nilai, predikat: "Jayyid Jiddan", arab: "جيد جداً",  kelas: "predikat-jayyid-jiddan" };
    if (nilai >= 70) return { angka: nilai, predikat: "Jayyid",        arab: "جيد",       kelas: "predikat-jayyid" };
    if (nilai >= 60) return { angka: nilai, predikat: "Maqbul",        arab: "مقبول",     kelas: "predikat-maqbul" };
    return              { angka: nilai, predikat: "Dho'if",        arab: "ضعيف",     kelas: "predikat-dhoif" };
}

function konversiPersenKehadiran(persen) {
    persen = Number(persen);
    if (isNaN(persen)) return { huruf: "E", angka: 0 };
    if (persen >= 95) return { huruf: "A",  angka: 95 };
    if (persen >= 90) return { huruf: "B+", angka: 90 };
    if (persen >= 80) return { huruf: "B",  angka: 85 };
    if (persen >= 70) return { huruf: "C",  angka: 75 };
    if (persen >= 60) return { huruf: "D",  angka: 65 };
    return              { huruf: "E",  angka: 50 };
}

window.nilaiToAngka = nilaiToAngka;
window.angkaKeHuruf = angkaKeHuruf;
window.konversiPersenKehadiran = konversiPersenKehadiran;


/* ==========================================================
   DOM READY
========================================================== */
document.addEventListener("DOMContentLoaded", function() {
    console.log("✅ DOM Ready");

    const btnCari = document.getElementById("btnCari");
    if (btnCari) {
        btnCari.addEventListener("click", cariLaporan);
        console.log("✅ Event btnCari terpasang");
    }

    const nisInput = document.getElementById("nis");
    const tglInput = document.getElementById("tglLahir");

    if (nisInput) {
        nisInput.addEventListener("keypress", function(e) {
            const dropdown = document.getElementById("dropdownSantri");
            if (e.key === "Enter" && (!dropdown || dropdown.style.display !== "block")) {
                cariLaporan();
            }
        });
    }

    if (tglInput) {
        tglInput.addEventListener("keypress", function(e) {
            if (e.key === "Enter") cariLaporan();
        });
    }

    setupSearchSantri();
    tungguFirebaseLalu(loadSemuaSantri);
});


/* ==========================================================
   TUNGGU FIREBASE SIAP
========================================================== */
function tungguFirebaseLalu(callback) {
    let count = 0;
    let cek = setInterval(function() {
        count++;
        if (window.db) {
            clearInterval(cek);
            console.log("✅ Firebase siap (tunggu " + (count * 200) + "ms)");
            callback();
        } else if (count > 50) {  // Timeout 10 detik
            clearInterval(cek);
            console.error("❌ Firebase TIDAK siap setelah 10 detik!");
            alert("Firebase gagal load. Cek koneksi & konfigurasi.");
        }
    }, 200);
}


/* ==========================================================
   LOAD SEMUA SANTRI (SATU FUNGSI SAJA!)
========================================================== */
async function loadSemuaSantri() {
    console.log("📋 Loading daftar santri...");

    try {
        // TANPA orderBy — biar tidak error kalau field kosong
        const snap = await window.db.collection("pendaftaran_santri").get();

        console.log("📦 Total dokumen dari Firestore:", snap.size);

        semuaSantri = [];
        snap.forEach(function(doc) {
            const d = doc.data();
            console.log("📄 Doc:", doc.id, "→ id_santri:", d.id_santri, "nama:", d.nama_santri);
            
            if (d.id_santri) {
                semuaSantri.push({
                    id: d.id_santri,
                    nama: d.nama_santri || "-",
                    kelas: d.tingkat_unit || "-",
                    tgl_lahir: d.tgl_lahir || ""
                });
            }
        });

        // Sort manual di JS (biar tidak butuh index Firestore)
        semuaSantri.sort(function(a, b) {
            return a.id.localeCompare(b.id);
        });

        console.log("✅ Total santri ter-load:", semuaSantri.length);
        console.log("📊 Sample data:", semuaSantri.slice(0, 3));

        window.semuaSantri = semuaSantri;

    } catch (e) {
        console.error("❌ Error load santri:", e);
        console.error("❌ Detail:", e.message);
    }
}


/* ==========================================================
   SETUP DROPDOWN & SEARCH (SATU FUNGSI SAJA!)
========================================================== */
function setupSearchSantri() {
    const inputNis = document.getElementById("nis");
    const dropdown = document.getElementById("dropdownSantri");

    if (!inputNis) {
        console.error("❌ Element #nis tidak ditemukan!");
        return;
    }

    if (!dropdown) {
        console.error("❌ Element #dropdownSantri tidak ditemukan!");
        return;
    }

    console.log("✅ setupSearchSantri OK");

    inputNis.addEventListener("focus", function() {
        showDropdown(inputNis.value);
    });

    inputNis.addEventListener("click", function() {
        showDropdown(inputNis.value);
    });

    inputNis.addEventListener("input", function() {
        showDropdown(inputNis.value);
    });

    document.addEventListener("click", function(e) {
        if (!e.target.closest(".search-wrapper")) {
            dropdown.style.display = "none";
        }
    });

    inputNis.addEventListener("keydown", function(e) {
        const items = dropdown.querySelectorAll(".dropdown-item");
        if (items.length === 0) return;

        let activeIdx = -1;
        items.forEach(function(item, i) {
            if (item.classList.contains("active")) activeIdx = i;
        });

        if (e.key === "ArrowDown") {
            e.preventDefault();
            activeIdx = (activeIdx + 1) % items.length;
            setActive(items, activeIdx);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            activeIdx = activeIdx <= 0 ? items.length - 1 : activeIdx - 1;
            setActive(items, activeIdx);
        } else if (e.key === "Enter" && activeIdx >= 0) {
            e.preventDefault();
            items[activeIdx].click();
        } else if (e.key === "Escape") {
            dropdown.style.display = "none";
        }
    });
}

function setActive(items, idx) {
    items.forEach(function(item) { item.classList.remove("active"); });
    if (items[idx]) {
        items[idx].classList.add("active");
        items[idx].scrollIntoView({ block: "nearest" });
    }
}


/* ==========================================================
   TAMPILKAN DROPDOWN (SATU FUNGSI SAJA!)
========================================================== */
function showDropdown(keyword) {
    const dropdown = document.getElementById("dropdownSantri");
    if (!dropdown) return;

    // Kalau belum ter-load, kasih tahu user
    if (semuaSantri.length === 0) {
        dropdown.innerHTML =
            '<div class="dropdown-empty">' +
                '<i class="fas fa-spinner fa-spin"></i> ' +
                'Memuat daftar santri...' +
            '</div>';
        dropdown.style.display = "block";
        return;
    }

    keyword = (keyword || "").trim().toLowerCase();

    let hasil;
    if (keyword === "") {
        hasil = semuaSantri;
    } else {
        hasil = semuaSantri.filter(function(s) {
            return s.id.toLowerCase().includes(keyword) ||
                   s.nama.toLowerCase().includes(keyword) ||
                   s.kelas.toLowerCase().includes(keyword);
        });
    }

    const tampil = hasil.slice(0, 20);

    if (tampil.length === 0) {
        dropdown.innerHTML =
            '<div class="dropdown-empty">' +
                '<i class="fas fa-search"></i> ' +
                'Santri tidak ditemukan' +
            '</div>';
        dropdown.style.display = "block";
        return;
    }

    let html = "";
    tampil.forEach(function(s) {
        const namaHL = highlightText(s.nama, keyword);
        const idHL = highlightText(s.id, keyword);

        html +=
            '<div class="dropdown-item" data-id="' + s.id + '" data-tgl="' + s.tgl_lahir + '">' +
                '<div class="dropdown-item-id">' + idHL + '</div>' +
                '<div class="dropdown-item-info">' +
                    '<div class="dropdown-item-nama">' + namaHL + '</div>' +
                    '<div class="dropdown-item-kelas">' +
                        '<i class="fas fa-graduation-cap"></i> ' + s.kelas +
                    '</div>' +
                '</div>' +
            '</div>';
    });

    if (hasil.length > 20) {
        html += '<div class="dropdown-info">Menampilkan 20 dari ' + hasil.length + ' santri</div>';
    }

    dropdown.innerHTML = html;
    dropdown.style.display = "block";

    dropdown.querySelectorAll(".dropdown-item").forEach(function(item) {
        item.addEventListener("click", function() {
            const id = this.getAttribute("data-id");
            const tgl = this.getAttribute("data-tgl");

            document.getElementById("nis").value = id;
            if (tgl) document.getElementById("tglLahir").value = tgl;

            dropdown.style.display = "none";
        });
    });
}

function highlightText(text, keyword) {
    if (!keyword) return text;
    const regex = new RegExp("(" + keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi");
    return text.replace(regex, '<mark>$1</mark>');
}


/* ==========================================================
   CARI LAPORAN (tetap sama)
========================================================== */
async function cariLaporan() {
    console.log("🔍 cariLaporan() DIPANGGIL");

    const loading        = document.getElementById("loading");
    const hasil          = document.getElementById("hasil");
    const tidakDitemukan = document.getElementById("tidakDitemukan");

    loading.style.display        = "block";
    hasil.style.display          = "none";
    tidakDitemukan.style.display = "none";

    const idInput = document.getElementById("nis").value.trim();
    const tgl     = document.getElementById("tglLahir").value;

    if (!idInput || !tgl) {
        alert("Lengkapi ID Santri dan Tanggal Lahir.");
        loading.style.display = "none";
        return;
    }

    try {
        const snap = await window.db.collection("pendaftaran_santri")
            .where("id_santri", "==", idInput)
            .where("tgl_lahir", "==", tgl)
            .get();

        loading.style.display = "none";

        if (snap.empty) {
            tidakDitemukan.style.display = "block";
            return;
        }

        const santri = snap.docs[0].data();

        hasil.style.display = "block";
        document.getElementById("namaSantri").textContent  = santri.nama_santri || "-";
        document.getElementById("nisSantri").textContent   = santri.id_santri || "-";
        document.getElementById("jkSantri").textContent    = santri.jenis_kelamin || "-";
        document.getElementById("kelasSantri").textContent = santri.tingkat_unit || "-";

        const id = santri.id_santri;

        await loadHafalan(id);
        await loadKehadiran(id);
        await loadIbadah(id);

    } catch (error) {
        console.error("❌ ERROR:", error);
        alert("Gagal: " + error.message);
        loading.style.display = "none";
    }
}


/* ==========================================================
   FUNGSI loadHafalan, loadKehadiran, loadIbadah
   ⚠️ PASTE dari file lama Anda di sini
========================================================== */

// [Copy paste fungsi loadHafalan, loadKehadiran, loadIbadah 
//  yang sudah ada di kode Anda — jangan ubah]

function setActive(items, idx) {
    items.forEach(item => item.classList.remove("active"));
    if (items[idx]) {
        items[idx].classList.add("active");
        items[idx].scrollIntoView({ block: "nearest" });
    }
}

// Tampilkan dropdown dengan filter
function showDropdown(keyword) {
    const dropdown = document.getElementById("dropdownSantri");
    if (!dropdown) return;
    
    keyword = keyword.trim().toLowerCase();
    
    // Filter santri
    const hasil = semuaSantri.filter(function(s) {
        return s.id.toLowerCase().includes(keyword) ||
               s.nama.toLowerCase().includes(keyword) ||
               s.kelas.toLowerCase().includes(keyword);
    });
    
    // Batasi 20 hasil pertama
    const tampil = hasil.slice(0, 20);
    
    if (tampil.length === 0) {
        dropdown.innerHTML = '<div class="dropdown-empty"><i class="fas fa-search"></i> Santri tidak ditemukan</div>';
        dropdown.style.display = "block";
        return;
    }
    
    let html = "";
    tampil.forEach(function(s) {
        // Highlight keyword
        const namaHighlight = highlightText(s.nama, keyword);
        const idHighlight = highlightText(s.id, keyword);
        
        html += 
            '<div class="dropdown-item" data-id="' + s.id + '" data-tgl="' + s.tgl_lahir + '">' +
                '<div class="dropdown-item-id">' + idHighlight + '</div>' +
                '<div class="dropdown-item-info">' +
                    '<div class="dropdown-item-nama">' + namaHighlight + '</div>' +
                    '<div class="dropdown-item-kelas"><i class="fas fa-graduation-cap"></i> ' + s.kelas + '</div>' +
                '</div>' +
            '</div>';
    });
    
    if (hasil.length > 20) {
        html += '<div class="dropdown-info">Menampilkan 20 dari ' + hasil.length + ' santri</div>';
    }
    
    dropdown.innerHTML = html;
    dropdown.style.display = "block";
    
    // Attach click event ke setiap item
    dropdown.querySelectorAll(".dropdown-item").forEach(function(item) {
        item.addEventListener("click", function() {
            const id = this.getAttribute("data-id");
            const tgl = this.getAttribute("data-tgl");
            
            document.getElementById("nis").value = id;
            
            // Auto-isi tanggal lahir juga (opsional)
            if (tgl) {
                document.getElementById("tglLahir").value = tgl;
            }
            
            dropdown.style.display = "none";
        });
    });
}

// Highlight teks yang cocok
function highlightText(text, keyword) {
    if (!keyword) return text;
    const regex = new RegExp("(" + keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi");
    return text.replace(regex, '<mark>$1</mark>');
}