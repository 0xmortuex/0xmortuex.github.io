/* ===== Scroll Animations & Parallax ===== */
(function () {
  'use strict';

  /* --- Intersection Observer for fade-up elements --- */
  var animObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('anim-fade-up--visible');

      // Stagger children (project cards, skill cards, contact cards)
      var children = entry.target.querySelectorAll(
        '.project-card, .skill-card, .contact-card'
      );
      children.forEach(function (child, i) {
        child.style.transitionDelay = i * 50 + 'ms';
      });

      animObserver.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.anim-fade-up').forEach(function (el) {
    animObserver.observe(el);
  });

  /* --- Skill bar fill animation --- */
  var skillObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var fills = entry.target.querySelectorAll('.skill-card__fill');
      fills.forEach(function (fill, i) {
        setTimeout(function () {
          fill.style.width = fill.dataset.level + '%';
        }, i * 60);
      });
      skillObserver.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.skills__group').forEach(function (group) {
    skillObserver.observe(group);
  });

  /* --- Stat counter animation --- */
  var statObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var nums = entry.target.querySelectorAll('.stat__number');
      nums.forEach(function (num) {
        var target = parseInt(num.dataset.target, 10);
        var duration = 1500;
        var start = performance.now();

        function tick(now) {
          var elapsed = now - start;
          var progress = Math.min(elapsed / duration, 1);
          // Ease-out cubic
          var eased = 1 - Math.pow(1 - progress, 3);
          num.textContent = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
      });
      statObserver.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  var statsCard = document.querySelector('.about__stats');
  if (statsCard) statObserver.observe(statsCard);

  /* --- Hero parallax dot grid --- */
  var heroBg = document.getElementById('hero-bg');
  if (heroBg) {
    document.addEventListener('mousemove', function (e) {
      var x = (e.clientX / window.innerWidth - 0.5) * 2;
      var y = (e.clientY / window.innerHeight - 0.5) * 2;
      heroBg.style.transform =
        'translate(' + x * 8 + 'px, ' + y * 8 + 'px)';
    });
  }

  /* --- Expose re-observe for dynamically added elements --- */
  window.observeAnimElements = function () {
    document.querySelectorAll('.anim-fade-up:not(.anim-fade-up--visible)').forEach(function (el) {
      animObserver.observe(el);
    });
  };
})();