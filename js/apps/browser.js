/* ===== Browser App ===== */
var BrowserApp = (function () {
  'use strict';

  var currentUrl = '';

  function open(url) {
    url = url || 'about:blank';
    currentUrl = url;
    var title = 'Browser \u2014 ' + shortenUrl(url);

    if (WM.isOpen('browser')) {
      WM.focus('browser');
      navigate(url);
      return;
    }

    WM.create('browser', title, 'browser', '', { width: 800, height: 550 });
    var el = WM.getContentEl('browser');

    el.innerHTML =
      '<div class="app-browser">' +
        '<div class="app-browser__toolbar">' +
          '<button class="app-browser__nav-btn" id="br-back">\u2190</button>' +
          '<button class="app-browser__nav-btn" id="br-fwd">\u2192</button>' +
          '<button class="app-browser__nav-btn" id="br-refresh">\u21bb</button>' +
          '<input class="app-browser__url" id="br-url" readonly value="' + escAttr(url) + '">' +
          '<a href="' + escAttr(url) + '" target="_blank" rel="noopener" class="app-browser__external" id="br-external">Open \u2197</a>' +
        '</div>' +
        '<iframe class="app-browser__iframe" id="br-iframe" sandbox="allow-scripts allow-same-origin allow-forms allow-popups" src="' + escAttr(url) + '"></iframe>' +
      '</div>';

    document.getElementById('br-back').addEventListener('click', function () {
      var iframe = document.getElementById('br-iframe');
      try { iframe.contentWindow.history.back(); } catch (e) {}
    });

    document.getElementById('br-fwd').addEventListener('click', function () {
      var iframe = document.getElementById('br-iframe');
      try { iframe.contentWindow.history.forward(); } catch (e) {}
    });

    document.getElementById('br-refresh').addEventListener('click', function () {
      var iframe = document.getElementById('br-iframe');
      if (iframe) iframe.src = iframe.src;
    });
  }

  function navigate(url) {
    currentUrl = url;
    var iframe = document.getElementById('br-iframe');
    var urlInput = document.getElementById('br-url');
    var ext = document.getElementById('br-external');

    if (iframe) iframe.src = url;
    if (urlInput) urlInput.value = url;
    if (ext) ext.href = url;

    WM.setTitle('browser', 'Browser \u2014 ' + shortenUrl(url));
  }

  function shortenUrl(url) {
    try {
      var u = new URL(url);
      return u.hostname + u.pathname.slice(0, 20);
    } catch (e) {
      return url.slice(0, 30);
    }
  }

  function escAttr(s) {
    return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }

  return { open: open };
})();