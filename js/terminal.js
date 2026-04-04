/* ===== Terminal Easter Egg ===== */
(function () {
  'use strict';

  var terminal = document.getElementById('terminal');
  var terminalBody = document.getElementById('terminal-body');
  var terminalOutput = document.getElementById('terminal-output');
  var terminalInput = document.getElementById('terminal-input');
  var terminalClose = document.getElementById('terminal-close');
  var terminalMinimize = document.getElementById('terminal-minimize');
  var terminalTrigger = document.getElementById('terminal-trigger');
  var terminalResize = document.getElementById('terminal-resize');

  var isOpen = false;
  var isMinimized = false;
  var history = [];
  var historyIndex = -1;
  var pageLoadTime = Date.now();

  function open() {
    if (isOpen) return;
    isOpen = true;
    terminal.classList.add('terminal--open');
    terminal.classList.remove('terminal--minimized');
    isMinimized = false;
    terminalInput.focus();
    if (terminalOutput.children.length === 0) {
      appendOutput('Welcome to 0xmortuex terminal. Type <span class="cmd-accent">help</span> for available commands.\n', 'cmd-output');
    }
  }

  function close() {
    isOpen = false;
    terminal.classList.remove('terminal--open');
    terminal.classList.remove('terminal--minimized');
    isMinimized = false;
  }

  function toggleMinimize() {
    isMinimized = !isMinimized;
    terminal.classList.toggle('terminal--minimized', isMinimized);
    if (!isMinimized) terminalInput.focus();
  }

  function appendOutput(html, className) {
    var div = document.createElement('div');
    div.className = className || '';
    div.innerHTML = html;
    terminalOutput.appendChild(div);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function processCommand(input) {
    var raw = input.trim();
    if (!raw) return;

    // Show the command
    appendOutput(
      '<span class="cmd-prompt">visitor@0xmortuex:~$</span> <span class="cmd-line">' + escapeHtml(raw) + '</span>',
      ''
    );

    var parts = raw.split(/\s+/);
    var cmd = parts[0].toLowerCase();
    var args = parts.slice(1).join(' ');

    switch (cmd) {
      case 'help':
        appendOutput(
          '<span class="cmd-accent">Available commands:</span>\n' +
          '  help       — Show this help message\n' +
          '  about      — Who is 0xmortuex?\n' +
          '  projects   — List all projects\n' +
          '  skills     — Show tech stack\n' +
          '  contact    — How to reach me\n' +
          '  whoami     — Identity check\n' +
          '  neofetch   — System info\n' +
          '  date       — Current date/time\n' +
          '  echo       — Echo text back\n' +
          '  hack       — Try your luck\n' +
          '  matrix     — Enter the matrix\n' +
          '  clear      — Clear terminal\n' +
          '  exit       — Close terminal',
          'cmd-output'
        );
        break;

      case 'about':
        appendOutput(
          '9th grader in Istanbul building tools at the intersection\n' +
          'of code, security, and law.\n\n' +
          'AI-powered dev tools | Discord plugins | Legal-tech apps\n' +
          'CLI-first | Open source | Real problems',
          'cmd-output'
        );
        break;

      case 'projects':
        appendOutput(
          '<span class="cmd-accent">Projects:</span>\n' +
          '  CodeLens      — AI security audit for code\n' +
          '                  <a href="https://0xmortuex.github.io/CodeLens/" target="_blank" class="cmd-accent">demo</a> | <a href="https://github.com/0xmortuex/CodeLens" target="_blank" class="cmd-accent">source</a>\n' +
          '  LexScope      — Legislation explorer with AI\n' +
          '                  <a href="https://0xmortuex.github.io/LexScope/" target="_blank" class="cmd-accent">demo</a> | <a href="https://github.com/0xmortuex/LexScope" target="_blank" class="cmd-accent">source</a>\n' +
          '  LoopholeMap   — Regulation loophole visualizer\n' +
          '                  <a href="https://0xmortuex.github.io/LoopholeMap/" target="_blank" class="cmd-accent">demo</a> | <a href="https://github.com/0xmortuex/LoopholeMap" target="_blank" class="cmd-accent">source</a>\n' +
          '  DebateBot     — Dual-side argument generator\n' +
          '                  <a href="https://0xmortuex.github.io/DebateBot/" target="_blank" class="cmd-accent">demo</a> | <a href="https://github.com/0xmortuex/DebateBot" target="_blank" class="cmd-accent">source</a>\n' +
          '  PassCrack     — Password strength simulator\n' +
          '                  <a href="https://github.com/0xmortuex/passcrack" target="_blank" class="cmd-accent">source</a>\n' +
          '  SteamOgames   — Steam library scraper\n' +
          '                  <a href="https://github.com/0xmortuex/SteamOgames" target="_blank" class="cmd-accent">source</a>\n' +
          '  Vencord (x5)  — Discord plugins\n' +
          '                  <a href="https://github.com/0xmortuex?tab=repositories&q=vencord" target="_blank" class="cmd-accent">source</a>',
          'cmd-output'
        );
        break;

      case 'skills':
        appendOutput(
          '<span class="cmd-accent">Languages:</span>  JavaScript, TypeScript, Python, HTML/CSS, Lua\n' +
          '<span class="cmd-accent">Tools:</span>      Git, Cloudflare Workers, VS Code, PowerShell\n' +
          '<span class="cmd-accent">APIs:</span>       OpenRouter, Claude API, GitHub API, Steam Web\n' +
          '<span class="cmd-accent">Concepts:</span>   Cybersecurity, Legislative Drafting, API Design, Web Scraping',
          'cmd-output'
        );
        break;

      case 'contact':
        appendOutput(
          '<span class="cmd-accent">GitHub:</span>   <a href="https://github.com/0xmortuex" target="_blank" class="cmd-accent">github.com/0xmortuex</a>\n' +
          '<span class="cmd-accent">Discord:</span>  0xmortuex',
          'cmd-output'
        );
        break;

      case 'whoami':
        appendOutput('0xmortuex — developer, security enthusiast, builder', 'cmd-output');
        break;

      case 'date':
        appendOutput(new Date().toString(), 'cmd-output');
        break;

      case 'echo':
        appendOutput(escapeHtml(args) || '', 'cmd-output');
        break;

      case 'clear':
        terminalOutput.innerHTML = '';
        break;

      case 'exit':
        close();
        break;

      case 'neofetch':
        runNeofetch();
        break;

      case 'hack':
        runHack();
        break;

      case 'matrix':
        runMatrix();
        break;

      case 'sudo':
        if (raw.toLowerCase().includes('rm -rf')) {
          appendOutput('Nice try. \ud83d\ude0f', 'cmd-output');
        } else {
          appendOutput('Command not found. Type \'help\' for available commands.', 'cmd-error');
        }
        break;

      default:
        appendOutput('Command not found. Type \'help\' for available commands.', 'cmd-error');
    }
  }

  function runNeofetch() {
    var uptime = formatUptime(Date.now() - pageLoadTime);
    var ascii =
      '       <span class="cmd-accent">  ___  _  __</span>\n' +
      '       <span class="cmd-accent"> / _ \\| |/ /</span>\n' +
      '       <span class="cmd-accent">| | | |   / </span>\n' +
      '       <span class="cmd-accent">| |_| | |\\ \\</span>\n' +
      '       <span class="cmd-accent"> \\___/|_| \\_\\</span>\n' +
      '       <span class="cmd-accent">  mortuex   </span>';

    var info =
      '  <span class="cmd-accent">OS:</span>        Portfolio v1.0\n' +
      '  <span class="cmd-accent">Host:</span>      GitHub Pages\n' +
      '  <span class="cmd-accent">Shell:</span>     vanilla JS\n' +
      '  <span class="cmd-accent">Projects:</span>  7\n' +
      '  <span class="cmd-accent">Languages:</span> JS, TS, Python, Lua\n' +
      '  <span class="cmd-accent">Uptime:</span>    ' + uptime;

    var asciiLines = ascii.split('\n');
    var infoLines = info.split('\n');
    var maxLines = Math.max(asciiLines.length, infoLines.length);
    var combined = '';

    for (var i = 0; i < maxLines; i++) {
      var left = asciiLines[i] || '                      ';
      var right = infoLines[i] || '';
      combined += left + right + '\n';
    }

    appendOutput(combined, 'cmd-output');
  }

  function runHack() {
    var output = terminalOutput;
    var lines = 12;
    var i = 0;

    function addLine() {
      if (i < lines) {
        var chars = '';
        for (var j = 0; j < 50; j++) {
          chars += String.fromCharCode(33 + Math.floor(Math.random() * 93));
        }
        appendOutput('<span class="cmd-accent">' + escapeHtml(chars) + '</span>', 'cmd-output');
        i++;
        setTimeout(addLine, 80);
      } else {
        appendOutput(
          '\n<span class="cmd-accent">Access granted.</span> Just kidding.\nBut I do build security tools \u2192 <a href="https://github.com/0xmortuex/passcrack" target="_blank" class="cmd-accent">PassCrack</a>',
          'cmd-output'
        );
      }
    }

    addLine();
  }

  function runMatrix() {
    var canvas = document.createElement('canvas');
    canvas.className = 'matrix-canvas';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    var ctx = canvas.getContext('2d');
    var fontSize = 14;
    var columns = Math.floor(canvas.width / fontSize);
    var drops = [];
    for (var i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -20);
    }

    var chars = '0123456789ABCDEFabcdef@#$%^&*';

    function draw() {
      ctx.fillStyle = 'rgba(5, 5, 5, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00ff88';
      ctx.font = fontSize + 'px JetBrains Mono, monospace';

      for (var i = 0; i < drops.length; i++) {
        var char = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    var interval = setInterval(draw, 50);
    setTimeout(function () {
      clearInterval(interval);
      canvas.remove();
    }, 5000);

    appendOutput('Entering the matrix... (5 seconds)', 'cmd-accent');
  }

  function formatUptime(ms) {
    var s = Math.floor(ms / 1000);
    var m = Math.floor(s / 60);
    var h = Math.floor(m / 60);
    s = s % 60;
    m = m % 60;
    if (h > 0) return h + 'h ' + m + 'm ' + s + 's';
    if (m > 0) return m + 'm ' + s + 's';
    return s + 's';
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /* --- Event Listeners --- */

  // Keyboard shortcut: backtick to toggle
  document.addEventListener('keydown', function (e) {
    if (e.key === '`' && !e.ctrlKey && !e.altKey && !e.metaKey) {
      var tag = document.activeElement.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      e.preventDefault();
      if (isOpen) close();
      else open();
    }
    // Escape to close
    if (e.key === 'Escape' && isOpen) {
      close();
    }
  });

  // Footer trigger
  if (terminalTrigger) {
    terminalTrigger.addEventListener('click', function () {
      open();
    });
  }

  // Close button
  terminalClose.addEventListener('click', close);

  // Minimize button
  terminalMinimize.addEventListener('click', toggleMinimize);

  // Input handling
  terminalInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      var val = terminalInput.value;
      terminalInput.value = '';
      if (val.trim()) {
        history.push(val);
        historyIndex = history.length;
      }
      processCommand(val);
    }

    // History navigation
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        terminalInput.value = history[historyIndex];
      }
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        historyIndex++;
        terminalInput.value = history[historyIndex];
      } else {
        historyIndex = history.length;
        terminalInput.value = '';
      }
    }
  });

  // Click on terminal body focuses input
  terminalBody.addEventListener('click', function (e) {
    if (e.target.tagName !== 'A') {
      terminalInput.focus();
    }
  });

  // Resize handle
  var isResizing = false;
  var startY, startHeight;

  terminalResize.addEventListener('mousedown', function (e) {
    isResizing = true;
    startY = e.clientY;
    startHeight = terminal.offsetHeight;
    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', function (e) {
    if (!isResizing) return;
    var diff = startY - e.clientY;
    var newHeight = Math.min(Math.max(startHeight + diff, 200), window.innerHeight * 0.8);
    terminal.style.height = newHeight + 'px';
  });

  document.addEventListener('mouseup', function () {
    if (isResizing) {
      isResizing = false;
      document.body.style.userSelect = '';
    }
  });

  // Close on click outside
  document.addEventListener('click', function (e) {
    if (isOpen && !terminal.contains(e.target) && e.target !== terminalTrigger) {
      close();
    }
  });
})();