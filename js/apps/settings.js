/* ===== Settings App ===== */
var SettingsApp = (function () {
  'use strict';

  var wallpapers = [
    { id: 'grid', name: 'Dark Grid', cls: 'wallpaper-grid', bg: 'linear-gradient(135deg,#0a0c10,#12141a)' },
    { id: 'gradient', name: 'Purple', cls: 'wallpaper-gradient', bg: 'linear-gradient(135deg,#0a0c10,#1a1033,#0a0c10)' },
    { id: 'solid', name: 'Solid Dark', cls: 'wallpaper-solid', bg: '#0a0c10' },
    { id: 'matrix', name: 'Matrix', cls: 'wallpaper-matrix', bg: '#050505' }
  ];

  function open() {
    if (WM.isOpen('settings')) { WM.focus('settings'); return; }
    WM.create('settings', 'Settings', 'settings', '', { width: 520, height: 460 });
    render();
  }

  function render() {
    var el = WM.getContentEl('settings');
    if (!el) return;

    var currentWp = localStorage.getItem('mos-wallpaper') || 'grid';
    var bootEnabled = localStorage.getItem('mos-boot') !== 'false';
    var displayName = localStorage.getItem('mos-name') || '0xmortuex';
    var theme = localStorage.getItem('mos-theme') || '';

    var wpHtml = wallpapers.map(function (wp) {
      return '<div class="app-settings__wp' + (wp.id === currentWp ? ' app-settings__wp--active' : '') + '" data-wp="' + wp.id + '" style="background:' + wp.bg + '" title="' + wp.name + '"></div>';
    }).join('');

    el.innerHTML =
      '<div class="app-settings">' +
        '<div class="app-settings__group">' +
          '<div class="app-settings__label">Wallpaper</div>' +
          '<div class="app-settings__wallpapers">' + wpHtml + '</div>' +
        '</div>' +
        '<div class="app-settings__group">' +
          '<div class="app-settings__label">Appearance</div>' +
          '<div class="app-settings__row">' +
            '<span class="app-settings__row-label">Dark Mode</span>' +
            '<div class="app-settings__toggle' + (theme !== 'light' ? ' app-settings__toggle--on' : '') + '" id="set-theme"></div>' +
          '</div>' +
          '<div class="app-settings__row">' +
            '<span class="app-settings__row-label">Boot Screen</span>' +
            '<div class="app-settings__toggle' + (bootEnabled ? ' app-settings__toggle--on' : '') + '" id="set-boot"></div>' +
          '</div>' +
        '</div>' +
        '<div class="app-settings__group">' +
          '<div class="app-settings__label">Profile</div>' +
          '<div class="app-settings__row">' +
            '<span class="app-settings__row-label">Display Name</span>' +
            '<input class="app-settings__input" id="set-name" value="' + escAttr(displayName) + '">' +
          '</div>' +
        '</div>' +
      '</div>';

    // Wallpaper selection
    el.querySelectorAll('[data-wp]').forEach(function (wpEl) {
      wpEl.addEventListener('click', function () {
        var wpId = wpEl.dataset.wp;
        localStorage.setItem('mos-wallpaper', wpId);
        applyWallpaper(wpId);
        render();
      });
    });

    // Theme toggle
    document.getElementById('set-theme').addEventListener('click', function () {
      var current = localStorage.getItem('mos-theme') || '';
      var next = current === 'light' ? '' : 'light';
      localStorage.setItem('mos-theme', next);
      if (next) document.documentElement.setAttribute('data-theme', 'light');
      else document.documentElement.removeAttribute('data-theme');
      render();
    });

    // Boot toggle
    document.getElementById('set-boot').addEventListener('click', function () {
      var current = localStorage.getItem('mos-boot') !== 'false';
      localStorage.setItem('mos-boot', !current);
      render();
    });

    // Name
    document.getElementById('set-name').addEventListener('change', function () {
      var name = this.value.trim() || '0xmortuex';
      localStorage.setItem('mos-name', name);
      var loginName = document.getElementById('login-name');
      var startUser = document.getElementById('start-menu-user');
      if (loginName) loginName.textContent = name;
      if (startUser) startUser.textContent = name;
    });
  }

  function applyWallpaper(id) {
    var wp = wallpapers.find(function (w) { return w.id === id; });
    if (!wp) return;
    var wallEl = document.getElementById('wallpaper');
    wallEl.className = 'desktop__wallpaper ' + wp.cls;
  }

  function loadSettings() {
    var wp = localStorage.getItem('mos-wallpaper') || 'grid';
    applyWallpaper(wp);

    var theme = localStorage.getItem('mos-theme');
    if (theme === 'light') document.documentElement.setAttribute('data-theme', 'light');

    var name = localStorage.getItem('mos-name');
    if (name) {
      var loginName = document.getElementById('login-name');
      var startUser = document.getElementById('start-menu-user');
      if (loginName) loginName.textContent = name;
      if (startUser) startUser.textContent = name;
    }
  }

  function escAttr(s) {
    return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }

  return { open: open, loadSettings: loadSettings };
})();