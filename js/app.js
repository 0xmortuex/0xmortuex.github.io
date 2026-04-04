/* ===== Main App Controller ===== */
(function () {
  'use strict';

  /* --- Hero Typing Animation --- */
  var heroTitle = document.getElementById('hero-title');
  var heroSubtitle = document.getElementById('hero-subtitle');
  var heroSocials = document.getElementById('hero-socials');
  var heroScroll = document.getElementById('hero-scroll');
  var fullText = '0xmortuex';
  var greenPart = '0x';
  var charIndex = 0;

  // Add cursor
  var cursor = document.createElement('span');
  cursor.className = 'hero__cursor';
  heroTitle.appendChild(cursor);

  function typeChar() {
    if (charIndex < fullText.length) {
      var char = fullText[charIndex];
      var span;

      if (charIndex < greenPart.length) {
        // Check if green span exists
        var greenSpan = heroTitle.querySelector('.green');
        if (!greenSpan) {
          greenSpan = document.createElement('span');
          greenSpan.className = 'green';
          heroTitle.insertBefore(greenSpan, cursor);
        }
        greenSpan.textContent += char;
      } else {
        // Check if white span exists
        var whiteSpan = heroTitle.querySelector('.white');
        if (!whiteSpan) {
          whiteSpan = document.createElement('span');
          whiteSpan.className = 'white';
          heroTitle.insertBefore(whiteSpan, cursor);
        }
        whiteSpan.textContent += char;
      }

      charIndex++;
      var delay = 80 + Math.random() * 60;
      setTimeout(typeChar, delay);
    } else {
      // Typing done — trigger cascading reveals
      setTimeout(function () {
        heroSubtitle.classList.add('hero__subtitle--visible');
      }, 300);

      var socialLinks = heroSocials.querySelectorAll('.hero__social-link');
      socialLinks.forEach(function (link, i) {
        setTimeout(function () {
          link.classList.add('hero__social-link--visible');
        }, 600 + i * 150);
      });

      setTimeout(function () {
        heroScroll.classList.add('hero__scroll--visible');
      }, 1000);

      // Remove cursor after a delay
      setTimeout(function () {
        cursor.remove();
      }, 2500);
    }
  }

  // Start typing after a small delay
  setTimeout(typeChar, 400);

  /* --- Navigation scroll effect --- */
  var nav = document.getElementById('nav');

  function updateNav() {
    if (window.scrollY > 50) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* --- Active nav link on scroll --- */
  var sections = document.querySelectorAll('.section, .hero');
  var navLinks = document.querySelectorAll('.nav__link');

  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.id;
        navLinks.forEach(function (link) {
          if (link.dataset.section === id) {
            link.classList.add('nav__link--active');
          } else {
            link.classList.remove('nav__link--active');
          }
        });
      }
    });
  }, {
    rootMargin: '-40% 0px -40% 0px',
    threshold: 0
  });

  sections.forEach(function (sec) {
    sectionObserver.observe(sec);
  });

  /* --- Mobile hamburger menu --- */
  var hamburger = document.getElementById('hamburger');
  var navLinksEl = document.getElementById('nav-links');
  var overlay = document.getElementById('nav-overlay');

  function toggleMenu() {
    hamburger.classList.toggle('nav__hamburger--open');
    navLinksEl.classList.toggle('nav__links--open');
    overlay.classList.toggle('nav__overlay--visible');
  }

  function closeMenu() {
    hamburger.classList.remove('nav__hamburger--open');
    navLinksEl.classList.remove('nav__links--open');
    overlay.classList.remove('nav__overlay--visible');
  }

  hamburger.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', closeMenu);

  // Close menu on nav link click
  navLinksEl.querySelectorAll('.nav__link').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  /* --- Smooth scroll for nav links (JS fallback) --- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offset = target.id === 'hero' ? 0 : nav.offsetHeight;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });
})();