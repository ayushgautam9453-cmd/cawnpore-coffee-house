/* =========================================================
   CAWNPORE COFFEE HOUSE — SCRIPT.JS
   Vanilla JavaScript — no dependencies
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------
     1. LOADING SCREEN
  --------------------------------------------------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hide');
      document.body.style.overflow = 'auto';
    }, 900);
  });
  // fallback in case 'load' already fired
  setTimeout(() => loader && loader.classList.add('hide'), 3000);


  /* ---------------------------------------------------
     2. STICKY NAVBAR ON SCROLL
  --------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  function handleScrollUI() {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    if (scrollY > 500) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  }
  window.addEventListener('scroll', handleScrollUI);
  handleScrollUI();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ---------------------------------------------------
     3. MOBILE MENU TOGGLE
  --------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });


  /* ---------------------------------------------------
     4. SMOOTH SCROLL FOR ALL ANCHOR LINKS
  --------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });


  /* ---------------------------------------------------
     5. ACTIVE NAVIGATION HIGHLIGHT ON SCROLL
  --------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function highlightActiveNav() {
    let currentId = '';
    const scrollPos = window.scrollY + 140;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
  }
  window.addEventListener('scroll', highlightActiveNav);
  highlightActiveNav();


  /* ---------------------------------------------------
     6. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
  --------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ---------------------------------------------------
     7. ANIMATED COUNTERS (About stats)
  --------------------------------------------------- */
  const counters = document.querySelectorAll('.about-stat-num');
  let countersStarted = false;

  function animateCounters() {
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-count'));
      const isDecimal = target % 1 !== 0;
      let current = 0;
      const increment = target / 60;

      const step = () => {
        current += increment;
        if (current >= target) {
          counter.textContent = isDecimal ? target.toFixed(1) : Math.round(target);
        } else {
          counter.textContent = isDecimal ? current.toFixed(1) : Math.round(current);
          requestAnimationFrame(step);
        }
      };
      requestAnimationFrame(step);
    });
  }

  const aboutStatsSection = document.querySelector('.about-stats');
  if (aboutStatsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersStarted) {
          countersStarted = true;
          animateCounters();
          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.4 });
    statsObserver.observe(aboutStatsSection);
  }


  /* ---------------------------------------------------
     8. MENU CATEGORY FILTER TABS
  --------------------------------------------------- */
  const menuTabs = document.querySelectorAll('.menu-tab');
  const menuCards = document.querySelectorAll('.menu-card');

  menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      menuTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.getAttribute('data-tab');

      menuCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-cat') === category) {
          card.classList.remove('hide');
        } else {
          card.classList.add('hide');
        }
      });
    });
  });


  /* ---------------------------------------------------
     9. GALLERY LIGHTBOX
  --------------------------------------------------- */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const fullImg = item.getAttribute('data-full');
      lightboxImg.src = fullImg;
      lightboxImg.alt = item.querySelector('img').alt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });


  /* ---------------------------------------------------
     10. RESERVATION FORM VALIDATION
  --------------------------------------------------- */
  const reserveForm = document.getElementById('reserveForm');
  const formSuccess = document.getElementById('formSuccess');

  function setInvalid(group, isInvalid) {
    group.classList.toggle('invalid', isInvalid);
  }

  function validatePhone(value) {
    return /^[6-9]\d{9}$/.test(value.trim());
  }

  function validateEmail(value) {
    if (!value.trim()) return true; // optional field
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  if (reserveForm) {
    reserveForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const nameInput = document.getElementById('name');
      const phoneInput = document.getElementById('phone');
      const dateInput = document.getElementById('date');
      const timeInput = document.getElementById('time');
      const guestsInput = document.getElementById('guests');
      const emailInput = document.getElementById('email');

      // Name
      const nameGroup = nameInput.closest('.form-group');
      const nameInvalid = nameInput.value.trim().length < 2;
      setInvalid(nameGroup, nameInvalid);
      if (nameInvalid) isValid = false;

      // Phone
      const phoneGroup = phoneInput.closest('.form-group');
      const phoneInvalid = !validatePhone(phoneInput.value);
      setInvalid(phoneGroup, phoneInvalid);
      if (phoneInvalid) isValid = false;

      // Date
      const dateGroup = dateInput.closest('.form-group');
      const dateInvalid = !dateInput.value;
      setInvalid(dateGroup, dateInvalid);
      if (dateInvalid) isValid = false;

      // Time
      const timeGroup = timeInput.closest('.form-group');
      const timeInvalid = !timeInput.value;
      setInvalid(timeGroup, timeInvalid);
      if (timeInvalid) isValid = false;

      // Guests
      const guestsGroup = guestsInput.closest('.form-group');
      const guestsInvalid = !guestsInput.value;
      setInvalid(guestsGroup, guestsInvalid);
      if (guestsInvalid) isValid = false;

      // Email (optional but must be valid if filled)
      const emailGroup = emailInput.closest('.form-group');
      const emailInvalid = !validateEmail(emailInput.value);
      setInvalid(emailGroup, emailInvalid);
      if (emailInvalid) isValid = false;

      if (isValid) {
        formSuccess.classList.add('show');
        reserveForm.reset();
        setTimeout(() => {
          formSuccess.classList.remove('show');
        }, 6000);
      } else {
        // scroll to first invalid field
        const firstInvalid = reserveForm.querySelector('.invalid');
        if (firstInvalid) {
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });

    // live-clear validation state as user types
    reserveForm.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('input', () => {
        field.closest('.form-group').classList.remove('invalid');
      });
    });

    // Prevent past dates in date picker
    const dateField = document.getElementById('date');
    if (dateField) {
      const today = new Date().toISOString().split('T')[0];
      dateField.setAttribute('min', today);
    }
  }


  /* ---------------------------------------------------
     11. CURSOR GLOW (decorative, desktop only)
  --------------------------------------------------- */
  const cursorGlow = document.getElementById('cursorGlow');
  if (window.matchMedia('(min-width: 1024px)').matches && cursorGlow) {
    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    });
  }


  /* ---------------------------------------------------
     12. TESTIMONIAL TRACK — DUPLICATE FOR INFINITE LOOP
  --------------------------------------------------- */
  const testiTrack = document.getElementById('testiTrack');
  if (testiTrack) {
    const originalCards = testiTrack.innerHTML;
    testiTrack.innerHTML += originalCards; // duplicate for seamless marquee
  }


  /* ---------------------------------------------------
     13. SCROLL PROGRESS BAR
  --------------------------------------------------- */
  const scrollProgress = document.getElementById('scrollProgress');
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (scrollProgress) scrollProgress.style.width = progress + '%';
  }
  window.addEventListener('scroll', updateScrollProgress);
  updateScrollProgress();


  /* ---------------------------------------------------
     14. RESPECT REDUCED-MOTION / TOUCH FOR MICRO-INTERACTIONS
  --------------------------------------------------- */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = window.matchMedia('(hover: none)').matches;
  const enableMicroInteractions = !prefersReducedMotion && !isTouchDevice;


  /* ---------------------------------------------------
     15. 3D TILT EFFECT ON CARDS
  --------------------------------------------------- */
  if (enableMicroInteractions) {
    const tiltCards = document.querySelectorAll('.why-card, .coffee-card, .menu-card');

    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6; // max 6deg
        const rotateY = ((x - centerX) / centerX) * 6;
        card.style.setProperty('--rx', `${rotateX}deg`);
        card.style.setProperty('--ry', `${rotateY}deg`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }


  /* ---------------------------------------------------
     16. MAGNETIC BUTTON EFFECT
  --------------------------------------------------- */
  if (enableMicroInteractions) {
    const magneticButtons = document.querySelectorAll('.magnetic');

    magneticButtons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.3}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }


  /* ---------------------------------------------------
     17. FAQ ACCORDION
  --------------------------------------------------- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // close all other items (single-open accordion)
      faqItems.forEach(other => {
        other.classList.remove('open');
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        other.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

});
