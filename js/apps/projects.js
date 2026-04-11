/* ===== Projects App ===== */
var ProjectsApp = (function () {
  'use strict';

  var categories = ['All', 'AI-Powered', 'Cybersec', 'Tools', 'Games'];
  var activeFilter = 'All';

  function open() {
    if (WM.isOpen('projects')) { WM.focus('projects'); return; }
    WM.create('projects', 'Projects', 'projects', '', { width: 780, height: 560 });
    render();
    OS.toast('14 projects loaded');
  }

  function render() {
    var el = WM.getContentEl('projects');
    if (!el) return;
    var projects = FS.getProjects();
    var filtered = activeFilter === 'All' ? projects : projects.filter(function (p) { return p.category === activeFilter; });

    var filtersHtml = categories.map(function (cat) {
      return '<button class="app-projects__filter' + (cat === activeFilter ? ' app-projects__filter--active' : '') + '" data-cat="' + cat + '">' + cat + '</button>';
    }).join('');

    var cardsHtml = filtered.map(function (p) {
      var tagsHtml = p.tags.map(function (t) { return '<span class="project-card__tag">' + t + '</span>'; }).join('');
      var openBtn = p.demo ? '<button class="project-card__btn project-card__btn--open" data-demo="' + p.demo + '">Open</button>' : '';
      var srcUrl = p.repo === 'vencord' ? 'https://github.com/0xmortuex?tab=repositories&q=vencord' : 'https://github.com/0xmortuex/' + p.repo;

      return '<div class="project-card">' +
        '<div class="project-card__header"><span class="project-card__emoji">' + p.emoji + '</span><span class="project-card__name">' + p.name + '</span></div>' +
        '<div class="project-card__desc">' + p.desc + '</div>' +
        '<div class="project-card__tags">' + tagsHtml + '</div>' +
        '<div class="project-card__actions">' +
          openBtn +
          '<a href="' + srcUrl + '" target="_blank" rel="noopener" class="project-card__btn project-card__btn--source">Source</a>' +
        '</div>' +
      '</div>';
    }).join('');

    el.innerHTML =
      '<div class="app-projects">' +
        '<div class="app-projects__filters">' + filtersHtml + '</div>' +
        '<div class="app-projects__grid">' + cardsHtml + '</div>' +
      '</div>';

    // Filter clicks
    el.querySelectorAll('.app-projects__filter').forEach(function (btn) {
      btn.addEventListener('click', function () {
        activeFilter = btn.dataset.cat;
        render();
      });
    });

    // Open in browser
    el.querySelectorAll('[data-demo]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        BrowserApp.open(btn.dataset.demo);
      });
    });
  }

  return { open: open };
})();