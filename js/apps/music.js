/* ===== Music App (Web Audio API procedural) ===== */
var MusicApp = (function () {
  'use strict';

  var tracks = [
    { title: 'Late Night Coding', artist: 'mortuexOS', bpm: 80, key: 'Am' },
    { title: 'Cyber Dreams', artist: 'mortuexOS', bpm: 70, key: 'Dm' },
    { title: 'Digital Rain', artist: 'mortuexOS', bpm: 90, key: 'Em' }
  ];

  var currentTrack = 0;
  var playing = false;
  var audioCtx = null;
  var gainNode = null;
  var oscillators = [];
  var loopInterval = null;

  function open() {
    if (WM.isOpen('music')) { WM.focus('music'); return; }
    WM.create('music', 'Music', 'music', '', { width: 360, height: 460 });
    render();
  }

  function render() {
    var el = WM.getContentEl('music');
    if (!el) return;

    var track = tracks[currentTrack];
    var tracksHtml = tracks.map(function (t, i) {
      return '<div class="app-music__track' + (i === currentTrack ? ' app-music__track--active' : '') + '" data-idx="' + i + '">' +
        '\ud83c\udfb5 ' + t.title +
      '</div>';
    }).join('');

    el.innerHTML =
      '<div class="app-music">' +
        '<div class="app-music__art' + (playing ? ' app-music__art--playing' : '') + '">\ud83c\udfb6</div>' +
        '<div class="app-music__title">' + track.title + '</div>' +
        '<div class="app-music__artist">' + track.artist + '</div>' +
        '<div class="app-music__controls">' +
          '<button class="app-music__btn" id="mu-prev">\u23ee</button>' +
          '<button class="app-music__btn app-music__btn--play" id="mu-play">' + (playing ? '\u23f8' : '\u25b6') + '</button>' +
          '<button class="app-music__btn" id="mu-next">\u23ed</button>' +
        '</div>' +
        '<div class="app-music__volume">' +
          '<span>\ud83d\udd0a</span>' +
          '<input type="range" class="app-music__slider" id="mu-vol" min="0" max="100" value="40">' +
        '</div>' +
        '<div class="app-music__tracks">' + tracksHtml + '</div>' +
      '</div>';

    document.getElementById('mu-play').addEventListener('click', togglePlay);
    document.getElementById('mu-prev').addEventListener('click', function () {
      currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
      if (playing) { stop(); play(); }
      render();
    });
    document.getElementById('mu-next').addEventListener('click', function () {
      currentTrack = (currentTrack + 1) % tracks.length;
      if (playing) { stop(); play(); }
      render();
    });
    document.getElementById('mu-vol').addEventListener('input', function () {
      if (gainNode) gainNode.gain.value = this.value / 100 * 0.15;
    });

    el.querySelectorAll('[data-idx]').forEach(function (t) {
      t.addEventListener('click', function () {
        currentTrack = parseInt(t.dataset.idx);
        if (playing) { stop(); play(); }
        render();
      });
    });
  }

  function togglePlay() {
    if (playing) stop(); else play();
    render();
  }

  function play() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.06;
    gainNode.connect(audioCtx.destination);
    playing = true;

    var track = tracks[currentTrack];
    var notes;
    if (track.key === 'Am') notes = [220, 261.63, 293.66, 329.63, 261.63, 293.66];
    else if (track.key === 'Dm') notes = [293.66, 349.23, 440, 523.25, 349.23, 440];
    else notes = [329.63, 392, 493.88, 329.63, 392, 493.88];

    var beat = 60 / track.bpm;
    var noteIdx = 0;

    function playNote() {
      if (!playing) return;
      var osc = audioCtx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = notes[noteIdx % notes.length];
      var noteGain = audioCtx.createGain();
      noteGain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      noteGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + beat * 0.9);
      osc.connect(noteGain);
      noteGain.connect(gainNode);
      osc.start();
      osc.stop(audioCtx.currentTime + beat);
      oscillators.push(osc);
      noteIdx++;
    }

    playNote();
    loopInterval = setInterval(playNote, beat * 1000);
  }

  function stop() {
    playing = false;
    if (loopInterval) { clearInterval(loopInterval); loopInterval = null; }
    oscillators.forEach(function (o) { try { o.stop(); } catch (e) {} });
    oscillators = [];
  }

  return { open: open };
})();