/**
 * PharmaCare Portal JavaScript
 * Kelompok 6 PharmaCare
 */

// Global State
let allClassesExpanded = false;

/* ==========================================================================
   1. UTILITY & NAVIGATION
   ========================================================================== */

// Toggle Dark / Light Mode
function toggleTheme() {
    document.documentElement.classList.toggle('dark');
}

// Toggle Mobile Menu Drawer
function toggleMobileSidebar() {
    const drawer = document.getElementById('mobileDrawer');
    if (drawer) {
        drawer.classList.toggle('hidden');
        drawer.classList.toggle('flex');
    }
}

/* ==========================================================================
   2. MODUL 2: KELAS OBAT ARV (ACCORDION, SEARCH, & EXPAND ALL)
   ========================================================================== */

// Toggle Accordion per-Kelas ARV
function toggleARVClass(classId) {
    const target = document.getElementById(classId);
    const icon = document.getElementById(`${classId}-icon`);

    if (target) {
        target.classList.toggle('hidden');
        if (icon) {
            icon.classList.toggle('rotate-180');
        }
    }
}

// Toggle Buka / Tutup Semua Kelas ARV Secara Serentak
function toggleExpandAllClasses() {
    const accordions = document.querySelectorAll('.arv-class-accordion');
    const masterBtn = document.getElementById('masterExpandBtn');
    allClassesExpanded = !allClassesExpanded;

    accordions.forEach(accordion => {
        const button = accordion.querySelector('button');
        if (!button) return;

        const onclickAttr = button.getAttribute('onclick');
        const match = onclickAttr ? onclickAttr.match(/'([^']+)'/) : null;
        const classId = match ? match[1] : null;

        const target = classId ? document.getElementById(classId) : accordion.querySelector('div[id^="class-"]');
        if (!target) return;

        const icon = document.getElementById(`${target.id}-icon`);

        if (allClassesExpanded) {
            target.classList.remove('hidden');
            if (icon) icon.classList.add('rotate-180');
        } else {
            target.classList.add('hidden');
            if (icon) icon.classList.remove('rotate-180');
        }
    });

    if (masterBtn) {
        masterBtn.innerHTML = allClassesExpanded 
            ? '<i class="fa-solid fa-folder-closed"></i> Tutup Semua Kelas' 
            : '<i class="fa-solid fa-folder-open"></i> Buka Semua Kelas';
    }
}

// Filter Pencarian Kelas & Nama Obat ARV (Dilengkapi Empty State)
function filterExpandableClasses() {
    const input = document.getElementById('arvClassSearchInput');
    if (!input) return;

    const query = input.value.toLowerCase().trim();
    const items = document.querySelectorAll('.arv-class-accordion');
    const noResultsCard = document.getElementById('noARVResultsFound');
    const keywordPlaceholder = document.getElementById('searchKeywordPlaceholder');

    let matchesCount = 0;

    items.forEach(item => {
        const keywords = (item.getAttribute('data-keywords') || '').toLowerCase();
        const textContent = item.textContent.toLowerCase();

        if (keywords.includes(query) || textContent.includes(query)) {
            item.style.display = '';
            matchesCount++;
        } else {
            item.style.display = 'none';
        }
    });

    // Menampilkan stiker / kartu indikator jika tidak ada data ditemukan
    if (noResultsCard) {
        if (matchesCount === 0 && query !== '') {
            if (keywordPlaceholder) keywordPlaceholder.textContent = query;
            noResultsCard.classList.remove('hidden');
        } else {
            noResultsCard.classList.add('hidden');
        }
    }
}

// Reset Pencarian ARV
function resetARVSearch() {
    const input = document.getElementById('arvClassSearchInput');
    if (input) {
        input.value = '';
        filterExpandableClasses();
        input.focus();
    }
}

/* ==========================================================================
   3. MODUL LAINNYA (FLIP CARD, KALKULATOR, VIDEO, & SOS FORM)
   ========================================================================== */

// Flip Kuis Flashcard Mitos vs Fakta (Modul 1)
function flipMythCard(card) {
    if (!card) return;
    const front = card.querySelector('.card-front');
    const back = card.querySelector('.card-back');

    if (front && back) {
        front.classList.toggle('hidden');
        back.classList.toggle('hidden');
    }
}

// Kalkulator Kepatuhan Minum Obat / Adherence Rate (Modul 3)
function calculateAdherence() {
    const dosesPerDayInput = document.getElementById('dosesPerDay');
    const missedDosesInput = document.getElementById('missedDoses');

    if (!dosesPerDayInput) return;

    const totalDoses = parseFloat(dosesPerDayInput.value) || 30;
    const missedDoses = parseFloat(missedDosesInput ? missedDosesInput.value : 0) || 0;

    const takenDoses = Math.max(0, totalDoses - missedDoses);
    const percentage = Math.min(100, Math.max(0, (takenDoses / totalDoses) * 100));

    const percentageEl = document.getElementById('adherencePercentage');
    const statusEl = document.getElementById('adherenceStatus');
    const adviceEl = document.getElementById('adherenceAdvice');

    if (percentageEl) percentageEl.textContent = `${percentage.toFixed(1)}%`;

    if (statusEl && adviceEl) {
        if (percentage >= 95) {
            statusEl.textContent = 'SANGAT BAIK (Target Sesuai)';
            statusEl.className = 'mt-2 text-sm font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 inline-block';
            adviceEl.textContent = 'Pertahankan kepatuhan ini untuk menjaga viral load tetap tidak terdeteksi!';
        } else if (percentage >= 80) {
            statusEl.textContent = 'CUKUP (Perlu Ditingkatkan)';
            statusEl.className = 'mt-2 text-sm font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 inline-block';
            adviceEl.textContent = 'Tingkat kepatuhan Anda mulai berisiko memicu resistensi obat. Pasang alarm jam minum obat atau minta bantuan pengingat.';
        } else {
            statusEl.textContent = 'BAHAYA (Risiko Kegagalan Terapi)';
            statusEl.className = 'mt-2 text-sm font-bold px-3 py-1 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 inline-block';
            adviceEl.textContent = 'Kepatuhan di bawah 80% berisiko tinggi membuat virus kebal (resisten) terhadap obat ARV. Segera konsultasikan dengan konselor PDP Anda!';
        }
    }
}

// Toggle Accordion Umum (Modul 4 & Lainnya)
function toggleAccordion(accId) {
    const target = document.getElementById(accId);
    const icon = document.getElementById(`${accId}-icon`);

    if (target) {
        target.classList.toggle('hidden');
        if (icon) {
            icon.classList.toggle('rotate-180');
        }
    }
}

// Pemutar Video Edukasi Interaktif
function changeVideo(videoId, title, desc) {
    const iframe = document.getElementById('mainVideoIframe');
    const titleEl = document.getElementById('mainVideoTitle');
    const descEl = document.getElementById('mainVideoDesc');

    if (iframe) iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    if (titleEl) titleEl.textContent = title;
    if (descEl) descEl.textContent = desc;
}

// Handler Form Konsultasi SOS
function handleContactSubmit(event) {
    event.preventDefault();
    const alertBox = document.getElementById('formSuccessAlert');
    if (alertBox) {
        alertBox.classList.remove('hidden');
        event.target.reset();
        setTimeout(() => {
            alertBox.classList.add('hidden');
        }, 5000);
    }
}

/* ==========================================================================
   4. INISIALISASI TAMPILAN & EFEK
   ========================================================================== */

// Animasi Scroll Reveal
function initScrollReveal() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, (index % 4) * 80);
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-on-scroll, .card-interactive, .myth-card, .arv-class-accordion');
    revealElements.forEach(el => {
        el.classList.add('reveal-on-scroll');
        observer.observe(el);
    });
}

// Header Shadow Effect saat Di-scroll
function initHeaderScrollShadow() {
    const header = document.querySelector('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('shadow-lg', 'backdrop-blur-md');
        } else {
            header.classList.remove('shadow-lg');
        }
    });
}

// Efek Ripple pada Tombol & Kartu
function initKotakanClickEffects() {
    const allCardsAndButtons = document.querySelectorAll(
        'button, .pulse-btn, .myth-card, .card-interactive, .arv-class-accordion, .stat-card'
    );

    allCardsAndButtons.forEach(element => {
        element.classList.add('ripple');
        element.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const circle = document.createElement('span');
            const diameter = Math.max(rect.width, rect.height);
            const radius = diameter / 2;

            circle.style.width = circle.style.height = `${diameter}px`;
            circle.style.left = `${e.clientX - rect.left - radius}px`;
            circle.style.top = `${e.clientY - rect.top - radius}px`;
            circle.classList.add('ripple-wave');

            const existingRipple = this.querySelector('.ripple-wave');
            if (existingRipple) {
                existingRipple.remove();
            }

            this.appendChild(circle);
        });
    });
}

// Inisialisasi Event Listener saat DOM Siap
document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initKotakanClickEffects();
    initHeaderScrollShadow();
});

// Registrasi Fungsi ke Scope Window (Mencegah Uncaught ReferenceError saat onclick HTML)
window.toggleTheme = toggleTheme;
window.toggleMobileSidebar = toggleMobileSidebar;
window.toggleARVClass = toggleARVClass;
window.toggleExpandAllClasses = toggleExpandAllClasses;
window.filterExpandableClasses = filterExpandableClasses;
window.resetARVSearch = resetARVSearch;
window.flipMythCard = flipMythCard;
window.calculateAdherence = calculateAdherence;
window.toggleAccordion = toggleAccordion;
window.changeVideo = changeVideo;
window.handleContactSubmit = handleContactSubmit;
