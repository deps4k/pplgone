// config.js - Konfigurasi pusat website
const APP_CONFIG = {
    schoolName: "SMKN 1 Talaga",
    majorName: "Pengembangan Perangkat Lunak dan Gim (PPLG)",
    className: "PPLG 1",
    version: "2.0.0"
};

// ============================================
// SISTEM PUBLIKASI - FLEKSIBEL
// ============================================
// Data sudah bisa ditampilkan untuk tahun 2024-2026
// Tahun 2027 akan disembunyikan sampai waktunya

const PUBLISH_CONFIG = {
    // Kelas saat ini: 2026/2027 (XII)
    currentAcademicYear: "2026/2027",
    currentClass: "XII PPLG 1",
    
    // Tanggal publikasi data kelas XII
    // Data kelas XII baru akan ditampilkan setelah tanggal ini
    publishDate: "2026-07-01T00:00:00",
    
    // Data yang sudah boleh tampil (2024-2026)
    // Semua data kelas X dan XI sudah bisa ditampilkan
    showClassX: true,   // 2024/2025
    showClassXI: true,  // 2025/2026
    showClassXII: false // 2026/2027 - Menunggu publishDate
};

// Timeline tahun ajaran
const ACADEMIC_YEARS = {
    '2024/2025': { 
        classLevel: 'X', 
        className: 'X PPLG 1',
        isPublished: true,
        label: 'Kelas X'
    },
    '2025/2026': { 
        classLevel: 'XI', 
        className: 'XI PPLG 1',
        isPublished: true,
        label: 'Kelas XI'
    },
    '2026/2027': {      
        classLevel: 'XII', 
        className: 'XII PPLG 1',
        isPublished: false,
        label: 'Kelas XII'
    }
};
