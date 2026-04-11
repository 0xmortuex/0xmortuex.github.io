/* ===== About Me App ===== */
var AboutApp = (function () {
  'use strict';

  function open() {
    if (WM.isOpen('about')) { WM.focus('about'); return; }
    WM.create('about', 'About \u2014 0xmortuex', 'about', '', { width: 620, height: 520 });
    var el = WM.getContentEl('about');

    el.innerHTML =
      '<div class="app-about">' +
        '<div class="app-about__avatar">' +
          '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="#6366f1" stroke-width="2"><circle cx="24" cy="16" r="8"/><path d="M8 42c0-8.837 7.163-16 16-16s16 7.163 16 16"/></svg>' +
        '</div>' +
        '<div class="app-about__info">' +
          '<h2 class="app-about__name">Hey, I\'m Fadi</h2>' +
          '<p class="app-about__bio">9th grader from Istanbul. I build AI-powered dev tools, legal-tech applications, real-time chat systems, browser games, and even a full desktop OS in vanilla JavaScript.</p>' +
          '<div class="app-about__section-title">Languages</div>' +
          '<div class="app-about__pills">' +
            pill('JavaScript') + pill('TypeScript') + pill('Python') + pill('HTML/CSS') + pill('Lua') +
          '</div>' +
          '<div class="app-about__section-title">Tools</div>' +
          '<div class="app-about__pills">' +
            pill('Git') + pill('Cloudflare Workers') + pill('D3.js') + pill('Chrome Extensions') + pill('VS Code') +
          '</div>' +
          '<div class="app-about__section-title">Interests</div>' +
          '<div class="app-about__pills">' +
            pill('Cybersecurity') + pill('OSINT') + pill('Legal Tech') + pill('Game Modding') +
          '</div>' +
          '<div class="app-about__stats" id="about-stats">' +
            '<div class="app-about__stat"><div class="app-about__stat-num" id="about-repos">-</div><div class="app-about__stat-label">Repos</div></div>' +
            '<div class="app-about__stat"><div class="app-about__stat-num" id="about-stars">-</div><div class="app-about__stat-label">Stars</div></div>' +
            '<div class="app-about__stat"><div class="app-about__stat-num" id="about-since">-</div><div class="app-about__stat-label">Since</div></div>' +
          '</div>' +
          '<div class="app-about__links">' +
            '<a href="https://github.com/0xmortuex" target="_blank" rel="noopener" class="app-about__link-btn">GitHub</a>' +
            '<a href="mailto:fraad002@gmail.com" class="app-about__link-btn">Email</a>' +
            '<a href="https://discord.com/users/0xmortuex" target="_blank" rel="noopener" class="app-about__link-btn">Discord</a>' +
          '</div>' +
        '</div>' +
      '</div>';

    fetchGitHub();
  }

  function pill(text) {
    return '<span class="app-about__pill">' + text + '</span>';
  }

  function fetchGitHub() {
    fetch('https://api.github.com/users/0xmortuex')
      .then(function (r) { return r.json(); })
      .then(function (user) {
        var reposEl = document.getElementById('about-repos');
        var sinceEl = document.getElementById('about-since');
        if (reposEl) reposEl.textContent = user.public_repos || '?';
        if (sinceEl) sinceEl.textContent = user.created_at ? user.created_at.slice(0, 4) : '?';
      })
      .catch(function () {});

    fetch('https://api.github.com/users/0xmortuex/repos?per_page=100')
      .then(function (r) { return r.json(); })
      .then(function (repos) {
        var stars = repos.reduce(function (sum, r) { return sum + (r.stargazers_count || 0); }, 0);
        var el = document.getElementById('about-stars');
        if (el) el.textContent = stars;
      })
      .catch(function () {});
  }

  return { open: open };
})();