/* ===== Desktop Shortcuts ===== */
var Shortcuts = (function () {
  'use strict';

  var container;
  var selected = null;

  var shortcuts = [
    { id: 'about', name: 'About Me', icon: 'about' },
    { id: 'projects', name: 'Projects', icon: 'projects' },
    { id: 'terminal', name: 'Terminal', icon: 'terminal' },
    { id: 'files', name: 'Files', icon: 'files' },
    { id: 'browser', name: 'Browser', icon: 'browser' },
    { id: 'settings', name: 'Settings', icon: 'settings' }
  ];

  function init() {
    container = document.getElementById('desktop-icons');
    render();

    // Deselect on desktop click
    document.getElementById('desktop').addEventListener('click', function (e) {
      if (!e.target.closest('.shortcut') && !e.target.closest('.window') && !e.target.closest('.taskbar') && !e.target.closest('.start-menu') && !e.target.closest('.context-menu')) {
        deselect();
      }
    });

    // Context menu
    document.getElementById('desktop').addEventListener('contextmenu', function (e) {
      if (e.target.closest('.window') || e.target.closest('.taskbar')) return;
      e.preventDefault();
      showContextMenu(e.clientX, e.clientY);
    });

    document.addEventListener('click', function () {
      document.getElementById('context-menu').style.display = 'none';
    });

    // Context menu actions
    document.getElementById('context-menu').addEventListener('click', function (e) {
      var item = e.target.closest('[data-action]');
      if (!item) return;
      var action = item.dataset.action;
      if (action === 'settings') OS.openApp('settings');
      else if (action === 'source') window.open('https://github.com/0xmortuex/0xmortuex.github.io', '_blank');
      else if (action === 'refresh') location.reload();
      else if (action === 'new-notepad') OS.openApp('notepad');
    });
  }

  function render() {
    container.innerHTML = '';
    shortcuts.forEach(function (s) {
      var el = document.createElement('div');
      el.className = 'shortcut';
      el.dataset.app = s.id;
      el.innerHTML =
        '<div class="shortcut__icon"><img src="assets/icons/' + s.icon + '.svg" alt=""></div>' +
        '<span class="shortcut__label">' + s.name + '</span>';

      el.addEventListener('click', function (e) {
        e.stopPropagation();
        select(el);
      });

      el.addEventListener('dblclick', function (e) {
        e.stopPropagation();
        OS.openApp(s.id);
      });

      container.appendChild(el);
    });
  }

  function select(el) {
    deselect();
    el.classList.add('shortcut--selected');
    selected = el;
  }

  function deselect() {
    if (selected) selected.classList.remove('shortcut--selected');
    selected = null;
  }

  function showContextMenu(x, y) {
    var menu = document.getElementById('context-menu');
    menu.style.display = '';
    menu.style.left = Math.min(x, window.innerWidth - 200) + 'px';
    menu.style.top = Math.min(y, window.innerHeight - 200) + 'px';
  }

  return { init: init };
})();