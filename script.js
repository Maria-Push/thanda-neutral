/* ============================================================
   THANDA WILDLIFE SANCTUARY — script.js
   1. Mobile navigation toggle
   2. Navbar hide/show on scroll
   3. Animated paw tracks
============================================================ */

document.addEventListener('DOMContentLoaded', function () {

    /* ========================================================
       1. MOBILE NAVIGATION TOGGLE
    ======================================================== */

    const hamburger = document.getElementById('hamburgerButton');
    const navMenu   = document.getElementById('navbarMenu');

    if (hamburger && navMenu) {
        const navList = navMenu.querySelector('.navbar-nav');

        hamburger.addEventListener('click', function () {
    const isOpen = navList.classList.toggle('active');

    // Keep aria-expanded in sync with visual state
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

    // Toggle .active on the button itself for the × animation
    hamburger.classList.toggle('active', isOpen);
});

        // Close menu when any nav link is tapped on mobile
        navMenu.querySelectorAll('.nav-link').forEach(function (link) {
            link.addEventListener('click', function () {
                if (window.innerWidth <= 768) {
                        navList.classList.remove('active');
                        hamburger.classList.remove('active');
                        hamburger.setAttribute('aria-expanded', 'false');
                }
            });
        });

        // Close menu when clicking outside of it
        document.addEventListener('click', function (e) {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                navList.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    }
});

   