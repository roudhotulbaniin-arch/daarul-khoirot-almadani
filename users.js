// ================================================================
// USERS.JS — Kelola User Admin
// ================================================================

import {
    auth,
    db,
    onAuthStateChanged
} from "./firebase.js";

import {
    signOut,
    createUserWithEmailAndPassword
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
//  ELEMEN DOM
// ================================================================

const loadingScreen  = document.getElementById("loadingScreen");
const sidebar        = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const toggleSidebar  = document.getElementById("toggleSidebar");
const btnLogout      = document.getElementById("btnLogout");
const btnTambahUser  = document.getElementById("btnTambahUser");
const btnRefresh     = document.getElementById("btnRefresh");
const inputCari      = document.getElementById("inputCari");
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

    // -- Belum login --
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

        // Tampilkan info admin
        const sidebarNama    = document.getElementById("sidebarNama");
        const sidebarJabatan = document.getElementById("sidebarJabatan");
        const topbarNama     = document.getElementById("topbarNama");
        const topbarRole     = document.getElementById("topbarRole");

        if (sidebarNama)    sidebarNama.textContent    = userData.nama || userData.username || "Admin";
        if (sidebarJabatan) sidebarJabatan.textContent = userData.jabatan || "-";
        if (topbarNama)     topbarNama.textContent     = userData.nama || userData.username || "Admin";
        if (topbarRole)     topbarRole.textContent     = userData.jabatan || "Admin";

        // ✅ SEMBUNYIKAN LOADING
        console.log("✅ Sembunyikan loading screen");
        loadingScreen.classList.add("hidden");

        // Muat data
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
    if (!confirm("Yakin logout?")) return;
    try {
        await signOut(auth);
        sessionStorage.clear();
        window.location.href = "login.html";
    } catch (err) {
        console.error(err);
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
//  STATISTIK
// ================================================================

function updateStatistik() {
    const total    = daftarUser.length;
    const aktif    = daftarUser.filter(u => u.aktif === true).length;
    const nonaktif = total - aktif;

    document.getElementById("statTotal").textContent    = total;
    document.getElementById("statAktif").textContent    = aktif;
    document.getElementById("statNonaktif").textContent = nonaktif;
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

        const okJab = jab === "semua" || u.jabatan === jab;
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
        document.getElementById("infoTotal").textContent = "Menampilkan 0 user";
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

    document.getElementById("infoTotal").textContent =
        `Menampilkan ${filteredUser.length} dari ${daftarUser.length} user`;
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
//  MODAL TAMBAH
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
    bukaModal(modalUser);
});

// ================================================================
//  EDIT
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

    bukaModal(modalUser);
};

// ================================================================
//  SIMPAN
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
            alert("User diperbarui!");
            tutupModal(modalUser);
            await muatDaftarUser();
        } else {
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, "users", cred.user.uid), {
                uid: cred.user.uid,
                nama, username, email, jabatan,
                role: "admin",
                aktif,
                dibuat: Timestamp.now()
            });
            alert("User baru ditambahkan! Silakan login ulang.");
            setTimeout(async () => {
                await signOut(auth);
                window.location.href = "login.html";
            }, 2000);
            return;
        }
    } catch (err) {
        console.error(err);
        let pesan = "Gagal simpan.";
        if (err.code === "auth/email-already-in-use") pesan = "Email sudah dipakai!";
        if (err.code === "auth/weak-password")        pesan = "Password minimal 6 karakter!";
        if (err.code === "auth/invalid-email")        pesan = "Email tidak valid!";
        alert(pesan);
    }

    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-save"></i> Simpan User';
});

// ================================================================
//  TOGGLE STATUS
// ================================================================

window.toggleStatus = async function (uid, current) {
    if (uid === currentAdminUID) {
        alert("Tidak bisa nonaktifkan akun sendiri!");
        return;
    }
    if (!confirm(`Yakin ${current ? "nonaktifkan" : "aktifkan"} user ini?`)) return;

    try {
        await updateDoc(doc(db, "users", uid), { aktif: !current });
        await muatDaftarUser();
    } catch (err) {
        alert("Gagal ubah status.");
    }
};

// ================================================================
//  HAPUS
// ================================================================

window.hapusUser = function (uid) {
    if (uid === currentAdminUID) {
        alert("Tidak bisa hapus akun sendiri!");
        return;
    }
    const u = daftarUser.find(x => x.id === uid);
    if (!u) return;

    currentDeleteUID = uid;
    document.getElementById("namaUserHapus").textContent = u.nama || u.username || u.email;
    bukaModal(modalHapus);
};

document.getElementById("btnKonfirmasiHapus")?.addEventListener("click", async () => {
    if (!currentDeleteUID) return;
    try {
        await deleteDoc(doc(db, "users", currentDeleteUID));
        tutupModal(modalHapus);
        currentDeleteUID = null;
        await muatDaftarUser();
    } catch (err) {
        alert("Gagal hapus.");
    }
});

document.getElementById("btnBatalHapus")?.addEventListener("click", () => {
    tutupModal(modalHapus);
});

// ================================================================
//  DETAIL
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
//  TOGGLE PASSWORD
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