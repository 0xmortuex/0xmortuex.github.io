/* ===== Contact App ===== */
var ContactApp = (function () {
  'use strict';

  function open() {
    if (WM.isOpen('contact')) { WM.focus('contact'); return; }
    WM.create('contact', 'Contact', 'contact', '', { width: 460, height: 500 });
    var el = WM.getContentEl('contact');

    el.innerHTML =
      '<div class="app-contact">' +
        '<h2 class="app-contact__heading">Get in Touch</h2>' +
        '<div class="app-contact__cards">' +
          '<a href="mailto:fraad002@gmail.com" class="app-contact__card">' +
            '<span class="app-contact__card-icon">\ud83d\udce7</span>' +
            '<span>fraad002@gmail.com</span>' +
          '</a>' +
          '<a href="https://github.com/0xmortuex" target="_blank" rel="noopener" class="app-contact__card">' +
            '<span class="app-contact__card-icon">\ud83d\udc19</span>' +
            '<span>github.com/0xmortuex</span>' +
          '</a>' +
          '<a href="https://discord.com/users/0xmortuex" target="_blank" rel="noopener" class="app-contact__card">' +
            '<span class="app-contact__card-icon">\ud83d\udcac</span>' +
            '<span>0xmortuex</span>' +
          '</a>' +
        '</div>' +
        '<div class="app-contact__form-title">Or leave a message</div>' +
        '<input class="app-contact__field" id="ct-name" placeholder="Name" autocomplete="off">' +
        '<input class="app-contact__field" id="ct-email" placeholder="Email" type="email" autocomplete="off">' +
        '<textarea class="app-contact__field" id="ct-msg" placeholder="Message"></textarea>' +
        '<button class="app-contact__send" id="ct-send">Send</button>' +
      '</div>';

    document.getElementById('ct-send').addEventListener('click', function () {
      var name = document.getElementById('ct-name').value.trim();
      var email = document.getElementById('ct-email').value.trim();
      var msg = document.getElementById('ct-msg').value.trim();
      if (!msg) { OS.toast('Please write a message'); return; }
      var subject = encodeURIComponent('Portfolio Contact from ' + (name || 'Visitor'));
      var body = encodeURIComponent('From: ' + (name || 'Anonymous') + '\nEmail: ' + (email || 'N/A') + '\n\n' + msg);
      window.location.href = 'mailto:fraad002@gmail.com?subject=' + subject + '&body=' + body;
      OS.toast('Opening email client...');
    });
  }

  return { open: open };
})();