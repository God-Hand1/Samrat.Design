// ===== Setup & Utilities =====
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// ===== Cursor Glow =====
const cursorGlow = document.getElementById('cursorGlow');
if (cursorGlow) {
    if (isTouchDevice) {
        cursorGlow.style.display = 'none';
    } else {
        let mouseX = 0, mouseY = 0;
        let isMoving = false;
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!isMoving) {
                window.requestAnimationFrame(() => {
                    cursorGlow.style.left = `${mouseX}px`;
                    cursorGlow.style.top = `${mouseY}px`;
                    isMoving = false;
                });
                isMoving = true;
            }
        }, { passive: true });
    }
}

// ===== Scroll Reveal =====
const revealElements = document.querySelectorAll('.reveal');
if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));
}

// ===== Skill Bars =====
const skillBars = document.querySelectorAll('.skill-fill');
if (skillBars.length > 0) {
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width') || '0%';
                entry.target.style.width = width;
                entry.target.classList.add('active');
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => skillObserver.observe(bar));
}

// ===== Counter Animation =====
const counters = document.querySelectorAll('.counter');
if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetAttr = entry.target.getAttribute('data-target');
                const target = parseInt(targetAttr, 10);
                if (isNaN(target)) return;

                let current = 0;
                const duration = 1500;
                const stepTime = 25;
                const steps = duration / stepTime;
                const increment = target / steps;

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        entry.target.textContent = target.toString();
                        clearInterval(timer);
                    } else {
                        entry.target.textContent = Math.floor(current).toString();
                    }
                }, stepTime);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));
}

// ===== Typing Effect =====
const typingEl = document.getElementById('typingText');
if (typingEl) {
    const typingTexts = [
        'Video Editor',
        'Graphic Designer',
        'Thumbnail Creator',
        'Motion Graphics Artist',
        'Content Creator'
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentText = typingTexts[textIndex];
        if (isDeleting) {
            charIndex--;
        } else {
            charIndex++;
        }

        typingEl.textContent = currentText.substring(0, charIndex);

        let speed = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === currentText.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % typingTexts.length;
            speed = 400;
        }

        setTimeout(typeEffect, speed);
    }
    setTimeout(typeEffect, 1000);
}

// ===== Mobile Menu =====
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const menuIcon = document.getElementById('menuIcon');
let menuOpen = false;

if (menuToggle && mobileMenu && menuIcon) {
    menuToggle.addEventListener('click', () => {
        menuOpen = !menuOpen;
        mobileMenu.classList.toggle('open', menuOpen);
        menuIcon.setAttribute('data-icon', menuOpen ? 'lucide:x' : 'lucide:menu');
    });

    // Close mobile menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuOpen) {
            window.closeMobile();
        }
    });
}

window.closeMobile = function() {
    if (menuOpen && mobileMenu && menuIcon) {
        menuOpen = false;
        mobileMenu.classList.remove('open');
        menuIcon.setAttribute('data-icon', 'lucide:menu');
    }
};

// ===== Portfolio Filter =====
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-card');

// Monotonic filter generation counter to avoid stale timeout race conditions
let filterGeneration = 0;

if (filterBtns.length > 0 && portfolioItems.length > 0) {
    const applyActiveStyles = (btn) => {
        btn.classList.add('active');
        btn.classList.remove('text-slate-500');
        btn.style.background = 'rgba(99,102,241,0.15)';
        btn.style.color = '#a5b4fc';
    };

    const removeActiveStyles = (btn) => {
        btn.classList.remove('active');
        btn.style.background = '';
        btn.style.color = '';
        btn.classList.add('text-slate-500');
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => removeActiveStyles(b));
            applyActiveStyles(btn);

            const filter = btn.getAttribute('data-filter') || 'all';
            filterGeneration++;
            const currentGen = filterGeneration;

            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    item.style.display = '';
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    // Force reflow
                    void item.offsetWidth;
                    item.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        // Only hide if this is still the active filter generation
                        if (filterGeneration === currentGen) {
                            item.style.display = 'none';
                        }
                    }, 300);
                }
            });
        });
    });

    const initialActiveBtn = document.querySelector('.filter-btn.active');
    if (initialActiveBtn) {
        applyActiveStyles(initialActiveBtn);
    }
}

// ===== Contact Form =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        window.showToast('Message sent successfully! I\'ll get back to you soon.');
        e.target.reset();
    });
}

// ===== Toast =====
window.showToast = function(msg) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    if (toast && toastMsg) {
        toastMsg.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3500);
    }
};

// ===== Back to Top (CSS class toggle instead of inline styles) =====
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    let isScrolling = false;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                backToTop.classList.toggle('visible', window.scrollY > 500);
                isScrolling = false;
            });
            isScrolling = true;
        }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== Active Nav Highlight =====
const sections = Array.from(document.querySelectorAll('section[id]'));
const navLinks = document.querySelectorAll('.nav-link');

if (sections.length > 0 && navLinks.length > 0) {
    const getSectionTops = () => sections.map(section => ({
        id: section.getAttribute('id'),
        top: section.offsetTop - 150
    }));

    let sectionTops = getSectionTops();

    window.addEventListener('resize', () => {
        sectionTops = getSectionTops();
    }, { passive: true });

    let isNavScrolling = false;
    window.addEventListener('scroll', () => {
        if (!isNavScrolling) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                let current = '';

                for (let i = sectionTops.length - 1; i >= 0; i--) {
                    if (scrollY >= sectionTops[i].top) {
                        current = sectionTops[i].id;
                        break;
                    }
                }

                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (current && link.getAttribute('href') === `#${current}`) {
                        link.classList.add('active');
                    }
                });
                isNavScrolling = false;
            });
            isNavScrolling = true;
        }
    }, { passive: true });
}

// ===== 3D Tilt on Hero (desktop only) =====
if (!isTouchDevice) {
    const hero = document.getElementById('hero');
    if (hero) {
        const glow = hero.querySelector('.hero-glow');
        if (glow) {
            let isTiltMoving = false;
            hero.addEventListener('mousemove', (e) => {
                if (!isTiltMoving) {
                    window.requestAnimationFrame(() => {
                        const rect = hero.getBoundingClientRect();
                        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
                        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

                        glow.style.transform = `translate(calc(-50% + ${x * 30}px), calc(-50% + ${y * 30}px))`;
                        isTiltMoving = false;
                    });
                    isTiltMoving = true;
                }
            }, { passive: true });
        }
    }
}

// ===== Dynamic Copyright Year =====
const copyrightYear = document.getElementById('copyrightYear');
if (copyrightYear) {
    copyrightYear.textContent = new Date().getFullYear().toString();
}
