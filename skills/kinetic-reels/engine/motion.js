// Kinetic motion library (Nov 9). Load after core_a.js, before reel.js:
//   <script src="core_a.js"></script><script src="motion.js"></script><script src="reel.js"></script>
// Every function is a pure function of time t, so a frame always renders the same way (the renderer seeks t).
// Never use the ids st, grid, wm, L or cap: the page already uses them (Nov 9: a steps rail called 'st' grabbed the whole stage).
// Build a piece with M.<piece>(...) inside add(), then drive it from scenes(t) with the matching M.<verb>(...).
// Catalogue: kinetic/COMPONENTS.md, section "Motion library". Every piece is shown in library/2026-11-10/motion_demo/.
const M = (() => {
  const $i = id => document.getElementById(id);
  const ease = p => eio(clamp(p));
  // seeded random, so swarms and drops land the same way every render
  function rng(seed) { let s = seed >>> 0 || 1; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }
  // value along keyframes [[t, v], ...] (numbers or arrays of numbers)
  function track(t, keys) {
    if (t <= keys[0][0]) return keys[0][1];
    for (let i = 0; i < keys.length - 1; i++) {
      const [t0, a] = keys[i], [t1, b] = keys[i + 1];
      if (t < t1) { const p = ease((t - t0) / (t1 - t0)); return Array.isArray(a) ? a.map((v, k) => lerp(v, b[k], p)) : lerp(a, b, p); }
    }
    return keys[keys.length - 1][1];
  }

  // 1. CURSOR: a real-looking pointer that glides between points and clicks with a ripple.
  //    keys = [[t, x, y, click?], ...] in page pixels. Put the cursor in add() LAST so it sits on top.
  const cursor = () => `<div class="m-cur"><svg viewBox="0 0 24 24" width="54" height="54"><path d="M4 2l16 11-7 1.6L9.6 22z" fill="#0B0B0F" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg><i></i></div>`;
  function cursorTo(el, t, keys, show = [0, 1e9]) {
    const xy = track(t, keys.map(k => [k[0], [k[1], k[2]]]));
    const clicks = keys.filter(k => k[3]).map(k => k[0]); const last = clicks.filter(c => t >= c).pop();
    const q = last == null ? 1 : clamp((t - last) / 0.45); const press = last != null && t - last < 0.12;
    const o = eo3(prog(t, show[0], 0.25)) * (1 - eo3(prog(t, show[1], 0.25)));
    el.style.transform = `translate(${xy[0]}px,${xy[1]}px) scale(${press ? 0.86 : 1})`; el.style.opacity = o; el.style.visibility = o < .01 ? 'hidden' : 'visible';
    const r = el.querySelector('i'); r.style.transform = `translate(-50%,-50%) scale(${0.2 + 2.2 * eo3(q)})`; r.style.opacity = last == null ? 0 : 0.55 * (1 - q);
  }

  // 2. BROWSER: a real screenshot in a browser window that scrolls and zooms into the line that matters.
  const browser = (id, src, url, w = 920, h = 560) => `<div class="m-bw" style="width:${w}px"><div class="m-bh"><s></s><s></s><s></s><span>${url}</span></div><div class="m-vp" style="height:${h}px"><img id="${id}" src="${src}"></div></div>`;
  //    keys = [[t, scrollY_px, zoom, focusX_0to1, focusY_0to1], ...]
  function scrollZoom(id, t, keys) {
    const [sy, z, fx, fy] = track(t, keys.map(k => [k[0], [k[1], k[2], k[3] ?? .5, k[4] ?? .3]]));
    const e = $i(id); e.style.transformOrigin = `${fx * 100}% ${fy * 100}%`; e.style.transform = `translateY(${-sy}px) scale(${z})`;
  }

  // 3. LINE CHART that draws itself, and can flip from green to red and crash.
  //    pts = [[x0to1, y0to1], ...] (y 0 = bottom). crashFrom = index where the red part starts (or -1).
  function chart(id, pts, w = 860, h = 420, crashFrom = -1) {
    const P = pts.map(([x, y]) => [24 + x * (w - 48), h - 24 - y * (h - 48)]);
    const d = a => a.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
    const g = crashFrom < 0 ? P : P.slice(0, crashFrom + 1), r = crashFrom < 0 ? [] : P.slice(crashFrom);
    const grid = [0.25, .5, .75].map(f => `<line x1="24" x2="${w - 24}" y1="${24 + f * (h - 48)}" y2="${24 + f * (h - 48)}" stroke="#ECECF1" stroke-width="2"/>`).join('');
    return `<svg class="m-ch" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${grid}<path id="${id}g" d="${d(g)}" fill="none" stroke="#16A34A" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>${r.length ? `<path id="${id}r" d="${d(r)}" fill="none" stroke="#DC2626" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>` : ''}<circle id="${id}d" r="13" fill="#16A34A" cx="${P[0][0]}" cy="${P[0][1]}"/></svg>`;
  }
  function drawChart(id, t, a, d, crashAt = null, crashD = 0.5) {
    const g = $i(id + 'g'), r = $i(id + 'r'), dot = $i(id + 'd'); const p = ease(prog(t, a, d)); g.style.strokeDashoffset = 1 - p;
    let tip = g, f = p;
    if (r && crashAt != null) { const q = eo3(prog(t, crashAt, crashD)); r.style.strokeDashoffset = 1 - q; if (t >= crashAt) { tip = r; f = q; } }
    const L = tip.getTotalLength(), pt = tip.getPointAtLength(L * f); dot.setAttribute('cx', pt.x); dot.setAttribute('cy', pt.y); dot.setAttribute('fill', tip === r ? '#DC2626' : '#16A34A');
  }

  // 4. CODE DIFF: lines land one by one like a real pull request, with +/- counters.
  //    lines = [['+'|'-'|' ', 'text'], ...]
  const diff = (id, file, lines) => `<div class="m-df" id="${id}"><div class="m-dh"><b>${file}</b><span><em class="a" id="${id}a">+0</em><em class="r" id="${id}r">-0</em></span></div>${lines.map(([k, s], i) => `<div class="m-dl ${k === '+' ? 'a' : k === '-' ? 'r' : ''}" id="${id}l${i}"><i>${k === ' ' ? '' : k}</i>${s.replace(/</g, '&lt;')}</div>`).join('')}</div>`;
  function diffReveal(id, t, a, step = 0.22) {
    const ls = [...$i(id).querySelectorAll('.m-dl')]; let A = 0, R = 0;
    ls.forEach((l, i) => { const p = eo3(prog(t, a + i * step, 0.25)); l.style.opacity = p; l.style.transform = `translateX(${(1 - p) * -24}px)`; if (p > .5) { if (l.classList.contains('a')) A++; if (l.classList.contains('r')) R++; } });
    $i(id + 'a').textContent = '+' + A; $i(id + 'r').textContent = '-' + R;
  }

  // 5. CHAT / SOCIAL STACK: messages or posts slide in, each after 0.5 s of typing dots.
  //    msgs = [{who, text, side:'l'|'r', av:'as/x.png' or null, tag:'@handle'}], times = when each one lands
  const chat = (id, msgs) => `<div class="m-cs" id="${id}">${msgs.map((m, i) => `<div class="m-msg ${m.side || 'l'}" id="${id}m${i}">${m.av ? `<img src="${m.av}">` : `<b class="m-av">${(m.who || '?')[0]}</b>`}<div><small>${m.who || ''}${m.tag ? ' <u>' + m.tag + '</u>' : ''}</small><p>${m.text}</p></div></div><div class="m-typ ${m.side || 'l'}" id="${id}t${i}"><s></s><s></s><s></s></div>`).join('')}</div>`;
  function chatReveal(id, t, times) {
    times.forEach((a, i) => { const m = $i(id + 'm' + i), ty = $i(id + 't' + i); const p = eo5(prog(t, a, 0.4)); const typing = t >= a - 0.55 && t < a;
      m.style.display = t >= a ? 'flex' : 'none'; m.style.opacity = p; m.style.transform = `translateY(${(1 - p) * 30}px) scale(${0.96 + .04 * p})`;
      ty.style.display = typing ? 'flex' : 'none'; [...ty.children].forEach((s, k) => s.style.transform = `translateY(${-6 * Math.max(0, Math.sin((t * 9) - k * 0.9))}px)`); });
  }

  // 6. SPLIT-FLAP number: each digit flips like an airport board until it lands on the value. Use one cell per character ('84,956' = 6).
  const flap = (id, n) => `<div class="m-fl" id="${id}">${Array.from({ length: n }, (_, i) => `<span id="${id}${i}">0</span>`).join('')}</div>`;
  function flapTo(id, text, t, a, d = 1.2) {
    const s = String(text); [...s].forEach((c, i) => { const e = $i(id + i); if (!e) return; const land = a + d * (i + 1) / s.length; const done = t >= land;
      const spin = Math.floor((t - a) * 18 + i * 3); const ch = /\d/.test(c) ? (done || t < a ? (t < a ? '0' : c) : String(spin % 10)) : c;
      e.textContent = ch; const ph = done || t < a ? 0 : ((t - a) * 18) % 1; e.style.transform = `rotateX(${ph * 80}deg)`; });
  }

  // 7. DROP + STACK: cards or coins fall into a pile with a small bounce (cost, limits, "it piles up").
  function dropAt(el, t, a, x, y, from = -700, rot = 0) {
    const p = prog(t, a, 0.55); const b = p < 1 ? (p < .7 ? eio(p / .7) : 1 - Math.sin((p - .7) / .3 * Math.PI) * 0.06) : 1;
    setT(el, { x, y: lerp(y + from, y, b), o: t >= a ? 1 : 0, r: rot * (1 - eo3(p)) * 3 + rot });
  }

  // 8. RACE BARS: options race side by side, the leader gets a crown pop.
  //    rows = [{name, logo:'as/x.svg' or null, value, label}] (value 0 to 1 of the track)
  const race = (id, title, rows) => `<div class="m-rc" id="${id}"><div class="m-rt">${title}</div>${rows.map((r, i) => `<div class="m-rr"><div class="m-rn">${r.logo ? `<img src="${r.logo}">` : ''}${r.name}</div><div class="m-rk"><div id="${id}b${i}"></div></div><b id="${id}v${i}">0</b><em id="${id}c${i}">\u2605</em></div>`).join('')}</div>`;
  function raceRun(id, t, a, d, rows, fmtv = v => Math.round(v * 100) + '%') {
    const lead = rows.reduce((m, r, i) => r.value > rows[m].value ? i : m, 0);
    rows.forEach((r, i) => { const p = ease(prog(t, a + i * 0.08, d)); $i(id + 'b' + i).style.width = (100 * r.value * p) + '%'; $i(id + 'v' + i).textContent = r.label && p >= 1 ? r.label : fmtv(r.value * p);
      const c = $i(id + 'c' + i); const q = prog(t, a + d + 0.15, 0.5); c.style.opacity = i === lead ? eo3(q) : 0; c.style.transform = `scale(${0.4 + 0.6 * spring(q)})`; });
  }

  // 9. SWARM: hundreds of agent dots drift, link up and pulse (crowds, agents, networks, "everyone reacts").
  function swarm(id, n = 140, w = 920, h = 600, seed = 7, colors = ['#6D28D9', '#C026D3', '#EA580C', '#2563EB', '#0EA5E9']) {
    const R = rng(seed); const N = Array.from({ length: n }, (_, i) => ({ x: R() * w, y: R() * h, ph: R() * 6.3, sp: .3 + R() * .7, c: colors[Math.floor(R() * colors.length)], r: 5 + R() * 6, at: R() }));
    const E = []; N.forEach((a, i) => { for (let k = 0; k < 2; k++) { const j = Math.floor(R() * n); if (j !== i) E.push([i, j, R()]); } });
    window['_sw_' + id] = { N, E, w, h };
    return `<svg class="m-sw" id="${id}" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><g id="${id}e">${E.map(() => '<line stroke="#C9C3E6" stroke-width="1.6"/>').join('')}</g><g id="${id}n">${N.map(p => `<circle r="${p.r.toFixed(1)}" fill="${p.c}"/>`).join('')}</g></svg>`;
  }
  //    a = when the dots start appearing (negative = already alive on frame 0), d = how long until all are in,
  //    link = 0..1 how many links show, pulse = time a wave runs through, gather = 0..1 pulls the crowd to the middle
  function swarmStep(id, t, a, d = 1.5, link = 1, pulse = null, gather = 0) {
    const S = window['_sw_' + id]; if (!S) return; const ns = $i(id + 'n').children, es = $i(id + 'e').children; const P = [];
    S.N.forEach((p, i) => { const x0 = p.x + 18 * Math.sin(t * p.sp + p.ph), y0 = p.y + 14 * Math.cos(t * p.sp * 1.3 + p.ph);
      const x = lerp(x0, S.w / 2 + (x0 - S.w / 2) * 0.35, gather), y = lerp(y0, S.h / 2 + (y0 - S.h / 2) * 0.35, gather); P.push([x, y]);
      const o = eo3(prog(t, a + p.at * d, 0.3)); const wave = pulse == null ? 0 : Math.max(0, 1 - Math.abs((t - pulse) * 2.2 - (x / S.w) * 2));
      ns[i].setAttribute('cx', x.toFixed(1)); ns[i].setAttribute('cy', y.toFixed(1)); ns[i].setAttribute('opacity', o); ns[i].setAttribute('transform', `translate(${x} ${y}) scale(${1 + wave * .8}) translate(${-x} ${-y})`); });
    S.E.forEach(([i, j, r], k) => { const e = es[k]; const o = r < link ? eo3(prog(t, a + d * .6 + r * 0.8, 0.4)) * 0.8 : 0;
      e.setAttribute('x1', P[i][0]); e.setAttribute('y1', P[i][1]); e.setAttribute('x2', P[j][0]); e.setAttribute('y2', P[j][1]); e.setAttribute('opacity', o); });
  }

  // 10. MARKER SWEEP / STRIKE: a highlighter swipes under a phrase, or a red line strikes the myth.
  const mark = (id, html, kind = 'under') => `<span class="m-mk ${kind}" id="${id}">${html}<i></i></span>`;
  function sweep(id, t, a, d = 0.45) { $i(id).querySelector('i').style.width = (100 * eo3(prog(t, a, d))) + '%'; }

  // 11. PINGS: dots light up with an expanding ring, one per item (countries, users, servers, files).
  const pings = (id, pts) => `<div class="m-pg" id="${id}">${pts.map(([x, y], i) => `<b id="${id}${i}" style="left:${x}px;top:${y}px"><i></i></b>`).join('')}</div>`;
  function pingRun(id, t, times) { times.forEach((a, i) => { const e = $i(id + i); const p = prog(t, a, 0.9); e.style.opacity = t >= a ? 1 : 0; e.style.transform = `translate(-50%,-50%) scale(${0.4 + 0.6 * spring(prog(t, a, 0.4))})`; const r = e.firstChild; r.style.transform = `translate(-50%,-50%) scale(${1 + 3 * eo3(p)})`; r.style.opacity = 0.6 * (1 - p); }); }

  // 12. METER: a token / credit / battery bar that fills or drains, colour shifting to red near empty.
  const meter = (id, label) => `<div class="m-mt"><div class="m-ml"><span>${label}</span><b id="${id}v">100%</b></div><div class="m-mk2"><div id="${id}"></div></div></div>`;
  function meterTo(id, t, keys) { const v = clamp(track(t, keys)); const e = $i(id); e.style.width = (v * 100) + '%'; e.style.background = v < .2 ? '#DC2626' : v < .45 ? '#EA580C' : 'linear-gradient(90deg,#6D28D9,#C026D3)'; $i(id + 'v').textContent = Math.round(v * 100) + '%'; }

  // 13. STEPS RAIL: numbered steps light up one by one with a progress line between them (how-tos).
  const steps = (id, items) => `<div class="m-st" id="${id}"><div class="m-sl"><div id="${id}p"></div></div>${items.map((s, i) => `<div class="m-si" id="${id}s${i}"><i>${i + 1}</i><b>${s}</b></div>`).join('')}</div>`;
  function stepsRun(id, t, times) { const n = times.length; let k = -1; times.forEach((a, i) => { if (t >= a) k = i; const e = $i(id + 's' + i); e.classList.toggle('on', t >= a); e.style.opacity = 0.35 + 0.65 * eo3(prog(t, a, 0.3)); });
    const prev = k <= 0 ? 0 : (k - 1) / Math.max(1, n - 1), cur = k < 0 ? 0 : k / Math.max(1, n - 1);
    $i(id + 'p').style.height = (100 * (k < 0 ? 0 : lerp(prev, cur, eo3(prog(t, times[k], 0.4))))) + '%'; }

  return { rng, track, cursor, cursorTo, browser, scrollZoom, chart, drawChart, diff, diffReveal, chat, chatReveal, flap, flapTo, dropAt, race, raceRun, swarm, swarmStep, mark, sweep, pings, pingRun, meter, meterTo, steps, stepsRun };
})();
