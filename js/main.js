/* ============================================================
   CHETAN.DEV — interactions
   Vanilla JS. No dependencies. Works from file:// too.
   ============================================================ */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Boot preloader ---------- */
  var bootLines = [
    '> initializing pipeline...',
    '> loading kernel modules ............ <span class="ok-line">OK</span>',
    '> mounting /dev/ambition ............ <span class="ok-line">OK</span>',
    '> starting docker daemon ............ <span class="ok-line">OK</span>',
    '> deploying portfolio v2.0 .......... <span class="ok-line">OK</span>',
    '> status: <span class="ok-line">ready_</span>'
  ];
  var preloader = document.getElementById('preloader');
  var bootLinesEl = document.getElementById('bootLines');
  var bootFill = document.getElementById('bootFill');
  var bootPct = document.getElementById('bootPct');

  function runBoot() {
    if (prefersReduced) { finishBoot(); return; }
    var i = 0;
    function next() {
      if (i < bootLines.length) {
        var p = document.createElement('p');
        p.innerHTML = bootLines[i];
        bootLinesEl.appendChild(p);
        var pct = Math.round(((i + 1) / bootLines.length) * 100);
        bootFill.style.width = pct + '%';
        bootPct.textContent = pct + '%';
        i++;
        setTimeout(next, 260);
      } else {
        setTimeout(finishBoot, 420);
      }
    }
    next();
  }
  function finishBoot() {
    preloader.classList.add('done');
    document.body.classList.add('booted');
    setTimeout(function () { preloader.style.display = 'none'; }, 700);
    startTyping(); // kick off hero terminal once visible
  }

  /* ---------- 2. Hero terminal typing effect ---------- */
  var termBody = document.getElementById('termBody');
  var script = [
    { type: 'cmd', text: 'whoami' },
    { type: 'out', html: '<span class="hl">chetan_sawale</span> — devops · cloud · linux' },
    { type: 'cmd', text: 'cat focus.txt' },
    { type: 'out', html: "b.tech '26 → reports executive @ hitachi → devops &amp; cloud engineer" },
    { type: 'out', html: 'shipping: linux homelabs · docker builds · aws experiments' },
    { type: 'cmd', text: 'status --open-to-work' },
    { type: 'out', html: '<span class="ok">●</span> true — let\'s build something reliable' }
  ];
  var typingStarted = false;

  function startTyping() {
    if (typingStarted) return;
    typingStarted = true;
    if (prefersReduced) { // render instantly for reduced motion
      script.forEach(function (s) { appendLine(s, s.type === 'cmd' ? '$ ' + s.text : (s.html || s.text)); });
      return;
    }
    var i = 0;
    function step() {
      if (i >= script.length) {
        var caret = document.createElement('div');
        caret.className = 'term-line typing-caret';
        caret.innerHTML = '<span class="prompt">$</span> ';
        termBody.appendChild(caret);
        return;
      }
      var s = script[i];
      if (s.type === 'cmd') { typeCmd(s.text, function () { i++; setTimeout(step, 320); }); }
      else { appendLine(s, s.html || s.text); i++; setTimeout(step, 420); }
    }
    step();
  }
  function appendLine(s, html) {
    var div = document.createElement('div');
    div.className = 'term-line';
    div.innerHTML = html;
    termBody.appendChild(div);
  }
  function typeCmd(text, done) {
    var div = document.createElement('div');
    div.className = 'term-line typing-caret';
    div.innerHTML = '<span class="prompt">$</span> ';
    termBody.appendChild(div);
    var n = 0;
    var caretSpan = document.createElement('span');
    div.appendChild(caretSpan);
    div.classList.remove('typing-caret');
    (function tick() {
      if (n <= text.length) {
        caretSpan.textContent = text.slice(0, n);
        n++;
        setTimeout(tick, 34 + Math.random() * 46);
      } else { done(); }
    })();
  }

  /* ---------- 3. Scroll-triggered reveals ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  // stagger siblings inside grids for a cascade feel
  document.querySelectorAll('.stack-grid, .project-grid, .about-facts').forEach(function (grid) {
    Array.prototype.forEach.call(grid.querySelectorAll('.reveal'), function (el, idx) {
      el.style.transitionDelay = (idx * 90) + 'ms';
    });
  });
  if ('IntersectionObserver' in window && !prefersReduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- 4. Navbar condense + mobile menu ---------- */
  var nav = document.getElementById('nav');
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  var menuBtn = document.getElementById('menuBtn');
  var mobileMenu = document.getElementById('mobileMenu');
  menuBtn.addEventListener('click', function () {
    var open = mobileMenu.classList.toggle('open');
    mobileMenu.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ---------- 5. CI/CD pipeline lighting loop ---------- */
  var stages = Array.prototype.slice.call(document.querySelectorAll('#pipelineViz .stage'));
  var pipelineLog = document.getElementById('pipelineLog');
  var stageVerbs = ['compiling...', 'building image...', 'running tests...', 'deploying...', 'scraping metrics...'];
  var stageDone = ['compiled ✓', 'image built ✓', 'tests passed ✓', 'deployed ✓', 'monitored ✓'];
  if (stages.length && !prefersReduced) {
    var idx = 0;
    setInterval(function () {
      stages.forEach(function (st, i) {
        var status = st.querySelector('.stage-status');
        st.classList.remove('active');
        if (i < idx) { st.classList.add('done'); status.textContent = stageDone[i]; }
        else if (i === idx) { st.classList.add('active'); status.textContent = stageVerbs[i]; }
        else { st.classList.remove('done'); status.textContent = 'waiting'; }
      });
      var cur = stages[idx];
      pipelineLog.innerHTML = '<span class="ok">●</span> pipeline: <strong>' +
        cur.querySelector('.stage-name').textContent + '</strong> ' + stageVerbs[idx];
      idx = (idx + 1) % (stages.length + 1); // +1 gives a beat where all show done
      if (idx === stages.length) {
        pipelineLog.innerHTML = '<span class="ok">●</span> pipeline: <strong>all stages green</strong> — shipping it';
      }
    }, 1300);
  } else if (stages.length) {
    stages.forEach(function (st, i) {
      st.classList.add('done');
      st.querySelector('.stage-status').textContent = stageDone[i];
    });
  }

  /* ---------- 6. Ambient canvas: grid + drifting nodes ---------- */
  var canvas = document.getElementById('bg');
  var ctx = canvas.getContext('2d');
  var nodes = [];
  function sizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  sizeCanvas();
  window.addEventListener('resize', sizeCanvas);
  function initNodes() {
    nodes = [];
    var count = Math.min(70, Math.floor(window.innerWidth / 22));
    for (var i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.6
      });
    }
  }
  initNodes();
  function drawGrid() {
    ctx.strokeStyle = 'rgba(30, 42, 58, 0.35)';
    ctx.lineWidth = 1;
    var gap = 56;
    ctx.beginPath();
    for (var x = 0; x <= canvas.width; x += gap) { ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); }
    for (var y = 0; y <= canvas.height; y += gap) { ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); }
    ctx.stroke();
  }
  function drawNodes() {
    var i, j, a, b, dx, dy, d;
    for (i = 0; i < nodes.length; i++) {
      a = nodes[i];
      a.x += a.vx; a.y += a.vy;
      if (a.x < 0 || a.x > canvas.width) a.vx *= -1;
      if (a.y < 0 || a.y > canvas.height) a.vy *= -1;
      for (j = i + 1; j < nodes.length; j++) {
        b = nodes[j];
        dx = a.x - b.x; dy = a.y - b.y;
        d = Math.sqrt(dx * dx + dy * dy);
        if (d < 130) {
          ctx.strokeStyle = 'rgba(0, 255, 136,' + (0.10 * (1 - d / 130)).toFixed(3) + ')';
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      ctx.fillStyle = 'rgba(0, 212, 255, 0.5)';
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
    }
  }
  if (!prefersReduced) {
    (function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGrid();
      drawNodes();
      requestAnimationFrame(loop);
    })();
  } else {
    drawGrid();
  }

  /* ---------- 7. Custom glow cursor (desktop, fine pointer only) ---------- */
  var glow = document.getElementById('cursorGlow');
  if (window.matchMedia('(pointer: fine)').matches && !prefersReduced) {
    var gx = -500, gy = -500, tx = -500, ty = -500;
    document.addEventListener('mousemove', function (e) { tx = e.clientX; ty = e.clientY; });
    (function follow() {
      gx += (tx - gx) * 0.12;
      gy += (ty - gy) * 0.12;
      glow.style.left = gx + 'px';
      glow.style.top = gy + 'px';
      requestAnimationFrame(follow);
    })();
  }

  /* ---------- 8. Magnetic buttons ---------- */
  if (window.matchMedia('(pointer: fine)').matches && !prefersReduced) {
    document.querySelectorAll('.magnetic').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        btn.style.transform = 'translate(' + x * 0.18 + 'px,' + y * 0.28 + 'px)';
      });
      btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
    });
  }

  /* ---------- 9. Contact form → mailto ---------- */
  var form = document.getElementById('contactForm');
  var formNote = document.getElementById('formNote');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('cfName').value.trim();
    var email = document.getElementById('cfEmail').value.trim();
    var msg = document.getElementById('cfMsg').value.trim();
    if (!name || !email || !msg) {
      formNote.textContent = '! all fields required — transmission aborted';
      formNote.style.color = 'var(--amber)';
      return;
    }
    var subject = encodeURIComponent('Portfolio ping from ' + name);
    var body = encodeURIComponent(msg + '\n\n— ' + name + ' (' + email + ')');
    window.location.href = 'mailto:sawalechetan102@gmail.com?subject=' + subject + '&body=' + body;
    formNote.textContent = '● opening your mail client — transmission ready';
    formNote.style.color = 'var(--green)';
  });

  /* ---------- 10. Boot it ---------- */
  runBoot();
})();
