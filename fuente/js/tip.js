  /* ---------- hover definitions ---------- */
  const tip = document.getElementById('tip');
  let hotEl = null;
  function keyOf(el) {
    const c = (el.getAttribute('class') || '').split(/\s+/).find(x => x.startsWith('def-'));
    return c ? c.slice(4) : null;
  }
  function showTip(el) {
    const k = keyOf(el), sl = el.closest('.slide'), ex = sl ? sl.dataset.ex : '';
    const def = (ex && document.querySelector('#defs [data-k="' + k + '"][data-ex="' + ex + '"]')) ||
                document.querySelector('#defs [data-k="' + k + '"]:not([data-ex])');
    if (!def) return;
    if (hotEl) hotEl.classList.remove('hot');
    hotEl = el; el.classList.add('hot');
    tip.innerHTML = '<span class="term">' + (def._titleHtml || def.dataset.t) + '</span>' + def.innerHTML;
    tip.style.left = '0px'; tip.style.top = '0px';
    tip.classList.add('show');
    const r = el.getBoundingClientRect(), tw = tip.offsetWidth, th = tip.offsetHeight;
    let x = Math.max(12, Math.min(r.left + r.width / 2 - tw / 2, window.innerWidth - tw - 12));
    let y = r.top - th - 12;
    if (y < 8) y = r.bottom + 12;
    tip.style.left = x + 'px'; tip.style.top = y + 'px';
  }
  function hideTip() {
    tip.classList.remove('show');
    if (hotEl) { hotEl.classList.remove('hot'); hotEl = null; }
  }
  function setupTips() {
    const titles = [];
    document.querySelectorAll('#defs [data-k]').forEach(d => {
      const t = document.createElement('span'); t.textContent = d.dataset.t;
      d.appendChild(t); d._title = t; titles.push(t);
    });
    MathJax.typesetPromise(titles).then(() => {
      document.querySelectorAll('#defs [data-k]').forEach(d => { d._titleHtml = d._title.innerHTML; d._title.remove(); });
    });
    document.addEventListener('pointerover', e => {
      if (e.pointerType === 'touch') return;
      const el = e.target.closest && e.target.closest('.slide.is-on g[class*="def-"]');
      if (el && el !== hotEl) showTip(el);
    });
    document.addEventListener('pointerout', e => {
      if (e.pointerType === 'touch') return;
      const el = e.target.closest && e.target.closest('g[class*="def-"]');
      if (el && !(e.relatedTarget && el.contains(e.relatedTarget))) hideTip();
    });
    document.addEventListener('click', e => {
      const el = e.target.closest && e.target.closest('.slide.is-on g[class*="def-"]');
      if (el) { (el === hotEl && tip.classList.contains('show')) ? hideTip() : showTip(el); }
      else if (!e.target.closest('.foot')) hideTip();
    });
  }