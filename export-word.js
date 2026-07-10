/* ==========================================================
   PART 9
   EXPORT WORD (.DOCX)
========================================================== */

// ======================================
// THEME
// ======================================

const THEME = {
    primary: "166534",
    secondary: "16A34A",
    light: "F3F4F6",
    border: "D1D5DB",
    white: "FFFFFF",
    text: "111827"
};

const CARD = {

    santri: "2563EB",
    setoran: "16A34A",
    ayat: "9333EA",
    tasmi: "EA580C",

    hadir: "0891B2",
    hafalan: "059669",
    ibadah: "D97706",
    nilai: "DC2626",

    terbaik: "CA8A04",
    juaraHafalan: "7C3AED",
    juaraHadir: "4338CA",
    juaraIbadah: "0F766E"

};

// ======================================
// HEADER DASHBOARD
// ======================================

function buatHeaderDashboard(logoBytes, periode) {

    return [

        new docx.Paragraph({
            alignment: docx.AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
                new docx.ImageRun({
                    data: logoBytes,
                    transformation: {
                        width: 90,
                        height: 90
                    }
                })
            ]
        }),

        new docx.Paragraph({
            alignment: docx.AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [
                new docx.TextRun({
                    text: "DASHBOARD ADMIN SANTRI",
                    bold: true,
                    size: 34
                })
            ]
        }),

        new docx.Paragraph({
            alignment: docx.AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
                new docx.TextRun({
                    text: "Daarul Khoirot Al-Madani",
                    italics: true,
                    size: 24
                })
            ]
        }),

        new docx.Paragraph({
            alignment: docx.AlignmentType.CENTER,
            spacing: { after: 40 },
            children: [
                new docx.TextRun({
                    text: "Periode : " + periode,
                    bold: true,
                    size: 22
                })
            ]
        }),

        new docx.Paragraph({
            alignment: docx.AlignmentType.CENTER,
            spacing: { after: 250 },
            children: [
                new docx.TextRun({
                    text: "Tanggal Cetak : " +
                        new Date().toLocaleDateString("id-ID"),
                    size: 20
                })
            ]
        })

    ];

}

// ======================================
// JUDUL HALAMAN
// ======================================

function buatJudulHalaman(judul, subjudul = "") {

    return [

        new docx.Paragraph({

            alignment: docx.AlignmentType.CENTER,

            spacing: {
                before: 120,
                after: 80
            },

            children: [

                new docx.TextRun({

                    text: judul,

                    bold: true,

                    size: 32

                })

            ]

        }),

        ...(subjudul ? [

            new docx.Paragraph({

                alignment: docx.AlignmentType.CENTER,

                spacing: {
                    after: 220
                },

                children: [

                    new docx.TextRun({

                        text: subjudul,

                        italics: true,

                        size: 22

                    })

                ]

            })

        ] : [])

    ];

}

// ======================================
// SECTION
// ======================================

function buatSection(title) {

    return new docx.Paragraph({

        spacing: {

            before: 220,

            after: 120

        },

        border: {

            bottom: {

                style: docx.BorderStyle.SINGLE,

                size: 8,

                color: THEME.primary

            }

        },

        children: [

            new docx.TextRun({

                text: title,

                bold: true,

                size: 26,

                color: THEME.primary

            })

        ]

    });

}

// ======================================
// CELL HEADER
// ======================================

function cell(text, width) {

    return new docx.TableCell({

        width: {
            size: width,
            type: docx.WidthType.DXA
        },

        children: [

            new docx.Paragraph({

                spacing: {
                    before: 0,
                    after: 0
                },

                children: [
                    new docx.TextRun(
                        String(text ?? "-")
                    )
                ]

            })

        ]

    });

}


function cellHeader(text, width) {

    return new docx.TableCell({

        width: {
            size: width,
            type: docx.WidthType.DXA
        },

        shading: {
            fill: "166534"
        },

        children: [

            new docx.Paragraph({

                alignment: docx.AlignmentType.CENTER,

                spacing: {
                    before: 0,
                    after: 0
                },

                children: [
                    new docx.TextRun({
                        text: text,
                        bold: true,
                        color: "FFFFFF"
                    })
                ]

            })

        ]

    });

}

// ======================================
// TABLE
// ======================================

function buatTabel(headers, rows, options = {}) {

    return new docx.Table({

        width: {
            size: 100,
            type: docx.WidthType.PERCENTAGE
        },

        rows: [

            new docx.TableRow({

                tableHeader: true,

                children: headers.map(cellHeader)

            }),

            ...rows.map(row =>

                new docx.TableRow({

                    children: row.map(cell)

                })

            )

        ]

    });

}

function dashboardCard(judul, nilai, warna = "166534") {

    return new docx.TableCell({

        width: {
            size: 25,
            type: docx.WidthType.PERCENTAGE
        },

        shading: {
            type: docx.ShadingType.CLEAR,
            fill: warna
        },

        margins: {
            top: 140,
            bottom: 140,
            left: 120,
            right: 120
        },

        borders: {

            top: {
                style: docx.BorderStyle.SINGLE,
                color: warna,
                size: 6
            },

            bottom: {
                style: docx.BorderStyle.SINGLE,
                color: warna,
                size: 6
            },

            left: {
                style: docx.BorderStyle.SINGLE,
                color: warna,
                size: 6
            },

            right: {
                style: docx.BorderStyle.SINGLE,
                color: warna,
                size: 6
            }

        },

        children: [

            new docx.Paragraph({

                alignment: docx.AlignmentType.CENTER,

                children: [

                    new docx.TextRun({

                        text: judul,
                        bold: true,
                        color: "FFFFFF",
                        size: 20

                    })

                ]

            }),

            new docx.Paragraph({

                alignment: docx.AlignmentType.CENTER,

                spacing: {
                    before: 120
                },

                children: [

                    new docx.TextRun({

                        text: String(nilai),
                        bold: true,
                        color: "FFFFFF",
                        size: 30

                    })

                ]

            })

        ]

    });

}

function getPredikat(nilai) {

    nilai = Number(nilai) || 0;

    if (nilai >= 90) return "Mumtaz";
    if (nilai >= 80) return "Jayyid Jiddan";
    if (nilai >= 70) return "Jayyid";
    if (nilai >= 60) return "Maqbul";

    return "Perlu Pembinaan";
}

function getPredikatKehadiran(alpha) {

    alpha = Number(alpha) || 0;

    if (alpha === 0) return "Mumtaz";
    if (alpha === 1) return "Jayyid Jiddan";
    if (alpha <= 3) return "Jayyid";
    if (alpha <= 5) return "Maqbul";

    return "Perlu Pembinaan";
}



function formatPredikat(predikat) {
    return predikat || "-";
}

window.exportToWord = async function () {
const logoBytes = await fetch("main_logo.png")
    .then(r => r.arrayBuffer());

    try {

        const rekap = state.dashboard?.rekap || [];
        const st = state.dashboard?.statistik || {};
        const sm = state.dashboard?.summary || {};
        const p = state.dashboard?.periode;


        if (!rekap.length) {

            info("Belum ada data.");
            return;

        }

        const namaBulan = [
            "Januari","Februari","Maret","April","Mei","Juni",
            "Juli","Agustus","September","Oktober","November","Desember"
        ];

        const periode = p
            ? `${namaBulan[Number(p.bulan)-1]} ${p.tahun}`
            : "-";

        const {
    Document,
    Packer,
    Paragraph,
    Table,
    TableRow,
    TableCell,
    WidthType,
    HeadingLevel,
    TextRun,
    ImageRun,
    AlignmentType,
    Footer,
    PageNumber
} = docx;

console.log(JSON.stringify(rekap[0], null, 2));
       const children = [];
      
      // ======================================
// STATISTIK DASHBOARD
// ======================================

const totalSantri = rekap.length;

const totalHadir = rekap.reduce((t, s) => t + (Number(s.hadir) || 0), 0);
const totalIzin = rekap.reduce((t, s) => t + (Number(s.izin) || 0), 0);
const totalSakit = rekap.reduce((t, s) => t + (Number(s.sakit) || 0), 0);
const totalAlpha = rekap.reduce((t, s) => t + (Number(s.alpha) || 0), 0);

const totalSetoran = rekap.reduce((t, s) => t + (Number(s.frekuensi) || 0), 0);
const totalAyat = rekap.reduce((t, s) => t + (Number(s.totalAyat) || 0), 0);
const totalTasmi = rekap.reduce((t, s) => t + (Number(s.tasmi) || 0), 0);

const rataKehadiran = totalSantri
    ? rekap.reduce((t, s) => t + (Number(s.nilaiKehadiran) || 0), 0) / totalSantri
    : 0;

const rataHafalan = totalSantri
    ? rekap.reduce((t, s) => t + (Number(s.nilaiHafalan) || 0), 0) / totalSantri
    : 0;

const rataIbadah = totalSantri
    ? rekap.reduce((t, s) => t + (Number(s.nilaiIbadahAkhlaq) || 0), 0) / totalSantri
    : 0;

const rataNilai = totalSantri
    ? rekap.reduce((t, s) => t + (Number(s.nilaiAkhir) || 0), 0) / totalSantri
    : 0;

const santriTerbaik = totalSantri
    ? [...rekap].sort((a, b) => b.nilaiAkhir - a.nilaiAkhir)[0]
    : null;

// ======================================
// SANTRI TERBAIK
// ======================================

const terbaikHafalan =
    [...rekap]
        .sort((a, b) => b.nilaiHafalan - a.nilaiHafalan)[0]?.nama || "-";

const terbaikKehadiran =
    [...rekap]
        .sort((a, b) => b.nilaiKehadiran - a.nilaiKehadiran)[0]?.nama || "-";

const terbaikIbadah =
    [...rekap]
        .sort((a, b) => b.nilaiIbadahAkhlaq - a.nilaiIbadahAkhlaq)[0]?.nama || "-";

const terbaikNilai =
    [...rekap]
        .sort((a, b) => b.nilaiAkhir - a.nilaiAkhir)[0]?.nama || "-";
       
       
// ======================================
// HEADER DASHBOARD
// ======================================

children.push(
    ...buatHeaderDashboard(
        logoBytes,
        periode
    )
);

children.push(

    new Table({

        width: {
            size: 100,
            type: docx.WidthType.PERCENTAGE
        },

        rows: [

            // BARIS 1

          new TableRow({

    children: [

        dashboardCard("Jumlah Santri", st.jumlahSantri, CARD.santri),

        dashboardCard("Total Setoran", st.totalSetoran, CARD.setoran),

        dashboardCard("Total Ayat", st.totalAyat, CARD.ayat),

        dashboardCard("Total Tasmi'", st.totalTasmi, CARD.tasmi)

    ]

}),

new TableRow({
        height: {
            value: 200,
            rule: docx.HeightRule.EXACT
        },
        children: [
            new TableCell({
                children: [
                    new Paragraph("")
                ],
                columnSpan: 4,
                borders: {
                    top: { style: docx.BorderStyle.NONE },
                    bottom: { style: docx.BorderStyle.NONE },
                    left: { style: docx.BorderStyle.NONE },
                    right: { style: docx.BorderStyle.NONE }
                }
            })
        ]
    }),

            // BARIS 2

            new TableRow({

    children: [

        dashboardCard(
            "Rata Hadir",
            formatNilai(st.rataKehadiran),
            CARD.hadir
        ),

        dashboardCard(
            "Rata Hafalan",
            formatNilai(st.rataHafalan),
            CARD.hafalan
        ),

        dashboardCard(
            "Rata Ibadah",
            formatNilai(st.rataIbadah),
            CARD.ibadah
        ),

        dashboardCard(
            "Nilai Akhir",
            formatNilai(st.rataNilaiAkhir),
            CARD.nilai
        )

    ]

}),

new TableRow({
        height: {
            value: 200,
            rule: docx.HeightRule.EXACT
        },
        children: [
            new TableCell({
                children: [
                    new Paragraph("")
                ],
                columnSpan: 4,
                borders: {
                    top: { style: docx.BorderStyle.NONE },
                    bottom: { style: docx.BorderStyle.NONE },
                    left: { style: docx.BorderStyle.NONE },
                    right: { style: docx.BorderStyle.NONE }
                }
            })
        ]
    }),

            // BARIS 3

          new TableRow({

    children: [

        dashboardCard(
            "Terbaik",
            sm.terbaik?.nama || "-",
            CARD.terbaik
        ),

        dashboardCard(
            "Hafalan",
            sm.hafalan?.nama || "-",
            CARD.juaraHafalan
        ),

        dashboardCard(
            "Kehadiran",
            sm.hadir?.nama || "-",
            CARD.juaraHadir
        ),

        dashboardCard(
            "Ibadah",
            sm.ibadah?.nama || "-",
            CARD.juaraIbadah
        )

    ]

})
        ]

    })

);

// ======================================
// HALAMAN 2 - KEHADIRAN
// ======================================

const tabelKehadiran = buatTabel(

[
    "No",
    "Nama Santri",
    "ID",
    "Kelas",
    "Hadir",
    "Izin",
    "Sakit",
    "Alpha",
    "Kehadiran (%)",
    "Nilai",
    "Predikat"
],

rekap.map((s,i)=>[

    i + 1,
    s.nama,
    s.id_santri,
    s.kelas,
    s.hadir,
    s.izin,
    s.sakit,
    s.alpha,
    s.persenHadir,
    s.nilaiKehadiran,
    s.predikatKehadiran

]),

{
    columnWidths: [
        500,
        2200,
        900,
        1000,
        700,
        700,
        700,
        700,
        1200,
        800,
        1000
    ]
}

);

children.push(

    new Paragraph({
        pageBreakBefore: true
    }),

    ...buatJudulHalaman(
        "KEHADIRAN SANTRI",
        "Daarul Khoirot Al-Madani"
    ),

    buatSection("DATA KEHADIRAN"),

    tabelKehadiran

);

// ======================================
// HALAMAN 3 - HAFALAN
// ======================================


const tabelHafalan = buatTabel(

[
    "No",
    "Nama Santri",
    "ID",
    "Kelas",
    "Lama",
    "Baru",
    "Akumulasi",
    "Frekuensi",
    "Ayat",
    "Tasmi'",
    "Nilai",
    "Predikat"
],

rekap.map((s,i)=>[

    i + 1,
    s.nama,
    s.id_santri,
    s.kelas,
    s.hafalanLama,
    s.hafalanBaru,
    s.akumulasi,
    s.frekuensi,
    s.totalAyat,
    s.tasmi,
    s.nilaiHafalan,
    s.predikatHafalan

]),

{
    columnWidths: [
        450,   // No
        2200,  // Nama Santri
        800,   // ID
        900,   // Kelas
        750,   // Lama
        750,   // Baru
        1000,  // Akumulasi
        900,   // Frekuensi
        800,   // Ayat
        800,   // Tasmi'
        800,   // Nilai
        1000   // Predikat
    ]
}

);

children.push(

    new Paragraph({
        pageBreakBefore: true
    }),

    ...buatJudulHalaman(
        "HAFALAN SANTRI",
        "Daarul Khoirot Al-Madani"
    ),

    buatSection("DATA HAFALAN"),

    tabelHafalan

);

// ======================================
// HALAMAN 4 - IBADAH
// ======================================
const tabelIbadah = buatTabel(

[
    "No",
    "Nama Santri",
    "ID",
    "Kelas",
    "Ibadah",
    "Akhlaq",
    "Rata-rata",
    "Predikat"
],

rekap.map((s,i)=>[

    i + 1,
    s.nama,
    s.id_santri,
    s.kelas,
    s.nilaiIbadah,
    s.nilaiAkhlaq,
    s.nilaiIbadahAkhlaq,
    s.predikatIbadah

]),

{
    columnWidths: [
        500,   // No
        2800,  // Nama Santri
        900,   // ID
        1000,  // Kelas
        1200,  // Ibadah
        1200,  // Akhlaq
        1200,  // Rata-rata
        1200   // Predikat
    ]
}

);

children.push(

    new Paragraph({
        pageBreakBefore: true
    }),

    ...buatJudulHalaman(
        "IBADAH & AKHLAQ",
        "Daarul Khoirot Al-Madani"
    ),

    buatSection("DATA IBADAH"),

    tabelIbadah

);

// ======================================
// HALAMAN 5 - REKAP NILAI
// ======================================
const tabelRekap = buatTabel(

[
    "No",
    "Nama Santri",
    "ID",
    "Kelas",
    "Kehadiran",
    "Hafalan",
    "Ibadah",
    "Nilai Akhir",
    "Predikat"
],

rekap.map((s,i)=>[

    i + 1,
    s.nama,
    s.id_santri,
    s.kelas,
    s.nilaiKehadiran,
    s.nilaiHafalan,
    s.nilaiIbadahAkhlaq,
    s.nilaiAkhir,
    s.predikat

]),

{
    columnWidths: [
        500,   // No
        2800,  // Nama Santri
        900,   // ID
        1000,  // Kelas
        1200,  // Kehadiran
        1200,  // Hafalan
        1200,  // Ibadah
        1200,  // Nilai Akhir
        1200   // Predikat
    ]
}

);

children.push(

    new Paragraph({
        pageBreakBefore: true
    }),

    ...buatJudulHalaman(
        "REKAP NILAI SANTRI",
        "Daarul Khoirot Al-Madani"
    ),

    buatSection("REKAP NILAI"),

    tabelRekap

);

// ======================================
// HALAMAN 6 - RANKING
// ======================================
const ranking = [...rekap].sort(
(a,b)=>b.nilaiAkhir-a.nilaiAkhir
);

const tabelRanking = buatTabel(

[
    "Rank",
    "Nama",
    "ID",
    "Kelas",
    "Kehadiran",
    "Hafalan",
    "Ibadah",
    "Nilai Akhir",
    "Predikat"
],

ranking.map((s,i)=>[

    i + 1,
    s.nama,
    s.id_santri,
    s.kelas,
    s.nilaiKehadiran,
    s.nilaiHafalan,
    s.nilaiIbadahAkhlaq,
    s.nilaiAkhir,
    s.predikat

]),

{
    columnWidths: [
        700,   // Rank
        2800,  // Nama
        900,   // ID
        1000,  // Kelas
        1200,  // Kehadiran
        1200,  // Hafalan
        1200,  // Ibadah
        1200,  // Nilai Akhir
        1200   // Predikat
    ]
}

);

children.push(

    new Paragraph({
        pageBreakBefore: true
    }),

    ...buatJudulHalaman(
        "RANKING SANTRI",
        "Daarul Khoirot Al-Madani"
    ),

    buatSection("PERINGKAT SANTRI"),

    tabelRanking

);

const doc = new Document({

    sections: [

        {

            footers: {
    default: new Footer({

        children: [

            new Paragraph({

                alignment: AlignmentType.CENTER,

                border: {
                    top: {
                        style: docx.BorderStyle.SINGLE,
                        size: 4,
                        color: "166534"
                    }
                },

                spacing: {
                    before: 120
                },

                children: [

                    new TextRun({
                        text: "Daarul Khoirot Al-Madani",
                        bold: true,
                        color: "166534"
                    }),

                    new TextRun({
                        text: "   |   Halaman "
                    }),

                    PageNumber.CURRENT

                ]

            })

        ]

    })
}, 
            children

        }

    ]

});


const blob = await Packer.toBlob(doc);

saveAs(blob, "Dashboard_Santri.docx");

sukses("Export Word berhasil.");

} catch (err) {

    console.error(err);
    console.log(err.name);
    console.log(err.message);
    console.log(err.stack);

}

};