  window.MathJax = {
    tex: { inlineMath: [['\\(', '\\)']], displayMath: [['\\[', '\\]']], macros: { D: ['\\class{def-#1}{#2}', 2] } },
    svg: { fontCache: 'global' },
    startup: { pageReady: () => MathJax.startup.defaultPageReady().then(init) }
  };

  function init() {
    const slides = [...document.querySelectorAll('.slide')];
    const counter = document.getElementById('counter');
    const head = document.getElementById('runhead');
    const chapter = head.textContent;
    const builds = i => [...slides[i].querySelectorAll('[data-b]')];
    const exSlides = ex => slides.filter(el => el.dataset.ex === ex);
    let s = 0, b = 0;

    function render() {
      hideTip();
      slides.forEach((el, i) => el.classList.toggle('is-on', i === s));
      const bs = builds(s);
      bs.forEach((e, k) => e.classList.toggle('is-on', k < b));
      const slide = slides[s];
      slide.querySelectorAll('.hl').forEach(e => e.classList.remove('hl'));
      const hl = b > 0 ? (bs[b - 1].dataset.hl || '') : '';
      hl.split(' ').filter(Boolean).forEach(k => slide.querySelectorAll('g.def-' + k).forEach(e => e.classList.add('hl')));
      const ex = slide.dataset.ex;
      if (ex) {
        const group = exSlides(ex), pos = group.indexOf(slide);
        head.textContent = chapter + ' · Ejercicio ' + ex;
        counter.textContent = 'Ej. ' + ex + ' · ' + (pos + 1) + ' / ' + group.length;
        try { history.replaceState(null, '', '#e' + ex + '-' + (pos + 1)); } catch (e) {}
      } else {
        head.textContent = chapter;
        counter.textContent = '';
        try { history.replaceState(null, '', '#indice'); } catch (e) {}
      }
    }
    function go(i, full) { s = i; b = full ? builds(s).length : 0; render(); }
    function next() {
      if (b < builds(s).length) { b++; render(); }
      else if (s < slides.length - 1) go(s + 1);
    }
    function prev() {
      if (b > 0) { b--; render(); }
      else if (s > 0) go(s - 1, true);
    }
    document.getElementById('nextBtn').addEventListener('click', next);
    document.getElementById('prevBtn').addEventListener('click', prev);
    document.getElementById('idxBtn').addEventListener('click', () => go(0));
    document.querySelectorAll('[data-go]').forEach(btn =>
      btn.addEventListener('click', () => go(slides.indexOf(exSlides(btn.dataset.go)[0]))));
    document.addEventListener('keydown', e => {
      if (e.target.tagName === 'BUTTON' && (e.key === ' ' || e.key === 'Enter')) return;
      if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(e.key)) { e.preventDefault(); next(); }
      if (['ArrowLeft', 'PageUp', 'Backspace'].includes(e.key)) { e.preventDefault(); prev(); }
      if (e.key === 'Home' || e.key === 'i' || e.key === 'I') { e.preventDefault(); go(0); }
    });

    const m = /^#e(\d+)-(\d+)$/.exec(location.hash);
    if (m) {
      const group = exSlides(m[1]);
      const target = group[Math.min(group.length, Math.max(1, +m[2])) - 1];
      if (target) { go(slides.indexOf(target), true); setupTips(); return; }
    }
    render();
    setupTips();
  }
