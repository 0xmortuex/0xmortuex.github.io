/* ===== Terminal App ===== */
var TerminalApp = (function () {
  'use strict';

  var outputEl, inputEl;
  var history = [];
  var histIdx = -1;
  var cwd = '/';
  var pageLoadTime = Date.now();

  function open() {
    if (WM.isOpen('terminal')) { WM.focus('terminal'); return; }
    WM.create('terminal', 'Terminal \u2014 mortuexOS', 'terminal', '', { width: 680, height: 440 });
    var el = WM.getContentEl('terminal');
    el.innerHTML =
      '<div class="app-terminal">' +
        '<div class="app-terminal__output" id="term-output"></div>' +
        '<div class="app-terminal__input-row">' +
          '<span class="app-terminal__prompt-text" id="term-prompt">visitor@mortuexOS:~$ </span>' +
          '<input class="app-terminal__input" id="term-input" autocomplete="off" spellcheck="false">' +
        '</div>' +
      '</div>';

    outputEl = document.getElementById('term-output');
    inputEl = document.getElementById('term-input');

    print('<span class="t-accent">mortuexOS Terminal v1.0</span>\nType <span class="t-accent">help</span> for available commands.\n');

    inputEl.addEventListener('keydown', onKeyDown);
    el.addEventListener('click', function (e) {
      if (e.target.tagName !== 'A') inputEl.focus();
    });
    inputEl.focus();
  }

  function promptStr() {
    return cwd === '/' ? 'visitor@mortuexOS:~$ ' : 'visitor@mortuexOS:~' + cwd + '$ ';
  }

  function updatePrompt() {
    var p = document.getElementById('term-prompt');
    if (p) p.textContent = promptStr();
  }

  function onKeyDown(e) {
    if (e.key === 'Enter') {
      var val = inputEl.value;
      inputEl.value = '';
      if (val.trim()) { history.push(val); histIdx = history.length; }
      print('<span class="t-prompt">' + esc(promptStr()) + '</span><span class="t-cmd">' + esc(val) + '</span>');
      exec(val.trim());
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (histIdx > 0) { histIdx--; inputEl.value = history[histIdx]; }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx < history.length - 1) { histIdx++; inputEl.value = history[histIdx]; }
      else { histIdx = history.length; inputEl.value = ''; }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      tabComplete();
    }
  }

  var cmds = ['help','about','projects','open','skills','contact','github','clear','ls','cd','cat','whoami','hostname','date','echo','uname','neofetch','sudo','rm','exit','hack','matrix','konami'];

  function tabComplete() {
    var val = inputEl.value;
    if (!val) return;
    var matches = cmds.filter(function (c) { return c.startsWith(val); });
    if (matches.length === 1) inputEl.value = matches[0] + ' ';
    else if (matches.length > 1) print(matches.join('  '));
  }

  function exec(input) {
    if (!input) return;
    var parts = input.split(/\s+/);
    var cmd = parts[0].toLowerCase();
    var args = parts.slice(1).join(' ');

    switch (cmd) {
      case 'help':
        print('<span class="t-accent">Available commands:</span>\n' +
          '  help       \u2014 Show this help\n  about      \u2014 Bio\n  projects   \u2014 List projects\n' +
          '  open &lt;name&gt;\u2014 Open project in browser\n  skills     \u2014 Tech stack\n' +
          '  contact    \u2014 Contact info\n  github     \u2014 Open GitHub\n  clear      \u2014 Clear terminal\n' +
          '  ls         \u2014 List files\n  cd &lt;dir&gt;   \u2014 Change directory\n  cat &lt;file&gt; \u2014 Read file\n' +
          '  whoami     \u2014 Identity\n  hostname   \u2014 Host\n  date       \u2014 Date/time\n' +
          '  echo &lt;text&gt;\u2014 Echo text\n  uname -a   \u2014 System info\n  neofetch   \u2014 System card\n' +
          '  hack       \u2014 Try hacking\n  matrix     \u2014 Matrix rain\n  exit       \u2014 Close terminal');
        break;
      case 'about':
        print('Fadi \u2014 0xmortuex\n9th grader from Istanbul. I build AI-powered dev tools,\nlegal-tech apps, real-time chat, browser games,\nand a full desktop OS in vanilla JavaScript.');
        break;
      case 'projects':
        var projs = FS.getProjects();
        var list = projs.map(function (p, i) { return '  ' + (i + 1) + '. ' + p.emoji + ' ' + p.name + ' \u2014 ' + p.desc.slice(0, 60); }).join('\n');
        print('<span class="t-accent">Projects (' + projs.length + '):</span>\n' + list);
        break;
      case 'open':
        var name = args.toLowerCase();
        var proj = FS.getProjects().find(function (p) { return p.name.toLowerCase() === name || p.repo.toLowerCase() === name; });
        if (proj && proj.demo) { BrowserApp.open(proj.demo); print('Opening ' + proj.name + '...'); }
        else if (proj) { print('<span class="t-err">No live demo for ' + proj.name + '</span>'); }
        else { print('<span class="t-err">Project not found. Try: open codelens</span>'); }
        break;
      case 'skills':
        print('<span class="t-accent">Languages:</span>  JavaScript, TypeScript, Python, HTML/CSS, Lua\n' +
              '<span class="t-accent">Tools:</span>      Git, Cloudflare Workers, D3.js, VS Code\n' +
              '<span class="t-accent">APIs:</span>       OpenRouter, Claude API, GitHub API, Chrome Extensions\n' +
              '<span class="t-accent">Concepts:</span>   Cybersecurity, OSINT, Legislative Drafting, Web Scraping');
        break;
      case 'contact':
        print('<span class="t-accent">GitHub:</span>   <a href="https://github.com/0xmortuex" target="_blank">github.com/0xmortuex</a>\n' +
              '<span class="t-accent">Email:</span>    <a href="mailto:fraad002@gmail.com">fraad002@gmail.com</a>\n' +
              '<span class="t-accent">Discord:</span>  0xmortuex');
        break;
      case 'github': window.open('https://github.com/0xmortuex', '_blank'); print('Opening GitHub...'); break;
      case 'clear': outputEl.innerHTML = ''; break;
      case 'ls':
        var items = FS.listDir(cwd);
        if (!items.length) { print('(empty)'); break; }
        var out = items.map(function (i) {
          return i.type === 'dir' ? '<span class="t-accent">' + i.name + '/</span>' : i.name;
        }).join('  ');
        print(out);
        break;
      case 'cd':
        if (!args || args === '~' || args === '/') { cwd = '/'; }
        else if (args === '..') { var p2 = cwd.split('/').filter(Boolean); p2.pop(); cwd = '/' + p2.join('/'); if (cwd !== '/') cwd += '/'; else cwd = '/'; }
        else {
          var target = cwd === '/' ? args : cwd + args;
          if (!target.endsWith('/')) target += '/';
          if (!target.startsWith('/')) target = '/' + target;
          var node = FS.getNode(target.replace(/\/$/, ''));
          if (node && node.type === 'dir') { cwd = target; }
          else { print('<span class="t-err">No such directory: ' + esc(args) + '</span>'); }
        }
        updatePrompt();
        break;
      case 'cat':
        if (!args) { print('<span class="t-err">Usage: cat &lt;filename&gt;</span>'); break; }
        var fpath = cwd === '/' ? args : cwd + args;
        if (!fpath.startsWith('/')) fpath = '/' + fpath;
        var content = FS.readFile(fpath.replace(/\/$/, ''));
        if (content !== null) print(esc(content));
        else print('<span class="t-err">No such file: ' + esc(args) + '</span>');
        break;
      case 'whoami': print('visitor'); break;
      case 'hostname': print('mortuexOS'); break;
      case 'date': print(new Date().toString()); break;
      case 'echo': print(esc(args)); break;
      case 'uname': print('mortuexOS 1.0.0 x86_64 JavaScript/Browser'); break;
      case 'neofetch': runNeofetch(); break;
      case 'exit': WM.close('terminal'); break;
      case 'hack': runHack(); break;
      case 'matrix': runMatrix(); break;
      case 'konami': print('<span class="t-accent">\u2191\u2191\u2193\u2193\u2190\u2192\u2190\u2192BA \u2014 You found it! \ud83c\udfae</span>'); break;
      case 'sudo':
        print('Nice try. \ud83d\ude0f');
        break;
      case 'rm':
        if (args.includes('-rf')) print('System destroyed... just kidding. \ud83d\udc80');
        else print('<span class="t-err">rm: permission denied</span>');
        break;
      default:
        print('<span class="t-err">command not found: ' + esc(cmd) + '. Type \'help\' for available commands.</span>');
    }
  }

  function runNeofetch() {
    var up = formatUptime(Date.now() - pageLoadTime);
    var cores = navigator.hardwareConcurrency || '?';
    var mem = navigator.deviceMemory || '?';
    var res = window.innerWidth + 'x' + window.innerHeight;
    print(
      '<span class="t-accent">     ___  __  __  ___  </span>\n' +
      '<span class="t-accent">    / _ \\|  \\/  |/ _ \\ </span>    OS: mortuexOS 1.0.0\n' +
      '<span class="t-accent">   | | | | |\\/| | | | |</span>    Host: 0xmortuex\n' +
      '<span class="t-accent">   | |_| | |  | | |_| |</span>    Kernel: JavaScript ES2024\n' +
      '<span class="t-accent">    \\___/|_|  |_|\\___/ </span>    Shell: mortuexTerm 1.0\n' +
      '                           Resolution: ' + res + '\n' +
      '    Terminal: mortuexOS Terminal\n' +
      '    CPU: ' + cores + ' cores\n' +
      '    Memory: ' + mem + 'GB\n' +
      '    Uptime: ' + up
    );
  }

  function runHack() {
    var i = 0;
    function step() {
      if (i < 10) {
        var chars = '';
        for (var j = 0; j < 50; j++) chars += String.fromCharCode(33 + Math.floor(Math.random() * 93));
        print('<span class="t-accent">' + esc(chars) + '</span>');
        i++;
        setTimeout(step, 70);
      } else {
        print('\n<span class="t-accent">Access granted.</span> Just kidding.\nBut I do build security tools \u2192 <a href="https://github.com/0xmortuex/passcrack" target="_blank">PassCrack</a>');
      }
    }
    step();
  }

  function runMatrix() {
    print('<span class="t-accent">Entering the matrix... (5 seconds)</span>');
    var canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;inset:0;z-index:99999;pointer-events:none;';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    var cols = Math.floor(canvas.width / 14);
    var drops = [];
    for (var i = 0; i < cols; i++) drops[i] = Math.floor(Math.random() * -20);
    var chars = '0123456789ABCDEFabcdef@#$%^&*';
    var iv = setInterval(function () {
      ctx.fillStyle = 'rgba(5,5,5,0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#22c55e';
      ctx.font = '14px JetBrains Mono, monospace';
      for (var j = 0; j < drops.length; j++) {
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], j * 14, drops[j] * 14);
        if (drops[j] * 14 > canvas.height && Math.random() > 0.975) drops[j] = 0;
        drops[j]++;
      }
    }, 50);
    setTimeout(function () { clearInterval(iv); canvas.remove(); }, 5000);
  }

  function formatUptime(ms) {
    var s = Math.floor(ms / 1000);
    var m = Math.floor(s / 60); s %= 60;
    var h = Math.floor(m / 60); m %= 60;
    return (h > 0 ? h + 'h ' : '') + m + 'm ' + s + 's';
  }

  function print(html) {
    var div = document.createElement('div');
    div.innerHTML = html;
    outputEl.appendChild(div);
    outputEl.scrollTop = outputEl.scrollHeight;
  }

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  return { open: open };
})();