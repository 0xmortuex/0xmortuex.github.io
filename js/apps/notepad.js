/* ===== Notepad App ===== */
var NotepadApp = (function () {
  'use strict';

  var instanceCount = 0;

  function open() {
    openWithContent('Untitled.txt', '');
  }

  function openWithContent(filename, content) {
    instanceCount++;
    var id = 'notepad-' + instanceCount;
    var title = 'Notepad \u2014 ' + filename;

    WM.create(id, title, 'notepad', '', { width: 600, height: 440 });
    var el = WM.getContentEl(id);

    var lines = (content || '').split('\n');
    var lineNums = lines.map(function (_, i) { return i + 1; }).join('\n');

    el.innerHTML =
      '<div class="app-notepad">' +
        '<div class="app-notepad__toolbar">' +
          '<button class="app-notepad__btn" id="np-copy-' + instanceCount + '">Copy</button>' +
          '<span style="flex:1"></span>' +
          '<span style="font-size:0.75rem;color:var(--os-text-muted)">' + escHtml(filename) + '</span>' +
        '</div>' +
        '<div class="app-notepad__body">' +
          '<div class="app-notepad__lines" id="np-lines-' + instanceCount + '">' + lineNums + '</div>' +
          '<textarea class="app-notepad__textarea" id="np-text-' + instanceCount + '" spellcheck="false">' + escHtml(content) + '</textarea>' +
        '</div>' +
      '</div>';

    var cnt = instanceCount;
    var textarea = document.getElementById('np-text-' + cnt);
    var linesEl = document.getElementById('np-lines-' + cnt);

    textarea.addEventListener('input', function () {
      updateLineNumbers(textarea, linesEl);
    });

    textarea.addEventListener('scroll', function () {
      linesEl.scrollTop = textarea.scrollTop;
    });

    document.getElementById('np-copy-' + cnt).addEventListener('click', function () {
      navigator.clipboard.writeText(textarea.value).then(function () {
        OS.toast('Copied to clipboard');
      });
    });
  }

  function updateLineNumbers(textarea, linesEl) {
    var count = textarea.value.split('\n').length;
    var nums = [];
    for (var i = 1; i <= count; i++) nums.push(i);
    linesEl.textContent = nums.join('\n');
  }

  function escHtml(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  return { open: open, openWithContent: openWithContent };
})();