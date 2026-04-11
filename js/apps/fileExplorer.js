/* ===== File Explorer App ===== */
var FileExplorerApp = (function () {
  'use strict';

  var currentPath = '/';
  var activeSidebar = 'Home';

  function open() {
    if (WM.isOpen('files')) { WM.focus('files'); return; }
    WM.create('files', 'Files', 'files', '', { width: 720, height: 480 });
    currentPath = '/';
    activeSidebar = 'Home';
    render();
  }

  function render() {
    var el = WM.getContentEl('files');
    if (!el) return;

    var sidebarItems = [
      { label: 'Home', icon: '\ud83c\udfe0', path: '/' },
      { label: 'Projects', icon: '\ud83d\udcc1', path: '/Projects' },
      { label: 'Documents', icon: '\ud83d\udcc4', path: '/Documents' }
    ];

    var sidebarHtml = sidebarItems.map(function (s) {
      var cls = currentPath.startsWith(s.path) || (s.path === '/' && currentPath === '/') ? ' app-files__sidebar-item--active' : '';
      return '<div class="app-files__sidebar-item' + cls + '" data-nav="' + s.path + '">' + s.icon + ' ' + s.label + '</div>';
    }).join('');

    var breadcrumb = buildBreadcrumb();
    var items = FS.listDir(currentPath === '/' ? '' : currentPath);

    var listHtml;
    if (items.length === 0) {
      listHtml = '<div class="app-files__loading">Empty folder</div>';
    } else {
      listHtml = items.sort(function (a, b) {
        if (a.type !== b.type) return a.type === 'dir' ? -1 : 1;
        return a.name.localeCompare(b.name);
      }).map(function (item) {
        var icon = item.type === 'dir' ? '\ud83d\udcc1' : getFileIcon(item.name);
        return '<div class="app-files__item" data-name="' + esc(item.name) + '" data-type="' + item.type + '">' +
          '<span class="app-files__item-icon">' + icon + '</span>' +
          '<span class="app-files__item-name">' + esc(item.name) + '</span>' +
          '<span class="app-files__item-meta">' + (item.type === 'dir' ? 'Folder' : 'File') + '</span>' +
        '</div>';
      }).join('');
    }

    el.innerHTML =
      '<div class="app-files">' +
        '<div class="app-files__sidebar">' + sidebarHtml + '</div>' +
        '<div class="app-files__main">' +
          '<div class="app-files__breadcrumb">' + breadcrumb + '</div>' +
          '<div class="app-files__list" id="files-list">' + listHtml + '</div>' +
        '</div>' +
      '</div>';

    // Sidebar navigation
    el.querySelectorAll('[data-nav]').forEach(function (item) {
      item.addEventListener('click', function () {
        currentPath = item.dataset.nav;
        render();
      });
    });

    // Breadcrumb navigation
    el.querySelectorAll('.app-files__breadcrumb-link').forEach(function (link) {
      link.addEventListener('click', function () {
        currentPath = link.dataset.path;
        render();
      });
    });

    // Item click
    el.querySelectorAll('.app-files__item').forEach(function (item) {
      item.addEventListener('dblclick', function () {
        var name = item.dataset.name;
        var type = item.dataset.type;
        if (type === 'dir') {
          currentPath = (currentPath === '/' ? '/' : currentPath + '/') + name;
          // Check if this is a project folder that needs GitHub data
          var node = FS.getNode(currentPath);
          if (node && node.children === null && node.repo) {
            loadGitHubFolder(name, node.repo);
          } else {
            render();
          }
        } else {
          openFile(name);
        }
      });
    });
  }

  function loadGitHubFolder(projectName, repoName) {
    var el = document.getElementById('files-list');
    if (el) el.innerHTML = '<div class="app-files__loading">Loading from GitHub...</div>';

    var repo = repoName || FS.getRepoName(projectName);
    fetch('https://api.github.com/repos/0xmortuex/' + repo + '/contents')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (Array.isArray(data)) {
          FS.setGitHubContents(projectName, data);
        }
        render();
      })
      .catch(function () {
        if (el) el.innerHTML = '<div class="app-files__loading">Failed to load \u2014 check your network or try again.</div>';
      });
  }

  function buildBreadcrumb() {
    var parts = currentPath.split('/').filter(Boolean);
    var html = '<span class="app-files__breadcrumb-link" data-path="/">Home</span>';
    var path = '';
    parts.forEach(function (part) {
      path += '/' + part;
      html += ' <span style="color:var(--os-text-muted)">/</span> <span class="app-files__breadcrumb-link" data-path="' + path + '">' + part + '</span>';
    });
    return html;
  }

  function openFile(name) {
    var filePath = (currentPath === '/' ? '/' : currentPath + '/') + name;
    var content = FS.readFile(filePath);
    if (content !== null) {
      NotepadApp.openWithContent(name, content);
    } else {
      // Try to open from GitHub
      var node = FS.getNode(filePath);
      if (node && node.download_url) {
        fetch(node.download_url)
          .then(function (r) { return r.text(); })
          .then(function (text) {
            NotepadApp.openWithContent(name, text);
          })
          .catch(function () {
            NotepadApp.openWithContent(name, '(Failed to load file content)');
          });
      } else {
        NotepadApp.openWithContent(name, '(No content available)');
      }
    }
  }

  function getFileIcon(name) {
    if (name.endsWith('.md')) return '\ud83d\udcdd';
    if (name.endsWith('.js')) return '\ud83d\udfe1';
    if (name.endsWith('.ts')) return '\ud83d\udd35';
    if (name.endsWith('.html')) return '\ud83c\udf10';
    if (name.endsWith('.css')) return '\ud83c\udfa8';
    if (name.endsWith('.json')) return '\ud83d\udce6';
    if (name.endsWith('.py')) return '\ud83d\udc0d';
    if (name.endsWith('.txt')) return '\ud83d\udcc4';
    return '\ud83d\udcc4';
  }

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  return { open: open };
})();