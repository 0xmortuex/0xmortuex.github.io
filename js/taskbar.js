/* ===== Taskbar & Start Menu ===== */
var Taskbar = (function () {
  'use strict';

  var appsEl, clockEl, startBtn, startMenu, startSearch, startGrid;
  var openApps = {};

  var allApps = [
    { id: 'about', name: 'About Me', icon: 'about' },
    { id: 'projects', name: 'Projects', icon: 'projects' },
    { id: 'terminal', name: 'Terminal', icon: 'terminal' },
    { id: 'files', name: 'Files', icon: 'files' },
    { id: 'browser', name: 'Browser', icon: 'browser' },
    { id: 'notepad', name: 'Notepad', icon: 'notepad' },
    { id: 'settings', name: 'Settings', icon: 'settings' },
    { id: 'music', name: 'Music', icon: 'music' },
    { id: 'contact', name: 'Contact', icon: 'contact' }
  ];

  function init() {
    appsEl = document.getElementById('taskbar-apps');
    clockEl = document.getElementById('taskbar-clock');
    startBtn = document.getElementById('start-btn');
    startMenu = document.getElementById('start-menu');
    startSearch = document.getElementById('start-search');
    startGrid = document.getElementById('start-menu-grid');

    updateClock();
    setInterval(updateClock, 15000);

    startBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleStartMenu();
    });

    document.addEventListener('click', function (e) {
      if (startMenu.style.display !== 'none' && !startMenu.contains(e.target) && e.target !== startBtn) {
        closeStartMenu();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeStartMenu();
    });

    startSearch.addEventListener('input', filterStartApps);
    renderStartMenu();

    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'light' ? '' : 'light';
      if (next) document.documentElement.setAttribute('data-theme', 'light');
      else document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('mos-theme', next);
    });
  }

  function updateClock() {
    var now = new Date();
    var h = now.getHours().toString().padStart(2, '0');
    var m = now.getMinutes().toString().padStart(2, '0');
    clockEl.textContent = h + ':' + m;
    clockEl.title = now.toLocaleDateString();
  }

  function addApp(id, icon, title) {
    if (openApps[id]) return;
    var btn = document.createElement('button');
    btn.className = 'taskbar__app';
    btn.dataset.appId = id;
    btn.title = title;
    btn.innerHTML = '<img class="taskbar__app-icon" src="assets/icons/' + icon + '.svg" alt="">' +
                    '<div class="taskbar__app-dot"></div>';
    btn.addEventListener('click', function () {
      WM.toggle(id);
    });
    appsEl.appendChild(btn);
    openApps[id] = btn;
  }

  function removeApp(id) {
    if (openApps[id]) {
      openApps[id].remove();
      delete openApps[id];
    }
  }

  function setActive(id) {
    Object.keys(openApps).forEach(function (k) {
      openApps[k].classList.toggle('taskbar__app--active', k === id);
    });
  }

  function toggleStartMenu() {
    if (startMenu.style.display === 'none') {
      startMenu.style.display = '';
      startSearch.value = '';
      filterStartApps();
      startSearch.focus();
    } else {
      closeStartMenu();
    }
  }

  function closeStartMenu() {
    startMenu.style.display = 'none';
  }

  function renderStartMenu() {
    startGrid.innerHTML = '';
    allApps.forEach(function (app) {
      var el = document.createElement('div');
      el.className = 'start-menu__app';
      el.dataset.appName = app.name.toLowerCase();
      el.innerHTML = '<img class="start-menu__app-icon" src="assets/icons/' + app.icon + '.svg" alt="">' +
                     '<span class="start-menu__app-name">' + app.name + '</span>';
      el.addEventListener('click', function () {
        closeStartMenu();
        OS.openApp(app.id);
      });
      startGrid.appendChild(el);
    });
  }

  function filterStartApps() {
    var q = startSearch.value.toLowerCase();
    var items = startGrid.querySelectorAll('.start-menu__app');
    items.forEach(function (item) {
      item.style.display = item.dataset.appName.includes(q) ? '' : 'none';
    });
  }

  return { init: init, addApp: addApp, removeApp: removeApp, setActive: setActive };
})();