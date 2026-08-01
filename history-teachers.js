// history-teachers.js - Data riwayat wali kelas PPLG 1
const WALI_KELAS_HISTORY = [
    {
        tahun: "2024/2025",
        kelas: "X PPLG 1",
        nama: "Lusi Unsrimiati",
        gender: "female"
    },
    {
        tahun: "2025/2026",
        kelas: "XI PPLG 1",
        nama: "Idit Rudianto",
        gender: "male"
    },
    {
        tahun: "2026/2027",
        kelas: "XII PPLG 1",
        nama: "Panji Azwar Pebriana",
        gender: "male",
        isActive: true // Menandai sebagai wali kelas aktif
    }
];

// Konfigurasi tambahan untuk riwayat
const HISTORY_CONFIG = {
    title: "Riwayat Wali Kelas PPLG 1",
    icon: "fa-chalkboard-teacher",
    description: "Daftar wali kelas yang pernah mengajar di PPLG 1 dari tahun ke tahun",
    showActiveStatus: true
};

// history-teacher.js - Sistem tampilan riwayat wali kelas
class HistoryTeacherDisplay {
    constructor(historyData, config) {
        this.historyData = historyData;
        this.config = config;
        this.container = null;
        this.publishSystem = null;
    }

    // Set publish system reference
    setPublishSystem(publishSystem) {
        this.publishSystem = publishSystem;
    }

    // Render riwayat wali kelas
    render(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        // Gunakan data dari publish system jika tersedia
        let dataToShow = this.historyData;
        let showActiveData = true;

        // Cek status publikasi untuk tahun aktif
        if (this.publishSystem) {
            const isPublished = this.publishSystem.checkPublishStatus();
            if (!isPublished) {
                // Sembunyikan data wali kelas aktif
                dataToShow = this.historyData.map(item => {
                    if (item.isActive) {
                        return {
                            ...item,
                            isHidden: true,
                            nama: "Akan diumumkan sesuai jadwal publikasi kelas."
                        };
                    }
                    return item;
                });
            }
        }

        // Buat HTML
        const html = this.createHTML(dataToShow);
        this.container.innerHTML = html;
        
        // Tambahkan animasi fade-in
        this.container.classList.add('fade-in');
    }

    // Create HTML untuk riwayat
    createHTML(data) {
        return `
            <div class="history-teacher-section">
                <div class="section-header text-center mb-8">
                    <span class="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                        <i class="fas ${this.config.icon} mr-2"></i> ${this.config.title}
                    </span>
                    <p class="text-gray-600 text-sm max-w-2xl mx-auto">${this.config.description}</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    ${data.map((item, index) => this.createCard(item, index)).join('')}
                </div>
            </div>
        `;
    }

    // Create card untuk setiap wali kelas
    createCard(item, index) {
        const isHidden = item.isHidden || false;
        const genderIcon = item.gender === 'female' ? 'fa-venus' : 'fa-mars';
        const genderColor = item.gender === 'female' ? 'text-pink-500' : 'text-blue-500';
        const cardClass = isHidden ? 'opacity-75' : '';
        const delay = index * 150;

        return `
            <div class="bg-white rounded-xl shadow-custom p-6 text-center hover-scale transition-smooth border border-gray-100 ${cardClass}"
                 style="animation-delay: ${delay}ms">
                <div class="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-user-graduate text-2xl text-blue-600"></i>
                </div>
                <div class="mb-2">
                    <span class="inline-block bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
                        ${item.tahun}
                    </span>
                </div>
                <h4 class="text-sm font-medium text-gray-500 mb-1">${item.kelas}</h4>
                <h3 class="text-lg font-bold text-gray-800 ${isHidden ? 'text-gray-500' : ''}">
                    ${isHidden ? '🔒 ' : ''}${item.nama}
                </h3>
                <div class="flex items-center justify-center gap-2 mt-2">
                    <i class="fas ${genderIcon} ${genderColor} text-sm"></i>
                    <span class="text-xs text-gray-500">
                        ${item.gender === 'female' ? 'Perempuan' : 'Laki-laki'}
                    </span>
                    ${item.isActive && !isHidden ? `
                        <span class="inline-block bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full ml-2">
                            <i class="fas fa-star text-xs"></i> Aktif
                        </span>
                    ` : ''}
                    ${isHidden ? `
                        <span class="inline-block bg-yellow-100 text-yellow-600 text-xs px-2 py-0.5 rounded-full ml-2">
                            <i class="fas fa-clock"></i> Menunggu
                        </span>
                    ` : ''}
                </div>
                ${!isHidden && item.isActive ? `
                    <div class="mt-3 pt-3 border-t border-gray-100">
                        <span class="text-xs text-gray-400">
                            <i class="fas fa-calendar-alt mr-1"></i> Wali Kelas ${item.tahun}
                        </span>
                    </div>
                ` : ''}
            </div>
        `;
    }

    // Update display (untuk re-render setelah publish)
    updateDisplay() {
        if (this.container) {
            this.render(this.container.id);
        }
    }
}

// Inisialisasi
document.addEventListener('DOMContentLoaded', function() {
    // Buat instance history display
    const historyDisplay = new HistoryTeacherDisplay(
        WALI_KELAS_HISTORY,
        HISTORY_CONFIG
    );

    // Render di container yang sesuai
    const container = document.getElementById('historyTeacherContainer');
    if (container) {
        historyDisplay.render('historyTeacherContainer');
        
        // Set reference ke publish system (akan di-set dari publish-system.js)
        window.historyDisplay = historyDisplay;
    }
}); 
