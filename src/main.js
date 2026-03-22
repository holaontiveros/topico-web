  // Per-bar static config (breathe timing, shimmer timing, opacity range, drift)
  const CONFIG = [
    { dur: '7s',   delay: '0s',    opLo: 0.38, opHi: 0.55, drift: '-3px', shimDur: '14s', shimDelay: '-2s'  },
    { dur: '8.5s', delay: '-1.2s', opLo: 0.28, opHi: 0.48, drift: '-5px', shimDur: '11s', shimDelay: '-5s'  },
    { dur: '6.8s', delay: '-3.1s', opLo: 0.35, opHi: 0.52, drift: '-2px', shimDur: '16s', shimDelay: '-1s'  },
    { dur: '9s',   delay: '-0.7s', opLo: 0.32, opHi: 0.50, drift: '-6px', shimDur: '12s', shimDelay: '-8s'  },
    { dur: '7.5s', delay: '-2.4s', opLo: 0.42, opHi: 0.60, drift: '-4px', shimDur: '13s', shimDelay: '-3s'  },
  ];
 
  // Height bands: each bar picks a value from a constrained range so the
  // composition always reads as a recognisable bar-chart silhouette.
  // [min%, max%] per bar — mobile values; desktop scales these down ~0.87x
  const RANGES_MOBILE  = [[22, 48], [32, 62], [20, 46], [38, 68], [44, 74]];
  const RANGES_DESKTOP = [[18, 42], [28, 55], [16, 40], [34, 62], [40, 68]];
 
  const bars = Array.from(document.querySelectorAll('.bar-inner'));
 
  function isMobile() { return window.innerWidth < 640; }
 
  function randInRange([lo, hi]) {
    return lo + Math.random() * (hi - lo);
  }
 
  // Apply static CSS custom properties once
  bars.forEach((bar, i) => {
    const c = CONFIG[i];
    const shimmer = bar.querySelector('.shimmer-layer');
    bar.style.setProperty('--breathe-dur',   c.dur);
    bar.style.setProperty('--breathe-delay', c.delay);
    bar.style.setProperty('--op-lo',  c.opLo);
    bar.style.setProperty('--op-hi',  c.opHi);
    bar.style.setProperty('--drift',  c.drift);
    shimmer.style.setProperty('--shimmer-dur',   c.shimDur);
    shimmer.style.setProperty('--shimmer-delay', c.shimDelay);
  });
 
  // Set heights — called on init and every reshape
  function applyHeights(heights) {
    bars.forEach((bar, i) => {
      bar.style.height = heights[i].toFixed(1) + '%';
    });
  }
 
  function newHeights() {
    const ranges = isMobile() ? RANGES_MOBILE : RANGES_DESKTOP;
    return ranges.map(r => randInRange(r));
  }
 
  // Initial heights (no transition on first paint)
  bars.forEach(b => b.style.transition = 'none');
  applyHeights(newHeights());
 
  // Re-enable transition after first paint
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      bars.forEach(b => b.style.transition = 'height 2.4s cubic-bezier(0.45, 0, 0.55, 1)');
    });
  });
 
  // Reshape every ~2–3 breathe cycles (~18–22 s feels natural)
  function scheduleReshape() {
    const delay = 18000 + Math.random() * 4000;
    setTimeout(() => {
      applyHeights(newHeights());
      scheduleReshape();
    }, delay);
  }
 
  scheduleReshape();
 
  // Also reshape on resize so desktop/mobile ranges stay correct
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => applyHeights(newHeights()), 200);
  });