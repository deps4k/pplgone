// gallery.js - Data galeri dokumentasi
const GALLERY_IMAGES = Array.from({ length: 87 }, (_, i) => ({
    file: `Galeri${i + 1}.jpg`,
    caption: `Kegiatan ${i + 1}`,
    category: i < 30 ? "Pembelajaran" : i < 60 ? "Kegiatan Sekolah" : "Acara Kelas"
}));

const GALLERY_CONFIG = {
    totalImages: 82,
    basePath: "Assets/img/galeri/",
    perPage: 12
}; 
