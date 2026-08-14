/**
 * PPLG.ONE - Universal Navbar
 * Satu sistem navbar untuk seluruh halaman.
 */

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const menuButton = document.getElementById('menuBtn');
    const navLinks = document.querySelector('.nav-links');

    if (!navbar || !menuButton || !navLinks) return;

    const icon = menuButton.querySelector('i');

    const closeMenu = () => {
        navLinks.classList.remove('active');
        menuButton.classList.remove('active');
        menuButton.setAttribute('aria-expanded', 'false');

        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    };

    const openMenu = () => {
        navLinks.classList.add('active');
        menuButton.classList.add('active');
        menuButton.setAttribute('aria-expanded', 'true');

        if (icon) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        }
    };

    menuButton.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();

        navLinks.classList.contains('active') ? closeMenu() : openMenu();
    });

    navLinks.querySelectorAll('.nav-link').forEach((link) => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (event) => {
        if (!navbar.contains(event.target)) closeMenu();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) closeMenu();
    });

    // Tentukan menu aktif berdasarkan halaman saat ini.
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.querySelectorAll('.nav-link').forEach((link) => {
        const linkPage = (link.getAttribute('href') || '').split('/').pop();
        link.classList.toggle('active', linkPage === currentPage);
    });

    closeMenu();
});
