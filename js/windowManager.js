/* ===== Window Manager ===== */
var WM = (function () {
  'use strict';

  var container = null;
  var windows = {};
  var zIndex = 100;
  var activeId = null;

  function init() {
    container = document.getElementById('windows-container');
  }

  function createWindow(id, title, icon, content, opts) {
    opts = opts || {};
    var width = opts.width || 700;
    var height = opts.height || 480;

    if (windows[id]) {
      restore(id);
      focus(id);
      return windows[id].el;
    }

    var desktop = container.getBoundingClientRect();
    var left = Math.max(20, (desktop.width - width) / 2 + Math.random() * 40 - 20);
    var top = Math.max(10, (desktop.height - height) / 2 + Math.random() * 30 - 15);

    var win = document.createElement('div');
    win.className = 'window';
    win.id = 'win-' + id;
    win.style.width = width + 'px';
    win.style.height = height + 'px';
    win.style.left = left + 'px';
    win.style.top = top + 'px';
    win.style.zIndex = ++zIndex;

    win.innerHTML =
      '<div class="window__titlebar" data-win="' + id + '">' +
        '<div class="window__titlebar-icon"><img src="assets/icons/' + icon + '.svg" alt=""></div>' +
        '<span class="window__titlebar-text">' + escHtml(title) + '</span>' +
        '<div class="window__controls">' +
          '<button class="window__ctrl-btn window__ctrl-btn--minimize" data-action="minimize" data-win="' + id + '"></button>' +
          '<button class="window__ctrl-btn window__ctrl-btn--maximize" data-action="maximize" data-win="' + id + '"></button>' +
          '<button class="window__ctrl-btn window__ctrl-btn--close" data-action="close" data-win="' + id + '"></button>' +
        '</div>' +
      '</div>' +
      '<div class="window__content" id="win-content-' + id + '"></div>' +
      '<div class="window__resize window__resize--e" data-resize="e" data-win="' + id + '"></div>' +
      '<div class="window__resize window__resize--s" data-resize="s" data-win="' + id + '"></div>' +
      '<div class="window__resize window__resize--w" data-resize="w" data-win="' + id + '"></div>' +
      '<div class="window__resize window__resize--se" data-resize="se" data-win="' + id + '"></div>' +
      '<div class="window__resize window__resize--sw" data-resize="sw" data-win="' + id + '"></div>';

    container.appendChild(win);

    var contentEl = document.getElementById('win-content-' + id);
    if (typeof content === 'string') {
      contentEl.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      contentEl.appendChild(content);
    }

    windows[id] = {
      el: win,
      contentEl: contentEl,
      title: title,
      icon: icon,
      minimized: false,
      maximized: false,
      prevRect: null
    };

    setupDrag(win, id);
    setupResize(win, id);
    setupControlButtons(win, id);

    win.addEventListener('mousedown', function () { focus(id); });

    focus(id);
    if (typeof Taskbar !== 'undefined') Taskbar.addApp(id, icon, title);

    return win;
  }

  function setupDrag(win, id) {
    var titlebar = win.querySelector('.window__titlebar');
    var dragging = false, startX, startY, startLeft, startTop;

    titlebar.addEventListener('mousedown', function (e) {
      if (e.target.closest('.window__controls')) return;
      if (windows[id].maximized) return;
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = win.offsetLeft;
      startTop = win.offsetTop;
      document.body.style.cursor = 'move';
      e.preventDefault();
    });

    document.addEventListener('mousemove', function (e) {
      if (!dragging) return;
      win.style.left = (startLeft + e.clientX - startX) + 'px';
      win.style.top = Math.max(0, startTop + e.clientY - startY) + 'px';
    });

    document.addEventListener('mouseup', function () {
      if (dragging) {
        dragging = false;
        document.body.style.cursor = '';
      }
    });
  }

  function setupResize(win, id) {
    var handles = win.querySelectorAll('.window__resize');
    var resizing = false, dir, startX, startY, startW, startH, startL, startT;

    handles.forEach(function (h) {
      h.addEventListener('mousedown', function (e) {
        if (windows[id].maximized) return;
        resizing = true;
        dir = h.dataset.resize;
        startX = e.clientX;
        startY = e.clientY;
        startW = win.offsetWidth;
        startH = win.offsetHeight;
        startL = win.offsetLeft;
        startT = win.offsetTop;
        e.preventDefault();
        e.stopPropagation();
      });
    });

    document.addEventListener('mousemove', function (e) {
      if (!resizing) return;
      var dx = e.clientX - startX;
      var dy = e.clientY - startY;

      if (dir.includes('e')) win.style.width = Math.max(400, startW + dx) + 'px';
      if (dir.includes('s')) win.style.height = Math.max(300, startH + dy) + 'px';
      if (dir.includes('w')) {
        var nw = Math.max(400, startW - dx);
        win.style.width = nw + 'px';
        win.style.left = (startL + startW - nw) + 'px';
      }
    });

    document.addEventListener('mouseup', function () {
      resizing = false;
    });
  }

  function setupControlButtons(win, id) {
    win.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-action]');
      if (!btn) return;
      var action = btn.dataset.action;
      if (action === 'close') closeWindow(id);
      else if (action === 'minimize') minimize(id);
      else if (action === 'maximize') toggleMaximize(id);
    });
  }

  function focus(id) {
    if (!windows[id]) return;
    activeId = id;
    windows[id].el.style.zIndex = ++zIndex;
    if (typeof Taskbar !== 'undefined') Taskbar.setActive(id);
  }

  function minimize(id) {
    if (!windows[id]) return;
    windows[id].minimized = true;
    windows[id].el.classList.add('window--minimized');
    if (typeof Taskbar !== 'undefined') Taskbar.setActive(null);
  }

  function restore(id) {
    if (!windows[id]) return;
    windows[id].minimized = false;
    windows[id].el.classList.remove('window--minimized');
    focus(id);
  }

  function toggleMaximize(id) {
    if (!windows[id]) return;
    var w = windows[id];
    if (w.maximized) {
      w.maximized = false;
      w.el.classList.remove('window--maximized');
      if (w.prevRect) {
        w.el.style.width = w.prevRect.w + 'px';
        w.el.style.height = w.prevRect.h + 'px';
        w.el.style.left = w.prevRect.l + 'px';
        w.el.style.top = w.prevRect.t + 'px';
      }
    } else {
      w.prevRect = {
        w: w.el.offsetWidth, h: w.el.offsetHeight,
        l: w.el.offsetLeft, t: w.el.offsetTop
      };
      w.maximized = true;
      w.el.classList.add('window--maximized');
    }
  }

  function closeWindow(id) {
    if (!windows[id]) return;
    var el = windows[id].el;
    el.classList.add('window--closing');
    setTimeout(function () {
      el.remove();
      delete windows[id];
      if (typeof Taskbar !== 'undefined') Taskbar.removeApp(id);
    }, 100);
  }

  function setTitle(id, title) {
    if (!windows[id]) return;
    windows[id].title = title;
    windows[id].el.querySelector('.window__titlebar-text').textContent = title;
  }

  function isOpen(id) {
    return !!windows[id];
  }

  function getContentEl(id) {
    return windows[id] ? windows[id].contentEl : null;
  }

  function toggleWindow(id) {
    if (!windows[id]) return;
    if (windows[id].minimized) {
      restore(id);
    } else if (activeId === id) {
      minimize(id);
    } else {
      focus(id);
    }
  }

  function escHtml(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  return {
    init: init,
    create: createWindow,
    close: closeWindow,
    focus: focus,
    minimize: minimize,
    restore: restore,
    toggle: toggleWindow,
    setTitle: setTitle,
    isOpen: isOpen,
    getContentEl: getContentEl
  };
})();