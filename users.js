// ================================================================
// USERS.JS — Kelola User Admin (FINAL with didOpen Button Fix)
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
//  HELPER — Force Stylize SweetAlert Buttons (Override element.style)
// ================================================================

function stylizeSwalButtons(popup, mode = 'primary') {
    if (!popup) return;
    
    // Container actions
    const actions = popup.querySelector('.swal2-actions');
    if (actions) {
        actions.style.cssText = `
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: nowrap !important;
            gap: 12px !important;
            margin: 22px 0 0 0 !important;
            padding: 0 !important;
            width: 100% !important;
            justify-content: stretch !important;
            align-items: stretch !important;
            box-sizing: border-box !important;
        `;
    }
    
    // Semua tombol — ukuran sama
    popup.querySelectorAll('.swal2-actions button').forEach(btn => {
        // Sembunyikan deny button
        if (btn.classList.contains('swal2-deny')) {
            btn.style.display = 'none';
            return;
        }
        
        // Base style untuk semua tombol
        btn.style.cssText = `
            display: inline-flex !important;
            flex: 1 1 50% !important;
            width: 50% !important;
            min-width: 0 !important;
            max-width: none !important;
            min-height: 50px !important;
            padding: 14px 12px !important;
            font-family: 'Quicksand', sans-serif !important;
            font-size: 0.92rem !important;
            font-weight: 700 !important;
            border-radius: 12px !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 6px !important;
            margin: 0 !important;
            white-space: nowrap !important;
            box-sizing: border-box !important;
            background-image: none !important;
            outline: none !important;
            cursor: pointer !important;
            letter-spacing: 0.3px !important;
            line-height: 1 !important;
            transition: all 0.25s ease !important;
        `;
    });
    
    // Cancel button — abu-abu
    const btnCancel = popup.querySelector('.swal2-cancel');
    if (btnCancel) {
        btnCancel.style.background = '#f3f4f6';
        btnCancel.style.backgroundColor = '#f3f4f6';
        btnCancel.style.color = '#4b5563';
        btnCancel.style.border = '2px solid #e5e7eb';
        btnCancel.style.boxShadow = 'none';
    }
    
    // Confirm button — warna tergantung mode
    const btnConfirm = popup.querySelector('.swal2-confirm');
    if (btnConfirm) {
        if (mode === 'danger') {
            btnConfirm.style.background = 'linear-gradient(135deg, #dc2626, #b91c1c)';
            btnConfirm.style.backgroundColor = '#dc2626';
            btnConfirm.style.color = '#ffffff';
            btnConfirm.style.border = 'none';
            btnConfirm.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.35)';
        } else {
            btnConfirm.style.background = 'linear-gradient(135deg, #1a5d1a, #144514)';
            btnConfirm.style.backgroundColor = '#1a5d1a';
            btnConfirm.style.color = '#ffffff';
            btnConfirm.style.border = 'none';
            btnConfirm.style.boxShadow = '0 4px 12px rgba(26, 93, 26, 0.35)';
        }
    }
}

// Stylize single button (untuk alertSukses, alertError, alertWarning)
function stylizeSingleButton(popup, mode = 'primary') {
    if (!popup) return;
    
    const actions = popup.querySelector('.swal2-actions');
    if (actions) {
        actions.style.cssText = `
            display: flex !important;
            justify-content: center !important;
            margin: 22px 0 0 0 !important;
            padding: 0 !important;
            width: 100% !important;
        `;
    }
    
    const btnConfirm = popup.querySelector('.swal2-confirm');
    if (btnConfirm) {
        btnConfirm.style.cssText = `
            display: inline-flex !important;
            min-width: 140px !important;
            min-height: 50px !important;
            padding: 14px 28px !important;
            font-family: 'Quicksand', sans-serif !important;
            font-size: 0.92rem !important;
            font-weight: 700 !important;
            border-radius: 12px !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 6px !important;
            margin: 0 !important;
            box-sizing: border-box !important;
            background-image: none !important;
            outline: none !important;
            cursor: pointer !important;
            letter-spacing: 0.3px !important;
            line-height: 1 !important;
            transition: all 0.25s ease !important;
            border: none !important;
            color: #ffffff !important;
        `;
        
        if (mode === 'danger') {
            btnConfirm.style.background = 'linear-gradient(135deg, #dc2626, #b91c1c)';
            btnConfirm.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.35)';
        } else if (mode === 'warning') {
            btnConfirm.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
            btnConfirm.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.35)';
        } else if (mode === 'success') {
            btnConfirm.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            btnConfirm.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.35)';
        } else {
            btnConfirm.style.background = 'linear-gradient(135deg, #1a5d1a, #144514)';
            btnConfirm.style.boxShadow = '0 4px 12px rgba(26, 93, 26, 0.35)';
        }
    }
}

// ================================================================
//  SWEETALERT2 HELPERS
// ================================================================

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: { popup: 'swal-toast' },
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
});

function alertSukses(judul, pesan = "") {
    return Swal.fire({
        icon: 'success',
        title: judul,
        html: pesan,
        confirmButtonText: '<i class="fas fa-check"></i> OK',
        customClass: { popup: 'swal-premium' },
        buttonsStyling: false,
        didOpen: (popup) => stylizeSingleButton(popup, 'success')
    });
}

function alertError(judul, pesan = "") {
    return Swal.fire({
        icon: 'error',
        title: judul,
        html: pesan,
        confirmButtonText: '<i class="fas fa-times"></i> Tutup',
        customClass: { popup: 'swal-premium swal-danger' },
        buttonsStyling: false,
        didOpen: (popup) => stylizeSingleButton(popup, 'danger')
    });
}

function alertWarning(judul, pesan = "") {
    return Swal.fire({
        icon: 'warning',
        title: judul,
        html: pesan,
        confirmButtonText: '<i class="fas fa-check"></i> Mengerti',
        customClass: { popup: 'swal-premium' },
        buttonsStyling: false,
        didOpen: (popup) => stylizeSingleButton(popup, 'warning')
    });
}

function alertKonfirmasi(judul, pesan = "", iconType = 'question') {
    return Swal.fire({
        icon: iconType,
        title: judul,
        html: pesan,
        showCancelButton: true,
        showDenyButton: false,
        confirmButtonText: '<i class="fas fa-check"></i> Ya, Lanjutkan',
        cancelButtonText: '<i class="fas fa-times"></i> Batal',
        reverseButtons: true,
        customClass: { popup: 'swal-premium' },
        buttonsStyling: false,
        didOpen: (popup) => stylizeSwalButtons(popup, 'primary')
    });
}

function alertKonfirmasiHapus(judul, pesan = "") {
    return Swal.fire({
        icon: 'warning',
        title: judul,
        html: pesan,
        showCancelButton: true,
        showDenyButton: false,
        confirmButtonText: '<i class="fas fa-trash"></i> Ya, Hapus',
        cancelButtonText: '<i class="fas fa-times"></i> Batal',
        reverseButtons: true,
        focusCancel: true,
        customClass: { popup: 'swal-premium swal-danger' },
        buttonsStyling: false,
        didOpen: (popup) => stylizeSwalButtons(popup, 'danger')
    });
}

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

// ================================================================
//  REGISTER WINDOW FUNCTIONS
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
    document.getElementById("groupPassword").style.display = "none";
    document.getElementById("inputPassword").required      = false;

    const btnReset = document.getElementById("btnResetPassword");
    if (btnReset) btnReset.style.display = "inline-flex";

    bukaModal(modalUser);
};

window.hapusUser = async function (uid) {
    if (uid === currentAdminUID) {
        alertWarning("Aksi Tidak Diizinkan", "Anda tidak bisa menghapus akun sendiri!");
        return;
    }
    const u = daftarUser.find(x => x.id === uid);
    if (!u) {
        alertError("User Tidak Ditemukan", "Data user tidak ada di daftar.");
        return;
    }

    const konf = await alertKonfirmasiHapus(
        "Hapus User Ini?",
        `
        <div style="text-align:left; background:#fef2f2; padding:14px; border-radius:10px; margin-top:10px; border-left:4px solid #ef4444;">
            <p style="margin:0 0 6px 0;"><strong><i class="fas fa-user" style="color:#dc2626; margin-right:6px;"></i>Nama:</strong> ${u.nama || "-"}</p>
            <p style="margin:0 0 6px 0;"><strong><i class="fas fa-envelope" style="color:#dc2626; margin-right:6px;"></i>Email:</strong> ${u.email}</p>
            <p style="margin:0;"><strong><i class="fas fa-briefcase" style="color:#dc2626; margin-right:6px;"></i>Jabatan:</strong> ${u.jabatan || "-"}</p>
        </div>
        <p style="margin-top:14px; font-size:0.82rem; color:#dc2626; font-weight:600;">
            <i class="fas fa-exclamation-triangle"></i>
            Data yang dihapus TIDAK BISA dikembalikan!
        </p>
        `
    );
    
    if (!konf.isConfirmed) return;
    
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

window.toggleStatus = async function (uid, current) {
    if (uid === currentAdminUID) {
        alertWarning("Aksi Tidak Diizinkan", "Anda tidak bisa menonaktifkan akun sendiri!");
        return;
    }
    
    const aksi = current ? "menonaktifkan" : "mengaktifkan";
    const konf = await alertKonfirmasi(
        `Yakin ${aksi} user ini?`,
        `Status user akan diubah menjadi <strong>${current ? "Nonaktif" : "Aktif"}</strong>.`,
        current ? 'warning' : 'question'
    );
    
    if (!konf.isConfirmed) return;

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

console.log("✅ Window functions registered");

// ================================================================
//  VARIABEL GLOBAL
// ================================================================

let daftarUser       = [];
let filteredUser     = [];
let currentEditUID   = null;
let currentAdminUID  = null;

// ================================================================
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
const modalDetail    = document.getElementById("modalDetail");
const formUser       = document.getElementById("formUser");

// ================================================================
//  MODAL HELPER
// ================================================================

function bukaModal(m)  { if (m) { m.classList.add("show"); document.body.style.overflow = "hidden"; } }
function tutupModal(m) { if (m) { m.classList.remove("show"); document.body.style.overflow = ""; } }

// ================================================================
//  CEK AUTENTIKASI
// ================================================================

console.log("🚀 users.js loaded");

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    try {
        const userSnap = await getDoc(doc(db, "users", user.uid));

        if (!userSnap.exists()) {
            await alertError("Akun Tidak Terdaftar", "Akun Anda tidak terdaftar sebagai admin!");
            await signOut(auth);
            window.location.href = "login.html";
            return;
        }

        const userData = userSnap.data();

        if (userData.role !== "admin" || userData.aktif !== true) {
            await alertError("Akses Ditolak", "Anda tidak memiliki izin untuk mengakses halaman ini.");
            await signOut(auth);
            window.location.href = "login.html";
            return;
        }

        currentAdminUID = user.uid;

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

        await muatDaftarUser();

    } catch (err) {
        console.error("❌ ERROR:", err);
        alertError("Terjadi Kesalahan", err.message);
        if (loadingScreen) loadingScreen.classList.add("hidden");
    }
});

// ================================================================
//  SIDEBAR & LOGOUT
// ================================================================

toggleSidebar?.addEventListener("click", () => sidebar.classList.toggle("open"));
sidebarOverlay?.addEventListener("click", () => sidebar.classList.remove("open"));

btnLogout?.addEventListener("click", async () => {
    const konf = await alertKonfirmasi(
        "Yakin Logout?",
        "Anda akan keluar dari sistem admin.",
        'question'
    );
    if (!konf.isConfirmed) return;

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

function isiOpsiJabatan() {
    if (!filterJabatan) return;
    const jabatanSet = [...new Set(daftarUser.map(u => u.jabatan).filter(Boolean))];
    filterJabatan.innerHTML = '<option value="">Semua Jabatan</option>';
    jabatanSet.forEach(j => {
        filterJabatan.innerHTML += `<option value="${j}">${j}</option>`;
    });
}

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

        const okJab = !jab || u.jabatan === jab;
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
                        <button type="button" class="btn-detail" onclick="lihatDetail('${u.id}')" title="Detail"><i class="fas fa-eye"></i></button>
                        <button type="button" class="btn-edit" onclick="editUser('${u.id}')" title="Edit"><i class="fas fa-pen"></i></button>
                        <button type="button" class="btn-toggle-status ${togCls}" onclick="toggleStatus('${u.id}', ${u.aktif})" title="Toggle status"><i class="fas ${togIcn}"></i></button>
                        <button type="button" class="btn-delete" onclick="hapusUser('${u.id}')" title="Hapus"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </td>
            </tr>`;
    }).join("");
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
    document.getElementById("groupPassword").style.display = "block";
    document.getElementById("inputPassword").required      = true;
    document.getElementById("inputEmail").disabled         = false;
    document.getElementById("hintEmail").style.display     = "block";
    document.getElementById("inputStatus").value           = "true";
    
    const btnReset = document.getElementById("btnResetPassword");
    if (btnReset) btnReset.style.display = "none";
    
    bukaModal(modalUser);
});

// ================================================================
//  SIMPAN USER
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
//  RESET PASSWORD VIA EMAIL
// ================================================================

document.getElementById("btnResetPassword")?.addEventListener("click", async () => {
    if (!currentEditUID) return;
    
    const u = daftarUser.find(x => x.id === currentEditUID);
    if (!u || !u.email) {
        alertError("Email Tidak Ditemukan", "User ini belum memiliki email terdaftar.");
        return;
    }
    
    tutupModal(modalUser);
    
    const konf = await alertKonfirmasi(
        "Kirim Email Reset Password?",
        `
        <div style="text-align:left; background:#f9fafb; padding:14px; border-radius:10px; margin-top:10px;">
            <p style="margin:0 0 8px 0;">
                <strong><i class="fas fa-envelope" style="color:#1a5d1a; margin-right:6px;"></i>Email Tujuan:</strong><br>
                <span style="color:#1a5d1a; font-weight:600; word-break:break-all;">${u.email}</span>
            </p>
            <p style="margin:8px 0 0 0;">
                <strong><i class="fas fa-user" style="color:#1a5d1a; margin-right:6px;"></i>Nama User:</strong><br>
                <span style="color:#374151;">${u.nama || u.username}</span>
            </p>
        </div>
        <p style="margin-top:14px; font-size:0.82rem; color:#6b7280;">
            <i class="fas fa-info-circle" style="color:#f59e0b; margin-right:4px;"></i>
            User akan menerima email dari Firebase berisi link untuk membuat password baru.
        </p>
        `,
        'question'
    );
    
    if (!konf.isConfirmed) {
        bukaModal(modalUser);
        return;
    }
    
    alertLoading("Mengirim email reset...");
    
    try {
        await sendPasswordResetEmail(auth, u.email);
        Swal.close();
        await alertSukses(
            "Email Berhasil Dikirim! 🎉",
            `
            <div style="text-align:left; background:#f0fdf4; padding:14px; border-radius:10px; margin-top:10px; border-left:4px solid #10b981;">
                <p style="margin:0;">
                    <strong><i class="fas fa-envelope-open-text" style="color:#10b981; margin-right:6px;"></i>Cek Inbox:</strong><br>
                    <span style="color:#1a5d1a; font-weight:600; word-break:break-all;">${u.email}</span>
                </p>
                <p style="margin:8px 0 0 0; font-size:0.82rem; color:#6b7280;">
                    <i class="fas fa-folder-open" style="color:#f59e0b;"></i>
                    Jangan lupa cek folder <strong>Spam/Junk</strong>.
                </p>
            </div>
            `
        );
    } catch (err) {
        Swal.close();
        let pesan = "Gagal mengirim email reset password.";
        if (err.code === "auth/user-not-found")     pesan = "User tidak terdaftar di Firebase Auth!";
        if (err.code === "auth/invalid-email")      pesan = "Format email tidak valid!";
        if (err.code === "auth/too-many-requests")  pesan = "Terlalu banyak permintaan. Tunggu beberapa menit.";
        if (err.code === "auth/network-request-failed") pesan = "Koneksi bermasalah. Cek internet Anda.";
        alertError("Gagal Kirim Email", pesan);
    }
});

// ================================================================
//  TOGGLE PASSWORD & MODAL CLOSE
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

document.getElementById("btnCloseModal")?.addEventListener("click", () => {
    tutupModal(modalUser); formUser.reset(); currentEditUID = null;
});

document.getElementById("btnBatal")?.addEventListener("click", () => {
    tutupModal(modalUser); formUser.reset(); currentEditUID = null;
});

document.getElementById("btnCloseDetail")?.addEventListener("click", () => tutupModal(modalDetail));

document.querySelectorAll(".modal-overlay").forEach(m => {
    m.addEventListener("click", (e) => {
        if (e.target !== m) return;
        tutupModal(m);
    });
});