/* ===== Virtual Filesystem ===== */
var FS = (function () {
  'use strict';

  var tree = {
    'Home': {
      type: 'dir',
      children: {
        'Projects': { type: 'dir', children: {} },
        'Documents': {
          type: 'dir',
          children: {
            'resume.txt': {
              type: 'file',
              content: 'Fadi — 0xmortuex\n9th Grader | Istanbul\n\nSkills: JavaScript, TypeScript, Python, HTML/CSS\nInterests: Cybersecurity, OSINT, Legal Tech, Game Modding\n\nGitHub: github.com/0xmortuex\nEmail: fraad002@gmail.com'
            },
            'skills.txt': {
              type: 'file',
              content: 'Languages: JavaScript, TypeScript, Python, HTML/CSS, Lua\nTools: Git, Cloudflare Workers, D3.js, VS Code, PowerShell\nAPIs: OpenRouter, Claude API, GitHub API, Steam Web, Chrome Extensions\nConcepts: Cybersecurity, OSINT, Legislative Drafting, API Design, Web Scraping'
            }
          }
        },
        'README.md': {
          type: 'file',
          content: '# 0xmortuex — Portfolio\n\nWelcome to mortuexOS.\n\nThis is my interactive developer portfolio built as a desktop operating system.\nBrowse my projects, open a terminal, explore files — all in the browser.\n\nBuilt with vanilla HTML, CSS, and JavaScript. Zero dependencies.\n\nLive: https://0xmortuex.github.io\nSource: https://github.com/0xmortuex/0xmortuex.github.io'
        }
      }
    }
  };

  var projects = [
    { name: 'LoopholeMap', repo: 'LoopholeMap', desc: 'Find vulnerabilities in any regulation, visualized as an interactive node graph.', emoji: '\ud83d\udd0d', demo: 'https://0xmortuex.github.io/LoopholeMap/', tags: ['D3.js', 'Claude', 'Cloudflare Workers'], category: 'AI-Powered' },
    { name: 'CodeLens', repo: 'CodeLens', desc: 'Paste code, get an instant AI security audit with visual report cards.', emoji: '\ud83d\udd12', demo: 'https://0xmortuex.github.io/CodeLens/', tags: ['JavaScript', 'Claude', 'Cloudflare Workers'], category: 'AI-Powered' },
    { name: 'LexScope', repo: 'LexScope', desc: 'Interactive legislation explorer with AI-parsed sections and improvement suggestions.', emoji: '\ud83d\udcdc', demo: 'https://0xmortuex.github.io/LexScope/', tags: ['JavaScript', 'Claude', 'Cloudflare Workers'], category: 'AI-Powered' },
    { name: 'DebateBot', repo: 'DebateBot', desc: 'Enter any topic, get the strongest arguments for both sides with evidence and fallacy detection.', emoji: '\u2696\ufe0f', demo: 'https://0xmortuex.github.io/DebateBot/', tags: ['JavaScript', 'Claude', 'Cloudflare Workers'], category: 'AI-Powered' },
    { name: 'TermsTrap', repo: 'TermsTrap', desc: 'Paste any Terms of Service, AI highlights hidden clauses, data selling, and auto-renewals.', emoji: '\ud83d\udee1\ufe0f', demo: 'https://0xmortuex.github.io/TermsTrap/', tags: ['JavaScript', 'Claude', 'Cloudflare Workers'], category: 'AI-Powered' },
    { name: 'MiniOS', repo: 'MiniOS', desc: 'A full desktop OS in the browser — windows, file system, terminal, paint, app store.', emoji: '\ud83d\udda5\ufe0f', demo: 'https://0xmortuex.github.io/MiniOS/', tags: ['Vanilla JS', 'CSS'], category: 'Tools' },
    { name: 'ChatRoom', repo: 'ChatRoom', desc: 'Real-time anonymous chat with rooms, message history, sound effects, and markdown.', emoji: '\ud83d\udcac', demo: 'https://0xmortuex.github.io/ChatRoom/', tags: ['JavaScript', 'Cloudflare Workers', 'KV'], category: 'Tools' },
    { name: 'TypeRush', repo: 'TypeRush', desc: 'Typing speed game with code mode, multiple languages, WPM tracking, and leaderboard.', emoji: '\u2328\ufe0f', demo: 'https://0xmortuex.github.io/TypeRush/', tags: ['Vanilla JS', 'CSS'], category: 'Games' },
    { name: 'GitPulse', repo: 'GitPulse', desc: 'Enter any GitHub username, get a visual profile card with language breakdown and heatmap.', emoji: '\ud83d\udcca', demo: 'https://0xmortuex.github.io/GitPulse/', tags: ['JavaScript', 'Chart.js', 'GitHub API'], category: 'Tools' },
    { name: 'PassCrack', repo: 'passcrack', desc: 'Simulates real attack techniques to estimate password crack time with pattern detection.', emoji: '\ud83d\udd11', demo: '', tags: ['HTML', 'CSS', 'JavaScript'], category: 'Cybersec' },
    { name: 'BillForge', repo: 'BillForge', desc: 'CUSA bill drafting tool with templates and legislative formatting.', emoji: '\ud83c\udfe6', demo: '', tags: ['JavaScript', 'Templates'], category: 'Tools' },
    { name: 'SteamOgames', repo: 'SteamOgames', desc: 'Scrapes and displays a 122-game Steam library dashboard without an API key.', emoji: '\ud83c\udfae', demo: '', tags: ['Python', 'Flask', 'BeautifulSoup'], category: 'Tools' },
    { name: 'Vencord Plugins', repo: 'vencord', desc: '5 standalone Discord plugins: InactivityTracker, QuickNotes, ServerClock, RoleMembers, DMOrganizer.', emoji: '\ud83d\udd0c', demo: '', tags: ['TypeScript', 'Vencord API'], category: 'Tools' }
  ];

  // Populate project folders
  projects.forEach(function (p) {
    tree['Home'].children['Projects'].children[p.name] = {
      type: 'dir',
      repo: p.repo,
      children: null // lazy-loaded from GitHub
    };
  });

  function getNode(path) {
    if (!path || path === '/') return tree['Home'];
    var parts = path.split('/').filter(Boolean);
    var node = tree['Home'];
    for (var i = 0; i < parts.length; i++) {
      if (!node.children || !node.children[parts[i]]) return null;
      node = node.children[parts[i]];
    }
    return node;
  }

  function listDir(path) {
    var node = getNode(path);
    if (!node || node.type !== 'dir' || !node.children) return [];
    return Object.keys(node.children).map(function (name) {
      return { name: name, type: node.children[name].type };
    });
  }

  function readFile(path) {
    var node = getNode(path);
    if (!node || node.type !== 'file') return null;
    return node.content || '';
  }

  function getProjects() { return projects; }

  function getRepoName(dirName) {
    var p = projects.find(function (pr) { return pr.name === dirName; });
    return p ? p.repo : dirName;
  }

  function setGitHubContents(projectName, contents) {
    var projNode = tree['Home'].children['Projects'].children[projectName];
    if (!projNode) return;
    projNode.children = {};
    contents.forEach(function (item) {
      projNode.children[item.name] = {
        type: item.type === 'dir' ? 'dir' : 'file',
        size: item.size,
        url: item.html_url,
        download_url: item.download_url,
        children: item.type === 'dir' ? null : undefined
      };
    });
  }

  return {
    getNode: getNode,
    listDir: listDir,
    readFile: readFile,
    getProjects: getProjects,
    getRepoName: getRepoName,
    setGitHubContents: setGitHubContents
  };
})();