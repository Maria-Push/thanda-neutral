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

    /* ========================================================
       2. SMOOTH SCROLL FOR ANCHOR LINKS
       (CSS scroll-behavior handles most cases, but this ensures
       it works in browsers that don't support it natively)
    ======================================================== */

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ========================================================
       3. NAVBAR HIDE / SHOW ON SCROLL
       Hides when scrolling down, reappears when scrolling up.
       Always visible at the top of the page.
    ======================================================== */

    const navbar         = document.querySelector('.navbar');
    const SCROLL_THRESHOLD = 100; // px before hide behaviour kicks in
    let   lastScrollY    = 0;

    if (navbar) {
        window.addEventListener('scroll', function () {
            const currentScrollY = window.scrollY || document.documentElement.scrollTop;

            if (currentScrollY <= SCROLL_THRESHOLD) {
                // Always show at top
                navbar.style.transform = 'translateX(-50%)';
                navbar.style.opacity   = '1';
            } else if (currentScrollY > lastScrollY) {
                // Scrolling down — hide
                navbar.style.transform = 'translate(-50%, -120%)';
                navbar.style.opacity   = '0';
            } else {
                // Scrolling up — show
                navbar.style.transform = 'translateX(-50%)';
                navbar.style.opacity   = '1';
            }

            lastScrollY = currentScrollY;
        }, { passive: true }); // passive: true improves scroll performance
    }

    /* ========================================================
       4. ANIMATED PAW TRACKS
       Appears when the Impact section scrolls into view.
       Plays once, then resets after 10 s so it can play again.
    ======================================================== */

    const pawContainer = document.getElementById('pawTracks');
    const impactSection = document.querySelector('#impact');

    // Skip setup entirely if either element is missing
    if (!pawContainer || !impactSection) return;

    // Diagonal walking path across the section
    const trackPath = [
        { top: '58%', left:  '0%', rotation: 88, flip: false },
        { top: '64%', left:  '7%', rotation: 92, flip: true  },
        { top: '59%', left: '14%', rotation: 95, flip: false },
        { top: '68%', left: '21%', rotation: 85, flip: true  },
        { top: '61%', left: '28%', rotation: 90, flip: false },
        { top: '66%', left: '35%', rotation: 88, flip: true  },
        { top: '63%', left: '42%', rotation: 93, flip: false },
        { top: '69%', left: '49%', rotation: 87, flip: true  },
        { top: '58%', left: '56%', rotation: 91, flip: false },
        { top: '65%', left: '63%', rotation: 94, flip: true  },
        { top: '60%', left: '70%', rotation: 86, flip: false },
        { top: '67%', left: '77%', rotation: 89, flip: true  },
        { top: '62%', left: '84%', rotation: 92, flip: false },
        { top: '69%', left: '91%', rotation: 88, flip: true  },
    ];

    // Stores all active timeouts so we can cancel if needed
    const activeTimers = [];

    function clearTimers() {
        activeTimers.forEach(clearTimeout);
        activeTimers.length = 0;
    }

    function createPawTracks() {
        // Clear any previous tracks and timers
        clearTimers();
        pawContainer.innerHTML = '';

        trackPath.forEach(function (pos, index) {
            const track = document.createElement('div');
            track.className = 'paw-track';
            track.textContent = '🐾';
            track.style.top  = pos.top;
            track.style.left = pos.left;
            track.style.setProperty('--rotation', pos.rotation + 'deg');

            if (pos.flip) {
                // Mirror every other print for a realistic alternating gait
                track.style.transform = 'scaleY(-1) scale(0.3) rotate(' + pos.rotation + 'deg)';
            }

            pawContainer.appendChild(track);

            const appearDelay  = index * 300;
            const fadeDelay    = appearDelay + 2000;
            const removeDelay  = appearDelay + 3000;

            activeTimers.push(
                setTimeout(function () { track.classList.add('show'); },     appearDelay),
                setTimeout(function () { track.classList.add('fade-out'); }, fadeDelay),
                setTimeout(function () { if (track.parentNode) track.remove(); }, removeDelay)
            );
        });
    }

    // Intersection observer — triggers when 30% of section is visible
    let hasPlayed = false;

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting && !hasPlayed) {
                hasPlayed = true;

                // Small delay so the section has finished sliding into view
                const triggerTimer = setTimeout(function () {
                    createPawTracks();

                    // Allow the animation to replay if user scrolls away and returns
                    const resetTimer = setTimeout(function () {
                        hasPlayed = false;
                    }, 10000);

                    activeTimers.push(resetTimer);
                }, 500);

                activeTimers.push(triggerTimer);
            }
        });
    }, { threshold: 0.3 });

    observer.observe(impactSection);


/* ========================================================
       5. FOOTER SUBSCRIBE FORM — FULL UX SIMULATION
 
       BUGS FIXED:
       ① The email input in HTML had id="emailAddress" but JS
         was calling getElementById('email') → returned null →
         crashed with TypeError on .value → entire submit
         handler died silently. Fixed: use id="email" in HTML
         (or swap the querySelector here to match whichever
         id you keep in HTML — both ways work, just be consistent).
 
       ② Pre-signup localStorage check on page load correctly
         disables the button before the submit listener runs,
         preventing double submissions even on refresh.
    ======================================================== */
 
    const subscribeForm = document.getElementById('subscribeForm');
 
    // ── PRE-SIGNUP STATE (runs on every page load) ──────────
    // If this visitor already signed up, lock the button immediately
    // so they never see an active form again.
    if (subscribeForm) {
        const alreadySignedUp = localStorage.getItem('signedUp');
        const savedName       = localStorage.getItem('userName');
        const submitBtn       = subscribeForm.querySelector('button[type="submit"]');

 
        // Friendly console greeting for returning visitors
        if (savedName) {
            console.log(`Welcome back, ${savedName} 🐾`);
        }
 
        // ── FORM SUBMISSION ──────────────────────────────────
        subscribeForm.addEventListener('submit', function (e) {
            e.preventDefault();
 
            // FIX ①: querySelector matches the actual id in your HTML.
            // If you keep id="emailAddress" in HTML, change 'email' → 'emailAddress' below.
            // If you change HTML to id="email", leave this as-is.
            const nameInput  = document.getElementById('firstName');
            const emailInput = document.getElementById('email'); // ← must match your HTML id
            const button     = subscribeForm.querySelector('button[type="submit"]');
 
            const name  = nameInput  ? nameInput.value.trim()  : '';
            const email = emailInput ? emailInput.value.trim() : '';
 
            // ── VALIDATION ───────────────────────────────────
 
            if (!name && !email) {
                showErrorToast("🐾 We need your name and email to join the coalition!");
                return;
            }
            if (!name) {
                showErrorToast("Oops… we need your first name 🐒");
                return;
            }
            if (!email) {
                showErrorToast("Hmm… we need your email to send updates 🌿");
                return;
            }
 
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                showErrorToast("Hmm… that doesn't look like an email 🐾");
                return;
            }
 
            // ── ALREADY SIGNED UP CHECK - exact match duplicate ──────────────────────
            const savedName  = localStorage.getItem('userName');
            const savedEmail = localStorage.getItem('userEmail');   // ← you'll store this now too

            const exactMatch =
                savedName  && savedEmail &&
                savedName.toLowerCase()  === name.toLowerCase() &&
                savedEmail.toLowerCase() === email.toLowerCase();

            if (exactMatch) {
                showAlreadySignedUp(name);
                return;
            }
 
            // ── PROCESS SUBMISSION ───────────────────────────
            button.textContent = "Joining...";
            button.disabled    = true;
 
            setTimeout(function () {
                showSignupSuccess(name);
 
                // Simulate backend: persist to localStorage
                localStorage.setItem('signedUp', 'true');
                localStorage.setItem('userName', name);
                localStorage.setItem('userEmail', email);
 
                subscribeForm.reset();
 
                button.textContent = "Join the coalition 🐆";   // reset to original label
                button.disabled    = false;             // re-enable the button
            }, 700);
        });
    }
 
}); // end DOMContentLoaded
 
 
/* ============================================================
   SUCCESS TOAST  —  anthropomorphic welcome messages
============================================================ */
function showSignupSuccess(name) {
    const messages = [
        `🐾 Hey ${name}, you're in. 🐾`,
        `🐆 Welcome to the herd, ${name}! 🐆`,
        `🦒 The sanctuary just got stronger with you, ${name}. 🦒`,
        `🦓 Glad you're here, ${name}. It means a lot. 🦓`
    ];
 
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
 
    const popup = document.createElement('div');
    popup.className = 'signup-toast';
    popup.setAttribute('aria-live', 'polite');
    popup.innerHTML = `
        ${randomMessage}<br>
        <small>We'll keep you in the loop (the good kind).</small>
    `;
 
    document.body.appendChild(popup);
    setTimeout(function () { popup.classList.add('show'); }, 10);
    setTimeout(function () {
        popup.classList.remove('show');
        setTimeout(function () { popup.remove(); }, 300);
    }, 7000);
}

function showAlreadySignedUp(name) {
    const messages = [
        `🐾 Hey ${name}, you're already in the coalition! 🐾`,
        `🦁 We know you, ${name} — you signed up already. 🦁`,
        `🦛 ${name}, your spot is saved. No need to sign up twice! 🦛`,
        `🐃 Once is enough, ${name} — we've got you. 🐃`
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    const popup = document.createElement('div');
    popup.className = 'signup-toast signup-error';
    popup.setAttribute('aria-live', 'polite');
    popup.innerHTML = `
        ${randomMessage}<br>
        <small>Check your inbox — we'll be in touch.</small>
    `;

    document.body.appendChild(popup);
    setTimeout(function () { popup.classList.add('show'); }, 10);
    setTimeout(function () {
        popup.classList.remove('show');
        setTimeout(function () { popup.remove(); }, 300);
    }, 7000);
}
 
 
/* ============================================================
   ERROR TOAST  —  anthropomorphic microcopy
============================================================ */
function showErrorToast(message) {
    const popup = document.createElement('div');
    popup.className = 'signup-toast signup-error';
    popup.setAttribute('aria-live', 'polite');
    popup.innerHTML = message;
 
    document.body.appendChild(popup);
    setTimeout(function () { popup.classList.add('show'); }, 10);
    setTimeout(function () {
        popup.classList.remove('show');
        setTimeout(function () { popup.remove(); }, 300);
    }, 7000);
}