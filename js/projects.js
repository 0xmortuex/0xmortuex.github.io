/* ===== Project Data & Rendering ===== */
(function () {
  'use strict';

  var projects = [
    {
      name: 'CodeLens',
      desc: 'Paste code, get an instant AI security audit with visual report cards.',
      category: 'AI Tools',
      tag: 'AI Tool',
      tagClass: 'ai',
      stack: ['JavaScript', 'Claude', 'Cloudflare Workers'],
      demo: 'https://0xmortuex.github.io/CodeLens/',
      source: 'https://github.com/0xmortuex/CodeLens'
    },
    {
      name: 'LexScope',
      desc: 'Interactive legislation explorer with AI-parsed sections, definitions, and improvement suggestions.',
      category: 'AI Tools',
      tag: 'AI Tool',
      tagClass: 'ai',
      stack: ['JavaScript', 'Claude', 'Cloudflare Workers'],
      demo: 'https://0xmortuex.github.io/LexScope/',
      source: 'https://github.com/0xmortuex/LexScope'
    },
    {
      name: 'LoopholeMap',
      desc: 'Find every loophole in any regulation, visualized as an interactive node graph.',
      category: 'AI Tools',
      tag: 'AI Tool',
      tagClass: 'ai',
      stack: ['JavaScript', 'D3.js', 'Claude', 'Cloudflare Workers'],
      demo: 'https://0xmortuex.github.io/LoopholeMap/',
      source: 'https://github.com/0xmortuex/LoopholeMap'
    },
    {
      name: 'DebateBot',
      desc: 'Enter any topic, get the strongest arguments for both sides with evidence and fallacy detection.',
      category: 'AI Tools',
      tag: 'AI Tool',
      tagClass: 'ai',
      stack: ['JavaScript', 'Claude', 'Cloudflare Workers'],
      demo: 'https://0xmortuex.github.io/DebateBot/',
      source: 'https://github.com/0xmortuex/DebateBot'
    },
    {
      name: 'PassCrack',
      desc: 'Simulates real attack techniques to estimate password crack time with pattern detection.',
      category: 'Cybersecurity',
      tag: 'Cybersec',
      tagClass: 'cyber',
      stack: ['HTML', 'CSS', 'JavaScript'],
      demo: '',
      source: 'https://github.com/0xmortuex/passcrack'
    },
    {
      name: 'SteamOgames',
      desc: 'Scrapes and displays a 122-game Steam library dashboard without an API key.',
      category: 'Dev Tools',
      tag: 'Dev Tool',
      tagClass: 'dev',
      stack: ['Python', 'Flask', 'BeautifulSoup'],
      demo: '',
      source: 'https://github.com/0xmortuex/SteamOgames'
    },
    {
      name: 'Vencord Plugins',
      desc: '5 standalone Discord plugins: InactivityTracker, QuickNotes, ServerClock, RoleMembers, DMOrganizer.',
      category: 'Plugins',
      tag: 'Plugin',
      tagClass: 'plugin',
      stack: ['TypeScript', 'Vencord API'],
      demo: '',
      source: 'https://github.com/0xmortuex?tab=repositories&q=vencord'
    }
  ];

  var categories = ['All', 'AI Tools', 'Cybersecurity', 'Dev Tools', 'Plugins'];
  var activeFilter = 'All';

  var filtersEl = document.getElementById('project-filters');
  var gridEl = document.getElementById('project-grid');

  function renderFilters() {
    filtersEl.innerHTML = '';
    categories.forEach(function (cat) {
      var btn = document.createElement('button');
      btn.className = 'filter-pill' + (cat === activeFilter ? ' filter-pill--active' : '');
      btn.textContent = cat;
      btn.addEventListener('click', function () {
        activeFilter = cat;
        renderFilters();
        renderProjects();
      });
      filtersEl.appendChild(btn);
    });
  }

  function renderProjects() {
    var filtered = activeFilter === 'All'
      ? projects
      : projects.filter(function (p) { return p.category === activeFilter; });

    gridEl.innerHTML = '';
    gridEl.classList.add('anim-fade-up');
    gridEl.classList.remove('anim-fade-up--visible');

    filtered.forEach(function (p, i) {
      var card = document.createElement('div');
      card.className = 'project-card';
      card.style.transitionDelay = i * 50 + 'ms';

      var stackHtml = p.stack.map(function (s) {
        return '<span class="stack-chip">' + s + '</span>';
      }).join('');

      var linksHtml = '';
      if (p.demo) {
        linksHtml += '<a href="' + p.demo + '" target="_blank" rel="noopener" class="project-card__link project-card__link--demo">Live Demo &rarr;</a>';
      }
      linksHtml += '<a href="' + p.source + '" target="_blank" rel="noopener" class="project-card__link project-card__link--source">Source &nearr;</a>';

      card.innerHTML =
        '<span class="project-card__tag project-card__tag--' + p.tagClass + '">' + p.tag + '</span>' +
        '<h3 class="project-card__name">' + p.name + '</h3>' +
        '<p class="project-card__desc">' + p.desc + '</p>' +
        '<div class="project-card__stack">' + stackHtml + '</div>' +
        '<div class="project-card__links">' + linksHtml + '</div>';

      gridEl.appendChild(card);
    });

    // Trigger animation
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        gridEl.classList.add('anim-fade-up--visible');
      });
    });
  }

  renderFilters();
  renderProjects();
})();