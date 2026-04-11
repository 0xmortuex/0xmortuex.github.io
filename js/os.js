/* ===== mortuexOS — Main Controller ===== */
var OS = (function () {
  'use strict';

  var bootEl, loginEl, desktopEl;
  var bootLines = [
    'mortuexOS v1.0.0',
    'Loading kernel... OK',
    'Initializing display... OK',
    'Loading portfolio modules... OK',
    'Starting window manager... OK',
    'Welcome, visitor.'
  ];

  function init() {
    bootEl = document.getElementById('boot');
    loginEl = document.getElementById('login');
    desktopEl = document.getElementById('desktop');

    var skipBoot = localStorage.getItem('mos-boot') === 'false';

    if (skipBoot) {
      bootEl.style.display = 'none';
      showLogin();
    } else {
      runBoot();
    }

    // Backtick shortcut for terminal
    document.addEventListener('keydown', function (e) {
      if (e.key === '`' && !e.ctrlKey && !e.altKey && !e.metaKey) {
        var tag = document.activeElement.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;
        e.preventDefault();
        TerminalApp.open();
      }
    });
  }

  function runBoot() {
    var termEl = document.getElementById('boot-terminal');
    var lineIdx = 0;

    function nextLine() {
      if (lineIdx < bootLines.length) {
        termEl.textContent += bootLines[lineIdx] + '\n';
        lineIdx++;
        setTimeout(nextLine, 300 + Math.random() * 200);
      } else {
        setTimeout(function () { endBoot(); }, 500);
      }
    }

    setTimeout(nextLine, 800);

    // Skip on click
    bootEl.addEventListener('click', function () {
      endBoot();
    });
  }

  var bootEnded = false;
  function endBoot() {
    if (bootEnded) return;
    bootEnded = true;
    bootEl.style.transition = 'opacity 0.4s';
    bootEl.style.opacity = '0';
    setTimeout(function () {
      bootEl.style.display = 'none';
      showLogin();
    }, 400);
  }

  var loginReady = false;
  function showLogin() {
    if (loginReady) return;
    loginReady = true;
    loginEl.style.display = '';
    createParticles();

    document.getElementById('login-btn').addEventListener('click', enterDesktop);
    document.addEventListener('keydown', function onKey(e) {
      if (e.key === 'Enter' && loginEl.style.display !== 'none') {
        document.removeEventListener('keydown', onKey);
        enterDesktop();
      }
    });
  }

  function createParticles() {
    var container = document.getElementById('login-particles');
    for (var i = 0; i < 30; i++) {
      var p = document.createElement('div');
      p.className = 'login__particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDuration = (6 + Math.random() * 8) + 's';
      p.style.animationDelay = (Math.random() * 5) + 's';
      container.appendChild(p);
    }
  }

  var desktopEntered = false;
  function enterDesktop() {
    if (desktopEntered) return;
    desktopEntered = true;
    loginEl.style.transition = 'opacity 0.4s';
    loginEl.style.opacity = '0';
    setTimeout(function () {
      loginEl.style.display = 'none';
      desktopEl.style.display = '';
      initDesktop();
    }, 400);
  }

  function initDesktop() {
    WM.init();
    Taskbar.init();
    Shortcuts.init();
    SettingsApp.loadSettings();

    setTimeout(function () {
      toast('Welcome to mortuexOS! Double-click an app to get started.');
    }, 600);
  }

  function openApp(id) {
    switch (id) {
      case 'about': AboutApp.open(); break;
      case 'projects': ProjectsApp.open(); break;
      case 'terminal': TerminalApp.open(); break;
      case 'files': FileExplorerApp.open(); break;
      case 'browser': BrowserApp.open(); break;
      case 'notepad': NotepadApp.open(); break;
      case 'settings': SettingsApp.open(); break;
      case 'music': MusicApp.open(); break;
      case 'contact': ContactApp.open(); break;
    }
  }

  function toast(text) {
    var toastEl = document.getElementById('toast');
    var textEl = document.getElementById('toast-text');
    textEl.textContent = text;
    toastEl.style.display = '';
    toastEl.classList.remove('toast--out');

    setTimeout(function () {
      toastEl.classList.add('toast--out');
      setTimeout(function () {
        toastEl.style.display = 'none';
      }, 300);
    }, 3500);
  }

  // Auto-init
  document.addEventListener('DOMContentLoaded', init);

  return { openApp: openApp, toast: toast };
})();