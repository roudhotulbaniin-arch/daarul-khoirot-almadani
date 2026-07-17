// ================================================================
// USERS.JS — Kelola User Admin (dengan Reset Password via Email)
// ================================================================

import {
    auth,
    db,
    onAuthStateChanged
} from "./firebase.js";

import {
    signOut,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    Timestamp
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// ================================================================
//  VARIABEL GLOBAL
// ================================================================

let daftarUser       = [];
let filteredUser     = [];
let currentEditUID   = null;
let currentDeleteUID = null;
let currentAdminUID  = null;

// ================================================================

// ================================================================
//  SWEETALERT2 HELPER — Premium Alerts
// ================================================================

// Toast kecil (untuk notifikasi cepat pojok kanan atas)
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: {
        popup: 'swal-toast'
    },
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
});

// Alert Sukses
function alertSukses(judul, pesan = "") {
    return Swal.fire({
        icon: 'success',
        title: judul,
        html: pesan,
        confirmButtonText: '<i class="fas fa-check"></i> OK',
        customClass: { popup: 'swal-premium' },
        buttonsStyling: false
    });
}

// Alert Error
function alertError(judul, pesan = "") {
    return Swal.fire({
        icon: 'error',
        title: judul,
        html: pesan,
        confirmButtonText: '<i class="fas fa-times"></i> Tutup',
        customClass: { 
            popup: 'swal-premium swal-danger'
        },
        buttonsStyling: false
    });
}

// Alert Warning
function alertWarning(judul, pesan = "") {
    return Swal.fire({
        icon: 'warning',
        title: judul,
        html: pesan,
        confirmButtonText: '<i class="fas fa-check"></i> Mengerti',
        customClass: { 
            popup: 'swal-premium swal-warning-header' 
        },
        buttonsStyling: false
    });
}

// Konfirmasi (Ya/Tidak)
function alertKonfirmasi(judul, pesan = "", iconType = 'question') {
    return Swal.fire({
        icon: iconType,
        title: judul,
        html: pesan,
        showCancelButton: true,
        confirmButtonText: '<i class="fas fa-check"></i> Ya, Lanjutkan',
        cancelButtonText: '<i class="fas fa-times"></i> Batal',
        reverseButtons: true,
        customClass: { popup: 'swal-premium' },
        buttonsStyling: false
    });
}

// Konfirmasi Bahaya (untuk hapus)
function alertKonfirmasiHapus(judul, pesan = "") {
    return Swal.fire({
        icon: 'warning',
        title: judul,
        html: pesan,
        showCancelButton: true,
        confirmButtonText: '<i class="fas fa-trash"></i> Ya, Hapus',
        cancelButtonText: '<i class="fas fa-times"></i> Batal',
        reverseButtons: true,
        customClass: { 
            popup: 'swal-premium swal-danger',
            confirmButton: 'swal2-deny'
        },
        buttonsStyling: false
    });
}

// Loading
function alertLoading(judul = "Sedang memproses...") {
    Swal.fire({
        title: judul,
        html: '<div class="loading-spinner-sm" style="margin: 15px auto;"></div>',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        customClass: { popup: 'swal-premium' }
    });
}

//  ELEMEN DOM
// ================================================================

const loadingScreen  = document.getElementById("loadingScreen");
const sidebar        = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const toggleSidebar  = document.getElementById("toggleSidebar");
const btnLogout      = document.getElementById("btnLogout");
const btnTambahUser  = document.getElementById("btnTambahUser");
const btnRefresh     = document.getElementById("btnRefresh");
const inputCari      = document.getElementById("searchInput");
const filterStatus   = document.getElementById("filterStatus");
const filterJabatan  = document.getElementById("filterJabatan");
const userTableBody  = document.getElementById("userTableBody");
const modalUser      = document.getElementById("modalUser");
const modalHapus     = document.getElementById("modalHapus");
const modalDetail    = document.getElementById("modalDetail");
const formUser       = document.getElementById("formUser");

// ================================================================
//  CEK AUTENTIKASI
// ================================================================

console.log("🚀 users.js loaded");

onAuthStateChanged(auth, async (user) => {

    console.log("🔍 Auth state changed:", user?.email || "belum login");

    if (!user) {
        console.log("❌ Belum login → redirect");
        window.location.href = "login.html";
        return;
    }

    try {
        console.log("🔍 Cek user di Firestore, UID:", user.uid);

        const userSnap = await getDoc(doc(db, "users", user.uid));

        if (!userSnap.exists()) {
            console.log("❌ User tidak ada di Firestore");
            alert("Akun Anda tidak terdaftar sebagai admin!");
            await signOut(auth);
            window.location.href = "login.html";
            return;
        }

        const userData = userSnap.data();
        console.log("✅ Data user:", userData);

        if (userData.role !== "admin" || userData.aktif !== true) {
            console.log("❌ Bukan admin aktif");
            alert("Akses ditolak!");
            await signOut(auth);
            window.location.href = "login.html";
            return;
        }

        currentAdminUID = user.uid;

        // Tampilkan info admin di card
        const infoUserEl = document.getElementById("currentUserInfo");
        if (infoUserEl) {
            infoUserEl.innerHTML = `
                <div class="current-user-icon"><i class="fas fa-user-shield"></i></div>
                <div class="current-user-text">
                    <strong>${userData.nama || userData.username || "Admin"}</strong>
                    <small>${userData.jabatan || "Administrator"}</small>
                </div>
            `;
        }

        if (loadingScreen) loadingScreen.classList.add("hidden");

        console.log("🔍 Muat daftar user...");
        await muatDaftarUser();

    } catch (err) {
        console.error("❌ ERROR:", err);
        alert("Error: " + err.message);
        loadingScreen.classList.add("hidden");
    }
});

// ================================================================
//  SIDEBAR
// ================================================================

toggleSidebar?.addEventListener("click", () => {
    sidebar.classList.toggle("open");
});

sidebarOverlay?.addEventListener("click", () => {
    sidebar.classList.remove("open");
});

// ================================================================
//  LOGOUT
// ================================================================

btnLogout?.addEventListener("click", async () => {
    const konfirmasi = await alertKonfirmasi(
        "Yakin Logout?",
        "Anda akan keluar dari sistem admin.",
        'question'
    );
    if (!konfirmasi.isConfirmed) return;
    
    try {
        alertLoading("Sedang logout...");
        await signOut(auth);
        sessionStorage.clear();
        window.location.href = "login.html";
    } catch (err) {
        Swal.close();
        alertError("Gagal Logout", err.message);
    }
});

// ================================================================
//  MUAT USER
// ================================================================

async function muatDaftarUser() {
    tampilkanLoadingTabel();

    try {
        const q = query(collection(db, "users"), orderBy("dibuat", "desc"));
        const snap = await getDocs(q);

        daftarUser = [];
        snap.forEach(d => daftarUser.push({ id: d.id, ...d.data() }));

        console.log("✅ Data user dimuat:", daftarUser.length);

        updateStatistik();
        isiOpsiJabatan();
        applyFilter();

    } catch (err) {
        console.error("❌ Error muat user:", err);
        userTableBody.innerHTML = `
            <tr><td colspan="7" class="td-loading">
                <div class="empty-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h4>Gagal Memuat</h4>
                    <p>${err.message}</p>
                </div>
            </td></tr>`;
    }
}

// ================================================================
//  ISI OPSI FILTER JABATAN
// ================================================================

function isiOpsiJabatan() {
    if (!filterJabatan) return;
    const jabatanSet = [...new Set(daftarUser.map(u => u.jabatan).filter(Boolean))];
    filterJabatan.innerHTML = '<option value="">Semua Jabatan</option>';
    jabatanSet.forEach(j => {
        filterJabatan.innerHTML += `<option value="${j}">${j}</option>`;
    });
}

// ================================================================
//  STATISTIK
// ================================================================

function updateStatistik() {
    const total    = daftarUser.length;
    const aktif    = daftarUser.filter(u => u.aktif === true).length;
    const nonaktif = total - aktif;

    const elTotal    = document.getElementById("statTotalUser");
    const elAktif    = document.getElementById("statUserAktif");
    const elNonaktif = document.getElementById("statUserNonaktif");

    if (elTotal)    elTotal.textContent    = total;
    if (elAktif)    elAktif.textContent    = aktif;
    if (elNonaktif) elNonaktif.textContent = nonaktif;
}

// ================================================================
//  FILTER
// ================================================================

inputCari?.addEventListener("input", applyFilter);
filterStatus?.addEventListener("change", applyFilter);
filterJabatan?.addEventListener("change", applyFilter);

function applyFilter() {
    const kw     = inputCari.value.toLowerCase().trim();
    const status = filterStatus.value;
    const jab    = filterJabatan.value;

    filteredUser = daftarUser.filter(u => {
        const okKw = !kw ||
            (u.nama     && u.nama.toLowerCase().includes(kw)) ||
            (u.username && u.username.toLowerCase().includes(kw)) ||
            (u.email    && u.email.toLowerCase().includes(kw));

        let okSt = true;
        if (status === "aktif")    okSt = u.aktif === true;
        if (status === "nonaktif") okSt = u.aktif !== true;

        const okJab = !jab || jab === "" || u.jabatan === jab;
        return okKw && okSt && okJab;
    });

    renderTabelUser();
}

// ================================================================
//  RENDER TABEL
// ================================================================

const AVATAR_COLORS = ["av-1","av-2","av-3","av-4","av-5","av-6"];

function renderTabelUser() {
    if (filteredUser.length === 0) {
        userTableBody.innerHTML = `
            <tr><td colspan="7" class="td-loading">
                <div class="empty-state">
                    <i class="fas fa-users-slash"></i>
                    <h4>Tidak Ada Data</h4>
                </div>
            </td></tr>`;
        const infoElEmpty = document.getElementById("infoTotal");
        if (infoElEmpty) infoElEmpty.textContent = "Menampilkan 0 user";
        return;
    }

    userTableBody.innerHTML = filteredUser.map((u, i) => {
        const inisial = (u.nama || u.username || u.email || "?").substring(0, 2).toUpperCase();
        const av = AVATAR_COLORS[i % AVATAR_COLORS.length];

        let tgl = "-";
        if (u.dibuat) {
            const d = u.dibuat.toDate ? u.dibuat.toDate() : new Date(u.dibuat);
            tgl = d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
        }

        const badge = u.aktif ? "badge-aktif" : "badge-nonaktif";
        const badgeTxt = u.aktif ? "Aktif" : "Nonaktif";
        const togCls = u.aktif ? "" : "nonaktif";
        const togIcn = u.aktif ? "fa-toggle-on" : "fa-toggle-off";

        return `
            <tr>
                <td class="td-no">${i + 1}</td>
                <td>
                    <div class="user-cell">
                        <div class="user-avatar ${av}">${inisial}</div>
                        <div class="user-info-cell">
                            <strong>${u.nama || "-"}</strong>
                            <small>@${u.username || "-"}</small>
                        </div>
                    </div>
                </td>
                <td class="td-email">${u.email}</td>
                <td class="td-jabatan">${u.jabatan || "-"}</td>
                <td><span class="badge ${badge}">${badgeTxt}</span></td>
                <td>${tgl}</td>
                <td>
                    <div class="aksi-buttons">
                        <button class="btn-detail" onclick="lihatDetail('${u.id}')"><i class="fas fa-eye"></i></button>
                        <button class="btn-edit" onclick="editUser('${u.id}')"><i class="fas fa-pen"></i></button>
                        <button class="btn-toggle-status ${togCls}" onclick="toggleStatus('${u.id}', ${u.aktif})"><i class="fas ${togIcn}"></i></button>
                        <button class="btn-delete" onclick="hapusUser('${u.id}')"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </td>
            </tr>`;
    }).join("");

    const infoElData = document.getElementById("infoTotal");
    if (infoElData) {
        infoElData.textContent = `Menampilkan ${filteredUser.length} dari ${daftarUser.length} user`;
    }
}

function tampilkanLoadingTabel() {
    userTableBody.innerHTML = `
        <tr><td colspan="7" class="td-loading">
            <div class="table-loading">
                <div class="loading-spinner-sm"></div>
                <span>Memuat data...</span>
            </div>
        </td></tr>`;
}

// ================================================================
//  REFRESH
// ================================================================

btnRefresh?.addEventListener("click", async () => {
    btnRefresh.classList.add("spinning");
    await muatDaftarUser();
    setTimeout(() => btnRefresh.classList.remove("spinning"), 600);
});

// ================================================================
//  MODAL TAMBAH USER
// ================================================================

btnTambahUser?.addEventListener("click", () => {
    currentEditUID = null;
    document.getElementById("modalTitle").innerHTML =
        '<i class="fas fa-user-plus"></i> Tambah User Baru';
    formUser.reset();
    
    // Password field: tampil & required
    document.getElementById("groupPassword").style.display = "block";
    document.getElementById("inputPassword").required      = true;
    
    // Email enabled
    document.getElementById("inputEmail").disabled         = false;
    document.getElementById("hintEmail").style.display     = "block";
    
    // Default status aktif
    document.getElementById("inputStatus").value           = "true";
    
    // ⭐ Sembunyikan tombol reset password (khusus mode edit)
    const btnReset = document.getElementById("btnResetPassword");
    if (btnReset) btnReset.style.display = "none";
    
    bukaModal(modalUser);
});

// ================================================================
//  EDIT USER
// ================================================================

window.editUser = function (uid) {
    const u = daftarUser.find(x => x.id === uid);
    if (!u) return;

    currentEditUID = uid;
    document.getElementById("modalTitle").innerHTML =
        '<i class="fas fa-user-edit"></i> Edit User';

    document.getElementById("inputNama").value     = u.nama || "";
    document.getElementById("inputUsername").value = u.username || "";
    document.getElementById("inputEmail").value    = u.email;
    document.getElementById("inputEmail").disabled = true;
    document.getElementById("hintEmail").style.display = "none";
    document.getElementById("inputJabatan").value  = u.jabatan || "";
    document.getElementById("inputStatus").value   = u.aktif ? "true" : "false";
    
    // Sembunyikan field password (pakai tombol reset via email)
    document.getElementById("groupPassword").style.display = "none";
    document.getElementById("inputPassword").required      = false;
    
    // ⭐ Tampilkan tombol reset password
    const btnReset = document.getElementById("btnResetPassword");
    if (btnReset) btnReset.style.display = "inline-flex";

    bukaModal(modalUser);
};

// ================================================================
//  SIMPAN USER (TAMBAH/EDIT)
// ================================================================
formUser?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nama     = document.getElementById("inputNama").value.trim();
    const username = document.getElementById("inputUsername").value.trim();
    const email    = document.getElementById("inputEmail").value.trim();
    const password = document.getElementById("inputPassword").value;
    const jabatan  = document.getElementById("inputJabatan").value;
    const aktif    = document.getElementById("inputStatus").value === "true";

    const btn = document.getElementById("btnSimpanUser");
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';

    try {
        if (currentEditUID) {
            await updateDoc(doc(db, "users", currentEditUID), {
                nama, username, jabatan, aktif
            });
            tutupModal(modalUser);
            await muatDaftarUser();
            Toast.fire({ icon: 'success', title: 'User berhasil diperbarui!' });
        } else {
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, "users", cred.user.uid), {
                uid: cred.user.uid,
                nama, username, email, jabatan,
                role: "admin",
                aktif,
                dibuat: Timestamp.now()
            });
            
            await alertSukses(
                "User Baru Ditambahkan! 🎉",
                `<p><strong>${nama}</strong> berhasil didaftarkan.</p>
                 <p style="font-size:0.82rem; color:#6b7280; margin-top:10px;">
                 <i class="fas fa-info-circle" style="color:#f59e0b;"></i>
                 Anda akan diarahkan ke login untuk masuk ulang.</p>`
            );
            
            await signOut(auth);
            window.location.href = "login.html";
            return;
        }
    } catch (err) {
        console.error(err);
        let pesan = "Terjadi kesalahan saat menyimpan.";
        if (err.code === "auth/email-already-in-use") pesan = "Email sudah digunakan akun lain!";
        if (err.code === "auth/weak-password")        pesan = "Password minimal 6 karakter!";
        if (err.code === "auth/invalid-email")        pesan = "Format email tidak valid!";
        alertError("Gagal Simpan", pesan);
    }

    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-save"></i> Simpan User';
});

// ================================================================
//  RESET PASSWORD VIA EMAIL ⭐
// ================================================================

document.getElementById("btnResetPassword")?.addEventListener("click", async () => {
    if (!currentEditUID) return;
    
    const u = daftarUser.find(x => x.id === currentEditUID);
    if (!u || !u.email) {
        alertError("Email Tidak Ditemukan", "User ini belum memiliki email terdaftar.");
        return;
    }
    
    // ⭐ Tutup modal edit dulu supaya swal jelas kelihatan
    tutupModal(modalUser);
    
    const konfirmasi = await alertKonfirmasi(
        "Kirim Email Reset Password?",
        `... (isi HTML seperti di atas) ...`,
        'question'
    );
    
    if (!konfirmasi.isConfirmed) {
        // Kalau batal, buka lagi modal edit
        bukaModal(modalUser);
        return;
    }
    
    
    const konfirmasi = await alertKonfirmasi(
        "Kirim Email Reset Password?",
        `
        <div style="text-align:left; background:#f9fafb; padding:14px; border-radius:10px; margin-top:10px;">
            <p style="margin:0 0 6px 0;"><strong><i class="fas fa-envelope" style="color:#1a5d1a; margin-right:5px;"></i>Email Tujuan:</strong><br>
            <span style="color:#1a5d1a; font-weight:600;">${u.email}</span></p>
           <p style="margin:6px 0 0 0;"><strong><i class="fas fa-user" style="color:#1a5d1a; margin-right:5px;"></i>Nama User:</strong><br>
            <span style="color:#374151;">${u.nama || u.username}</span></p>
        </div>
        <p style="margin-top:14px; font-size:0.82rem; color:#6b7280;">
            <i class="fas fa-info-circle" style="color:#f59e0b;"></i>
            User akan menerima email dari Firebase berisi link untuk membuat password baru.
        </p>
        `,
        'question'
    );
    
    if (!konfirmasi.isConfirmed) return;
    
    // Loading
    alertLoading("Mengirim email reset...");
    
    try {
        await sendPasswordResetEmail(auth, u.email);
        
        Swal.close();
        await alertSukses(
            "Email Berhasil Dikirim! 🎉",
            `
            <div style="text-align:left; background:#f0fdf4; padding:14px; border-radius:10px; margin-top:10px; border-left:4px solid #10b981;">
                <p style="margin:0;"><strong>📧 Cek Inbox:</strong><br>
                <span style="color:#1a5d1a; font-weight:600;">${u.email}</span></p>
                <p style="margin:8px 0 0 0; font-size:0.82rem; color:#6b7280;">
                    <i class="fas fa-folder-open" style="color:#f59e0b;"></i>
                    Jangan lupa cek folder <strong>Spam/Junk</strong> jika tidak muncul di Inbox.
                </p>
            </div>
            `
        );
    } catch (err) {
        Swal.close();
        console.error("Error reset password:", err);
        let pesan = "Gagal mengirim email reset password.";
        if (err.code === "auth/user-not-found")     pesan = "User tidak terdaftar di Firebase Auth!";
        if (err.code === "auth/invalid-email")      pesan = "Format email tidak valid!";
        if (err.code === "auth/too-many-requests")  pesan = "Terlalu banyak permintaan. Tunggu beberapa menit lalu coba lagi.";
        if (err.code === "auth/network-request-failed") pesan = "Koneksi bermasalah. Cek internet Anda.";
        
        alertError("Gagal Kirim Email", pesan);
    }
});

// ================================================================
//  TOGGLE STATUS
// ================================================================
window.toggleStatus = async function (uid, current) {
    if (uid === currentAdminUID) {
        alertWarning("Aksi Tidak Diizinkan", "Anda tidak bisa menonaktifkan akun sendiri!");
        return;
    }
    
    const aksi = current ? "menonaktifkan" : "mengaktifkan";
    const konfirmasi = await alertKonfirmasi(
        `Yakin ${aksi} user ini?`,
        `Status user akan diubah menjadi <strong>${current ? "Nonaktif" : "Aktif"}</strong>.`,
        current ? 'warning' : 'question'
    );
    
    if (!konfirmasi.isConfirmed) return;

    try {
        await updateDoc(doc(db, "users", uid), { aktif: !current });
        await muatDaftarUser();
        Toast.fire({ 
            icon: 'success', 
            title: `User berhasil ${current ? "dinonaktifkan" : "diaktifkan"}!` 
        });
    } catch (err) {
        alertError("Gagal Ubah Status", err.message);
    }
};

// ================================================================
//  HAPUS USER
// ================================================================
window.hapusUser = async function (uid) {
    if (uid === currentAdminUID) {
        alertWarning("Aksi Tidak Diizinkan", "Anda tidak bisa menghapus akun sendiri!");
        return;
    }
    const u = daftarUser.find(x => x.id === uid);
    if (!u) return;

    const konfirmasi = await alertKonfirmasiHapus(
        "Hapus User Ini?",
        `
        <div style="text-align:left; background:#fef2f2; padding:14px; border-radius:10px; margin-top:10px; border-left:4px solid #ef4444;">
            <p style="margin:0 0 6px 0;"><strong>👤 Nama:</strong> ${u.nama || "-"}</p>
            <p style="margin:0 0 6px 0;"><strong>📧 Email:</strong> ${u.email}</p>
            <p style="margin:0;"><strong>💼 Jabatan:</strong> ${u.jabatan || "-"}</p>
        </div>
        <p style="margin-top:14px; font-size:0.82rem; color:#dc2626; font-weight:600;">
            <i class="fas fa-exclamation-triangle"></i>
            Data yang dihapus TIDAK BISA dikembalikan!
        </p>
        `
    );
    
    if (!konfirmasi.isConfirmed) return;
    
    try {
        alertLoading("Menghapus user...");
        await deleteDoc(doc(db, "users", uid));
        Swal.close();
        await muatDaftarUser();
        Toast.fire({ icon: 'success', title: 'User berhasil dihapus!' });
    } catch (err) {
        Swal.close();
        alertError("Gagal Hapus", err.message);
    }
};

// ================================================================
//  DETAIL USER
// ================================================================

window.lihatDetail = function (uid) {
    const u = daftarUser.find(x => x.id === uid);
    if (!u) return;

    document.getElementById("detailNama").textContent     = u.nama || "-";
    document.getElementById("detailUsername").textContent = "@" + (u.username || "-");
    document.getElementById("detailEmail").textContent    = u.email;
    document.getElementById("detailJabatan").textContent  = u.jabatan || "-";
    document.getElementById("detailRole").textContent     = u.role || "-";
    document.getElementById("detailUID").textContent      = u.uid || u.id;

    document.getElementById("detailStatus").innerHTML = u.aktif
        ? '<span class="badge badge-aktif">Aktif</span>'
        : '<span class="badge badge-nonaktif">Nonaktif</span>';

    let tgl = "-";
    if (u.dibuat) {
        const d = u.dibuat.toDate ? u.dibuat.toDate() : new Date(u.dibuat);
        tgl = d.toLocaleString("id-ID");
    }
    document.getElementById("detailDibuat").textContent = tgl;

    bukaModal(modalDetail);
};

document.getElementById("btnCloseDetail")?.addEventListener("click", () => tutupModal(modalDetail));

// ================================================================
//  TOGGLE PASSWORD (SHOW/HIDE)
// ================================================================

document.getElementById("toggleModalPassword")?.addEventListener("click", () => {
    const inp = document.getElementById("inputPassword");
    const icn = document.getElementById("toggleModalPassword").querySelector("i");
    if (inp.type === "password") {
        inp.type = "text";
        icn.classList.replace("fa-eye", "fa-eye-slash");
    } else {
        inp.type = "password";
        icn.classList.replace("fa-eye-slash", "fa-eye");
    }
});

// ================================================================
//  MODAL HELPER
// ================================================================

function bukaModal(m)  { m.classList.add("show"); document.body.style.overflow = "hidden"; }
function tutupModal(m) { m.classList.remove("show"); document.body.style.overflow = ""; }

document.getElementById("btnCloseModal")?.addEventListener("click", () => {
    tutupModal(modalUser); formUser.reset(); currentEditUID = null;
});

document.getElementById("btnBatal")?.addEventListener("click", () => {
    tutupModal(modalUser); formUser.reset(); currentEditUID = null;
});

document.querySelectorAll(".modal-overlay").forEach(m => {
    m.addEventListener("click", (e) => {
        if (e.target !== m) return;
        tutupModal(m);
    });
});