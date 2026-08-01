// app.js - Sistem utama website (Updated)
class PPLGApp {
    constructor() {
        this.publishDate = new Date(PUBLISH_CONFIG.publishDate);
        this.isPublished = false;
        this.countdownInterval = null;
        this.publishCheckInterval = null;
        this.studentsData = STUDENTS_DATA;
        this.galleryData = GALLERY_IMAGES;
        this.projectsData = PROJECTS_DATA;
        this.waliKelasData = WALI_KELAS_HISTORY;
        this.currentYear = new Date().getFullYear();
        this.currentMonth = new Date().getMonth() + 1;
    }

    // Inisialisasi
    init() {
        this.checkPublishStatus();
        this.renderProjects();
        this.renderWaliKelasHistory();
        this.renderHeroStats();
        this.setupMobileMenu();
        this.setupNavbarActive();
        
        // Cek setiap 30 detik
        this.publishCheckInterval = setInterval(() => {
            this.checkPublishStatus();
        }, 30000);
    }

    // Cek status publikasi
    checkPublishStatus() {
        const now = new Date();
        this.isPublished = now >= this.publishDate;
        
        if (this.isPublished) {
            this.showClassData();
            this.stopCountdown();
        } else {
            this.hideClassData();
            this.startCountdown();
        }
        
        return this.isPublished;
    }

    // Tampilkan data kelas
    showClassData() {
        document.querySelectorAll('.class-data').forEach(el => {
            el.style.display = 'grid';
            el.classList.add('fade-in');
        });
        document.querySelectorAll('.class-placeholder').forEach(el => {
            el.style.display = 'none';
        });
        
        this.renderStudents();
        this.renderGallery();
        this.renderHomeroomTeacher();
    }

    // Sembunyikan data kelas XII saja
    hideClassData() {
        // Data kelas XII disembunyikan
        document.querySelectorAll('.class-data-xii').forEach(el => {
            el.style.display = 'none';
        });
        
        // Tampilkan placeholder untuk kelas XII
        document.querySelectorAll('.class-placeholder-xii').forEach(el => {
            el.style.display = 'block';
        });
        
        // Data kelas X dan XI tetap tampil
        document.querySelectorAll('.class-data-xi').forEach(el => {
            el.style.display = 'grid';
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
                this.checkPublishStatus();
                return;
            }
            
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            document.querySelectorAll('.countdown-timer').forEach(el => {
                el.innerHTML = `
                    <span class="countdown-item">
                        <span class="countdown-number">${String(days).padStart(2, '0')}</span>
                        <span class="countdown-label">Hari</span>
                    </span>
                    <span class="countdown-item">
                        <span class="countdown-number">${String(hours).padStart(2, '0')}</span>
                        <span class="countdown-label">Jam</span>
                    </span>
                    <span class="countdown-item">
                        <span class="countdown-number">${String(minutes).padStart(2, '0')}</span>
                        <span class="countdown-label">Menit</span>
                    </span>
                    <span class="countdown-item">
                        <span class="countdown-number">${String(seconds).padStart(2, '0')}</span>
                        <span class="countdown-label">Detik</span>
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

    // Render siswa (hanya yang aktif)
    renderStudents() {
        const grid = document.getElementById('siswaGrid');
        if (!grid) return;
        
        grid.innerHTML = '';
        const fotoBasePath = "Assets/img/murid/";
        
        // Filter siswa yang akan ditampilkan
        // Semua siswa bisa ditampilkan, tapi dengan label kelas yang sesuai
        this.studentsData.forEach((s, index) => {
            const isFemale = s.jenisKelamin === 'Perempuan';
            const genderIcon = isFemale ? 'fa-venus' : 'fa-mars';
            const genderClass = isFemale ? 'gender-female' : 'gender-male';
            
            const card = document.createElement('div');
            card.className = "student-card";
            card.style.animationDelay = `${index * 50}ms`;
            card.innerHTML = `
                <div class="student-card-inner">
                    <div class="student-photo-wrapper">
                        <img src="${fotoBasePath + s.foto}" 
                             alt="${s.nama}" 
                             class="student-photo"
                             loading="lazy"
                             onerror="this.onerror=null; this.src='assets/placeholder-student.jpg'">
                        <div class="gender-badge ${genderClass}">
                            <i class="fas ${genderIcon}"></i> ${s.jenisKelamin}
                        </div>
                    </div>
                    <div class="student-info">
                        <h4 class="student-name">${s.nama}</h4>
                        <p class="student-class">${PUBLISH_CONFIG.currentClass}</p>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
        
        document.getElementById('siswaCount').textContent = this.studentsData.length;
    }

    // Render galeri
    renderGallery() {
        const grid = document.getElementById('galleryGrid');
        if (!grid) return;
        
        grid.innerHTML = '';
        const galleryBasePath = GALLERY_CONFIG.basePath;
        
        // Tampilkan semua galeri (termasuk yang sudah ada)
        // Data galeri dari kelas X dan XI sudah bisa ditampilkan
        this.galleryData.forEach((img, i) => {
            const card = document.createElement('div');
            card.className = "gallery-card";
            card.style.animationDelay = `${i * 30}ms`;
            card.innerHTML = `
                <div class="gallery-card-inner">
                    <img src="${galleryBasePath + img.file}" 
                         alt="${img.caption}" 
                         class="gallery-image"
                         loading="lazy"
                         onerror="this.onerror=null; this.src='assets/placeholder-gallery.jpg'">
                    <div class="gallery-caption">
                        <span class="gallery-badge">${img.category}</span>
                        <p class="gallery-title">${img.caption}</p>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
        
        document.getElementById('galleryCount').textContent = this.galleryData.length;
        document.getElementById('totalGallery').textContent = this.galleryData.length;
    }

    // Render proyek
    renderProjects() {
        const grid = document.getElementById('projectsGrid');
        if (!grid) return;
        
        grid.innerHTML = '';
        const projectBasePath = PROJECTS_CONFIG.basePath;
        
        this.projectsData.forEach((p, index) => {
            const card = document.createElement('div');
            card.className = "project-card";
            card.style.animationDelay = `${index * 100}ms`;
            card.innerHTML = `
                <div class="project-card-inner">
                    <div class="project-image-wrapper">
                        <img src="${projectBasePath + p.file}" 
                             alt="${p.title}" 
                             class="project-image"
                             loading="lazy"
                             onerror="this.onerror=null; this.src='assets/placeholder-project.jpg'">
                        <span class="project-year">${p.year}</span>
                    </div>
                    <div class="project-info">
                        <h4 class="project-title">${p.title}</h4>
                        <p class="project-desc">${p.desc}</p>
                        <span class="project-tech">${p.tech}</span>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    // Render wali kelas history
    renderWaliKelasHistory() {
        const container = document.getElementById('historyTeacherContainer');
        if (!container) return;
        
        container.innerHTML = `
            <div class="history-section">
                <div class="section-header">
                    <span class="section-badge">
                        <i class="fas ${WALI_KELAS_CONFIG.icon}"></i> ${WALI_KELAS_CONFIG.title}
                    </span>
                    <p class="section-description">${WALI_KELAS_CONFIG.description}</p>
                </div>
                <div class="history-grid">
                    ${this.waliKelasData.map((item, index) => {
                        // Wali kelas 2026/2027 hanya ditampilkan jika sudah publish
                        const isHidden = !this.isPublished && item.tahun === "2026/2027";
                        const genderIcon = item.gender === 'female' ? 'fa-venus' : 'fa-mars';
                        const genderColor = item.gender === 'female' ? 'text-pink-500' : 'text-blue-500';
                        
                        return `
                            <div class="history-card" style="animation-delay: ${index * 150}ms">
                                <div class="history-card-icon">
                                    <i class="fas fa-user-graduate"></i>
                                </div>
                                <div class="history-card-content">
                                    <span class="history-year">${item.tahun}</span>
                                    <h4 class="history-class">${item.kelas}</h4>
                                    <h3 class="history-name ${isHidden ? 'text-gray-400' : ''}">
                                        ${isHidden ? '🔒 Akan diumumkan' : item.nama}
                                    </h3>
                                    <div class="history-meta">
                                        <i class="fas ${genderIcon} ${genderColor}"></i>
                                        <span>${item.gender === 'female' ? 'Perempuan' : 'Laki-laki'}</span>
                                        ${item.isActive && !isHidden ? `
                                            <span class="status-badge active">
                                                <i class="fas fa-star"></i> Aktif
                                            </span>
                                        ` : ''}
                                        ${isHidden ? `
                                            <span class="status-badge waiting">
                                                <i class="fas fa-clock"></i> Menunggu
                                            </span>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    // Render wali kelas aktif di hero
    renderHomeroomTeacher() {
        const container = document.getElementById('homeroomTeacher');
        if (!container) return;
        
        // Cari wali kelas aktif
        const activeTeacher = this.waliKelasData.find(w => w.isActive);
        if (!activeTeacher) return;
        
        // Jika belum publish, tampilkan placeholder
        if (!this.isPublished) {
            container.innerHTML = `
                <div class="placeholder-card">
                    <div class="placeholder-icon">👨‍🏫</div>
                    <h3>Wali Kelas Akan Diumumkan</h3>
                    <p>Informasi wali kelas ${PUBLISH_CONFIG.currentClass} akan ditampilkan sesuai jadwal publikasi.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = `
            <div class="homeroom-teacher-card">
                <div class="homeroom-teacher-icon">
                    <i class="fas fa-chalkboard-teacher"></i>
                </div>
                <div class="homeroom-teacher-info">
                    <h4 class="homeroom-teacher-name">${activeTeacher.nama}</h4>
                    <p class="homeroom-teacher-role">Wali Kelas ${activeTeacher.kelas}</p>
                </div>
            </div>
        `;
    }

    // Render hero stats
    renderHeroStats() {
        document.getElementById('totalStudents').textContent = this.studentsData.length;
        document.getElementById('totalGallery').textContent = this.galleryData.length;
        document.getElementById('totalProjects').textContent = this.projectsData.length;
    }

    // Setup mobile menu - FIXED
    setupMobileMenu() {
        const menuBtn = document.getElementById('menuBtn');
        const navLinks = document.querySelector('.nav-links');
        
        if (!menuBtn || !navLinks) return;
        
        menuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
                navLinks.classList.remove('active');
                const icon = menuBtn.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            }
        });
        
        // Close menu when clicking a link
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                const icon = menuBtn.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            });
        });
    }

    // Setup navbar active link
    setupNavbarActive() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-link').forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
}

// Inisialisasi
document.addEventListener('DOMContentLoaded', function() {
    const app = new PPLGApp();
    app.init();
});
