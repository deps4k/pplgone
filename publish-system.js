// publish-system.js - Sistem publikasi otomatis (Updated with History)
class PublishSystem {
    constructor(config) {
        this.config = config;
        this.publishDate = new Date(config.publishDate);
        this.isPublished = false;
        this.countdownInterval = null;
        this.publishCheckInterval = null;
    }

    // Cek status publikasi
    checkPublishStatus() {
        const now = new Date();
        this.isPublished = now >= this.publishDate;
        return this.isPublished;
    }

    // Start sistem
    init() {
        this.checkAndUpdate();
        // Cek setiap 30 detik
        this.publishCheckInterval = setInterval(() => {
            this.checkAndUpdate();
        }, 30000);
    }

    // Check dan update tampilan
    checkAndUpdate() {
        const status = this.checkPublishStatus();
        if (status) {
            this.showClassData();
            this.stopCountdown();
            // Update history jika ada
            if (window.historyDisplay) {
                window.historyDisplay.updateDisplay();
            }
        } else {
            this.hideClassData();
            this.startCountdown();
        }
    }

    // Tampilkan data kelas
    showClassData() {
        document.querySelectorAll('.class-data').forEach(el => {
            el.style.display = 'block';
            el.classList.add('fade-in');
        });
        document.querySelectorAll('.class-placeholder').forEach(el => {
            el.style.display = 'none';
        });
        // Trigger render data
        this.renderStudents();
        this.renderGallery();
        this.renderHomeroomTeacher();
    }

    // Sembunyikan data kelas
    hideClassData() {
        document.querySelectorAll('.class-data').forEach(el => {
            el.style.display = 'none';
        });
        document.querySelectorAll('.class-placeholder').forEach(el => {
            el.style.display = 'block';
        });
        this.updatePlaceholderMessage();
    }

    // Update pesan placeholder
    updatePlaceholderMessage() {
        const placeholders = document.querySelectorAll('.class-placeholder');
        placeholders.forEach(el => {
            const countdownEl = el.querySelector('.countdown-timer');
            if (countdownEl) {
                // Countdown akan diupdate oleh startCountdown
            }
        });
    }

    // Start countdown
    startCountdown() {
        if (this.countdownInterval) return;
        
        this.countdownInterval = setInterval(() => {
            const now = new Date();
            const diff = this.publishDate - now;
            
            if (diff <= 0) {
                this.stopCountdown();
                this.checkAndUpdate();
                return;
            }
            
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            const countdownEls = document.querySelectorAll('.countdown-timer');
            countdownEls.forEach(el => {
                el.innerHTML = `
                    <span class="bg-blue-100 px-4 py-2 rounded-lg mx-1">
                        ${String(days).padStart(2, '0')} <span class="text-sm">Hari</span>
                    </span>
                    <span class="bg-blue-100 px-4 py-2 rounded-lg mx-1">
                        ${String(hours).padStart(2, '0')} <span class="text-sm">Jam</span>
                    </span>
                    <span class="bg-blue-100 px-4 py-2 rounded-lg mx-1">
                        ${String(minutes).padStart(2, '0')} <span class="text-sm">Menit</span>
                    </span>
                    <span class="bg-blue-100 px-4 py-2 rounded-lg mx-1">
                        ${String(seconds).padStart(2, '0')} <span class="text-sm">Detik</span>
                    </span>
                `;
            });
        }, 1000);
    }

    // Stop countdown
    stopCountdown() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
    }

    // Render siswa
    renderStudents() {
        const grid = document.getElementById('siswaGrid');
        if (!grid) return;
        
        grid.innerHTML = '';
        const siswaBasePath = "Assets/img/murid/";
        
        STUDENTS_DATA.forEach(s => {
            const isFemale = s.gender === 'female';
            const genderIcon = isFemale ? 'fa-venus' : 'fa-mars';
            const genderText = isFemale ? 'Perempuan' : 'Laki-laki';
            const genderClass = isFemale ? 'gender-female' : 'gender-male';
            
            const card = document.createElement('div');
            card.className = "bg-white rounded-xl overflow-hidden card-shadow hover-scale transition-smooth cursor-pointer";
            card.innerHTML = `
                <div class="relative">
                    <img src="${siswaBasePath + s.file}" alt="${s.name}" class="w-full aspect-square object-cover" loading="lazy"
                         onerror="this.src='https://placehold.co/400x400/e2e8f0/3b82f6?text=${s.name}'">
                    <div class="absolute top-3 right-3 ${genderClass} text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
                        <i class="fas ${genderIcon}"></i> ${genderText}
                    </div>
                </div>
                <div class="p-4 text-center">
                    <span class="font-semibold text-sm">${s.name}</span>
                </div>
            `;
            grid.appendChild(card);
        });
        
        document.getElementById('siswaCount').textContent = STUDENTS_DATA.length;
    }

    // Render galeri
    renderGallery() {
        const grid = document.getElementById('galleryGrid');
        if (!grid) return;
        
        grid.innerHTML = '';
        const galleryBase = "Assets/img/galeri/";
        
        GALLERY_IMAGES.forEach(img => {
            const card = document.createElement('div');
            card.className = "bg-white rounded-xl overflow-hidden card-shadow hover-scale transition-smooth cursor-pointer";
            card.innerHTML = `
                <img src="${galleryBase + img.file}" alt="${img.caption}" class="w-full aspect-[4/3] object-cover" loading="lazy"
                     onerror="this.src='https://placehold.co/600x450/e2e8f0/3b82f6?text=Image+Not+Found'">
                <div class="p-3 text-center">
                    <p class="text-sm text-gray-600"><i class="fas fa-camera mr-1"></i>${img.caption}</p>
                </div>
            `;
            grid.appendChild(card);
        });
        
        document.getElementById('galleryCount').textContent = GALLERY_IMAGES.length;
        document.getElementById('totalGallery').textContent = GALLERY_IMAGES.length;
    }

    // Render wali kelas
    renderHomeroomTeacher() {
        const container = document.getElementById('homeroomTeacher');
        if (!container) return;
        
        container.innerHTML = `
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20 fade-in">
                <div class="flex items-center justify-center gap-4 flex-wrap">
                    <div class="w-20 h-20 rounded-full bg-blue-500/30 flex items-center justify-center text-3xl">
                        <i class="fas fa-chalkboard-teacher"></i>
                    </div>
                    <div class="text-left">
                        <h4 class="font-bold text-xl text-white">${HOMEROOM_TEACHER.name}</h4>
                        <p class="text-sm text-white/80">${HOMEROOM_TEACHER.description}</p>
                        <p class="text-xs text-white/60">${HOMEROOM_TEACHER.subject}</p>
                    </div>
                </div>
            </div>
        `;
    }
}

// Inisialisasi sistem
document.addEventListener('DOMContentLoaded', function() {
    const publishSystem = new PublishSystem(CLASS_CONFIG);
    publishSystem.init();
    
    // Render proyek (selalu tampil)
    renderProjects();
    
    // Set publish system ke history display
    if (window.historyDisplay) {
        window.historyDisplay.setPublishSystem(publishSystem);
        window.historyDisplay.updateDisplay();
    }
});

// Render proyek
function renderProjects() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    const projectBase = "Assets/img/project/";
    
    PROJECTS_DATA.forEach(p => {
        const card = document.createElement('div');
        card.className = "bg-white rounded-xl overflow-hidden card-shadow hover-scale transition-smooth";
        card.innerHTML = `
            <img src="${projectBase + p.file}" alt="${p.title}" class="w-full aspect-video object-cover" loading="lazy"
                 onerror="this.src='https://placehold.co/600x400/e2e8f0/3b82f6?text=${p.title}'">
            <div class="p-6">
                <h5 class="text-xl font-bold text-gray-800 mb-2">${p.title}</h5>
                <p class="text-gray-600 text-sm mb-3">${p.desc}</p>
                <span class="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">${p.tech}</span>
            </div>
        `;
        grid.appendChild(card);
    });
              }
