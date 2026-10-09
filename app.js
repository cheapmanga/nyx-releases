(function(){
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS = 'http://www.w3.org/2000/svg';

  // Night sky: a fixed, seeded scatter of four-point stars, so the sky looks the same on every visit.
  var sky = document.querySelector('.stars');
  if (sky) {
    var seed = 7;
    function rnd(){ seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
    var w = sky.clientWidth || 1200, h = sky.clientHeight || 800;
    var count = Math.round(Math.min(90, w * h / 9000));
    // Keep the text readable: no star lands on the headline, the copy or the buttons.
    var box = sky.getBoundingClientRect();
    var keepOut = Array.prototype.map.call(document.querySelectorAll('.hero > *, .nav-in > *'), function(el){
      var r = el.getBoundingClientRect();
      return { l: r.left - box.left - 14, t: r.top - box.top - 14, r: r.right - box.left + 14, b: r.bottom - box.top + 14 };
    });
    function clear(x, y){ return !keepOut.some(function(k){ return x > k.l && x < k.r && y > k.t && y < k.b; }); }
    for (var i = 0; i < count; i++) {
      var x = rnd() * w, y = rnd() * h * 0.92;
      var big = rnd() > 0.93, r = big ? 5 + rnd() * 5 : 1 + rnd() * 2.2;
      if (!clear(x, y)) continue;
      var u = document.createElementNS(NS, 'use');
      u.setAttribute('href', '#spark');
      u.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') scale(' + r.toFixed(2) + ')');
      if (big && rnd() > 0.4) u.setAttribute('class', 'bright');
      u.style.setProperty('--o', (big ? 0.95 : 0.35 + rnd() * 0.5).toFixed(2));
      u.style.setProperty('--d', (0.15 + rnd() * 1.6).toFixed(2) + 's');
      sky.appendChild(u);
    }
    // The one large star, echoing the logo, low on the right where the headline leaves room.
    var main = document.createElementNS(NS, 'use');
    main.setAttribute('href', '#spark');
    main.setAttribute('class', 'bright');
    // Beside the headline if there is room, otherwise in the open sky below the buttons' row.
    var h1 = document.querySelector('.hero h1').getBoundingClientRect(), right = h1.right - box.left;
    var room = w - right, ms = w > 760 ? 56 : 28, mx, my;
    if (room > ms * 2 + 120) { mx = right + room / 2; my = h1.top - box.top + h1.height * 0.45; }
    else if (w > 760) { mx = w - ms - 90; my = h * 0.74; }
    else { mx = w - ms - 22; my = 92; }
    main.setAttribute('transform', 'translate(' + mx + ' ' + my + ') scale(' + ms + ')');
    main.style.setProperty('--d', '1.8s');
    sky.appendChild(main);
  }

  // Screenshot tabs (ARIA tabs pattern: arrows move between tabs, the panel swaps its image).
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  var panel = document.getElementById('p-shot');
  function select(t, focus){
    tabs.forEach(function(o){ var on = o === t; o.setAttribute('aria-selected', on); o.tabIndex = on ? 0 : -1; });
    var img = panel.querySelector('img');
    img.src = t.dataset.src; img.alt = t.dataset.alt;
    panel.setAttribute('aria-labelledby', t.id);
    if (focus) t.focus();
  }
  tabs.forEach(function(t, i){
    t.addEventListener('click', function(){ select(t); });
    t.addEventListener('keydown', function(e){
      var k = e.key, n = tabs.length, j = null;
      if (k === 'ArrowDown' || k === 'ArrowRight') j = (i + 1) % n;
      if (k === 'ArrowUp' || k === 'ArrowLeft') j = (i - 1 + n) % n;
      if (k === 'Home') j = 0;
      if (k === 'End') j = n - 1;
      if (j !== null) { e.preventDefault(); select(tabs[j], true); }
    });
  });
  // Warm the cache so switching tabs doesn't flash.
  tabs.forEach(function(t){ var im = new Image(); im.src = t.dataset.src; });

  // Smooth scrolling (skipped if the library didn't load or motion is reduced).
  if (!reduce && window.Lenis) {
    var lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    (function raf(t){ lenis.raf(t); requestAnimationFrame(raf); })(0);
    document.querySelectorAll('a[href^="#"]').forEach(function(a){
      a.addEventListener('click', function(e){
        var id = a.getAttribute('href');
        if (id.length > 1) { var t = document.querySelector(id); if (t) { e.preventDefault(); lenis.scrollTo(t, { offset: -20 }); } }
      });
    });
  }
})();
