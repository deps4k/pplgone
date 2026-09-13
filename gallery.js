// gallery.js - Data galeri dokumentasi
const GALLERY_IMAGES = Array.from({ length: 95 }, (_, i) => ({
    file: `Galeri${i + 1}.jpg`,
    caption: `Kegiatan ${i + 1}`,
    category: i < 30 ? "Kegiatan Sekolah" : i < 60 ? "Kegiatan Sekolah" : "Kegiatan Sekolah"
}));

const GALLERY_CONFIG = {
    totalImages: 95,
    basePath: "Assets/img/galeri/",
    perPage: 12
}; 
