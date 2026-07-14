
/* ==========================================================
   PART 10
   EXPORT PDF (jsPDF + AUTOTABLE)
   PRINT + PDF INDIVIDUAL
========================================================== */
/* ==============================
   EXPORT DASHBOARD PDF
============================== */

function pdfCard(pdf, x, y, w, h, title, value) {

    // Shadow
    pdf.setFillColor(220,220,220);
    pdf.roundedRect(x+1, y+1, w, h, 3,3,"F");

    // Card
    pdf.setFillColor(255,255,255);
    pdf.setDrawColor(22,101,52);
    pdf.setLineWidth(0.4);
    pdf.roundedRect(x,y,w,h,3,3,"FD");

// ================= WARNA HEADER =================

let warna = [22, 101, 52]; // Default hijau

switch (title) {

    case "Jumlah Santri":
        warna = [37, 99, 235];     // Biru
        break;

    case "Total Setoran":
        warna = [245, 158, 11];    // Oranye
        break;

    case "Total Ayat":
        warna = [16, 185, 129];    // Emerald
        break;

    case "Total Tasmi":
        warna = [139, 92, 246];    // Ungu
        break;

    case "Rata Hadir":
        warna = [14, 165, 233];    // Sky Blue
        break;

    case "Rata Hafalan":
        warna = [5, 150, 105];     // Hijau Tua
        break;

    case "Rata Ibadah":
        warna = [234, 88, 12];     // Jingga
        break;

    case "Nilai Akhir":
        warna = [220, 38, 38];     // Merah
        break;

    case "Terbaik":
        warna = [202, 138, 4];     // Emas
        break;

    case "Hafalan":
        warna = [34, 197, 94];     // Hijau
        break;

    case "Kehadiran":
        warna = [59, 130, 246];    // Biru
        break;

    case "Ibadah":
        warna = [168, 85, 247];    // Ungu
        break;

}

// Header
pdf.setFillColor(...warna);
pdf.roundedRect(x, y, w, 8, 3, 3, "F");

pdf.setTextColor(255);
pdf.setFont("helvetica", "bold");
pdf.setFontSize(8);
pdf.text(title, x + 3, y + 5.3);

    // Isi
    pdf.setTextColor(30);

    const namaCard = ["Terbaik","Hafalan","Kehadiran","Ibadah"];

    if (namaCard.includes(title)) {

        pdf.setFontSize(10);
        pdf.setFont("helvetica","bold");

        let isi = pdf.splitTextToSize(String(value), w-8);

        if (isi.length > 2) {
            isi = isi.slice(0,2);
            isi[1] += "...";
        }

        pdf.text(isi, x+4, y+15);

    } else {

        pdf.setFontSize(16);
        pdf.setFont("helvetica","bold");

        pdf.text(
            String(value),
            x + w/2,
            y + 18,
            { align: "center" }
        );

    }

}

function tambahHalamanTabel(pdf, judul, periode, kolom, baris) {

    pdf.addPage();

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(15);
    pdf.text(judul, 14, 18);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text("Periode : " + periode, 14, 25);

    pdf.autoTable({

    startY: 32,

    head: [kolom],

    body: baris,

    theme: "grid",

    tableWidth: "auto",

    styles: {
        fontSize: 8,
        cellPadding: 2,
        lineColor: [180,180,180],
        lineWidth: 0.1,
        valign: "middle",
        halign: "center"      // Default semua isi rata tengah
    },

    headStyles: {
        fillColor: [22,101,52],
        textColor: 255,
        halign: "center",
        valign: "middle",
        fontStyle: "bold",
        fontSize: 8
    },

    alternateRowStyles: {
        fillColor: [247,250,247]
    },

    didParseCell(data) {

        // Header selalu rata tengah
        if (data.section === "head") {
            data.cell.styles.halign = "center";
        }

        // Kolom Nama Santri (kolom ke-2) rata kiri
        if (data.section === "body" && data.column.index === 1) {
            data.cell.styles.halign = "left";
        }

    }

});
} 

window.exportToPDF = function () {
    try {
        const data = state.dashboard?.rekap || [];
const rekap = data;

const st = state.dashboard?.statistik || {};
const sm = state.dashboard?.summary || {};
if (!data.length) {
    info("Belum ada data.");
    return;
}

const w = 55;
const h = 25;

const { jsPDF } = window.jspdf;
        
const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4"
});
        
// ================= HALAMAN DASHBOARD =================

const pageWidth = pdf.internal.pageSize.width;

pdf.setFont("helvetica", "bold");
pdf.setFontSize(16);

pdf.text(
    "DASHBOARD ADMIN SANTRI",
    pageWidth / 2,
    15,
    { align: "center" }
);
        
pdf.setFontSize(11);
pdf.setFont("helvetica", "normal");
pdf.text(
    "Daarul Khoirot Al-Madani",
    pageWidth / 2,
    23,
    { align: "center" }
);

pdf.setFont("helvetica", "normal");
pdf.setFontSize(11);
const p = state.dashboard?.periode;

const namaBulan = [
    "Januari","Februari","Maret","April","Mei","Juni",
    "Juli","Agustus","September","Oktober","November","Desember"
];

const periode = p
    ? `${namaBulan[Number(p.bulan) - 1]} ${p.tahun}`
    : "-";
pdf.text("Lembaga Pendidikan Islam Daarul Khoirot Al-Madani", 14, 32);
pdf.text("Periode : " + periode, 14, 38);
pdf.text("Tanggal : " + new Date().toLocaleDateString("id-ID"), 14, 44);

const yCard = 55;

pdfCard(pdf, 15,  yCard,      w, h, "Jumlah Santri", st.jumlahSantri);
pdfCard(pdf, 75,  yCard,      w, h, "Total Setoran", st.totalSetoran);
pdfCard(pdf, 135, yCard,      w, h, "Total Ayat", st.totalAyat);
pdfCard(pdf, 195, yCard,      w, h, "Total Tasmi", st.totalTasmi);

pdfCard(pdf, 15,  yCard + 35, w, h, "Rata Hadir", formatNilai(st.rataKehadiran) + "%");
pdfCard(pdf, 75,  yCard + 35, w, h, "Rata Hafalan", formatNilai(st.rataHafalan));
pdfCard(pdf, 135, yCard + 35, w, h, "Rata Ibadah", formatNilai(st.rataIbadah));
pdfCard(pdf, 195, yCard + 35, w, h, "Nilai Akhir", formatNilai(st.rataNilaiAkhir));

pdfCard(pdf, 15,  yCard + 70, w, h, "Terbaik", sm.terbaik?.nama || "-");
pdfCard(pdf, 75,  yCard + 70, w, h, "Hafalan", sm.hafalan?.nama || "-");
pdfCard(pdf, 135, yCard + 70, w, h, "Kehadiran", sm.hadir?.nama || "-");
pdfCard(pdf, 195, yCard + 70, w, h, "Ibadah", sm.ibadah?.nama || "-");

const kolomKehadiran = [
    "No","Nama Santri","ID Santri","Unit",
    "Hadir","Izin","Sakit","Alpha",
    "Kehadiran (%)","Nilai","Predikat"
];

const barisKehadiran = [];

rekap.forEach((r,i)=>{

    barisKehadiran.push([

        i+1,
        r.nama ?? "-",
        r.id_santri ?? "-",
        r.kelas || r.tingkat_unit || "-",
        r.hadir ?? 0,
        r.izin ?? 0,
        r.sakit ?? 0,
        r.alpha ?? 0,
        formatNilai(r.persenHadir)+"%",
        formatNilai(r.nilaiKehadiran),
        r.predikatKehadiran ?? "-"

    ]);

});

tambahHalamanTabel(
    pdf,
    "DATA KEHADIRAN SANTRI",
    periode,
    kolomKehadiran,
    barisKehadiran
);

const kolomHafalan = [
    "No","Nama Santri","ID Santri","Unit",
    "Hafalan Lama","Hafalan Baru","Akumulasi",
    "Frekuensi","Total Ayat","Tasmi'","Nilai","Predikat"
];

const barisHafalan = [];

rekap.forEach((r,i)=>{

    barisHafalan.push([

        i+1,
        r.nama ?? "-",
        r.id_santri ?? "-",
        r.kelas || r.tingkat_unit || "-",
        r.hafalanLama ?? 0,
        r.hafalanBaru ?? 0,
        r.akumulasi ?? 0,
        r.frekuensi ?? 0,
        r.totalAyat ?? 0,
        r.tasmi ?? 0,
        formatNilai(r.nilaiHafalan),
        r.predikatHafalan ?? "-"

    ]);

});

tambahHalamanTabel(
    pdf,
    "DATA HAFALAN SANTRI",
    periode,
    kolomHafalan,
    barisHafalan
);

const kolomIbadah = [
    "No","Nama Santri","ID Santri","Unit",
    "Nilai Ibadah","Nilai Akhlaq","Rata-rata","Predikat"
];

const barisIbadah = [];

rekap.forEach((r,i)=>{

    barisIbadah.push([

        i+1,
        r.nama ?? "-",
        r.id_santri ?? "-",
        r.kelas || r.tingkat_unit || "-",
        formatNilai(r.nilaiIbadah),
        formatNilai(r.nilaiAkhlaq),
        formatNilai((Number(r.nilaiIbadah)+Number(r.nilaiAkhlaq))/2),
        r.predikatIbadah ?? "-"

    ]);

});

tambahHalamanTabel(
    pdf,
    "DATA IBADAH & AKHLAQ",
    periode,
    kolomIbadah,
    barisIbadah
);

const kolomRekap = [
    "No","Nama Santri","ID Santri","Unit",
    "Kehadiran","Hafalan",
    "Ibadah & Akhlaq",
    "Nilai Akhir","Predikat"
];

const barisRekap = [];

rekap.forEach((r,i)=>{

    barisRekap.push([

        i+1,
        r.nama ?? "-",
        r.id_santri ?? "-",
        r.kelas || r.tingkat_unit || "-",
        formatNilai(r.nilaiKehadiran), 
        formatNilai(r.nilaiHafalan),
        formatNilai(r.nilaiIbadah),
        formatNilai(r.nilaiAkhir),
        r.predikat ?? "-"

    ]);

});

tambahHalamanTabel(
    pdf,
    "REKAPITULASI NILAI AKHIR",
    periode,
    kolomRekap,
    barisRekap
);

const kolomRanking = [
    "No","Nama Santri","ID Santri","Unit",
    "Kehadiran","Hafalan",
    "Ibadah","Nilai Akhir","Predikat"
];

const ranking = [...rekap].sort(
    (a,b)=>(b.nilaiAkhir||0)-(a.nilaiAkhir||0)
);

const barisRanking = [];

ranking.forEach((r,i)=>{

    barisRanking.push([

        i+1,
        r.nama ?? "-",
        r.id_santri ?? "-",
        r.kelas || r.tingkat_unit || "-",
        formatNilai(r.nilaiKehadiran), 
        formatNilai(r.nilaiHafalan),
        formatNilai(r.nilaiIbadah),
        formatNilai(r.nilaiAkhir),
        r.predikat ?? "-"

    ]);

});

tambahHalamanTabel(
    pdf,
    "RANKING SANTRI",
    periode,
    kolomRanking,
    barisRanking
);

        
const pageCount = pdf.internal.getNumberOfPages();

for (let i = 1; i <= pageCount; i++) {

    pdf.setPage(i);

    pdf.setFontSize(8);

    pdf.text(
        "Daarul Khoirot Al-Madani",
        14,
        pdf.internal.pageSize.height - 8
    );

    pdf.text(
        "Halaman " + i + " / " + pageCount,
        pdf.internal.pageSize.width - 35,
        pdf.internal.pageSize.height - 8
    );

}

const tanggal = new Date()
    .toLocaleDateString("id-ID")
    .replaceAll("/", "-");

pdf.save("Dashboard_Santri_" + tanggal + ".pdf");
        sukses("Export PDF Dashboard berhasil.");


    } catch (err) {
        console.error(err);
        gagal("Export PDF gagal.");
    }
};

/* ==============================
   PRINT LAPORAN DASHBOARD
============================== */

window.printLaporan = function () {

    try {

        const area = document.getElementById("boxLaporanRekap");

        if (!area) {
            gagal("Area raport tidak ditemukan.");
            return;
        }

console.log(document.getElementById("txtPeriodeLaporan").textContent);
        const isiRaport = area.innerHTML;

// Ambil URL logo
const logoSrc = document.getElementById("logoRaport")?.src || "";

const win = window.open("", "_blank");     win.document.write(`

        <html>
        <head>

        <title>Raport Santri</title>

<style>

body{
    font-family:Quicksand,sans-serif;
    padding:20px;
    font-size:12px;
}

table{
    width:100%;
    border-collapse:collapse;
}

th,td{
    border:1px solid #333;
    padding:8px;
}

.button-group,
.no-print{
    display:none!important;
}

.sub-judul-rekap{
    margin:18px 0 10px;
    padding:8px 12px;
    border:1px solid #1a5d1a;
    background:#eaf6ea;
    font-weight:bold;
}

.catatan-card,
.motivasi-card{
    border:1px solid #333;
    margin:15px 0;
    overflow:hidden;
}

.catatan-header{
    background:#f3f3f3;
    border-bottom:1px solid #333;
    padding:8px 12px;
    font-weight:bold;
}

.catatan-content{
    padding:12px 15px;
    line-height:1.7;
    min-height:90px;
}

.catatan-item{
    margin-bottom:10px;
}

.catatan-item strong{
    display:block;
    margin-bottom:4px;
}

.form-grid-2{
    display:grid;
    grid-template-columns:repeat(2,1fr);
    gap:10px;
}

.form-grid-2 > div{
    border:1px solid #333;
    padding:8px;
}

.kop-raport{
    display:flex;
    align-items:center;
    gap:18px;
    margin-bottom:18px;
    padding-bottom:12px;
    border-bottom:3px solid #1a5d1a;
}

.raport-header{
    text-align:center;
    margin-bottom:25px;
}

.logo-raport{
    width:55px;
    margin-bottom:8px;
}

.raport-header h1{
    font-size:24px;
    color:#0b6b2c;
    margin:3px 0;
}

.raport-header h2{
    font-size:16px;
    color:#0b6b2c;
    margin:0;
}

.raport-header h3{
    margin-top:10px;
    color:#0b6b2c;
}

.garis-header{
    width:180px;
    height:3px;
    background:#0b6b2c;
    margin:10px auto;
    border-radius:10px;
}

.raport-header p{
    color:#1a5d1a;
    margin-top:8px;
    font-size:15px;
}

.kop-text{
    flex:1;
    text-align:center;
}

.kop-text h1{
    margin:2px 0;
    font-size:24px;
}

.kop-text h2{
    margin:0;
    font-size:17px;
}

.kop-text p{
    margin:2px 0;
    font-size:12px;
}

.nilai-box{
    display:flex;
    gap:12px;
    margin:15px 0 20px;
}

.nilai-box > div{
    flex:1;
    border:1px solid #333;
    background:#e8f5e9;   /* Background hijau muda */
    padding:10px;
    text-align:center;
    box-sizing:border-box;
}

.nilai-box > div strong{
    display:block;
    margin-top:6px;
    font-size:22px;
    font-weight:bold;
    color:#1b5e20;
}

.nilai-box > div:last-child strong{
    font-family:"Amiri","Traditional Arabic",serif;
    font-size:26px;
}


/* ==========================
   AREA TTD
========================== */

.ttd-wrapper{
    margin-top:25px;
    padding:10px;
    border:1px solid #ddd;
    border-radius:12px;
    background:#fafafa;
    overflow:hidden;
}


.ttd-tanggal{
    text-align:right;
    font-size:12px;
    margin-bottom:12px;
}

.ttd-mengetahui{
    text-align:center;
    font-size:12px;
    font-weight:600;
    margin-bottom:10px;
}


.ttd-row{
    display:grid;
    grid-template-columns:repeat(2,1fr);
    gap:40px;
    margin-bottom:20px;
}

.ttd-box{
    width:100%;
    min-width:0;
    text-align:center;
}

.ttd-box p{
    margin:0 0 6px;
    font-size:9px;
    font-weight:600;
    line-height:1.2;
}

.ttd-box b{
    display:block;
    width:100%;
    max-width:100%;
    border-top:1px solid #000;
    padding-top:6px;
    font-size:9px;
    font-weight:700;
    white-space:normal;
    overflow-wrap:break-word;
    box-sizing:border-box;
}

.ttd-space{
    height:40px;
    display:flex;
    justify-content:center;
    align-items:center;
}

/* TTD Bagian Pendidikan */
.ttd{
    width:90px;
    max-width:100%;
    max-height:80px;
    object-fit:contain;
}

/* TTD + Stempel Kepala Lembaga */
.ttd-stempel{
    width:90px;
    max-width:100%;
    max-height:80px;
    object-fit:contain;
}

.ttd-box b{
    display:block;
    width:170px;
    margin:8px auto 0;
    padding-top:6px;
    border-top:1px solid #000;
    font-size:9px;
    font-weight:700;
}

</style>

        </head>


        <body>

            ${isiRaport}

        </body>


        </html>

        `);


        win.document.close();

        win.focus();

        win.print();


        sukses("Raport siap dicetak.");


    } catch(err){

        console.error(err);

        gagal("Cetak raport gagal.");

    }

};

/* ==========================================================
   PART 11 (FINAL)
   UI EXPORT + LOADING + ERROR HANDLER + CLEANUP
========================================================== */

function safeRun(fn, errorMessage="Terjadi kesalahan") {

    try {

        fn();

    } catch(err){

        console.error(err);
        gagal(errorMessage);

    }

}


window.exportDashboardWord = function(){

    safeRun(()=>{

        setLoading(true);

        exportToWord();

        setLoading(false);

    },"Export Word gagal");

};


window.exportDashboardPDF = function(){

    safeRun(()=>{

        setLoading(true);

        exportToPDF();

        setLoading(false);

    },"Export PDF gagal");

};


window.exportPrint = function(){

    safeRun(()=>{

        printLaporan();

    },"Print gagal");

};