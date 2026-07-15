console.log("✅ laporan_santri.js LOADED");

/* ==========================================================
   VARIABEL GLOBAL - HARUS DI PALING ATAS
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
    let cek = setInterval(function() {
        if (window.db) {
            clearInterval(cek);
            console.log("✅ Firebase siap");
            callback();
        }
    }, 200);
}

/* ==========================================================
   LOAD SEMUA SANTRI
   ========================================================== */

async function loadSemuaSantri() {
    console.log("📋 Loading daftar santri...");

    try {
        const snap = await window.db.collection("pendaftaran_santri").get();

        semuaSantri = [];
        snap.forEach(function(doc) {
            const d = doc.data();
            if (d.id_santri) {
                semuaSantri.push({
                    id: d.id_santri,
                    nama: d.nama_santri || "-",
                    kelas: d.tingkat_unit || "-",
                    tgl_lahir: d.tgl_lahir || ""
                });
            }
        });

        semuaSantri.sort(function(a, b) {
            return a.id.localeCompare(b.id);
        });

        console.log("✅ Total santri:", semuaSantri.length);
        console.log("📊 Sample:", semuaSantri.slice(0, 3));

        // Expose ke window untuk debug
        window.semuaSantri = semuaSantri;

    } catch (e) {
        console.error("❌ Error load santri:", e);
    }
}

/* ==========================================================
   SETUP DROPDOWN & SEARCH
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
   TAMPILKAN DROPDOWN
   ========================================================== */

function showDropdown(keyword) {
    const dropdown = document.getElementById("dropdownSantri");
    if (!dropdown) return;

    if (semuaSantri.length === 0) {
        dropdown.innerHTML =
            '<div class="dropdown-empty">' +
                '<i class="fas fa-spinner fa-spin"></i>' +
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
                '<i class="fas fa-search"></i>' +
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

            if (tgl) {
                document.getElementById("tglLahir").value = tgl;
            }

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
   CARI LAPORAN
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
   ⚠️ TAMBAHKAN FUNGSI: loadHafalan, loadKehadiran, loadIbadah
   YANG SUDAH ADA DI FILE LAMA ANDA DI BAWAH INI!
   ========================================================== */

// PASTE FUNGSI LAMA DI SINI ⬇️⬇️⬇️

/* ==========================================================
   HAFALAN — dengan predikat Islami
   ========================================================== */

async function loadHafalan(idSantri) {
    console.log("loadHafalan:", idSantri);

    try {
        const snap = await window.db.collection("setoran_hafalan")
            .where("id_santri", "==", idSantri)
            .get();

        const dataList = [];
        snap.forEach(function(doc) {
            dataList.push(doc.data());
        });

        dataList.sort(function(a, b) {
            return (b.tanggal || "").localeCompare(a.tanggal || "");
        });

        function hurufToAngka(kode) {
            if (!kode) return 0;
            const k = String(kode).trim().toUpperCase();

            if (k.startsWith("A")) return 95;
            if (k.startsWith("B")) return 80;
            if (k.startsWith("C")) return 70;
            if (k.startsWith("D")) return 50;

            const lower = k.toLowerCase();
            if (lower === "sangat baik") return 95;
            if (lower === "baik")        return 80;
            if (lower === "cukup")       return 70;
            if (lower === "kurang")      return 50;

            return 0;
        }

        function detailNilai(kode) {
            const angka = hurufToAngka(kode);
            if (angka === 0) return null;

            if (angka >= 90) return { angka: 95, huruf: "A", latin: "Mumtaz",        arab: "ممتاز" };
            if (angka >= 80) return { angka: 80, huruf: "B", latin: "Jayyid Jiddan", arab: "جيد جداً" };
            if (angka >= 70) return { angka: 70, huruf: "C", latin: "Jayyid",        arab: "جيد" };
            return                { angka: 50, huruf: "D", latin: "Maqbul",        arab: "مقبول" };
        }

        function kelasBadge(huruf) {
            if (huruf === "A") return "nilai-a";
            if (huruf === "B") return "nilai-b";
            if (huruf === "C") return "nilai-c";
            if (huruf === "D") return "nilai-d";
            return "nilai-default";
        }

        function labelTasmi(val) {
            if (val === true || val === "true") return "Sudah";
            if (val === false || val === "false") return "Belum";
            if (val === undefined || val === null || val === "") return null;
            return val;
        }

        function renderNilai(label, kode) {
            const d = detailNilai(kode);
            if (!d) return "";

            const html =
                '<div class="nilai-detail ' + kelasBadge(d.huruf) + '">' +
                    '<div class="nilai-header">' +
                        '<span class="nilai-label">' + label + '</span>' +
                        '<span class="nilai-huruf">' + d.huruf + '</span>' +
                    '</div>' +
                    '<div class="nilai-body">' +
                        '<div class="nilai-angka">' + d.angka + '</div>' +
                        '<div class="nilai-teks">' +
                            '<div class="nilai-latin">' + d.latin + '</div>' +
                            '<div class="nilai-arab">' + d.arab + '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>';

            return html;
        }

        let html = "";

        dataList.forEach(function(d) {
            const nilaiTahsin     = hurufToAngka(d.tahsin);
            const nilaiTajwid     = hurufToAngka(d.tajwid);
            const nilaiKelancaran = hurufToAngka(d.kelancaran);

            const nilaiList = [nilaiTahsin, nilaiTajwid, nilaiKelancaran].filter(function(n) {
                return n > 0;
            });

            const rataHafalan = nilaiList.length > 0 ?
                nilaiList.reduce(function(a, b) { return a + b; }, 0) / nilaiList.length : 0;

            const predikat = angkaKeHuruf(rataHafalan);
            const tasmi = labelTasmi(d.tasmi);

            let item = '<div class="hafalan-item">';

            // Header
            item +=
                '<div class="hafalan-header">' +
                    '<strong>' + (d.surah || "-") + '</strong>' +
                    '<span class="hafalan-tanggal">' + (d.tanggal || "-") + '</span>' +
                '</div>';

            // Detail Juz & Ayat
            item += '<div class="hafalan-detail">';
            item += '<span><b>Juz:</b> ' + (d.juzMulai || "-") + ' - ' + (d.juzSelesai || "-") + '</span>';
            item += '<span><b>Ayat:</b> ' + (d.ayatMulai || "-") + ' - ' + (d.ayatSelesai || "-") + '</span>';
            if (d.totalAyat) {
                item += '<span><b>Total:</b> ' + d.totalAyat + ' ayat</span>';
            }
            item += '</div>';

            // Grid nilai
            item += '<div class="nilai-grid">';
            item += renderNilai("Kelancaran", d.kelancaran);
            item += renderNilai("Tahsin", d.tahsin);
            item += renderNilai("Tajwid", d.tajwid);
            item += '</div>';

            // Predikat rata-rata
            if (rataHafalan > 0) {
                item +=
                    '<div class="predikat-hafalan ' + predikat.kelas + '">' +
                        '<div class="predikat-hafalan-label">' +
                            '<i class="fas fa-star"></i>' +
                            'Rata-rata Predikat' +
                        '</div>' +
                        '<div class="predikat-hafalan-body">' +
                            '<div class="predikat-hafalan-arab">' + predikat.arab + '</div>' +
                            '<div class="predikat-hafalan-info">' +
                                '<div class="predikat-hafalan-latin">' + predikat.predikat + '</div>' +
                                '<div class="predikat-hafalan-angka">' + rataHafalan.toFixed(1) + '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>';
            }

            // Tasmi
            if (tasmi) {
                const iconTasmi = tasmi === "Sudah" ? "check-circle" : "times-circle";
                const classTasmi = tasmi === "Sudah" ? "tasmi-sudah" : "tasmi-belum";
                item +=
                    '<div class="tasmi-box ' + classTasmi + '">' +
                        '<i class="fas fa-' + iconTasmi + '"></i>' +
                        '<span>Tasmi: <b>' + tasmi + '</b></span>' +
                    '</div>';
            }

            // Catatan
            if (d.catatan) {
                item +=
                    '<div class="hafalan-catatan">' +
                        '<i class="fas fa-comment"></i>' +
                        '<div>' +
                            '<div class="catatan-label">Catatan</div>' +
                            '<div class="catatan-isi">' + d.catatan + '</div>' +
                        '</div>' +
                    '</div>';
            }

            // Motivasi
            if (d.motivasi) {
                item +=
                    '<div class="hafalan-motivasi">' +
                        '<i class="fas fa-heart"></i>' +
                        '<div>' +
                            '<div class="motivasi-label">Motivasi</div>' +
                            '<div class="motivasi-isi">' + d.motivasi + '</div>' +
                        '</div>' +
                    '</div>';
            }

            item += '</div>';
            html += item;
        });

        if (html === "") html = "<p>Belum ada data hafalan.</p>";
        document.getElementById("hasilHafalan").innerHTML = html;

    } catch (e) {
        console.error("Error hafalan:", e);
        document.getElementById("hasilHafalan").innerHTML = "<p>Error memuat data.</p>";
    }
}


/* ==========================================================
   KEHADIRAN — dengan konversi persen
   ========================================================== */

async function loadKehadiran(idSantri) {
    console.log("loadKehadiran:", idSantri);

    try {
        const snap = await window.db.collection("kehadiran_santri")
            .where("id_santri", "==", idSantri)
            .get();

        let hadir = 0, izin = 0, sakit = 0, alpha = 0;
        const dataList = [];

        snap.forEach(function(doc) {
            const d = doc.data();
            dataList.push(d);
            const status = (d.status || "").toLowerCase();
            if (status === "hadir") hadir++;
            else if (status === "izin") izin++;
            else if (status === "sakit") sakit++;
            else if (status === "alpha" || status === "alpa") alpha++;
        });

        const total = hadir + izin + sakit + alpha;
        const persenHadir = total > 0 ? (hadir / total) * 100 : 0;

        // Konversi persen ke huruf + angka
        const konversi = konversiPersenKehadiran(persenHadir);

        // Konversi angka ke predikat (Mumtaz/Jayyid/dll)
        const predikat = angkaKeHuruf(konversi.angka);

        // Format persen: tanpa desimal kalau bulat
        function formatPersen(nilai) {
            if (nilai % 1 === 0) return nilai + "%";
            return nilai.toFixed(1) + "%";
        }

        // Urutkan berdasarkan tanggal terbaru
        dataList.sort(function(a, b) {
            return (b.tanggal || "").localeCompare(a.tanggal || "");
        });

        let html = "";

        if (snap.size > 0) {
            // Statistik ringkas
            html +=
                '<div class="statistik-kehadiran">' +
                    '<div class="stat-item stat-hadir">' +
                        '<div class="stat-angka">' + hadir + '</div>' +
                        '<div class="stat-label">Hadir</div>' +
                    '</div>' +
                    '<div class="stat-item stat-izin">' +
                        '<div class="stat-angka">' + izin + '</div>' +
                        '<div class="stat-label">Izin</div>' +
                    '</div>' +
                    '<div class="stat-item stat-sakit">' +
                        '<div class="stat-angka">' + sakit + '</div>' +
                        '<div class="stat-label">Sakit</div>' +
                    '</div>' +
                    '<div class="stat-item stat-alpha">' +
                        '<div class="stat-angka">' + alpha + '</div>' +
                        '<div class="stat-label">Alpha</div>' +
                    '</div>' +
                '</div>';

            // Kartu Nilai Kehadiran (persen + huruf + arab)
            html +=
                '<div class="nilai-kehadiran-box ' + predikat.kelas + '">' +
                    '<div class="nilai-kehadiran-header">' +
                        '<i class="fas fa-award"></i>' +
                        'Nilai Kehadiran' +
                    '</div>' +
                    '<div class="nilai-kehadiran-body">' +
                        '<div class="nilai-kehadiran-persen">' +
                            '<div class="persen-angka">' + formatPersen(persenHadir) + '</div>' +
                            '<div class="persen-label">Kehadiran</div>' +
                        '</div>' +
                        '<div class="nilai-kehadiran-divider"></div>' +
                        '<div class="nilai-kehadiran-nilai">' +
                            '<div class="nilai-angka-besar">' + konversi.angka + '</div>' +
                            '<div class="nilai-huruf-besar">' + konversi.huruf + '</div>' +
                        '</div>' +
                        '<div class="nilai-kehadiran-divider"></div>' +
                        '<div class="nilai-kehadiran-predikat">' +
                            '<div class="predikat-arab-besar">' + predikat.arab + '</div>' +
                            '<div class="predikat-latin-besar">' + predikat.predikat + '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>';
        }

        // Detail per tanggal
        dataList.forEach(function(d) {
            const status = (d.status || "-").toLowerCase();
            let badgeClass = "badge-alpha";
            if (status === "hadir") badgeClass = "badge-hadir";
            else if (status === "izin") badgeClass = "badge-izin";
            else if (status === "sakit") badgeClass = "badge-sakit";

            html +=
                '<div class="kehadiran-item">' +
                    '<div class="kehadiran-tanggal">' +
                        '<i class="fas fa-calendar-day"></i>' +
                        (d.tanggal || "-") +
                    '</div>' +
                    '<span class="badge ' + badgeClass + '">' + (d.status || "-") + '</span>' +
                '</div>';
        });

        if (snap.size === 0) html = "<p>Belum ada data kehadiran.</p>";
        document.getElementById("hasilKehadiran").innerHTML = html;

    } catch (e) {
        console.error("Error kehadiran:", e);
        document.getElementById("hasilKehadiran").innerHTML = "<p>Error memuat data.</p>";
    }
}

/* ==========================================================
   IBADAH & AKHLAQ — dengan predikat Islami
   ========================================================== */

async function loadIbadah(idSantri) {
    console.log("loadIbadah:", idSantri);

    try {
        const snap = await window.db.collection("ibadah_akhlaq_santri")
            .where("id_santri", "==", idSantri)
            .get();

        const dataList = [];
        snap.forEach(function(doc) {
            dataList.push(doc.data());
        });

        dataList.sort(function(a, b) {
            return (b.tanggal || "").localeCompare(a.tanggal || "");
        });

        function kataToAngka(kata) {
            if (!kata) return 0;
            const k = String(kata).trim().toLowerCase();
            if (k === "sangat baik") return 95;
            if (k === "baik")        return 80;
            if (k === "cukup")       return 70;
            if (k === "kurang")      return 50;
            return 0;
        }

        function detailAngka(angka) {
            if (!angka || angka === 0) return null;
            if (angka >= 90) return { angka: angka, huruf: "A", latin: "Mumtaz",        arab: "ممتاز" };
            if (angka >= 80) return { angka: angka, huruf: "B", latin: "Jayyid Jiddan", arab: "جيد جداً" };
            if (angka >= 70) return { angka: angka, huruf: "C", latin: "Jayyid",        arab: "جيد" };
            if (angka >= 60) return { angka: angka, huruf: "D", latin: "Maqbul",        arab: "مقبول" };
            return                { angka: angka, huruf: "E", latin: "Dho'if",        arab: "ضعيف" };
        }

        function kelasNilai(huruf) {
            if (huruf === "A") return "nilai-a";
            if (huruf === "B") return "nilai-b";
            if (huruf === "C") return "nilai-c";
            if (huruf === "D") return "nilai-d";
            if (huruf === "E") return "nilai-e";
            return "nilai-default";
        }

        // ============================================
        // URUTAN & LABEL (URUT SESUAI PERMINTAAN)
        // ============================================
        const urutanIbadah = ["subuh", "dzuhur", "ashar", "maghrib", "isya", "tilawah"];
        const labelIbadah = {
            subuh:   "Subuh",
            dzuhur:  "Dzuhur",
            ashar:   "Ashar",
            maghrib: "Maghrib",
            isya:    "Isya",
            tilawah: "Tilawah"
        };

        const urutanAkhlaq = ["adabGuru", "adabOrtu", "disiplin", "kebersihan"];
        const labelAkhlaq = {
            adabGuru:   "Adab pada Guru",
            adabOrtu:   "Adab pada Orang Tua",
            disiplin:   "Kedisiplinan",
            kebersihan: "Kebersihan"
        };

        function renderNestedItem(label, kata) {
            const angka = kataToAngka(kata);
            const detail = detailAngka(angka);

            if (!detail) {
                return '<div class="nested-item">' +
                       '<div class="nested-item-header">' +
                       '<span class="nested-label">' + label + '</span>' +
                       '</div>' +
                       '<div class="nested-item-kata">-</div>' +
                       '</div>';
            }

            return '<div class="nested-item ' + kelasNilai(detail.huruf) + '">' +
                       '<div class="nested-item-header">' +
                           '<span class="nested-label">' + label + '</span>' +
                           '<span class="nested-huruf">' + detail.huruf + '</span>' +
                       '</div>' +
                       '<div class="nested-item-body">' +
                           '<span class="nested-angka">' + detail.angka + '</span>' +
                           '<span class="nested-arab">' + detail.arab + '</span>' +
                       '</div>' +
                       '<div class="nested-item-kata">' + kata + '</div>' +
                   '</div>';
        }

        let html = "";

        dataList.forEach(function(d) {
            // HITUNG RATA-RATA IBADAH - URUT
            let nilaiIbadahList = [];
            if (d.ibadah && typeof d.ibadah === "object") {
                urutanIbadah.forEach(function(key) {
                    if (d.ibadah[key]) {
                        const n = kataToAngka(d.ibadah[key]);
                        if (n > 0) nilaiIbadahList.push(n);
                    }
                });
            }
            const rataIbadah = nilaiIbadahList.length > 0 ?
                nilaiIbadahList.reduce(function(a, b) { return a + b; }, 0) / nilaiIbadahList.length : 0;

            // HITUNG RATA-RATA AKHLAQ - URUT
            let nilaiAkhlaqList = [];
            if (d.akhlaq && typeof d.akhlaq === "object") {
                urutanAkhlaq.forEach(function(key) {
                    if (d.akhlaq[key]) {
                        const n = kataToAngka(d.akhlaq[key]);
                        if (n > 0) nilaiAkhlaqList.push(n);
                    }
                });
            }
            const rataAkhlaq = nilaiAkhlaqList.length > 0 ?
                nilaiAkhlaqList.reduce(function(a, b) { return a + b; }, 0) / nilaiAkhlaqList.length : 0;

            // PREDIKAT TOTAL
            let rataTotal = 0;
            if (rataIbadah > 0 && rataAkhlaq > 0) {
                rataTotal = (rataIbadah + rataAkhlaq) / 2;
            } else if (rataIbadah > 0) {
                rataTotal = rataIbadah;
            } else if (rataAkhlaq > 0) {
                rataTotal = rataAkhlaq;
            }

            const detailIbadah = detailAngka(rataIbadah);
            const detailAkhlaq = detailAngka(rataAkhlaq);
            const detailTotal  = detailAngka(rataTotal);

            // RENDER DETAIL NESTED - URUT
            let detailIbadahHtml = "";
            if (d.ibadah && typeof d.ibadah === "object") {
                urutanIbadah.forEach(function(key) {
                    if (d.ibadah[key] !== undefined) {
                        detailIbadahHtml += renderNestedItem(labelIbadah[key] || key, d.ibadah[key]);
                    }
                });
            }

            let detailAkhlaqHtml = "";
            if (d.akhlaq && typeof d.akhlaq === "object") {
                urutanAkhlaq.forEach(function(key) {
                    if (d.akhlaq[key] !== undefined) {
                        detailAkhlaqHtml += renderNestedItem(labelAkhlaq[key] || key, d.akhlaq[key]);
                    }
                });
            }

            let item = '<div class="ibadah-item">';

            // Header tanggal
            item +=
                '<div class="ibadah-header">' +
                    '<span class="ibadah-tanggal">' +
                        '<i class="fas fa-calendar-day"></i>' +
                        (d.tanggal || "-") +
                    '</span>' +
                '</div>';

            // 3 Kotak Ringkasan
            item += '<div class="ringkasan-grid">';

            if (detailIbadah) {
                item +=
                    '<div class="ringkasan-box ' + kelasNilai(detailIbadah.huruf) + '">' +
                        '<div class="ringkasan-title">' +
                            '<i class="fas fa-mosque"></i> Ibadah' +
                        '</div>' +
                        '<div class="ringkasan-arab">' + detailIbadah.arab + '</div>' +
                        '<div class="ringkasan-latin">' + detailIbadah.latin + '</div>' +
                        '<div class="ringkasan-nilai">' +
                            '<span class="ringkasan-angka">' + rataIbadah.toFixed(1) + '</span>' +
                            '<span class="ringkasan-huruf">' + detailIbadah.huruf + '</span>' +
                        '</div>' +
                    '</div>';
            }

            if (detailAkhlaq) {
                item +=
                    '<div class="ringkasan-box ' + kelasNilai(detailAkhlaq.huruf) + '">' +
                        '<div class="ringkasan-title">' +
                            '<i class="fas fa-heart"></i> Akhlaq' +
                        '</div>' +
                        '<div class="ringkasan-arab">' + detailAkhlaq.arab + '</div>' +
                        '<div class="ringkasan-latin">' + detailAkhlaq.latin + '</div>' +
                        '<div class="ringkasan-nilai">' +
                            '<span class="ringkasan-angka">' + rataAkhlaq.toFixed(1) + '</span>' +
                            '<span class="ringkasan-huruf">' + detailAkhlaq.huruf + '</span>' +
                        '</div>' +
                    '</div>';
            }

            if (detailTotal) {
                item +=
                    '<div class="ringkasan-box ringkasan-total ' + kelasNilai(detailTotal.huruf) + '">' +
                        '<div class="ringkasan-title">' +
                            '<i class="fas fa-star"></i> Predikat' +
                        '</div>' +
                        '<div class="ringkasan-arab">' + detailTotal.arab + '</div>' +
                        '<div class="ringkasan-latin">' + detailTotal.latin + '</div>' +
                        '<div class="ringkasan-nilai">' +
                            '<span class="ringkasan-angka">' + rataTotal.toFixed(1) + '</span>' +
                            '<span class="ringkasan-huruf">' + detailTotal.huruf + '</span>' +
                        '</div>' +
                    '</div>';
            }

            item += '</div>';

            // Detail Ibadah
            if (detailIbadahHtml) {
                item +=
                    '<div class="nested-section">' +
                        '<div class="nested-title">' +
                            '<i class="fas fa-mosque"></i> Detail Ibadah' +
                        '</div>' +
                        '<div class="nested-grid">' + detailIbadahHtml + '</div>' +
                    '</div>';
            }

            // Detail Akhlaq
            if (detailAkhlaqHtml) {
                item +=
                    '<div class="nested-section">' +
                        '<div class="nested-title">' +
                            '<i class="fas fa-heart"></i> Detail Akhlaq' +
                        '</div>' +
                        '<div class="nested-grid">' + detailAkhlaqHtml + '</div>' +
                    '</div>';
            }

            // Catatan
            if (d.catatan) {
                item +=
                    '<div class="ibadah-catatan">' +
                        '<i class="fas fa-comment"></i>' +
                        '<div>' +
                            '<div class="catatan-label">Catatan Musyrif</div>' +
                            '<div class="catatan-isi">' + d.catatan + '</div>' +
                        '</div>' +
                    '</div>';
            }

            item += '</div>';
            html += item;
        });

        if (html === "") html = "<p>Belum ada data ibadah & akhlak.</p>";
        document.getElementById("hasilIbadah").innerHTML = html;

    } catch (e) {
        console.error("Error ibadah:", e);
        document.getElementById("hasilIbadah").innerHTML = "<p>Error memuat data.</p>";
    }
}

/* ==========================================================================
   DROPDOWN & SEARCH SANTRI
   ========================================================================== */

// Load semua santri saat halaman siap
async function loadSemuaSantri() {
    console.log("📋 Loading daftar santri...");
    try {
        const snap = await window.db.collection("pendaftaran_santri")
            .orderBy("id_santri")
            .get();
        
        semuaSantri = [];
        snap.forEach(function(doc) {
            const d = doc.data();
            if (d.id_santri) {
                semuaSantri.push({
                    id: d.id_santri,
                    nama: d.nama_santri || "-",
                    kelas: d.tingkat_unit || "-",
                    tgl_lahir: d.tgl_lahir || ""
                });
            }
        });
        
        console.log("✅ Total santri:", semuaSantri.length);
    } catch (e) {
        console.error("❌ Error load santri:", e);
    }
}

// Setup event listener untuk search
function setupSearchSantri() {
    const inputNis = document.getElementById("nis");
    const dropdown = document.getElementById("dropdownSantri");
    
    if (!inputNis || !dropdown) return;
    
    // Fokus input → tampilkan dropdown
    inputNis.addEventListener("focus", function() {
        showDropdown(inputNis.value);
    });
    
    // Ketik → filter dropdown
    inputNis.addEventListener("input", function() {
        showDropdown(inputNis.value);
    });
    
    // Klik di luar → sembunyikan dropdown
    document.addEventListener("click", function(e) {
        if (!e.target.closest(".search-wrapper")) {
            dropdown.style.display = "none";
        }
    });
    
    // Keyboard navigation (Arrow Up/Down/Enter)
    inputNis.addEventListener("keydown", function(e) {
        const items = dropdown.querySelectorAll(".dropdown-item");
        if (items.length === 0) return;
        
        let activeIdx = Array.from(items).findIndex(item => item.classList.contains("active"));
        
        if (e.key === "ArrowDown") {
            e.preventDefault();
            if (activeIdx < items.length - 1) activeIdx++;
            else activeIdx = 0;
            setActive(items, activeIdx);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (activeIdx > 0) activeIdx--;
            else activeIdx = items.length - 1;
            setActive(items, activeIdx);
        } else if (e.key === "Enter") {
            if (activeIdx >= 0) {
                e.preventDefault();
                items[activeIdx].click();
            }
        } else if (e.key === "Escape") {
            dropdown.style.display = "none";
        }
    });
}

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