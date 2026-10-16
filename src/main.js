/* ======================= KONFIGURASI ======================= */
const LANE_X = [-4.5, -1.5, 1.5, 4.5];
const SEG = 100;                 // panjang 1 bendera (= 1 kotak bensin)
const BASE = 20, BOOST = 1.45, TOW_SPEED = 17;
const AI_BASE = 20.4, AI_SKILL = 0.55;      // makin kecil skill = AI makin sering salah jalur
const FUEL_PRICE = 2, TANK_MAX = 10, START_COINS = 20, MIN_COINS = 10;
const ROAD_HALF = 5.6, STEER_SPEED = 9, AI_STEER = 6.5, PAD_W = 3.6, PAD_LEN = 24, LINGER = 0.7;
const BONUS_PLACE = [10, 4, 1], BONUS_EXACT = 5;
const DRIFT = 18;                // dorongan ke luar saat tikungan (mode Sulit)

const COLORS = [
  { name: 'Merah',  hex: 0xe53935, css: '#e53935' },
  { name: 'Biru',   hex: 0x1e88e5, css: '#1e88e5' },
  { name: 'Kuning', hex: 0xfdd835, css: '#fdd835' },
  { name: 'Hijau',  hex: 0x43a047, css: '#43a047' },
];
// gokart: hanya beda tampilan (adil untuk semua). Tiap model punya ban, knalpot, jok, bemper, dan nomor sendiri.
const KARTS = [
  { name: 'Kancil',  price: 0,   tw: 5, th: 12, rim: 0xcfd8dc, bar: 0, exh: 1, seat: 0, pod: 0, plate: 0xffffff, acc: 0 },
  { name: 'Kelinci', price: 20,  tw: 5, th: 12, rim: 0xfdd835, bar: 1, exh: 2, seat: 1, pod: 0, plate: 0xffe082, acc: 1 },
  { name: 'Elang',   price: 30,  tw: 6, th: 13, rim: 0x29b6f6, bar: 1, exh: 1, seat: 2, pod: 1, plate: 0xffffff, acc: 2 },
  { name: 'Harimau', price: 40,  tw: 6, th: 13, rim: 0xff9800, bar: 2, exh: 2, seat: 1, pod: 1, plate: 0xffcc80, acc: 3 },
  { name: 'Citah',   price: 50,  tw: 6, th: 12, rim: 0xffeb3b, bar: 0, exh: 2, seat: 2, pod: 2, plate: 0xffffff, acc: 0 },
  { name: 'Banteng', price: 65,  tw: 7, th: 14, rim: 0xef5350, bar: 2, exh: 1, seat: 0, pod: 1, plate: 0xffab91, acc: 1 },
  { name: 'Hiu',     price: 80,  tw: 6, th: 13, rim: 0x90caf9, bar: 1, exh: 0, seat: 2, pod: 2, plate: 0xb3e5fc, acc: 2 },
  { name: 'Naga',    price: 100, tw: 7, th: 14, rim: 0x66bb6a, bar: 2, exh: 2, seat: 1, pod: 2, plate: 0xc5e1a5, acc: 3 },
  { name: 'Roket',   price: 125, tw: 7, th: 13, rim: 0xffffff, bar: 1, exh: 3, seat: 2, pod: 2, plate: 0xfff59d, acc: 0 },
  { name: 'Petir',   price: 150, tw: 7, th: 15, rim: 0xffd600, bar: 2, exh: 3, seat: 2, pod: 2, plate: 0xfff176, acc: 1 },
];
const CARS = KARTS, CAR_PRICE = KARTS.map((k) => k.price), NK = KARTS.length;
const SHIRTS = [0xe53935, 0x1e88e5, 0xfdd835, 0x43a047, 0xff6fa8, 0x8e44ff];
const ACC_ICON = ['🏁', '🚩', '💡', '🛡️'];       // sayap, bendera, lampu, bemper (tiap model gokart punya satu)
const TRACKS = [   // sirkuit sungguhan, dari yang pendek ke panjang; "curve" = bentuk tikungan khas (dipakai di mode Sulit)
  { name: 'Sentul',    emoji: '🇮🇩', len: 'Pendek',  flags: 4, sky: 0x9ad8ff, ground: 0x5faa43, theme: 'sentul',    run: 0xbdb8a6, wall: [0xe53935, 0xffffff], stand: 2, curve: { a1: 0.30, k1: 66, p1: 0.4, a2: 0.10, k2: 30, p2: 1.3 } },
  { name: 'Suzuka',    emoji: '🇯🇵', len: 'Pendek',  flags: 5, sky: 0xa9def7, ground: 0x6cae56, theme: 'suzuka',    run: 0xc9bfa8, wall: [0xe53935, 0xffffff], stand: 0, curve: { a1: 0.26, k1: 38, p1: 1.0, a2: 0.18, k2: 92, p2: 0.2 } },
  { name: 'Sepang',    emoji: '🇲🇾', len: 'Sedang',  flags: 6, sky: 0x8ad8ff, ground: 0x4fa83a, theme: 'sepang',    run: 0xc0c0c0, wall: [0x1e88e5, 0xffffff], stand: 1, curve: { a1: 0.32, k1: 54, p1: 0, a2: 0.14, k2: 24, p2: 2.0 } },
  { name: 'Monza',     emoji: '🇮🇹', len: 'Sedang',  flags: 7, sky: 0xb7d3ee, ground: 0x4f8f3f, theme: 'monza',     run: 0xc7b99a, wall: [0x43a047, 0xffffff], stand: 3, curve: { a1: 0.34, k1: 60, p1: 0.8, a2: 0.12, k2: 25, p2: 0.5, g: 85 } },
  { name: 'Mandalika', emoji: '🇮🇩', len: 'Panjang', flags: 9, sky: 0x8fe0ff, ground: 0xd9c48f, theme: 'mandalika', run: 0xeadfb9, wall: [0xe53935, 0xffffff], stand: 0, sea: true, curve: { a1: 0.30, k1: 72, p1: 0.2, a2: 0.15, k2: 34, p2: 1.6 } },
];
const NUM_WORDS = ['nol', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh'];

/* ======================= UTIL ======================= */
const $ = (s) => document.querySelector(s);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffle(arr, rng) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* ======================= STATE & SAVE ======================= */
const SAVE_KEY = 'balap-voxel-v1';
const G = { coins: START_COINS, carIdx: 0, trackIdx: 0, level: 1, mute: false, musicOff: false, diff: 'easy', char: { g: 'boy', hat: 0, hs: 0, shirt: 1 }, charSet: false, name: '', owned: KARTS.map((_, i) => i === 0), buying: -1,
  cust: KARTS.map((_, i) => ({ col: i % 4, acc: 0, lv: 0 })), state: 'menu', fill: 0, R: null, t: 0 };
function loadSave() {
  try {
    const j = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
    if (typeof j.coins === 'number') G.coins = j.coins;
    if (j.carIdx >= 0 && j.carIdx < CARS.length) G.carIdx = j.carIdx;
    if (j.trackIdx >= 0 && j.trackIdx < TRACKS.length) G.trackIdx = j.trackIdx;
    if (j.level >= 1 && j.level <= 3) G.level = j.level;
    if (typeof j.mute === 'boolean') G.mute = j.mute;
    if (typeof j.musicOff === 'boolean') G.musicOff = j.musicOff;
    if (j.diff === 'easy' || j.diff === 'hard' || j.diff === 'curvy') G.diff = j.diff;
    if (j.char) G.char = { g: j.char.g === 'girl' ? 'girl' : 'boy', hat: clamp(j.char.hat | 0, 0, 5), hs: clamp(j.char.hs | 0, 0, 2), shirt: clamp(j.char.shirt | 0, 0, 5) };
    if (j.charSet === true) G.charSet = true;
    if (typeof j.name === 'string') G.name = j.name.slice(0, 12);
    if (Array.isArray(j.owned)) G.owned = G.owned.map((d, i) => i === 0 || j.owned[i] === true);       // simpanan lama (4 mobil) tetap terbaca
    if (Array.isArray(j.cust)) G.cust = G.cust.map((d, i) => { const c = j.cust[i]; return c ? { col: clamp(c.col | 0, 0, 3), acc: c.acc ? 1 : 0, lv: clamp(c.lv | 0, 0, 3) } : d; });
    if (!G.owned[G.carIdx]) G.carIdx = 0;
  } catch (e) { /* abaikan */ }
}
function save() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ coins: G.coins, carIdx: G.carIdx, trackIdx: G.trackIdx, level: G.level, mute: G.mute, musicOff: G.musicOff, diff: G.diff, char: G.char, charSet: G.charSet, name: G.name, owned: G.owned, cust: G.cust }));
  } catch (e) { /* abaikan */ }
}

/* ======================= AUDIO: MUSIK + EFEK (semua dibuat lewat kode, tanpa file) ======================= */
const A = { ctx: null, mus: null, sfx: null, noise: null, eng: null, wind: null,
  want: null, mode: null, step: 0, nextT: 0, timer: 0, boostI: 0, boostTarget: 0, offline: false };
const MN = (m) => 440 * Math.pow(2, (m - 69) / 12);
// 8 bar. Balapan: Am F C G | Am F G E  -> [nada dasar (MIDI C3=48 + off), isi akor]
const MIN = [0, 3, 7], MAJ = [0, 4, 7];
const PROG = [[9, MIN], [5, MAJ], [0, MAJ], [-5, MAJ], [9, MIN], [5, MAJ], [-5, MAJ], [-8, MAJ]];
// melodi lead (MIDI), 8 nada per bar (tiap 2 step), selalu main saat balapan
const LEAD = [[81, 84, 88, 84, 81, 84, 88, 93], [77, 81, 84, 81, 77, 81, 84, 89],
              [79, 84, 88, 84, 79, 84, 88, 91], [79, 83, 86, 83, 79, 83, 86, 91],
              [81, 84, 88, 84, 81, 84, 88, 93], [77, 81, 84, 81, 77, 81, 84, 89],
              [79, 83, 86, 83, 79, 86, 83, 79], [80, 83, 88, 83, 80, 83, 88, 92]];
const BPM = { menu: 118, race: 168, win: 132 };
// lagu kemenangan: C G Am F, melodi ceria (0 = diam)
const WIN_PROG = [[0, MAJ], [-5, MAJ], [-3, MIN], [-7, MAJ]];
const WIN_LEAD = [[84, 0, 84, 88, 91, 0, 88, 84], [83, 0, 83, 86, 91, 0, 86, 83], [84, 0, 81, 84, 88, 0, 84, 81], [81, 0, 84, 88, 93, 0, 91, 88]];

function audioInit(override) {
  if (A.ctx) { if (A.ctx.state === 'suspended' && !A.offline) A.ctx.resume(); return true; }
  try {
    let ctx = override;
    if (!ctx) { const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false; ctx = new AC(); }
    A.ctx = ctx; A.offline = !!override;
    const master = ctx.createGain(); master.gain.value = 0.9;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -16; comp.knee.value = 12; comp.ratio.value = 5; comp.attack.value = 0.004; comp.release.value = 0.2;
    master.connect(comp); comp.connect(ctx.destination);
    A.mus = ctx.createGain(); A.sfx = ctx.createGain();
    A.mus.connect(master); A.sfx.connect(master);
    const len = Math.floor(ctx.sampleRate * 2), buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    A.noise = buf;
    applyAudioPrefs();
    buildEngine();
    return true;
  } catch (e) { A.ctx = null; return false; }
}
function applyAudioPrefs() {
  if (!A.ctx) return;
  A.mus.gain.value = G.musicOff ? 0 : 0.8;
  A.sfx.gain.value = G.mute ? 0 : 1;
}
const okSfx = () => A.ctx && !G.mute;

function oscHit(type, f1, f2, t, dur, vol, dest, attack = 0.005) {
  const ctx = A.ctx, o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.setValueAtTime(f1, t);
  if (f2 && f2 !== f1) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(vol, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(dest); o.start(t); o.stop(t + dur + 0.03);
}
function noiseHit(t, dur, ftype, f1, f2, vol, q, dest) {
  const ctx = A.ctx, src = ctx.createBufferSource(), bp = ctx.createBiquadFilter(), g = ctx.createGain();
  src.buffer = A.noise;
  bp.type = ftype; bp.Q.value = q; bp.frequency.setValueAtTime(f1, t);
  if (f2 && f2 !== f1) bp.frequency.exponentialRampToValueAtTime(f2, t + dur);
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(bp); bp.connect(g); g.connect(dest);
  src.start(t, Math.random() * 0.4, dur + 0.05);
}
function tone(f, d, type = 'square', v = 0.05, f2 = 0, delay = 0) {
  if (!okSfx()) return;
  oscHit(type, f, f2, A.ctx.currentTime + delay, d, v, A.sfx);
}

/* ---- efek suara ---- */
const sfx = {
  coin: () => { tone(988, 0.07, 'square', 0.05); tone(1319, 0.16, 'square', 0.05, 0, 0.07); },
  tick: () => tone(520, 0.05, 'square', 0.04),
  chime: () => { [784, 1175, 1568].forEach((f, i) => tone(f, 0.9, 'sine', 0.05, 0, i * 0.12)); },
  title: () => {          // hantaman judul: dentuman + sapuan naik + akor
    if (!okSfx()) return;
    const t = A.ctx.currentTime;
    oscHit('sine', 120, 38, t, 0.5, 0.45, A.sfx, 0.002);
    noiseHit(t, 0.9, 'bandpass', 400, 5000, 0.22, 1, A.sfx);
    [523, 659, 784, 1047].forEach((f) => oscHit('square', f, f, t + 0.02, 0.7, 0.045, A.sfx, 0.01));
  },
  bump: () => { if (!okSfx()) return; const t = A.ctx.currentTime; oscHit('sine', 150, 45, t, 0.2, 0.3, A.sfx, 0.002); noiseHit(t, 0.12, 'bandpass', 700, 200, 0.2, 1, A.sfx); },
  fuel: () => { tone(523, 0.08, 'square', 0.05); tone(659, 0.08, 'square', 0.05, 0, 0.08); tone(784, 0.08, 'square', 0.05, 0, 0.16); tone(1047, 0.2, 'square', 0.05, 0, 0.24); },
  beep: () => tone(440, 0.15, 'square', 0.07),
  go: () => { tone(880, 0.4, 'square', 0.07); tone(1175, 0.4, 'square', 0.05); tone(1568, 0.4, 'triangle', 0.05); },
  flag: () => { tone(660, 0.1, 'triangle', 0.06); tone(990, 0.14, 'triangle', 0.06, 0, 0.08); },
  swoosh: () => { if (okSfx()) noiseHit(A.ctx.currentTime, 0.12, 'bandpass', 900, 2400, 0.07, 1, A.sfx); },
  horn: () => { tone(392, 0.18, 'square', 0.05); tone(392, 0.18, 'square', 0.05, 0, 0.24); },
  pay: () => { tone(880, 0.1, 'square', 0.04, 1320); tone(1320, 0.14, 'square', 0.04, 1760, 0.1); },
  win: () => [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, 0.2, 'square', 0.05, 0, i * 0.11)),
  lose: () => [392, 330, 262].forEach((f, i) => tone(f, 0.22, 'triangle', 0.06, 0, i * 0.16)),
  stall: () => {
    tone(220, 0.7, 'sawtooth', 0.05, 70);
    if (okSfx()) [0, 0.18, 0.33].forEach((d) => noiseHit(A.ctx.currentTime + d, 0.08, 'bandpass', 300, 0, 0.12, 1, A.sfx));
  },
  boost: () => {          // ledakan boost: whoosh + sapuan naik + kilau
    if (!okSfx()) return;
    const t = A.ctx.currentTime;
    noiseHit(t, 0.75, 'bandpass', 300, 4200, 0.26, 1.1, A.sfx);
    oscHit('sawtooth', 150, 880, t, 0.5, 0.075, A.sfx, 0.02);
    oscHit('square', 300, 1700, t, 0.35, 0.035, A.sfx, 0.02);
    [784, 988, 1175, 1568].forEach((f, i) => oscHit('square', f, f, t + 0.05 * i, 0.12, 0.04, A.sfx));
  },
};
function speak(text) {
  if (G.mute) return;
  try {
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'id-ID'; u.rate = 0.85;
    speechSynthesis.speak(u);
  } catch (e) { /* abaikan */ }
}

/* ---- suara mesin + angin: nadanya naik mengikuti kecepatan ---- */
function buildEngine() {
  const ctx = A.ctx;
  const g = ctx.createGain(); g.gain.value = 0;
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 500; lp.Q.value = 3;
  const o1 = ctx.createOscillator(); o1.type = 'sawtooth'; o1.frequency.value = 50;
  const o2 = ctx.createOscillator(); o2.type = 'square'; o2.frequency.value = 25;
  const o3 = ctx.createOscillator(); o3.type = 'sawtooth'; o3.frequency.value = 50.6;
  o1.connect(lp); o2.connect(lp); o3.connect(lp); lp.connect(g); g.connect(A.sfx);
  o1.start(); o2.start(); o3.start();
  const ns = ctx.createBufferSource(); ns.buffer = A.noise; ns.loop = true;
  const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 800; bp.Q.value = 0.5;
  const wg = ctx.createGain(); wg.gain.value = 0;
  ns.connect(bp); bp.connect(wg); wg.connect(A.sfx); ns.start();
  const rn = ctx.createBufferSource(); rn.buffer = A.noise; rn.loop = true;
  const rh = ctx.createBiquadFilter(); rh.type = 'highpass'; rh.frequency.value = 2200;
  const rg = ctx.createGain(); rg.gain.value = 0;
  rn.connect(rh); rh.connect(rg); rg.connect(A.sfx); rn.start();
  A.eng = { g, lp, o1, o2, o3 }; A.wind = { wg, bp }; A.rain = { rg };
}
function engineUpdate(speed, boosting, running, rain = 0) {
  if (!A.eng || A.offline) return;
  const t = A.ctx.currentTime;
  if (A.rain) A.rain.rg.gain.setTargetAtTime(rain * 0.16, t, 0.3);
  const k = clamp(speed / (BASE * BOOST), 0, 1.1);
  const f = 46 + k * 78 + (boosting ? 26 : 0);
  A.eng.o1.frequency.setTargetAtTime(f, t, 0.08);
  A.eng.o3.frequency.setTargetAtTime(f * 1.012, t, 0.08);
  A.eng.o2.frequency.setTargetAtTime(f / 2, t, 0.08);
  A.eng.lp.frequency.setTargetAtTime(380 + k * 900 + (boosting ? 1000 : 0), t, 0.1);
  A.eng.g.gain.setTargetAtTime(running ? 0.045 + k * 0.06 : 0, t, 0.12);
  A.wind.wg.gain.setTargetAtTime(running ? k * k * 0.16 + (boosting ? 0.12 : 0) : 0, t, 0.15);
  A.wind.bp.frequency.setTargetAtTime(500 + k * 1800 + (boosting ? 1400 : 0), t, 0.15);
}

/* ---- musik latar: menu (santai) dan balapan (ngebut, makin ramai saat boost) ---- */
const kick = (t, v) => oscHit('sine', 165, 44, t, 0.16, v, A.mus, 0.002);
const snare = (t) => { noiseHit(t, 0.12, 'bandpass', 2400, 0, 0.2, 0.8, A.mus); oscHit('triangle', 200, 120, t, 0.1, 0.12, A.mus, 0.002); };
const hat = (t, open, v) => noiseHit(t, open ? 0.14 : 0.04, 'highpass', 7500, 0, v, 0.7, A.mus);

function scheduleStep(step, t, sd) {
  const bar = Math.floor(step / 16) % 8, s = step % 16;
  const [off, tri] = PROG[bar], root = 48 + off;
  if (A.mode === 'race') {
    const boost = A.boostI > 0.5;
    // drum: kick tiap ketukan, snare 2 & 4, hat terbuka di off-beat, hat 16 saat boost
    if (s % 4 === 0) kick(t, 0.7);
    if (s === 4 || s === 12) snare(t);
    if (s % 4 === 2) hat(t, true, 0.07); else if (s % 2 === 0) hat(t, false, 0.05);
    if (s % 2 === 1 && (boost || bar % 4 === 3)) hat(t, false, 0.045);
    if (s === 0) noiseHit(t, boost ? 0.7 : 0.35, 'highpass', 5000, 0, boost ? 0.07 : 0.04, 0.7, A.mus);   // cymbal tiap bar
    // bass 16 putus-putus (oktaf naik-turun) khas balapan
    const bn = MN(root - 12 + (s % 4 === 0 ? 0 : (s % 4 === 2 ? 12 : 0)));
    if (s % 4 !== 0) {
      oscHit('sawtooth', bn, 0, t, sd * 0.9, 0.11, A.mus, 0.003);
      oscHit('square', bn / 2, 0, t, sd * 0.9, 0.06, A.mus, 0.003);
    } else oscHit('sawtooth', bn, 0, t, sd * 0.9, 0.09, A.mus, 0.003);
    // arpeggio cepat 16-an
    const ch = tri[[0, 1, 2, 1, 0, 1, 2, 1][s % 8]] + (s % 8 > 3 ? 12 : 0);
    oscHit('square', MN(root + 24 + ch), 0, t, sd * 0.8, boost ? 0.05 : 0.032, A.mus, 0.002);
    // lead: selalu ada, makin tebal saat boost
    if (s % 2 === 0) {
      const ln = LEAD[bar][s / 2];
      oscHit('sawtooth', MN(ln), 0, t, sd * 1.9, boost ? 0.06 : 0.045, A.mus, 0.006);
      oscHit('square', MN(ln - 12), 0, t, sd * 1.9, 0.025, A.mus, 0.006);
      if (boost) oscHit('square', MN(ln + 12), 0, t, sd * 1.4, 0.03, A.mus, 0.004);
    }
    if (boost && s === 15) noiseHit(t, sd * 1.5, 'bandpass', 800, 6000, 0.08, 1, A.mus);   // riser tiap bar
  } else if (A.mode === 'win') {
    const W = WIN_PROG[bar % 4], wr = 48 + W[0];
    if (s % 4 === 0) kick(t, 0.55);
    if (s === 4 || s === 12) snare(t);
    if (s % 4 === 2) hat(t, true, 0.06); else if (s % 2 === 0) hat(t, false, 0.04);
    if (s % 2 === 0) oscHit('sawtooth', MN(wr - 12 + (s % 4 === 2 ? 12 : 0)), 0, t, sd * 1.7, 0.1, A.mus, 0.004);
    if (s === 0) { W[1].forEach((n) => oscHit('square', MN(wr + 12 + n), 0, t, sd * 6, 0.03, A.mus, 0.01)); noiseHit(t, 0.8, 'highpass', 5000, 0, 0.05, 0.7, A.mus); }
    const wl = WIN_LEAD[bar % 4][s / 2];
    if (s % 2 === 0 && wl) {
      oscHit('square', MN(wl), 0, t, sd * 1.8, 0.06, A.mus, 0.004);
      oscHit('triangle', MN(wl - 12), 0, t, sd * 1.8, 0.07, A.mus, 0.004);
    }
    oscHit('triangle', MN(wr + 24 + W[1][(s >> 1) % 3]), 0, t, sd * 0.9, 0.03, A.mus, 0.002);
  } else {
    // menu: tetap semangat — kick lembut, bass memantul, arpeggio ceria
    const M = [[0, MAJ], [-3, MIN], [-7, MAJ], [-5, MAJ], [0, MAJ], [-3, MIN], [-7, MAJ], [-5, MAJ]][bar];
    const mr = 48 + M[0];
    if (s % 4 === 0) kick(t, 0.4);
    if (s === 4 || s === 12) snare(t);
    if (s % 2 === 0) hat(t, s % 4 === 2, 0.045);
    if (s % 4 === 0 || s % 8 === 6) oscHit('triangle', MN(mr - 12), 0, t, sd * 2.5, 0.2, A.mus, 0.004);
    if (s % 2 === 0) oscHit('square', MN(mr + 24 + M[1][(s / 2) % 3]), 0, t, sd * 1.6, 0.035, A.mus, 0.004);
    if (s === 0) M[1].forEach((n) => oscHit('triangle', MN(mr + 12 + n), 0, t, sd * 14, 0.04, A.mus, 0.1));
  }
}
function musicTick() {
  const ctx = A.ctx; if (!ctx || !A.mode) return;
  if (G.musicOff) { A.nextT = ctx.currentTime + 0.06; return; }
  const sd = 60 / BPM[A.mode] / 4;
  if (A.nextT < ctx.currentTime - 0.3) A.nextT = ctx.currentTime + 0.05;   // sempat tertinggal (tab ke background)
  while (A.nextT < ctx.currentTime + 0.15) { scheduleStep(A.step, A.nextT, sd); A.nextT += sd; A.step++; }
}
function applyMode() {
  if (!A.ctx || A.offline || A.mode === A.want) return;
  A.mode = A.want; clearInterval(A.timer); A.timer = 0;
  if (A.mode) { A.step = 0; A.nextT = A.ctx.currentTime + 0.06; A.timer = setInterval(musicTick, 30); }
}
function setMusic(mode) { A.want = mode; applyMode(); }

/* uji audio tanpa speaker: render offline, lalu ukur puncak dan RMS */
async function audioTest(mode, boostI, secs) {
  const sr = 22050, oc = new OfflineAudioContext(2, Math.floor(sr * secs), sr);
  const keep = { ...A };
  A.ctx = null; A.eng = null; A.wind = null;
  audioInit(oc); A.mode = mode; A.boostI = boostI;
  const sd = 60 / BPM[mode] / 4;
  for (let i = 0; i * sd < secs - 0.3; i++) scheduleStep(i, i * sd, sd);
  if (boostI > 0) sfx.boost();
  const buf = await oc.startRendering();
  const d = buf.getChannelData(0);
  let pk = 0, ss = 0, bad = false;
  for (let i = 0; i < d.length; i++) { const v = d[i]; if (v !== v) bad = true; pk = Math.max(pk, Math.abs(v)); ss += v * v; }
  Object.assign(A, keep);
  return { nan: bad, peak: +pk.toFixed(3), rms: +Math.sqrt(ss / d.length).toFixed(4), secs };
}

/* ======================= JALAN BERBELOK (mode Sulit) ======================= */
const ROAD = { on: false, n: 0, cx: null, psi: null, off: 60 };
const sm01 = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
function headingAt(s, len, pf) {
  if (s <= 0 || s >= len) return 0;
  const env = sm01((s - 40) / 70) * (1 - sm01((s - (len - 140)) / 70));
  const g = pf.g ? clamp(0.5 + 1.3 * Math.sin(s / pf.g), 0, 1) : 1;           // Monza: ada lintasan lurus panjang
  return env * g * (pf.a1 * Math.sin(s / pf.k1 + pf.p1) + pf.a2 * Math.sin(s / pf.k2 + pf.p2));
}
function buildRoad(len, on, pf) {
  ROAD.on = on;
  if (!on) return;
  const n = Math.ceil(len) + 320;
  ROAD.n = n; ROAD.cx = new Float32Array(n); ROAD.psi = new Float32Array(n);
  let x = 0;
  for (let i = 0; i < n; i++) {
    const p = headingAt(i - ROAD.off, len, pf);
    ROAD.psi[i] = p; ROAD.cx[i] = x; x += Math.tan(p);
  }
}
function roadXZ(s, x, o) {      // titik di jalan: s = jarak, x = geser kanan(+)/kiri(-)
  if (!ROAD.on) { o.X = x; o.Z = -s; o.psi = 0; return o; }
  const f = clamp(s + ROAD.off, 0, ROAD.n - 1.001), i = Math.floor(f), u = f - i;
  const psi = ROAD.psi[i] + (ROAD.psi[i + 1] - ROAD.psi[i]) * u;
  const cx = ROAD.cx[i] + (ROAD.cx[i + 1] - ROAD.cx[i]) * u;
  o.psi = psi; o.X = cx + x * Math.cos(psi); o.Z = -s + x * Math.sin(psi);
  return o;
}
function curvAt(s) {
  if (!ROAD.on) return 0;
  const i = clamp(Math.floor(s + ROAD.off), 0, ROAD.n - 2);
  return ROAD.psi[i + 1] - ROAD.psi[i];
}
const _xz = { X: 0, Z: 0, psi: 0 }, _xz2 = { X: 0, Z: 0, psi: 0 };

/* ======================= PIKSEL: DASAR ======================= */
// Gaya pseudo-3D ala OutRun: kanvas beresolusi rendah (tinggi 180 piksel) yang diperbesar tanpa penghalusan,
// jalan digambar baris demi baris, semua benda adalah sprite piksel yang membesar saat mendekat.
const canvas = $('#c');
const ctx = canvas.getContext('2d', { alpha: false });
let VW = 320, VH = 180, HY = 76;
const FOCAL = 100, MAXZ = 230;
const _css = new Map();
function css(h) { let s = _css.get(h); if (!s) { s = '#' + h.toString(16).padStart(6, '0'); _css.set(h, s); } return s; }
function shade(hex, f) {
  const r = clamp(Math.round(((hex >> 16) & 255) * f), 0, 255), g = clamp(Math.round(((hex >> 8) & 255) * f), 0, 255), b = clamp(Math.round((hex & 255) * f), 0, 255);
  return (r << 16) | (g << 8) | b;
}
function mix(a, b, t) {
  if (t <= 0) return a; if (t >= 1) return b;
  const r = Math.round(((a >> 16) & 255) * (1 - t) + ((b >> 16) & 255) * t), g = Math.round(((a >> 8) & 255) * (1 - t) + ((b >> 8) & 255) * t), bl = Math.round((a & 255) * (1 - t) + (b & 255) * t);
  return (r << 16) | (g << 8) | bl;
}
function mk(w, h, fn) { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); fn(g); return { c, w, h }; }
const rc = (g, col, x, y, w, h) => { g.fillStyle = css(col); g.fillRect(x, y, w, h); };

/* huruf piksel 3x5 */
const FONT = {
  '0': ['111', '101', '101', '101', '111'], '1': ['010', '110', '010', '010', '111'],
  '2': ['111', '001', '111', '100', '111'], '3': ['111', '001', '111', '001', '111'],
  '4': ['101', '101', '111', '001', '001'], '5': ['111', '100', '111', '001', '111'],
  '6': ['111', '100', '111', '101', '111'], '7': ['111', '001', '010', '010', '010'],
  '8': ['111', '101', '111', '101', '111'], '9': ['111', '101', '111', '001', '111'],
  'F': ['111', '100', '110', '100', '100'], 'I': ['111', '010', '010', '010', '111'],
  'N': ['101', '111', '111', '111', '101'], 'S': ['111', '100', '111', '001', '111'],
  'H': ['101', '101', '111', '101', '101'],
  'P': ['111', '101', '111', '100', '100'], 'T': ['111', '010', '010', '010', '010'], 'O': ['111', '101', '101', '101', '111'], ' ': ['000', '000', '000', '000', '000'],
};
function pxText(g, str, x, y, cell, color) {
  [...str].forEach((ch, ci) => {
    const gl = FONT[ch]; if (!gl) return;
    for (let r = 0; r < 5; r++) for (let c = 0; c < 3; c++) if (gl[r][c] === '1') rc(g, color, x + (ci * 4 + c) * cell, y + r * cell, cell, cell);
  });
}

/* ---------- sprite mobil (tampak belakang, 32x28, dasar roda di bawah) ---------- */
const DARK = 0x263238, GLASS = 0x9fd8f5, TAIL = 0xff1744;
function drawCarPx(g, sp) {               // gokart tampak belakang (32x28)
  const K = KARTS[sp.m], hex = COLORS[sp.c].hex, dk = shade(hex, 0.72), hl = shade(hex, 1.25), tw = K.tw, th = K.th;
  const ch = sp.drv || { g: 'boy', hat: 0, hs: 0, shirt: 1 };
  const hc = SHIRTS[ch.hat], hst = (hc === 0xfdd835 || hc === 0xff6fa8) ? 0x263238 : 0xffffff, sh = SHIRTS[ch.shirt];
  [0, 32 - tw].forEach((x, i) => {                                           // ban belakang
    rc(g, 0x1b1f22, x, 28 - th, tw, th); rc(g, 0x37474f, i ? x + tw - 1 : x, 28 - th, 1, th);
    rc(g, K.rim, x + Math.floor(tw / 2) - 1, 28 - th + 3, 2, th - 6);
  });
  rc(g, 0x546e7a, tw, 22, 32 - 2 * tw, 2);                                    // as roda
  rc(g, hex, tw + 1, 17, 30 - 2 * tw, 7); rc(g, hl, tw + 1, 17, 30 - 2 * tw, 1); rc(g, dk, tw + 1, 22, 30 - 2 * tw, 2);   // bodi belakang
  if (K.pod >= 1) { rc(g, dk, tw, 14, 3, 9); rc(g, dk, 29 - tw, 14, 3, 9); }
  if (K.pod >= 2) { rc(g, hl, tw, 14, 3, 1); rc(g, hl, 29 - tw, 14, 3, 1); }
  if (K.exh === 0) { rc(g, 0x546e7a, 18, 9, 9, 9); rc(g, 0x4fc3f7, 20, 11, 2, 5); rc(g, 0x4fc3f7, 23, 11, 2, 5); }      // listrik
  else {
    rc(g, 0x455a64, 19, 10, 7, 8); rc(g, 0x78909c, 19, 11, 7, 1); rc(g, 0x78909c, 19, 14, 7, 1);                        // mesin
    const pipe = (x, w) => { rc(g, 0xb0bec5, x, 19, w, 5); rc(g, DARK, x, 23, w, 1); };
    if (K.exh === 1) pipe(21, 3); else if (K.exh === 2) { pipe(12, 3); pipe(21, 3); } else { pipe(10, 3); pipe(15, 3); pipe(21, 4); }
  }
  if (K.bar === 1) rc(g, 0xcfd8dc, 5, 24, 22, 2); else if (K.bar === 2) { rc(g, DARK, 4, 23, 24, 3); rc(g, 0xfdd835, 4, 23, 3, 3); rc(g, 0xfdd835, 25, 23, 3, 3); }
  if (ch.g === 'girl') rc(g, 0x5d3a1a, 12, 6, 8, 6);                          // rambut
  rc(g, sh, 9, 8, 14, 4); rc(g, sh, 7, 10, 3, 6); rc(g, sh, 22, 10, 3, 6);    // bahu & lengan
  if (K.seat === 0) { rc(g, dk, 10, 11, 12, 9); rc(g, shade(dk, 1.25), 10, 11, 12, 1); }
  else if (K.seat === 1) { rc(g, dk, 10, 9, 12, 11); rc(g, shade(dk, 1.25), 12, 8, 8, 2); }
  else { rc(g, dk, 9, 10, 14, 10); rc(g, hl, 8, 12, 2, 6); rc(g, hl, 22, 12, 2, 6); rc(g, shade(dk, 1.25), 11, 9, 10, 2); }
  const num = String(sp.m + 1), pw = num.length * 4 + 1, px = Math.round(16 - pw / 2);        // plat nomor
  rc(g, K.plate, px, 13, pw, 7); pxText(g, num, px + 1, 14, 1, 0x263238);
  rc(g, TAIL, tw + 2, 20, 3, 2); rc(g, TAIL, 27 - tw, 20, 3, 2);
  if (sp.lv === 1) { [11, 20].forEach((x) => rc(g, 0xffffff, x, 11, 1, 13)); rc(g, 0xffffff, 13, 22, 1, 2); rc(g, 0xffffff, 18, 22, 1, 2); }
  else if (sp.lv === 2) { for (let i = 0; i < 8; i++) for (let r = 0; r < 2; r++) rc(g, (i + r) % 2 ? 0x111111 : 0xffffff, 8 + i * 2, 21 + r * 2, 2, 2); }
  else if (sp.lv === 3) {
    [tw + 1, 27 - tw].forEach((x, i) => { rc(g, 0xff9800, x, 18, 4, 6); rc(g, 0xff9800, x + (i ? 1 : 0), 16, 3, 2); rc(g, 0xffeb3b, x + (i ? 1 : 0), 21, 3, 3); });
  }
  if (sp.acc && K.acc === 2) { rc(g, DARK, 9, 2, 1, 10); rc(g, DARK, 22, 2, 1, 10); rc(g, DARK, 9, 2, 14, 1); rc(g, 0xfff176, 11, 0, 2, 2); rc(g, 0xfff176, 19, 0, 2, 2); }
  rc(g, hc, 13, 1, 6, 7); rc(g, shade(hc, 0.72), 13, 7, 6, 1); rc(g, shade(hc, 1.3), 14, 1, 2, 1); rc(g, 0xf2c29b, 15, 8, 2, 1);   // helm
  if (ch.hs === 1) rc(g, hst, 15, 1, 2, 6); else if (ch.hs === 2) { rc(g, hst, 13, 3, 1, 3); rc(g, hst, 18, 3, 1, 3); rc(g, hst, 15, 1, 2, 1); }
  if (sp.acc && K.acc === 0) { rc(g, DARK, 4, 9, 24, 2); rc(g, hl, 4, 9, 24, 1); rc(g, DARK, 4, 7, 2, 6); rc(g, DARK, 26, 7, 2, 6); rc(g, DARK, 11, 11, 2, 3); rc(g, DARK, 19, 11, 2, 3); }
  if (sp.acc && K.acc === 1) { rc(g, DARK, 25, 1, 1, 15); rc(g, 0xff1744, 26, 1, 5, 3); rc(g, 0xffffff, 27, 2, 2, 1); }
  if (sp.acc && K.acc === 3) { rc(g, DARK, 3, 25, 26, 3); rc(g, 0xfdd835, 3, 25, 3, 3); rc(g, 0xfdd835, 26, 25, 3, 3); }
}
const carCache = new Map();
function carSprite(sp) {
  const d = sp.drv;
  const key = [sp.m, sp.c, sp.acc, sp.lv, d ? d.g + d.hat + d.hs + d.shirt : ''].join('|');
  let s = carCache.get(key);
  if (!s) { s = mk(32, 28, (g) => drawCarPx(g, sp)); carCache.set(key, s); }
  return s;
}
/* pembalap tampak depan (untuk lemari / layar awal) */
const bustCache = new Map();
function bustSprite(ch) {
  const key = ch.g + ch.hat + ch.hs + ch.shirt;
  let s = bustCache.get(key);
  if (s) return s;
  s = mk(28, 30, (g) => {
    const hc = SHIRTS[ch.hat], st = (hc === 0xfdd835 || hc === 0xff6fa8) ? 0x263238 : 0xffffff, sh = SHIRTS[ch.shirt], hl = shade(hc, 1.25), dk = shade(hc, 0.72);
    if (ch.g === 'girl') { rc(g, 0x5d3a1a, 4, 14, 4, 12); rc(g, 0x5d3a1a, 20, 14, 4, 12); rc(g, 0x7a4b24, 4, 14, 1, 12); }
    rc(g, sh, 2, 22, 24, 8); rc(g, shade(sh, 1.2), 2, 22, 24, 1); rc(g, shade(sh, 0.8), 2, 28, 24, 2); rc(g, 0xf2c29b, 11, 20, 6, 3);
    rc(g, hc, 6, 3, 16, 17); rc(g, hl, 8, 2, 12, 1); rc(g, hc, 7, 2, 14, 1); rc(g, hl, 8, 4, 2, 3);
    [[6, 3], [21, 3], [6, 19], [21, 19]].forEach(([x, y]) => { g.clearRect(x, y, 1, 1); });
    rc(g, dk, 8, 8, 12, 2);                                   // alis helm
    rc(g, 0xf2c29b, 9, 10, 10, 8);                            // wajah
    rc(g, 0x222222, 11, 12, 2, 2); rc(g, 0x222222, 15, 12, 2, 2); rc(g, 0xd9534f, 12, 16, 4, 1);
    rc(g, dk, 7, 18, 3, 3); rc(g, dk, 18, 18, 3, 3); rc(g, 0x222222, 9, 20, 10, 1);          // pipi & tali dagu
    if (ch.hs === 1) rc(g, st, 13, 2, 2, 6);
    else if (ch.hs === 2) { rc(g, st, 7, 5, 3, 3); rc(g, st, 18, 5, 3, 3); rc(g, st, 13, 3, 2, 2); }
  });
  bustCache.set(key, s);
  return s;
}

/* ---------- sprite pemandangan ---------- */
let SP = null;
function initSprites() {
  if (SP) return;
  const rng = mulberry32(99);
  SP = { tree: [], building: [], umbrella: [] };
  [0x2e7d32, 0x388e3c, 0x43a047].forEach((c) => SP.tree.push(mk(20, 30, (g) => {
    rc(g, 0x6d4c41, 8, 21, 4, 9); rc(g, 0x4e342e, 8, 21, 1, 9);
    rc(g, shade(c, 0.8), 2, 13, 16, 9); rc(g, c, 3, 7, 14, 8); rc(g, shade(c, 1.15), 5, 2, 10, 7);
    rc(g, shade(c, 1.35), 7, 3, 3, 2); rc(g, shade(c, 1.2), 5, 9, 3, 2);
    [[2, 13], [17, 13], [3, 7], [16, 7], [5, 2], [14, 2]].forEach(([x, y]) => g.clearRect(x, y, 1, 1));
  })));
  SP.palm = mk(26, 40, (g) => {
    for (let i = 0; i < 6; i++) { rc(g, i % 2 ? 0x8d6e63 : 0x795548, 12 + (i > 3 ? 1 : 0) + Math.floor(i / 3), 38 - (i + 1) * 5, 3, 5); }
    const tx = 15, ty = 9;
    rc(g, 0x2e7d32, tx - 11, ty, 23, 2); rc(g, 0x388e3c, tx - 9, ty - 2, 19, 2);
    rc(g, 0x2e7d32, tx - 12, ty + 2, 5, 2); rc(g, 0x2e7d32, tx + 8, ty + 2, 5, 2); rc(g, 0x43a047, tx - 6, ty - 4, 13, 2);
    rc(g, 0x388e3c, tx - 4, ty + 2, 9, 2); rc(g, 0x5d4037, tx - 1, ty + 2, 3, 3); rc(g, 0x5d4037, tx + 2, ty + 3, 2, 2);
  });
  SP.bush = mk(14, 9, (g) => { rc(g, 0x558b2f, 1, 3, 12, 6); rc(g, 0x689f38, 3, 0, 8, 5); rc(g, 0x7cb342, 4, 1, 3, 2); g.clearRect(1, 3, 1, 1); g.clearRect(12, 3, 1, 1); });
  SP.house = [0xfff3e0, 0xffe0b2, 0xe1f5fe, 0xf8bbd0].map((w) => mk(30, 26, (g) => {
    rc(g, w, 3, 12, 24, 14); rc(g, shade(w, 0.85), 24, 12, 3, 14);
    rc(g, 0xc62828, 0, 8, 30, 4); rc(g, 0xd32f2f, 3, 4, 24, 4); rc(g, 0xe53935, 7, 0, 16, 4);
    rc(g, 0x5d4037, 12, 19, 6, 7); rc(g, 0x81d4fa, 5, 15, 5, 5); rc(g, 0x81d4fa, 20, 15, 5, 5); rc(g, 0xffffff, 7, 15, 1, 5);
  }));
  SP.hut = mk(22, 18, (g) => {
    rc(g, 0xbcaaa4, 3, 8, 16, 10); rc(g, 0xd7b46a, 0, 5, 22, 3); rc(g, 0xe0c27a, 3, 2, 16, 3); rc(g, 0xefd592, 7, 0, 8, 2);
    rc(g, 0x5d4037, 9, 11, 4, 7); rc(g, 0x81d4fa, 4, 10, 3, 3); rc(g, 0x81d4fa, 15, 10, 3, 3);
  });
  [0xe53935, 0x1e88e5].forEach((c) => SP.umbrella.push(mk(20, 22, (g) => {
    rc(g, 0xeeeeee, 9, 6, 2, 16); rc(g, c, 1, 3, 18, 3); rc(g, 0xffffff, 5, 3, 3, 3); rc(g, 0xffffff, 12, 3, 3, 3); rc(g, c, 4, 1, 12, 2); rc(g, c, 8, 0, 4, 1);
    rc(g, 0xffca28, 12, 20, 8, 2);
  })));
  SP.lamp = mk(10, 30, (g) => { rc(g, 0x546e7a, 7, 4, 2, 26); rc(g, 0x546e7a, 2, 2, 7, 2); rc(g, 0xfff176, 0, 4, 4, 2); rc(g, 0xfffde7, 1, 4, 2, 1); });
  for (let i = 0; i < 8; i++) {
    const w = 18 + Math.floor(rng() * 10), h = 36 + Math.floor(rng() * 36), col = [0x90a4ae, 0xb0bec5, 0x78909c, 0xcfd8dc, 0x8d6e63, 0xa1887f, 0x7986cb, 0x9fa8da][i];
    const sp = mk(w, h, (g) => {
      rc(g, col, 0, 0, w, h); rc(g, shade(col, 0.78), 0, 0, w, 3); rc(g, shade(col, 0.85), w - 3, 3, 3, h - 3); rc(g, shade(col, 1.15), 0, 3, 1, h - 3);
      for (let y = 6; y < h - 9; y += 6) for (let x = 3; x < w - 5; x += 5) rc(g, rng() < 0.55 ? (rng() < 0.7 ? 0xfff59d : 0x90caf9) : 0x37474f, x, y, 3, 3);
      rc(g, 0x37474f, Math.floor(w / 2) - 2, h - 6, 4, 6);
    });
    sp.wu = w * 0.42; SP.building.push(sp);
  }
  SP.fuel = mk(14, 17, (g) => {
    rc(g, 0xb71c1c, 1, 3, 12, 14); rc(g, 0xe53935, 2, 3, 10, 13); rc(g, 0xff7961, 2, 3, 2, 12);
    rc(g, 0xfdd835, 8, 0, 4, 3); rc(g, 0xfdd835, 6, 1, 3, 2); rc(g, 0xffffff, 4, 7, 6, 7); pxText(g, 'F', 5, 8, 1, 0xe53935);
  });
  SP.truck = mk(40, 32, (g) => {
    rc(g, DARK, 3, 22, 6, 10); rc(g, DARK, 31, 22, 6, 10);
    rc(g, 0x546e7a, 2, 14, 36, 10); rc(g, 0x78909c, 2, 14, 36, 2); rc(g, 0xfdd835, 4, 24, 32, 2);
    rc(g, 0xff9800, 10, 2, 20, 12); rc(g, 0xffb74d, 11, 2, 18, 1); rc(g, GLASS, 13, 4, 14, 6);
    rc(g, 0xffeb3b, 17, 0, 6, 2); rc(g, DARK, 19, 12, 2, 12); rc(g, TAIL, 3, 16, 3, 3); rc(g, TAIL, 34, 16, 3, 3);
  });
  SP.arch = mk(84, 42, (g) => {
    rc(g, 0x90a4ae, 2, 10, 3, 32); rc(g, 0x90a4ae, 79, 10, 3, 32);
    rc(g, 0x111111, 0, 2, 84, 18);
    for (let i = 0; i < 42; i++) { rc(g, i % 2 ? 0x111111 : 0xffffff, i * 2, 2, 2, 2); rc(g, i % 2 ? 0xffffff : 0x111111, i * 2, 18, 2, 2); }
    pxText(g, 'FINISH', 19, 6, 2, 0xffffff);
    rc(g, 0xff5252, 3, 0, 8, 2); rc(g, 0xff5252, 73, 0, 8, 2);
  });
  // --- sirkuit ---
  SP.pine = [0x1b5e20, 0x2e7d32].map((c) => mk(14, 36, (g) => {
    rc(g, 0x5d4037, 6, 30, 2, 6);
    for (let t = 0; t < 5; t++) { const w = 4 + t * 2, x = 7 - Math.floor(w / 2), y = 1 + t * 6; rc(g, c, x, y, w, 7); rc(g, shade(c, 1.3), x, y, 1, 7); rc(g, shade(c, 0.75), x + w - 1, y, 1, 7); }
  }));
  SP.cherry = [0xf48fb1, 0xf8bbd0].map((c) => mk(22, 30, (g) => {
    rc(g, 0x6d4c41, 9, 19, 4, 11); rc(g, 0x4e342e, 9, 19, 1, 11);
    rc(g, shade(c, 0.85), 2, 10, 18, 10); rc(g, c, 3, 5, 16, 9); rc(g, shade(c, 1.1), 6, 1, 10, 7);
    [[4, 9], [10, 4], [15, 8], [7, 14], [14, 15], [10, 10]].forEach(([x, y]) => rc(g, 0xffffff, x, y, 2, 2));
    [[2, 10], [19, 10], [3, 5], [18, 5]].forEach(([x, y]) => g.clearRect(x, y, 1, 1));
  }));
  const stand = (roof, base, pal, seed) => { const r = mulberry32(seed); return mk(48, 24, (g) => {
    rc(g, base, 0, 8, 48, 16);
    for (let q = 0; q < 4; q++) { rc(g, shade(base, 0.78), 0, 10 + q * 4, 48, 1); for (let x = 1; x < 46; x += 3) rc(g, pal[Math.floor(r() * pal.length)], x, 8 + q * 4, 2, 3); }
    rc(g, roof, 0, 2, 48, 4); rc(g, shade(roof, 0.75), 0, 5, 48, 1); rc(g, 0x90a4ae, 1, 6, 1, 18); rc(g, 0x90a4ae, 46, 6, 1, 18);
  }); };
  const crowd = [0xe53935, 0xfdd835, 0x1e88e5, 0xf48fb1, 0xffffff, 0x43a047, 0xff9800];
  SP.stand = [stand(0xe53935, 0xcfd8dc, crowd, 1), stand(0x1e88e5, 0xcfd8dc, crowd, 2), stand(0xff9800, 0xb0bec5, crowd, 3), stand(0x6d4c41, 0x8d6e63, crowd, 4)];
  SP.sail = mk(64, 34, (g) => {
    rc(g, 0x78909c, 0, 18, 64, 16);
    const r = mulberry32(8);
    for (let q = 0; q < 3; q++) { rc(g, 0x607d8b, 0, 21 + q * 4, 64, 1); for (let x = 1; x < 62; x += 3) rc(g, crowd[Math.floor(r() * crowd.length)], x, 19 + q * 4, 2, 3); }
    for (let x = 0; x < 64; x++) { const top = Math.round(12 - 10 * Math.sin(Math.PI * x / 63)); rc(g, 0xffffff, x, top, 1, 3); rc(g, 0x1565c0, x, top + 3, 1, 2); }
    rc(g, 0x90a4ae, 2, 14, 1, 20); rc(g, 0x90a4ae, 61, 14, 1, 20);
  });
  SP.board = [[0xe53935, 0xffffff], [0x1e88e5, 0xfdd835], [0x43a047, 0xffffff], [0xff9800, 0x263238]].map(([a, b], k) => mk(16, 11, (g) => {
    rc(g, 0x546e7a, 3, 8, 2, 3); rc(g, 0x546e7a, 11, 8, 2, 3); rc(g, a, 0, 0, 16, 8); rc(g, b, 0, 2, 16, 2);
    const r = mulberry32(20 + k); for (let x = 2; x < 14; x += 3) if (r() < 0.7) rc(g, b, x, 5, 2, 2);
  }));
  SP.wheel = mk(48, 52, (g) => {
    const pal = [0xe53935, 0xfdd835, 0x1e88e5, 0x43a047, 0xff9800, 0xf48fb1];
    for (let a = 0; a < 6.28; a += 0.025) rc(g, 0xeceff1, Math.round(24 + 20 * Math.cos(a)), Math.round(24 + 20 * Math.sin(a)), 2, 2);
    for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; for (let t = 0; t < 20; t += 1) rc(g, 0xcfd8dc, Math.round(24 + t * Math.cos(a)), Math.round(24 + t * Math.sin(a)), 1, 1); }
    for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6; rc(g, pal[k % 6], Math.round(24 + 20 * Math.cos(a)) - 1, Math.round(24 + 20 * Math.sin(a)), 4, 4); }
    for (let t = 0; t <= 1; t += 0.03) { rc(g, 0x90a4ae, Math.round(24 - 14 * t), Math.round(24 + 26 * t), 2, 2); rc(g, 0x90a4ae, Math.round(24 + 14 * t), Math.round(24 + 26 * t), 2, 2); }
    rc(g, 0x546e7a, 6, 50, 36, 2); rc(g, 0xfdd835, 22, 22, 4, 4);
  });
  SP.pitb = mk(96, 28, (g) => {
    rc(g, 0xeceff1, 0, 6, 96, 22); rc(g, 0x546e7a, 0, 3, 96, 3); rc(g, 0xe53935, 0, 6, 96, 2); rc(g, 0xb0bec5, 0, 26, 96, 2);
    const pal = [0xe53935, 0x1e88e5, 0xfdd835, 0x43a047, 0xff9800, 0x8e44ff];
    for (let i = 0; i < 8; i++) { const x = 4 + i * 11; rc(g, 0x37474f, x, 12, 9, 16); rc(g, pal[i % 6], x, 9, 9, 3); rc(g, 0x546e7a, x, 16, 9, 1); rc(g, 0x546e7a, x, 20, 9, 1); }
  });
  SP.flag = [];
  for (let k = 0; k <= 9; k++) SP.flag.push(mk(18, 36, (g) => {
    rc(g, 0x90a4ae, 8, 8, 2, 28); rc(g, 0x263238, 2, 8, 14, 14); rc(g, 0xffffff, 2, 8, 14, 1); rc(g, 0xffffff, 2, 21, 14, 1);
    pxText(g, String(k), 6, 10, 2, 0xffffff); rc(g, 0xff5252, 10, 2, 7, 4); rc(g, 0xffffff, 10, 2, 2, 4); rc(g, 0x90a4ae, 8, 0, 2, 8);
  }));
}

/* ======================= OBJEK MOBIL ======================= */
const CAR = { p: null, a: null, b: null };
const specOf = (i) => { const c = G.cust[i]; return { m: i, c: c.col, acc: c.acc, lv: c.lv, drv: G.char }; };
const mySpec = () => specOf(G.carIdx);
function oppSpecs(rng, pc) {          // dua lawan: warna beda dari pemain & dari satu sama lain
  const cols = shuffle([0, 1, 2, 3].filter((c) => c !== pc), rng);
  return [0, 1].map((i) => ({ m: Math.floor(rng() * NK), c: cols[i], acc: rng() < 0.5 ? 1 : 0, lv: Math.floor(rng() * 4),
    drv: { g: rng() < 0.5 ? 'boy' : 'girl', hat: Math.floor(rng() * 6), hs: Math.floor(rng() * 3), shirt: Math.floor(rng() * 6) } }));
}
function mountCar(which, sp) { CAR[which] = { spec: sp, vis: true, s: 0, x: 0, bob: 0, yaw: 0, boost: false }; }
function placeCar(o, x, s, yaw, bob) { o.x = x; o.s = s; o.yaw = yaw; o.bob = bob; }

/* ======================= DUNIA / LINTASAN ======================= */
let world = null;
const VIEW = { camS: -4.6, camX: -1.1, h: 3.6, shift: 0, carD: 4.6 };
const CV = { s: 0, x: 0, h: 3.6, shift: 0, cx0: 0, tan0: 0, psi: 0 };
let CLK = 0, FDT = 0.016;
function makePerms(N, rng) {
  const perms = [];
  let p = shuffle([0, 1, 2, 3], rng);
  perms.push(p.slice());
  for (let k = 1; k < N; k++) {
    const r = 1 + Math.floor(rng() * 3);
    const prev = p;
    p = prev.map((_, i) => prev[(i + r) % 4]);
    perms.push(p.slice());
  }
  return perms;   // perms[k][lane] = indeks warna jalur itu di segmen k
}

function buildWorld(ti, layout, mode) {
  initSprites();
  const hard = mode !== 'easy', curvy = mode === 'curvy';
  const T = TRACKS[ti], N = T.flags, len = N * SEG;
  buildRoad(len, curvy, T.curve);
  const rng = mulberry32(1337 + ti * 101), items = [];
  const add = (sp, s, x, wu) => items.push({ sp, s, x, wu });
  const end = len + 120, th = T.theme;
  const pick = (a) => a[Math.floor(rng() * a.length)];
  for (let s = 25; s < end - 40; s += 55 + rng() * 30) add(SP.stand[T.stand], s, (rng() < 0.5 ? -1 : 1) * 18, 16);        // tribun
  for (let s = 10; s < end; s += 16 + rng() * 8) add(pick(SP.board), s, ((Math.floor(s / 16) & 1) ? 1 : -1) * 12.8, 6.5);   // papan iklan
  add(SP.pitb, 70, -35, 40);                                                                                              // gedung pit
  if (th === 'sepang') add(SP.sail, 32, 28, 26);
  if (th === 'suzuka') add(SP.wheel, len * 0.5, 54, 15);
  for (let s = -30; s < end; s += 7 + rng() * 5) [-1, 1].forEach((sd) => {
    const x = sd * (14.5 + rng() * 26), r = rng();
    if (th === 'sentul') { if (r < 0.45) add(pick(SP.pine), s, x, 4.6); else if (r < 0.8) add(pick(SP.tree), s, x, 5.2); else add(SP.bush, s, x, 2.8); }
    else if (th === 'suzuka') { if (r < 0.45) add(pick(SP.cherry), s, x, 5.6); else if (r < 0.75) add(pick(SP.tree), s, x, 5.2); else add(SP.bush, s, x, 2.8); }
    else if (th === 'sepang') { if (r < 0.55) add(SP.palm, s, x, 6.2); else if (r < 0.85) add(pick(SP.tree), s, x, 5.2); else add(SP.bush, s, x, 2.8); }
    else if (th === 'monza') { if (r < 0.6) add(pick(SP.pine), s, x, 5.2); else if (r < 0.88) add(pick(SP.tree), s, x, 5.4); else add(SP.bush, s, x, 2.8); }
    else {          // mandalika: laut di kiri, pantai berpalem
      const px = sd < 0 ? -(14.5 + rng() * 7) : x;
      if (r < 0.5) add(SP.palm, s, px, 6.2); else if (r < 0.7) add(SP.umbrella[Math.floor(rng() * 2)], s, px, 4.6); else if (r < 0.82 && sd > 0) add(SP.hut, s, px + 2, 6.2); else add(SP.bush, s, px, 2.8);
    }
  });
  for (let k = 1; k < N; k++) [-1, 1].forEach((sd) => add(SP.flag[k], k * SEG, sd * 9.2, 3.4));
  add(SP.arch, len, 0, 17);
  items.sort((a, b) => a.s - b.s);
  world = { ti, T, N, len, layout, hard, curvy, mode, items, pads: hard ? layout : null, perms: hard ? null : layout };
  bgBuild();
}

/* ---------- latar jauh: gunung / laut / gedung + awan ---------- */
let BG = [], CLOUDS = [];
const BGP = 640, BGH = 64;
function bgBuild() {
  BG = []; CLOUDS = [];
  if (!world) return;
  const th = world.T.theme, rng = mulberry32(55 + world.ti), tau = Math.PI * 2, H = BGH;
  const peak = (g, cx, w, h, body, cap, capH) => {
    for (let y = 0; y < h; y++) { const hw = (w / 2) * (y / h); rc(g, y < capH ? 0xffffff : y < capH + 4 ? 0xdfe6ec : (cap ? body : shade(body, 1.0 + 0.1 * (1 - y / h))), Math.round(cx - hw), H - h + y, Math.max(1, Math.round(hw * 2)), 1); }
  };
  const hills = (g, base, a1, a2, col, top) => {
    for (let x = 0; x < BGP; x++) { const h = Math.round(base + a1 * Math.sin(tau * 3 * x / BGP + 1) + a2 * Math.sin(tau * 7 * x / BGP)); rc(g, col, x, H - h, 1, h); rc(g, top, x, H - h, 1, 1); }
  };
  const pines = (g, c1, c2, hmin, hmax, step) => {
    for (let x = 0; x < BGP - 8; x += step + Math.floor(rng() * 4)) {
      const h = hmin + Math.floor(rng() * (hmax - hmin)), w = 8 + Math.floor(rng() * 4), c = rng() < 0.5 ? c1 : c2;
      for (let y = 0; y < h; y++) { const hw = (w / 2) * (0.25 + 0.75 * y / h); rc(g, c, Math.round(x + w / 2 - hw), H - h + y, Math.max(1, Math.round(hw * 2)), 1); }
    }
  };
  const palms = (g, base, n) => {
    rc(g, 0xf0d9a0, 0, base, BGP, H - base);
    for (let k = 0; k < n; k++) {
      const x = 12 + k * (BGP / n) + Math.floor(rng() * 24), h = 10 + Math.floor(rng() * 8);
      rc(g, 0x6d4c41, x, base - h, 1, h); rc(g, 0x2e7d32, x - 4, base - h - 1, 9, 2); rc(g, 0x388e3c, x - 3, base - h - 3, 7, 2); rc(g, 0x2e7d32, x - 5, base - h + 1, 2, 2); rc(g, 0x2e7d32, x + 4, base - h + 1, 2, 2);
    }
  };
  const sea = (g) => {
    rc(g, 0x4fc3f7, 0, 56, BGP, 8); rc(g, 0x81d4fa, 0, 56, BGP, 1);
    for (let k = 0; k < 4; k++) { const x = 40 + k * 150 + rng() * 60; rc(g, 0x6d4c41, x, 55, 9, 2); rc(g, 0xffffff, x + 4, 46, 1, 9); rc(g, 0xffffff, x + 5, 48, 3, 7); }
  };
  const far = mk(BGP, H, (g) => {
    if (th === 'sentul') { for (let k = 0; k < 5; k++) peak(g, (k + 0.3 + rng() * 0.4) * (BGP / 5), 90 + rng() * 40, 30 + rng() * 22, 0x6a93a8, true, 0); }
    else if (th === 'suzuka') {
      peak(g, 250, 230, 52, 0x7a98b8, false, 14);
      for (let k = 0; k < 4; k++) peak(g, 20 + k * 170 + rng() * 50, 90, 20 + rng() * 10, 0x8fb0c0, true, 0);
    } else if (th === 'sepang') {
      hills(g, 18, 4, 3, 0x80b9aa, 0x9ccdbf);
      [130, 440].forEach((x0) => {
        rc(g, 0xcfd8dc, x0, H - 50, 7, 50); rc(g, 0xb0bec5, x0 + 14, H - 50, 7, 50); rc(g, 0x90a4ae, x0 + 7, H - 28, 7, 2);
        rc(g, 0xcfd8dc, x0 + 2, H - 56, 3, 6); rc(g, 0xb0bec5, x0 + 16, H - 56, 3, 6);
        for (let y = H - 46; y < H - 4; y += 5) { rc(g, 0xffffff, x0 + 1, y, 2, 2); rc(g, 0xffffff, x0 + 15, y, 2, 2); }
      });
    } else if (th === 'monza') {
      for (let k = 0; k < 7; k++) peak(g, (k + 0.4 + rng() * 0.3) * (BGP / 7), 70 + rng() * 40, 34 + rng() * 26, 0x8ea8c3, false, 10);
    } else {           // mandalika: gunung Rinjani + laut
      peak(g, 300, 240, 50, 0x7c6a5a, true, 0); rc(g, 0x3e2f24, 290, H - 50, 20, 3);
      sea(g);
      for (let k = 0; k < 3; k++) { const cx = 90 + k * 200 + rng() * 40, w = 44 + rng() * 30; for (let x = 0; x < w; x++) { const h = Math.round(12 * Math.sin(Math.PI * x / w)); rc(g, 0x5aa469, Math.round(cx - w / 2 + x), 56 - h, 1, h); } }
    }
  });
  const near = mk(BGP, H, (g) => {
    if (th === 'sentul') pines(g, 0x2e7d32, 0x1b5e20, 14, 26, 6);
    else if (th === 'suzuka') { hills(g, 13, 6, 4, 0x4f9d3a, 0x6fbf4b); for (let k = 0; k < 50; k++) rc(g, 0xf8bbd0, Math.floor(rng() * (BGP - 3)), H - 22 + Math.floor(rng() * 10), 3, 3); }
    else if (th === 'sepang') palms(g, 58, 14);
    else if (th === 'monza') pines(g, 0x1b5e20, 0x14451a, 18, 32, 5);
    else palms(g, 60, 9);
  });
  BG = [{ sp: far, par: 0.25 }, { sp: near, par: 0.55 }];
  for (let i = 0; i < 8; i++) {
    const w = 30 + Math.floor(rng() * 36), h = 9 + Math.floor(rng() * 6);
    CLOUDS.push({ x: i * 80 + rng() * 40, y: 4 + rng() * 26, v: 0.5 + rng() * 0.8, sp: mk(w, h, (g) => {
      rc(g, 0xffffff, 3, h - 6, w - 6, 6); rc(g, 0xffffff, 8, h - 9, Math.floor(w * 0.4), 5); rc(g, 0xffffff, Math.floor(w * 0.45), h - 11, Math.floor(w * 0.3), 6); rc(g, 0xe3f2fd, 3, h - 2, w - 6, 2);
      rc(g, 0xffffff, 1, h - 4, w - 2, 3);
    }) });
  }
}

/* ======================= KAMERA / GAMBAR ======================= */
function resize() {
  const a = innerWidth / innerHeight;
  VH = 180; VW = clamp(Math.round(VH * a), 260, 420);
  canvas.width = VW; canvas.height = VH;
  ctx.imageSmoothingEnabled = false;
}
addEventListener('resize', resize);

function camSetup() {
  CV.s = VIEW.camS; CV.x = VIEW.camX; CV.h = VIEW.h;
  const R = G.R, sk = (R && G.state === 'race') ? R.shake : 0, bi = A.boostI || 0;
  CV.shift = VIEW.shift + (Math.random() - 0.5) * (sk * 7 + bi * 1.2);
  HY = Math.round(VH * 0.42) + Math.round((Math.random() - 0.5) * (sk * 6 + bi * 1.6));
  if (ROAD.on) { roadXZ(CV.s, 0, _xz); CV.cx0 = _xz.X; CV.tan0 = Math.tan(_xz.psi); CV.psi = _xz.psi; } else { CV.cx0 = 0; CV.tan0 = 0; CV.psi = 0; }
}
function latAt(s) {       // geser jalan ke samping (piksel dunia) pada jarak s, relatif arah kamera
  if (!ROAD.on) return 0;
  roadXZ(s, 0, _xz2);
  return _xz2.X - CV.cx0 - (s - CV.s) * CV.tan0;
}
function proj(s, x) {
  const z = s - CV.s;
  if (z < 0.7) return null;
  const sc = FOCAL / z;
  return { z, sc, sx: VW / 2 + CV.shift + (latAt(s) + x - CV.x) * sc, sy: HY + CV.h * sc };
}
const rainOf = () => (G.R && (G.state === 'race' || G.state === 'result')) ? G.R.rainLvl : 0;
function skyCols(rain) {
  const sky = mix(world.T.sky, 0x6f7b88, rain * 0.6);
  return { sky, top: shade(sky, 0.74), hz: mix(sky, 0xffffff, 0.4 - rain * 0.2) };
}
function drawStrip(L, par, off, y) {
  const P = L.w, x0 = -((((off * par) % P) + P) % P);
  for (let x = x0; x < VW; x += P) ctx.drawImage(L.c, Math.round(x), y);
}
function drawSky(rain) {
  const c = skyCols(rain), bands = 12, bh = Math.ceil((HY + 2) / bands);
  for (let i = 0; i < bands; i++) { ctx.fillStyle = css(mix(c.top, c.hz, i / (bands - 1))); ctx.fillRect(0, i * bh, VW, bh + 1); }
  const bgx = -CV.psi * 520;
  if (rain < 0.5 && world.T.theme !== 'kota') {                 // matahari
    const sx = Math.round(VW * 0.72 + bgx * 0.1), sy = HY - 34;
    for (let dy = -8; dy <= 8; dy++) { const hw = Math.floor(Math.sqrt(64 - dy * dy)); rc(ctx, 0xfff59d, sx - hw, sy + dy, hw * 2 + 1, 1); }
    rc(ctx, 0xffffff, sx - 3, sy - 3, 3, 2);
  }
  ctx.globalAlpha = 1 - rain * 0.45;
  for (const cl of CLOUDS) {
    const px = ((((cl.x + CLK * 3 * cl.v + bgx * 0.3) % BGP) + BGP) % BGP);
    ctx.drawImage(cl.sp.c, Math.round(px), Math.round(cl.y));
    ctx.drawImage(cl.sp.c, Math.round(px - BGP), Math.round(cl.y));
  }
  ctx.globalAlpha = 1;
  for (const L of BG) drawStrip(L.sp, L.par, bgx, HY + 1 - BGH);
  if (rain > 0.02) { ctx.fillStyle = `rgba(90,100,115,${0.25 * rain})`; ctx.fillRect(0, HY - BGH, VW, BGH + 1); }
}
function drawRoad(rain) {
  const T = world.T, hard = world.hard, N = world.N, len = world.len, HF = CV.h * FOCAL;
  const skyC = skyCols(rain).hz;
  const gA = mix(T.ground, 0x55606b, rain * 0.4), gB = shade(gA, 0.92);
  const asA = mix(0x37474f, 0x242c31, rain * 0.6), asB = shade(asA, 1.12);
  const half = VW / 2 + CV.shift, runC = mix(T.run, 0x55606b, rain * 0.4);
  for (let y = HY + 1; y < VH; y++) {
    const dy = y - HY, z = HF / dy, s = CV.s + z, sc = dy / CV.h;
    const fog = clamp((z - 80) / 160, 0, 0.92);
    const cxp = half + (latAt(s) - CV.x) * sc;
    const R_ = (x0, x1, c, minW) => {
      let a = Math.round(x0), b = Math.round(x1);
      if (minW && b - a < minW) b = a + minW;
      if (b <= 0 || a >= VW) return;
      if (a < 0) a = 0; if (b > VW) b = VW;
      ctx.fillStyle = css(fog > 0.01 ? mix(c, skyC, fog) : c);
      ctx.fillRect(a, y, b - a, 1);
    };
    R_(0, VW, (Math.floor(s / 7) & 1) ? gA : gB);
    if (T.sea) {
      R_(0, cxp - 22.8 * sc, (Math.floor(s / 5) & 1) ? 0x29b6f6 : 0x4fc3f7);
      R_(cxp - 22.8 * sc, cxp - 21.6 * sc, 0xffffff);
    }
    R_(cxp - 11.5 * sc, cxp + 11.5 * sc, (Math.floor(s / 9) & 1) ? runC : shade(runC, 0.94));                       // area aman (run-off)
    const wc = T.wall[Math.floor(s / 2.5) & 1];
    R_(cxp - 11.6 * sc, cxp - 10.8 * sc, wc, 1); R_(cxp + 10.8 * sc, cxp + 11.6 * sc, wc, 1);                         // tembok ban
    const cb = (Math.floor(s / 6) & 1) ? 0xffffff : 0xe53935;
    R_(cxp - 7.5 * sc, cxp - 6.8 * sc, cb, 1); R_(cxp + 6.8 * sc, cxp + 7.5 * sc, cb, 1);
    R_(cxp - 6.8 * sc, cxp + 6.8 * sc, (Math.floor(s / 14) & 1) ? asB : asA);
    if (!hard) {
      if (s >= 0 && s < len) {
        const perm = world.perms[Math.min(N - 1, Math.floor(s / SEG))], alt = (Math.floor(s / 5) & 1) ? 1 : 0.93;
        for (let l = 0; l < 4; l++) R_(cxp + (LANE_X[l] - 1.42) * sc, cxp + (LANE_X[l] + 1.42) * sc, shade(COLORS[perm[l]].hex, alt), 1);
      }
      if ((Math.floor(s / 8) & 1) === 0) [-3, 0, 3].forEach((x) => R_(cxp + (x - 0.1) * sc, cxp + (x + 0.1) * sc, 0xffffff, 1));
    } else {
      for (const pd of world.pads) {
        if (s < pd.s0) break;
        if (s > pd.s1) continue;
        const cc = COLORS[pd.color].hex, xa = cxp + (pd.x - PAD_W / 2) * sc, xb = cxp + (pd.x + PAD_W / 2) * sc;
        R_(xa, xb, (Math.floor((s - pd.s0) / 3) & 1) ? shade(cc, 1.22) : cc, 1);
        R_(xa, xa + 0.2 * sc, 0xffffff, 1); R_(xb - 0.2 * sc, xb, 0xffffff, 1);
      }
    }
    // garis start, tiap bendera, dan finish
    const sLo = CV.s + HF / (dy + 0.5), sUp = CV.s + HF / Math.max(0.5, dy - 0.5), kk = Math.floor(sUp / SEG);
    if (kk >= 0 && kk <= N && (sUp - kk * SEG < 0.8 || Math.floor(sLo / SEG) < kk)) {
      if (kk === N) {
        const rr = Math.floor((sUp - kk * SEG) / 0.5);
        for (let i = -7; i < 7; i++) R_(cxp + i * sc, cxp + (i + 1) * sc, ((i + rr) & 1) ? 0x111111 : 0xffffff, 1);
      } else R_(cxp - 6.8 * sc, cxp + 6.8 * sc, 0xffffff, 1);
    }
  }
}

/* ---------- sprite: urut dari jauh ke dekat ---------- */
const DR = [];
function drawSpr(sp, wu, s, x, lift, fogK) {
  const p = proj(s, x); if (!p) return null;
  const dw = Math.round(wu * p.sc);
  if (dw < 2) return p;
  const dh = Math.round(dw * sp.h / sp.w);
  const px = Math.round(p.sx - dw / 2);
  if (px > VW || px + dw < 0) return p;
  const a = clamp(1 - (p.z - 110) / 120, 0.05, 1);
  if (a < 1) ctx.globalAlpha = a;
  ctx.drawImage(sp.c, px, Math.round(p.sy - dh - (lift || 0) * p.sc), dw, dh);
  if (a < 1) ctx.globalAlpha = 1;
  return p;
}
function drawCarObj(o, boostFx) {
  const sp = carSprite(o.spec), p = proj(o.s, o.x); if (!p) return;
  const dw = Math.round(2.4 * p.sc); if (dw < 2) return;
  const dh = Math.round(dw * sp.h / sp.w), bob = Math.round(o.bob * p.sc * 1.5);
  const px = Math.round(p.sx - dw / 2), py = Math.round(p.sy - dh - bob);
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(Math.round(px - dw * 0.04), Math.round(p.sy - dh * 0.1), Math.round(dw * 1.08), Math.max(1, Math.round(dh * 0.16)));
  if (o.boost && dw > 8) {                          // api knalpot
    const f = 0.5 + Math.random() * 0.6, fw = Math.max(1, Math.round(dw * 0.08)), fh = Math.max(1, Math.round(dh * 0.3 * f));
    [0.22, 0.72].forEach((k) => { ctx.fillStyle = '#ff9800'; ctx.fillRect(Math.round(px + dw * k), py + dh - 1, fw * 2, fh); ctx.fillStyle = '#ffeb3b'; ctx.fillRect(Math.round(px + dw * k) + 1, py + dh - 1, Math.max(1, fw), Math.max(1, fh - 1)); });
  }
  const sway = Math.round((o.yaw || 0) * -dw * 0.25);
  ctx.drawImage(sp.c, px + sway, py, dw, dh);
}
function drawSprites(R, live) {
  DR.length = 0;
  const s0 = CV.s + 0.8, s1 = CV.s + MAXZ, it = world.items;
  let lo = 0, hi = it.length;
  while (lo < hi) { const m = (lo + hi) >> 1; if (it[m].s < s0) lo = m + 1; else hi = m; }
  for (let i = lo; i < it.length && it[i].s <= s1; i++) DR.push({ z: it[i].s - CV.s, k: 0, o: it[i] });
  [CAR.p, CAR.a, CAR.b].forEach((o) => { if (o && o.vis && o.s - CV.s > 0.8) DR.push({ z: o.s - CV.s - 0.01, k: 1, o }); });
  if (live && R) {
    for (const c of R.coinList) if (!c.got && c.s > s0 && c.s < s1) DR.push({ z: c.s - CV.s, k: 2, o: c });
    if (R.truck && R.truck.vis) DR.push({ z: R.truck.s - CV.s, k: 3, o: R.truck });
    for (const q of R.parts) if (q.life > 0) { const s = q.owner.s - q.back; if (s > s0) DR.push({ z: s - CV.s, k: 4, o: q, s }); }
  }
  DR.sort((a, b) => b.z - a.z);
  for (const d of DR) {
    const o = d.o;
    if (d.k === 0) drawSpr(o.sp, o.wu, o.s, o.x);
    else if (d.k === 1) drawCarObj(o);
    else if (d.k === 2) {
      if (o.kind === 'fuel') drawSpr(SP.fuel, 1.9, o.s, o.x, 0.6 + Math.sin(CLK * 5) * 0.12);
      else {
        const p = proj(o.s, o.x); if (!p) continue;
        const h = Math.max(2, Math.round(1.1 * p.sc)), w = Math.max(2, Math.round(h * (0.3 + 0.7 * Math.abs(Math.cos(o.rot))))), cy = Math.round(p.sy - 1.5 * p.sc);
        ctx.fillStyle = '#b8860b'; ctx.fillRect(Math.round(p.sx - w / 2) - 1, cy - 1, w + 2, h + 2);
        ctx.fillStyle = '#ffd600'; ctx.fillRect(Math.round(p.sx - w / 2), cy, w, h);
        if (w > 2) { ctx.fillStyle = '#fff59d'; ctx.fillRect(Math.round(p.sx - w / 2) + 1, cy + 1, 1, Math.max(1, h - 2)); }
      }
    } else if (d.k === 3) drawSpr(SP.truck, 3.3, o.s, o.x);
    else if (d.k === 4) {
      const p = proj(d.s, o.owner.x + o.ox); if (!p || p.z < 2) continue;
      const k = Math.max(0, o.life / o.max), sz = Math.min(9, Math.max(1, Math.round((0.18 + 0.7 * k) * p.sc)));
      ctx.fillStyle = o.col; ctx.fillRect(Math.round(p.sx - sz / 2), Math.round(p.sy - (0.4 + o.h) * p.sc - sz), sz, sz);
    }
  }
}
const DROPS = Array.from({ length: 110 }, () => ({ x: Math.random() * 500, y: Math.random() * 200 }));
function drawRain(rain) {
  if (rain < 0.03) return;
  ctx.fillStyle = `rgba(35,45,65,${0.2 * rain})`; ctx.fillRect(0, 0, VW, VH);
  const n = Math.floor(DROPS.length * rain);
  ctx.fillStyle = `rgba(215,235,255,${0.55 + 0.3 * rain})`;
  for (let i = 0; i < n; i++) {
    const d = DROPS[i];
    d.y += 300 * FDT; d.x -= 50 * FDT;
    if (d.y > VH) { d.y = -6; d.x = Math.random() * (VW + 60); }
    if (d.x < -4) d.x += VW + 60;
    ctx.fillRect(Math.round(d.x), Math.round(d.y), 1, 4);
  }
}
function drawRoadScene() {
  camSetup();
  const rain = rainOf(), live = G.state === 'race' || G.state === 'result';
  drawSky(rain);
  drawRoad(rain);
  drawSprites(G.R, live);
  drawRain(rain);
}

/* ---------- ruang pamer (garasi / lemari / pembalap) ---------- */
let freeL = 0.62, freeT = 0;
function freeArea() {       // bagian layar di kanan panel (0..1) supaya mobil / pembalap tidak tertutup
  if (CLK - freeT < 0.4) return;
  freeT = CLK;
  const p = document.querySelector('.ov.side.show .panel');
  freeL = p ? clamp(p.getBoundingClientRect().right / innerWidth, 0.3, 0.9) : 0.55;
}
function drawShow(kind) {
  freeArea();
  const fy = Math.round(VH * 0.6), cxs = Math.round(VW * (freeL + (1 - freeL) / 2 + 0.01)), fw = VW * (1 - freeL) * 0.92;
  for (let i = 0; i < 14; i++) { ctx.fillStyle = css(mix(0x251d4a, 0x6a4fb3, i / 13)); ctx.fillRect(0, Math.round(i * fy / 14), VW, Math.ceil(fy / 14) + 1); }
  for (let i = 0; i < 26; i++) {                                           // lampu kecil berkedip di dinding
    const x = (i * 97) % VW, y = ((i * 53) % (fy - 10)) + 4, on = (Math.floor(CLK * 2 + i) % 3) !== 0;
    ctx.fillStyle = on ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.15)'; ctx.fillRect(x, y, 1, 1);
  }
  const vy = fy - 34, HF2 = 3 * FOCAL;
  for (let y = fy; y < VH; y++) {
    const dy = y - vy, z = HF2 / dy, sc = dy / 3;
    const row = Math.floor(z / 2.2);
    for (let i = -16; i < 16; i++) {
      const x0 = cxs + (i * 2.2) * sc, x1 = cxs + ((i + 1) * 2.2) * sc;
      if (x1 < 0 || x0 > VW) continue;
      ctx.fillStyle = ((i + row) & 1) ? '#392e6c' : '#2d2458';
      ctx.fillRect(Math.round(x0), y, Math.round(x1) - Math.round(x0), 1);
    }
  }
  ctx.fillStyle = 'rgba(255,255,255,0.10)';                                // lingkaran cahaya
  for (let i = 0; i < 5; i++) { const w = 150 - i * 22, h = 22 - i * 3; ctx.fillRect(cxs - w / 2, fy + 36 - i * 2, w, Math.max(1, h * 0.5)); }
  if (kind === 'custom') {                                                 // suasana pit stop: papan, lampu, tumpukan ban
    const bw = 74, bx = Math.round(cxs - bw / 2), by = 25;
    rc(ctx, 0x263238, bx, by, bw, 16); rc(ctx, 0xfdd835, bx, by, bw, 1); rc(ctx, 0xfdd835, bx, by + 15, bw, 1);
    pxText(ctx, 'PIT STOP', bx + 6, by + 3, 2, 0xfdd835);
    for (let i = 0; i < 4; i++) rc(ctx, (Math.floor(CLK * 3) + i) % 2 ? 0xff5252 : 0x7a2a2a, bx + 6 + i * 20, by + 13, 6, 1);
    [Math.round(freeL * VW) + 6, VW - 30].forEach((x) => { for (let t = 0; t < 3; t++) { const y = fy + 30 - t * 7; rc(ctx, 0x1b1f22, x, y, 24, 7); rc(ctx, 0x37474f, x, y, 24, 1); rc(ctx, 0xffffff, x + 3, y + 3, 18, 1); } });
  }
  const bob = Math.round(Math.sin(CLK * 3) * 1);
  if (kind === 'custom') {
    const sp = carSprite(CAR.p.spec), k = clamp(Math.floor(fw / sp.w), 2, Math.floor(VH * 0.7 / sp.h)), sway = Math.round(Math.sin(CLK * 0.9) * 6);
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(cxs - sp.w * k * 0.55 + sway, fy + 40, sp.w * k * 1.1, 6);
    ctx.drawImage(sp.c, Math.round(cxs - sp.w * k / 2 + sway), Math.round(fy + 44 - sp.h * k + bob * 2), sp.w * k, sp.h * k);
  } else {
    const sp = bustSprite(G.char), k = clamp(Math.floor(fw / sp.w), 2, Math.floor(VH * 0.74 / sp.h));
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(cxs - sp.w * k * 0.5, VH - 14, sp.w * k, 6);
    ctx.drawImage(sp.c, Math.round(cxs - sp.w * k / 2), Math.round(VH - 10 - sp.h * k + bob * 2), sp.w * k, sp.h * k);
  }
}
function renderFrame(dt) {
  FDT = dt;
  const st = G.state;
  if (st === 'custom' || st === 'wardrobe' || st === 'hero') drawShow(st); else drawRoadScene();
}

/* ======================= UI (standar EZUI dari Ezventure) ======================= */
const SCREEN_IDS = { menu: 'scr-menu', diff: 'scr-diff', track: 'scr-track', custom: 'scr-custom', wardrobe: 'scr-wardrobe', hero: 'scr-hero', pit: 'scr-pit', result: 'scr-result' };
function showScreen(name) {
  Object.entries(SCREEN_IDS).forEach(([k, id]) => EZUI.show(id, k === name));
  $('#hud').classList.toggle('on', name === 'hud');
  $('#btn-set').hidden = name === 'hud';
  $('#sys').hidden = name === 'none';
  EZUI.hide('scr-set');
}
let toastTimer = 0;
function toast(text, ms = 1300) {
  const t = $('#toast'); t.textContent = text; t.classList.add('on');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('on'), ms);
}
let countTimer = 0;
function showCount(text, ms = 0) {
  const c = $('#count'); c.textContent = text; c.classList.remove('on'); void c.offsetWidth; c.classList.add('on');
  clearTimeout(countTimer);
  if (ms) countTimer = setTimeout(() => c.classList.remove('on'), ms);
}
function clearOverlays() {
  clearTimeout(toastTimer); clearTimeout(countTimer);
  $('#toast').classList.remove('on'); $('#count').classList.remove('on');
}
function syncSet() {
  $('#set-music').classList.toggle('off', G.musicOff); $('#set-music').textContent = G.musicOff ? '🎵 Musik: mati' : '🎵 Musik: nyala';
  $('#set-sound').classList.toggle('off', G.mute); $('#set-sound').textContent = G.mute ? '🔇 Suara: mati' : '🔊 Suara: nyala';
  $('#set-level').innerHTML = [[1, '🚩', 'Bendera'], [2, '🖐️', 'Jari'], [3, '🎲', 'Dadu']].map(([v, e, l]) => _menuCard(G.level === v, v, e, l, '')).join('');
  $('#set-delchar').textContent = confirmKey === 'char' ? '❓ Yakin? Ketuk lagi' : '🗑️ Hapus karakter';
  $('#set-reset').textContent = confirmKey === 'all' ? '❓ Yakin? Ketuk lagi' : '🧹 Mulai dari awal';
}
let confirmKey = '';
function syncSys() {
  $('#btn-mute').textContent = G.mute ? '🔇' : '🔊';
  $('#btn-mute').classList.toggle('off', G.mute);
  $('#btn-music').classList.toggle('off', G.musicOff);
}

/* ---- efek visual ngebut dan boost ---- */
function boostFx(on) { $('#fx').classList.toggle('on', on); }
function boostBurst(ci) {
  sfx.boost();
  const f = $('#flash'); f.style.background = COLORS[ci].css; f.classList.remove('go'); void f.offsetWidth; f.classList.add('go');
  const b = $('#boosttxt'); b.classList.remove('go'); void b.offsetWidth; b.classList.add('go');
}

/* ikon gokart (SVG, tampak samping) — model, warna, aksesori, livery ikut berubah */
function carSvg(m, ci, acc, lv) {
  const K = KARTS[m], hx = COLORS[ci].hex, col = COLORS[ci].css, dkc = css(shade(hx, 0.72)), W = '#fff', DK = '#263238', S = 'stroke="#2b2350" stroke-width="2" stroke-linejoin="round"';
  const r = (x, y, w, h, f, ex = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}" ${S} ${ex}/>`;
  const rim = css(K.rim), tr = 12 + (K.tw - 5) * 2, helm = css(SHIRTS[G.char.hat]);
  let o = '';
  o += r(1, 17, K.exh === 0 ? 9 : 7, 8, K.exh === 0 ? '#4fc3f7' : '#78909c');                         // mesin / baterai
  if (K.exh >= 2) o += r(0, 25, 4, 3, '#b0bec5');
  if (K.exh === 1 || K.exh === 3) o += r(0, 22, 4, 3, '#b0bec5');
  o += r(9, 21, 40, 7, col) + r(42, 17, 12, 8, col);                                                   // lantai & hidung
  if (K.pod) o += r(22, 19, 14, 4, dkc);
  if (K.seat === 0) o += r(14, 13, 10, 10, dkc); else if (K.seat === 1) o += r(13, 9, 10, 14, dkc); else o += r(12, 11, 13, 12, dkc) + r(11, 15, 3, 7, col);
  o += `<circle cx="19" cy="6" r="5.5" fill="${helm}" ${S}/><rect x="21" y="5" width="5" height="3" fill="#9fd8f5"/>`;     // pembalap
  o += `<path d="M33 22 L37 11" stroke="${DK}" stroke-width="3" stroke-linecap="round"/><rect x="33" y="8" width="8" height="3" rx="1.5" fill="${DK}"/>`;
  o += `<rect x="16" y="15" width="6" height="5" fill="${css(K.plate)}" stroke="#2b2350" stroke-width="1"/>`;
  if (K.bar === 1) o += r(51, 19, 4, 9, '#cfd8dc'); else if (K.bar === 2) o += r(51, 19, 4, 9, DK) + `<rect x="51" y="19" width="4" height="3" fill="#fdd835"/>`;
  o += r(4, 26 - tr / 2, tr * 0.8, tr, DK, 'rx="3"') + `<rect x="${4 + tr * 0.4 - 1}" y="${26 - tr / 2 + 3}" width="2" height="${tr - 6}" fill="${rim}"/>`;      // ban belakang
  o += r(41, 20, 11, 9, DK, 'rx="3"') + `<rect x="45" y="22" width="2" height="5" fill="${rim}"/>`;                                          // ban depan
  if (lv === 1) o += `<rect x="11" y="23" width="38" height="2" fill="${W}"/>`;
  else if (lv === 2) for (let i = 0; i < 8; i++) o += `<rect x="${12 + i * 4.5}" y="22" width="4.5" height="4.5" fill="${i % 2 ? '#111' : W}"/>`;
  else if (lv === 3) o += `<polygon points="10,28 10,19 24,28" fill="#ff9800"/><polygon points="10,28 10,23 18,28" fill="#ffeb3b"/>`;
  if (acc) {
    if (K.acc === 0) o += r(0, 5, 14, 3, DK) + r(6, 8, 3, 8, DK);
    else if (K.acc === 1) o += `<path d="M7 17 V0" stroke="${DK}" stroke-width="2"/><polygon points="7,0 16,3 7,6" fill="#ff1744"/>`;
    else if (K.acc === 2) o += `<path d="M13 12 V3 H25" stroke="${DK}" stroke-width="2" fill="none"/>` + r(15, -2, 4, 3, '#fff176') + r(21, -2, 4, 3, '#fff176');
    else o += r(52, 17, 4, 11, '#fdd835') + r(0, 27, 6, 4, '#fdd835');
  }
  return `<svg class="ci" viewBox="-2 -4 60 36" aria-hidden="true">${o}</svg>`;
}
function helmSvg(ci, st) {
  const c = '#' + SHIRTS[ci].toString(16).padStart(6, '0'), S = 'stroke="#2b2350" stroke-width="2" stroke-linejoin="round"';
  const sc = (ci === 2 || ci === 4) ? '#263238' : '#fff';
  let o = `<path d="M5 28 A15 17 0 0 1 35 28 Z" fill="${c}" ${S}/><rect x="20" y="19" width="16" height="9" rx="2" fill="#9fd8f5" ${S}/>`;
  if (st === 1) o += `<rect x="17" y="6" width="4" height="13" fill="${sc}"/>`;
  else if (st === 2) o += `<circle cx="11" cy="21" r="2.5" fill="${sc}"/><circle cx="17" cy="14" r="2.5" fill="${sc}"/><circle cx="12" cy="14" r="2" fill="${sc}"/>`;
  return `<svg class="ci" viewBox="0 0 40 32" aria-hidden="true" style="max-width:44px">${o}</svg>`;
}
const diceHtml = (n) => {
  const on = { 1: [5], 2: [1, 9], 3: [1, 5, 9], 4: [1, 3, 7, 9], 5: [1, 3, 5, 7, 9], 6: [1, 3, 4, 6, 7, 9] }[n];
  return `<span class="die">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((c) => `<i class="${on.includes(c) ? 'on' : ''}"></i>`).join('')}</span>`;
};
function clueHtml(N) {
  if (G.level === 2) {            // jari: ✋ = 5
    const rest = N % 5, one = ['', '☝️', '✌️', '🤟', '🖖'][rest];
    return `<div class="flags">${N >= 5 ? '✋' : ''}${one}</div>`;
  }
  if (G.level === 3) return `<div class="dice">${N > 6 ? diceHtml(6) + diceHtml(N - 6) : diceHtml(N)}</div>`;
  return `<div class="flags">${'🚩'.repeat(N)}</div>`;
}

let _menuCard = (sel, i, e, label, small, cls = '') =>
  `<button class="ccard ${cls} ${sel ? 'sel' : ''}" data-i="${i}"><span class="e">${e}</span>${label}${small ? `<small>${small}</small>` : ''}</button>`;
function renderMenu() {
  $('#menu-coins').textContent = G.coins;
  $('#home-title').textContent = 'Selamat datang, ' + (G.name || 'Pembalap') + '!';
  const card = _menuCard;
  $('#menu-cars').innerHTML = CARS.map((c, i) => {
    const cu = G.cust[i], icon = carSvg(i, cu.col, cu.acc, cu.lv);
    if (G.owned[i]) return `<button class="ccard car ${i === G.carIdx ? 'sel' : ''}" data-i="${i}" aria-label="${c.name}">${icon}</button>`;
    const buy = G.buying === i;
    return `<button class="ccard car lock ${buy ? 'buy' : ''}" data-i="${i}" aria-label="${c.name}">${icon}<span class="lk">${buy ? '✔' : '🔒'}</span><small>🪙 ${CAR_PRICE[i]}</small></button>`;
  }).join('');
  $('#menu-tracks').innerHTML = TRACKS.map((t, i) => card(i === G.trackIdx, i, t.emoji, t.name, t.len)).join('');
  $('#menu-diffs').innerHTML = [['easy', '😊', 'Mudah', 'ikuti jalur'], ['hard', '🔥', 'Normal', 'setir bebas'], ['curvy', '🌪️', 'Sulit', 'berbelok']]
    .map(([v, e, l, sm]) => card(G.diff === v, v, e, l, sm)).join('');
  $('#cu-coins').textContent = G.coins;
}
function renderCustom() {
  const c = G.cust[G.carIdx], card = _menuCard;
  $('#cu-g').innerHTML = [['boy', '👦', 'Cowok'], ['girl', '👧', 'Cewek']].map(([v, e, l]) => card(G.char.g === v, v, e, l, '', 'big')).join('');
  $('#cu-hat').innerHTML = [0, 1, 2, 3, 4, 5].map((i) => `<button class="swb ${G.char.hat === i ? 'sel' : ''}" data-i="${i}" style="background:#${SHIRTS[i].toString(16).padStart(6, '0')}" aria-label="warna helm"></button>`).join('');
  $('#cu-hs').innerHTML = [0, 1, 2].map((i) => `<button class="ccard car ${G.char.hs === i ? 'sel' : ''}" data-i="${i}">${helmSvg(G.char.hat, i)}</button>`).join('');
  const sw = (cur, arr) => arr.map((h, i) => `<button class="swb ${cur === i ? 'sel' : ''}" data-i="${i}" style="background:#${h.toString(16).padStart(6, '0')}" aria-label="warna"></button>`).join('');
  $('#cu-shirt').innerHTML = sw(G.char.shirt, SHIRTS);
  $('#cu-col').innerHTML = sw(c.col, COLORS.map((x) => x.hex));
  $('#cu-acc').innerHTML = [0, 1].map((v) => `<button class="ccard car ${c.acc === v ? 'sel' : ''}" data-i="${v}">${carSvg(G.carIdx, c.col, v, c.lv)}${v ? `<small>${ACC_ICON[KARTS[G.carIdx].acc]}</small>` : ''}</button>`).join('');
  $('#cu-lv').innerHTML = [0, 1, 2, 3].map((v) => `<button class="ccard car ${c.lv === v ? 'sel' : ''}" data-i="${v}">${carSvg(G.carIdx, c.col, c.acc, v)}</button>`).join('');
}
function renderPit() {
  const R = G.R, N = R.N;
  $('#pit-info').innerHTML = `${clueHtml(N)}<p>Berapa kotak bensinnya?</p>`;
  const slots = [];
  for (let i = 0; i < TANK_MAX; i++) slots.push(`<button class="slot ${i < G.fill ? 'full' : ''}" data-i="${i}" aria-label="kotak ${i + 1}"></button>`);
  $('#pit-tank').innerHTML = slots.join('');
  $('#pit-count').textContent = '⛽';
  const cost = G.fill * FUEL_PRICE;
  $('#pit-cost').textContent = G.fill ? '🪙'.repeat(cost) : 'Isi bensinnya dulu ya!';
  $('#btn-pay').disabled = G.fill < 1;
  $('#btn-plus').disabled = G.fill >= TANK_MAX;
  $('#btn-minus').disabled = G.fill <= 0;
}
function pitSet(n) {
  n = clamp(n, 0, TANK_MAX);
  const afford = Math.floor(G.coins / FUEL_PRICE);
  if (n > afford) {
    n = afford;
    const w = $('#pit-cost'); w.classList.remove('shake'); void w.offsetWidth; w.classList.add('shake');
    toast('Uangmu kurang! 🪙', 900); sfx.lose();
  }
  if (n !== G.fill) { G.fill = n; sfx.tick(); if (n > 0) speak(NUM_WORDS[n]); }
  renderPit();
}

function buildHud() {
  const R = G.R;
  $('#h-ticks').innerHTML = Array.from({ length: R.N }, (_, i) => `<i style="left:${((i + 1) / R.N) * 100}%">🚩</i>`).join('');
  $('#h-pm').style.background = COLORS[R.p.color].css;
  $('#h-am').style.background = COLORS[R.bots[0].color].css;
  $('#h-bm').style.background = COLORS[R.bots[1].color].css;
  $('#h-sw').style.background = COLORS[R.p.color].css;
  $('#h-hintx').textContent = R.hard ? 'Lewati petak warna ini = BOOST! 🔥' : 'Jalur warna ini = BOOST! 🔥';
  $('#h-fuel').innerHTML = Array.from({ length: R.F }, () => '<div class="fs"><i></i></div>').join('');
  $('#fx').style.setProperty('--glow', COLORS[R.p.color].css + 'cc');
  R.hudRem = -1;
}
function updateHud() {
  const R = G.R, p = R.p;
  $('#h-pm').style.left = (clamp(p.s / R.len, 0, 1) * 100) + '%';
  $('#h-am').style.left = (clamp(R.bots[0].s / R.len, 0, 1) * 100) + '%';
  $('#h-bm').style.left = (clamp(R.bots[1].s / R.len, 0, 1) * 100) + '%';
  const pos = 1 + R.bots.filter((q) => q.s > p.s).length;
  if (R.hudPos !== pos) { R.hudPos = pos; $('#h-pos').textContent = pos + '/3'; }
  const rem = Math.max(0, R.F - p.s / SEG);
  if (Math.abs(rem - R.hudRem) > 0.02) {
    R.hudRem = rem;
    const fs = $('#h-fuel').children;
    for (let i = 0; i < fs.length; i++) fs[i].firstChild.style.height = (clamp(rem - i, 0, 1) * 100) + '%';
  }
}

/* ======================= INPUT ======================= */
const IN = { left: false, right: false, drag: 0 };
const inputAxis = () => clamp((IN.right ? 1 : 0) - (IN.left ? 1 : 0) + IN.drag, -1, 1);
function resetInput() {
  IN.left = IN.right = false; IN.drag = 0;
  $('#btn-left').classList.remove('hold'); $('#btn-right').classList.remove('hold');
}
function steer(d) {                    // mode Mudah: pindah satu jalur
  if (G.state !== 'race') return;
  const R = G.R;
  if (R.phase === 'go' || R.phase === 'tow') {
    const nl = clamp(R.p.lane + d, 0, 3);
    if (nl !== R.p.lane) { R.p.lane = nl; sfx.swoosh(); }
  }
}
function press(dir, on) {              // mode Sulit: tahan tombol = setir terus
  const R = G.R;
  if (G.state === 'race' && R && R.hard) {
    if (dir < 0) IN.left = on; else IN.right = on;
    $(dir < 0 ? '#btn-left' : '#btn-right').classList.toggle('hold', on);
  } else if (on) steer(dir);
}

/* ======================= BALAPAN ======================= */
function makePads(N, rng, pc, ac, bc) {
  const pads = [];
  let lastX = 0;
  for (let k = 0; k < N; k++) {
    const cols = shuffle([pc, ac, bc], rng);   // tiap segmen: warna pemain + dua lawan
    for (let j = 0; j < 3; j++) {
      let x, tries = 0;
      do { x = (rng() * 2 - 1) * 4.2; tries++; } while (Math.abs(x - lastX) < 2.6 && tries < 20);
      lastX = x;
      const s0 = k * SEG + 4 + j * 32;
      pads.push({ s0, s1: s0 + PAD_LEN, x, color: cols[j] });
    }
  }
  return pads;
}
function padUnder(R, s, x, color) {
  for (const pd of R.pads) {
    if (s < pd.s0) break;
    if (s <= pd.s1 && pd.color === color && Math.abs(x - pd.x) <= PAD_W / 2 + 0.2) return true;
  }
  return false;
}
function nextPad(R, s, color, ahead) {
  for (const pd of R.pads) {
    if (pd.s1 < s) continue;
    if (pd.s0 > s + ahead) break;
    if (pd.color === color) return pd;
  }
  return null;
}
function previewLayout() {
  const T = TRACKS[G.trackIdx], rng = mulberry32(7 + G.trackIdx);
  if (G.diff === 'easy') return makePerms(T.flags, rng);
  const o = oppSpecs(mulberry32(5), G.cust[G.carIdx].col);
  return makePads(T.flags, rng, G.cust[G.carIdx].col, o[0].c, o[1].c);
}
function mountPreview() {
  const sp = specOf(G.buying >= 0 ? G.buying : G.carIdx);      // mobil yang belum dibeli ikut dipratinjau
  const o = oppSpecs(mulberry32(5), sp.c);
  mountCar('p', sp); mountCar('a', o[0]); mountCar('b', o[1]);
}

function prepareRace() {
  const T = TRACKS[G.trackIdx];
  const rng = mulberry32((Math.random() * 2147483647) | 0);
  const hard = G.diff !== 'easy', curvy = G.diff === 'curvy';
  const my = mySpec(), opp = oppSpecs(rng, my.c);
  const perms = makePerms(T.flags, rng);
  const pads = hard ? makePads(T.flags, rng, my.c, opp[0].c, opp[1].c) : null;
  if (hard) { pads[0].color = my.c; pads[0].x = LANE_X[1]; }      // petak pertama pas di depan mobil pemain
  buildWorld(G.trackIdx, hard ? pads : perms, G.diff);
  mountCar('p', my); mountCar('a', opp[0]); mountCar('b', opp[1]);
  const bot = (sp, obj, lane, skill, base, timer) => ({ s: 0, lane, x: LANE_X[lane], vx: 0, speed: 0, boost: false, boostT: 0, tx: LANE_X[lane], color: sp.c, obj, timer, finished: false, skill, base });
  const R = {
    N: T.flags, len: T.flags * SEG, hard, curvy, perms, pads, rng, F: 0, t: 0, cd: 3.2, lastN: 4, phase: 'wait',
    p: { s: 0, lane: 1, x: LANE_X[1], vx: 0, speed: 0, boost: false, boostT: 0, color: my.c, obj: CAR.p },
    bots: [bot(opp[0], CAR.a, 2, AI_SKILL, AI_BASE, 0.6), bot(opp[1], CAR.b, 0, AI_SKILL - 0.1, AI_BASE - 0.4, 0.9)],
    got: 0, lastSeg: 0, coinList: [], parts: [], fx: 0, towed: false, truck: null, truckS: 0, boostToast: -9, doneT: 0,
    hudPos: 0, hudRem: -1, fxOn: false,
    F0: 0, bumpCd: {}, shake: 0, rainLvl: 0, rainFrom: -1, rainTo: -1, rainMsg: false,
  };
  if (G.forceRain || rng() < 0.5) {                    // hujan acak: sebagian lintasan
    R.rainFrom = G.forceRain ? 0 : R.len * (0.1 + rng() * 0.3);
    R.rainTo = G.forceRain ? R.len + 50 : Math.min(R.len + 50, R.rainFrom + R.len * (0.45 + rng() * 0.4));
  }
  // koin: 1 baris (3 koin) per segmen
  for (let k = 0; k < R.N; k++) {
    const lane = Math.floor(rng() * 4), s0 = k * SEG + 15 + rng() * 55;
    const cx = hard ? (rng() * 2 - 1) * 4.5 : LANE_X[lane];
    for (let j = 0; j < 3; j++) R.coinList.push({ rot: rng() * 6, s: s0 + j * 5, x: cx, got: false });
  }
  // partikel api boost (oranye, kuning, warna mobil)
  const pcols = ['#ff9800', '#ffeb3b', COLORS[my.c].css];
  for (let i = 0; i < 40; i++) R.parts.push({ life: 0, max: 0.35, back: 0, ox: 0, h: 0, vz: 0, col: pcols[i % 3], owner: null });
  R.truck = { vis: false, s: 0, x: 0 };
  G.R = R;
}

function spawnFuel(R) {                       // bensin di jalan: tepat sebelum bensin habis
  const need = R.N - R.F;
  if (need <= 0 || R.F < 1) return;
  for (let i = 0; i < need; i++) {
    const s = (R.F + i) * SEG - 45 - R.rng() * 15;
    const x = R.hard ? (R.rng() * 2 - 1) * 4.2 : LANE_X[Math.floor(R.rng() * 4)];
    R.coinList.push({ rot: 0, s, x, got: false, kind: 'fuel' });
  }
}
function rebuildFuel() {
  const R = G.R;
  $('#h-fuel').innerHTML = Array.from({ length: R.F }, () => '<div class="fs"><i></i></div>').join('');
  R.hudRem = -1;
}
function updateRain(R, dt) {
  const p = R.p, on = R.rainFrom >= 0 && p.s >= R.rainFrom && p.s <= R.rainTo;
  R.rainLvl += ((on ? 1 : 0) - R.rainLvl) * Math.min(1, dt * 0.8);
  if (on && !R.rainMsg && R.phase === 'go') { R.rainMsg = true; toast('🌧️ Hujan! Jalan licin', 2200); }
  const l = R.rainLvl;
  $('#h-rain').hidden = l < 0.25;
}
function collide(R, dt) {                     // tabrakan antar mobil
  if (R.phase !== 'go') return;
  const all = [R.p, ...R.bots];
  for (let i = 0; i < all.length; i++) for (let j = i + 1; j < all.length; j++) {
    const a = all[i], b = all[j];
    if (a.finished || b.finished) continue;
    const ds = a.s - b.s, dx = a.x - b.x;
    if (Math.abs(ds) > 4.4 || Math.abs(dx) > 2.2) continue;
    const front = ds >= 0 ? a : b, rear = ds >= 0 ? b : a, key = i * 4 + j;
    if (R.t > (R.bumpCd[key] || 0)) {
      R.bumpCd[key] = R.t + 0.7;
      rear.speed *= 0.8; front.speed *= 1.03;
      const dir = dx === 0 ? (Math.random() < 0.5 ? 1 : -1) : Math.sign(dx);
      a.vx += dir * 3.5; b.vx -= dir * 3.5;
      if (a === R.p || b === R.p) { sfx.bump(); R.shake = 0.5; }
    }
    if (R.hard) {
      const push = (2.2 - Math.abs(dx)) * 0.5 * Math.min(1, dt * 14), dir = dx === 0 ? 1 : Math.sign(dx);
      a.x = clamp(a.x + dir * push, -ROAD_HALF, ROAD_HALF); b.x = clamp(b.x - dir * push, -ROAD_HALF, ROAD_HALF);
    }
    if (Math.abs(dx) < 1.6) {                 // satu jalur: yang belakang tidak bisa menembus
      rear.s = Math.min(rear.s, front.s - 3.8);
      rear.speed = Math.min(rear.speed, front.speed * 0.97);
    }
  }
}
function startRace() {
  const R = G.R;
  R.F = G.fill; R.F0 = G.fill;
  spawnFuel(R);
  G.coins -= G.fill * FUEL_PRICE;
  save();
  R.phase = 'count';
  G.state = 'race';
  resetInput();
  setMusic('race');
  showScreen('hud');
  buildHud(); updateHud();
  $('#h-coins').textContent = G.coins;
  sfx.pay();
}

function segIdx(R, s) { return clamp(Math.floor(s / SEG), 0, R.N - 1); }

function finishPlayer() {
  const R = G.R;
  R.phase = 'done'; R.doneT = 0;
  R.place = 1 + R.bots.filter((q) => q.finished).length;
  R.p.boost = false;
  setMusic(null); A.boostTarget = 0; boostFx(false); R.fxOn = false;
  (R.place === 1 && !R.towed) ? sfx.win() : (R.place === 2 && !R.towed ? sfx.flag() : sfx.lose());
}

function spawnFlame(R, o) {
  const pr = R.parts.find((q) => q.life <= 0); if (!pr) return;
  pr.life = pr.max = 0.3 + Math.random() * 0.15;
  pr.owner = o; pr.ox = (Math.random() - 0.5) * 1.0; pr.h = Math.random() * 0.5; pr.back = 2.2; pr.vz = 3 + Math.random() * 4;
}

function stepBot(R, a, dt) {
  const p = R.p;
  if (!a.finished) {
    a.timer -= dt;
    let inZone;
    const dr = R.curvy && R.phase !== 'done' ? -curvAt(a.s) * a.speed * DRIFT * (1 + 0.6 * R.rainLvl) : 0;
    if (R.hard) {
      if (a.timer <= 0) {
        a.timer = 0.5 + R.rng() * 0.9;
        const nx = nextPad(R, a.s, a.color, 70);
        if (nx && R.rng() < a.skill) a.tx = nx.x; else a.tx = clamp(a.tx + (R.rng() - 0.5) * 7, -4.6, 4.6);
      }
      a.vx += (clamp((a.tx - a.x) * 3, -AI_STEER, AI_STEER) - dr - a.vx) * Math.min(1, dt * (6 - 3 * R.rainLvl));
      a.x = clamp(a.x + (a.vx + dr) * dt, -ROAD_HALF, ROAD_HALF);
      if (padUnder(R, a.s, a.x, a.color)) a.boostT = LINGER; else a.boostT = Math.max(0, a.boostT - dt);
      inZone = a.boostT > 0;
    } else {
      const gl = R.perms[segIdx(R, a.s)].indexOf(a.color);
      if (a.timer <= 0) { a.lane = R.rng() < a.skill ? gl : Math.floor(R.rng() * 4); a.timer = 0.5 + R.rng() * 0.9; }
      a.x += (LANE_X[a.lane] - a.x) * Math.min(1, dt * (6 - 3 * R.rainLvl));
      inZone = Math.abs(a.x - LANE_X[gl]) < 1.1;
    }
    a.boost = inZone;
    let target = a.base * (inZone ? BOOST : 1);
    if (a.s < p.s - 40) target *= 1.05; else if (a.s > p.s + 40) target *= 0.93;
    a.speed += (target - a.speed) * Math.min(1, dt * 3);
    a.s += a.speed * dt;
    if (a.s >= R.len) { a.finished = true; a.s = R.len; }
  } else {
    a.speed *= Math.exp(-dt * 1.5); a.s += a.speed * dt; a.boost = false;
  }
}

function stepRace(dt) {
  const R = G.R, p = R.p;
  R.t += dt;

  if (R.phase === 'count') {
    R.cd -= dt;
    const n = Math.ceil(R.cd);
    if (n !== R.lastN && n > 0) { R.lastN = n; showCount(String(n)); sfx.beep(); }
    if (R.cd <= 0) { R.phase = 'go'; showCount('GO!', 800); sfx.go(); }
    return;
  }

  /* --- gerak samping pemain --- */
  const canSteer = R.phase === 'go' || R.phase === 'tow';
  if (R.hard) {
    const ax = canSteer ? inputAxis() : 0;
    p.vx += (ax * STEER_SPEED - p.vx) * Math.min(1, dt * (10 - 6.5 * R.rainLvl));       // licin: setir telat merespons
    const dr = R.curvy && R.phase === 'go' ? -curvAt(p.s) * p.speed * DRIFT * (1 + 0.6 * R.rainLvl) : 0;     // tikungan mendorong mobil ke luar
    p.x = clamp(p.x + (p.vx + dr) * dt, -ROAD_HALF, ROAD_HALF);
  } else {
    p.x += (LANE_X[p.lane] - p.x) * Math.min(1, dt * (11 - 6.5 * R.rainLvl));
  }

  /* --- maju, boost, bensin --- */
  if (R.phase === 'go') {
    let inZone;
    if (R.hard) {
      if (padUnder(R, p.s, p.x, p.color)) p.boostT = LINGER; else p.boostT = Math.max(0, p.boostT - dt);
      inZone = p.boostT > 0;
    } else {
      const gl = R.perms[segIdx(R, p.s)].indexOf(p.color);
      inZone = Math.abs(p.x - LANE_X[gl]) < 1.1;
    }
    if (inZone && !p.boost && R.t - R.boostToast > 1.0) { R.boostToast = R.t; boostBurst(p.color); }
    p.boost = inZone;
    let target = BASE * (inZone ? BOOST : 1);
    const rem = R.F - p.s / SEG;
    if (R.F < R.N && rem < 0.22) target *= clamp(rem / 0.22, 0.25, 1);
    p.speed += (target - p.speed) * Math.min(1, dt * 3);
    p.s += p.speed * dt;
    if (p.s >= R.len) { p.s = R.len; finishPlayer(); }
    else if (R.F < R.N && p.s >= R.F * SEG - 0.05) {
      p.s = R.F * SEG - 0.05; p.speed = 0; p.boost = false;
      R.phase = 'stalled'; R.stallT = 0; sfx.stall();
      toast('Bensin habis! ⛽', 2200);
    }
  } else if (R.phase === 'stalled') {
    R.stallT += dt;
    if (R.stallT > 1.4) {
      R.phase = 'towin'; R.towed = true;
      R.truckS = p.s + 32; R.truck.vis = true; sfx.horn();
      toast('Mobil derek datang! 🚛', 2200);
    }
  } else if (R.phase === 'towin') {
    R.truckS = Math.max(p.s + 6.8, R.truckS - 38 * dt);
    if (R.truckS <= p.s + 6.8 + 0.001) { R.phase = 'tow'; R.truck.x = p.x; }
  } else if (R.phase === 'tow') {
    p.boost = false;
    p.speed += (TOW_SPEED - p.speed) * Math.min(1, dt * 3);
    p.s += p.speed * dt;
    R.truckS = p.s + 6.8;
    if (p.s >= R.len) { p.s = R.len; finishPlayer(); }
  } else if (R.phase === 'done') {
    R.doneT += dt;
    p.speed *= Math.exp(-dt * 1.8); p.s += p.speed * dt; p.boost = false;
    if (R.doneT > 1.3 && G.state === 'race') showResult();
  }

  /* --- bendera: jalur ganti warna (mode Mudah) --- */
  const sg = Math.floor(p.s / SEG);
  if (sg > R.lastSeg && sg < R.N && R.phase === 'go') {
    R.lastSeg = sg;
    toast(R.hard ? `🚩 Bendera ${sg}` : 'Jalur ganti warna! 🎨', 1200); sfx.flag();
  }

  /* --- koin --- */
  for (const c of R.coinList) {
    if (c.got) continue;
    c.rot += dt * 4;
    if (Math.abs(c.s - p.s) < 2 && Math.abs(c.x - p.x) < 1.6 && R.phase !== 'done') {
      c.got = true;
      if (c.kind === 'fuel') { R.F += 1; rebuildFuel(); sfx.fuel(); toast('⛽ Dapat bensin!', 1200); }
      else { R.got++; sfx.coin(); $('#h-coins').textContent = G.coins + R.got; }
    }
  }

  /* --- komputer (2 lawan) + tabrakan + hujan --- */
  for (const q of R.bots) stepBot(R, q, dt);
  collide(R, dt);
  updateRain(R, dt);
  R.shake = Math.max(0, R.shake - dt * 2.2);

  /* --- efek boost: api, vignette, suara mesin --- */
  const bo = R.phase === 'go' && p.boost;
  if (bo !== R.fxOn) { R.fxOn = bo; boostFx(bo); A.boostTarget = bo ? 1 : 0; }
  engineUpdate(p.speed, bo, p.speed > 0.8, R.rainLvl);
  R.fx += dt;
  while (R.fx > 0.03) {
    R.fx -= 0.03;
    if (bo) spawnFlame(R, p.obj);
    for (const q of R.bots) if (q.boost) spawnFlame(R, q.obj);
  }
  for (const q of R.parts) if (q.life > 0) { q.life -= dt; q.back -= q.vz * dt; }
  updateHud();
}

function showResult() {
  const R = G.R;
  G.state = 'result';
  const exact = !R.towed && R.F0 === R.N;
  const bonusPlace = R.towed ? 0 : BONUS_PLACE[R.place - 1];
  const earned = R.got + bonusPlace + (exact ? BONUS_EXACT : 0);
  G.coins += earned;
  save();
  const win = R.place === 1 && !R.towed;
  const big = R.towed ? '🚛' : ['🥇', '🥈', '🥉'][R.place - 1];
  $('#res-title').textContent = R.towed ? 'Diderek!' : `Juara ${R.place}!`;
  $('#res-lines').innerHTML = `<div class="rbig${win ? ' win' : ''}">${big}</div><div class="rcoins">+${earned} 🪙</div>` +
    (R.towed ? '<p class="rnote bad">⛽ Bensin kurang</p>' : exact ? '<p class="rnote good">⭐ Bensin pas!</p>' : R.F0 > R.N ? '<p class="rnote bad">⛽ Bensin kelebihan</p>' : '');
  clearOverlays();
  resetInput();
  boostFx(false); A.boostTarget = 0; engineUpdate(0, false, false);
  setMusic(win ? 'win' : 'menu');
  showScreen('result');
  $('#h-coins').textContent = G.coins;
}

function updatePreview(dt) {
  G.t += dt;
  const bob = Math.sin(G.t * 3) * 0.03, cu = G.state === 'custom';
  if (CAR.p) placeCar(CAR.p, LANE_X[1], 0, 0, bob);
  if (CAR.a) { CAR.a.vis = !cu; placeCar(CAR.a, LANE_X[2], 7, 0, bob); }
  if (CAR.b) { CAR.b.vis = !cu; placeCar(CAR.b, LANE_X[0], 13, 0, bob); }
  VIEW.carD = G.state === 'pit' ? 3.4 : 3.0; VIEW.h = 2.2;
  VIEW.camS = -VIEW.carD;
  VIEW.camX = LANE_X[1] * 0.8 + Math.sin(G.t * 0.5) * 0.5;
  if (G.state === 'menu') { freeArea(); VIEW.shift = VW * (freeL + (1 - freeL) / 2 - 0.5); } else VIEW.shift = 0;
}
function updateChase(dt) {
  const R = G.R, p = R.p, f = 1 - Math.exp(-dt * 6);
  VIEW.carD += ((p.boost ? 4.2 : 3.4) - VIEW.carD) * f;
  VIEW.h += (2.7 - VIEW.h) * f;
  VIEW.camX += (p.x * 0.8 - VIEW.camX) * f;
  VIEW.camS = p.s - VIEW.carD;
  VIEW.shift = 0;
}
function syncCars() {
  const R = G.R;
  [R.p, ...R.bots].forEach((c, i) => {
    const bob = Math.sin(R.t * 18 + i * 1.7) * 0.04 * Math.min(1, c.speed / BASE);
    const yaw = R.hard ? -c.vx * 0.03 : -(LANE_X[c.lane] - c.x) * 0.08;
    placeCar(c.obj, c.x, c.s, yaw, bob);
    c.obj.boost = !!c.boost && R.phase !== 'done';
  });
  if (R.truck && R.truck.vis) { R.truck.s = R.truckS; R.truck.x = R.p.x; }
}

function update(dt) {
  CLK += dt;
  A.boostI += (A.boostTarget - A.boostI) * Math.min(1, dt * 4);
  if (G.state === 'race' || G.state === 'result') {
    const R = G.R;
    if (G.state === 'race') stepRace(dt);
    else {
      R.p.speed *= Math.exp(-dt * 1.8); R.p.s += R.p.speed * dt;
      for (const q of R.bots) { q.speed *= Math.exp(-dt * 1.5); q.s += q.speed * dt; }
    }
    syncCars();
    if (G.state === 'result') updateRain(R, dt);
    updateChase(dt);
  } else if (G.state === 'intro') {
    updateIntro(dt);
  } else {
    updatePreview(dt);
  }
}

/* ======================= ALUR LAYAR ======================= */
function goMenu() {
  G.state = 'menu';
  clearOverlays(); resetInput();
  boostFx(false); A.boostTarget = 0; engineUpdate(0, false, false);
  setMusic('menu');
  let note = '';
  if (G.coins < MIN_COINS) { G.coins = MIN_COINS; note = '🪙 Kamu dapat uang saku supaya bisa isi bensin!'; save(); }
  $('#menu-note').textContent = note;
  G.R = null;
  G.buying = -1;
  setupPreview();
  renderMenu(); showScreen('menu');
}
function setupPreview() { buildWorld(G.trackIdx, previewLayout(), G.diff); mountPreview(); }
function goDiff() { G.state = 'pick'; clearOverlays(); setMusic('menu'); renderMenu(); showScreen('diff'); }
function goTrack() { G.state = 'pick'; renderMenu(); showScreen('track'); }
function goHero() {
  G.state = 'hero'; setMusic('menu'); setupPreview(); renderMenu(); renderCustom();
  $('#hero-name').value = G.name; $('#hero-g').classList.toggle('locked', G.charSet);     // gender hanya dipilih sekali
  showScreen('hero');
}
function goWardrobe() { G.state = 'wardrobe'; setMusic('menu'); G.buying = -1; setupPreview(); renderCustom(); showScreen('wardrobe'); }
function goCustom() {
  G.state = 'custom'; G.buying = -1;
  setMusic('menu');
  setupPreview();
  renderMenu(); renderCustom(); showScreen('custom');
}
function goPit() {
  clearOverlays();
  prepareRace();
  G.state = 'pit'; G.fill = 0;
  renderPit(); showScreen('pit');
}

/* ======================= EVENT ======================= */
$('#menu-cars').addEventListener('click', (e) => {
  const t = e.target.closest('[data-i]'); if (!t) return;
  if (t.dataset.i === 'k') { sfx.tick(); goCustom(); return; }
  const i = +t.dataset.i;
  if (G.owned[i]) { G.carIdx = i; G.buying = -1; save(); sfx.tick(); setupPreview(); }
  else if (G.buying !== i) { G.buying = i; sfx.tick(); mountPreview(); }      // ketuk pertama: pratinjau + tanya dulu
  else if (G.coins >= CAR_PRICE[i]) {                                          // ketuk kedua: beli
    G.coins -= CAR_PRICE[i]; G.owned[i] = true; G.carIdx = i; G.buying = -1; save(); sfx.win(); toast('Gokart baru! 🎉', 1400); setupPreview();
  } else { G.buying = -1; sfx.lose(); toast('Uangmu kurang! 🪙', 1000); setupPreview(); }
  renderMenu(); renderCustom();
});
$('#menu-tracks').addEventListener('click', (e) => {
  const t = e.target.closest('[data-i]'); if (!t) return;
  G.trackIdx = +t.dataset.i; save(); sfx.tick();
  buildWorld(G.trackIdx, previewLayout(), G.diff);
  renderMenu();
});
$('#menu-diffs').addEventListener('click', (e) => {
  const t = e.target.closest('[data-i]'); if (!t) return;
  G.diff = ['easy', 'hard', 'curvy'].includes(t.dataset.i) ? t.dataset.i : 'easy'; save(); sfx.tick();
  buildWorld(G.trackIdx, previewLayout(), G.diff);
  renderMenu();
});
$('#btn-play').addEventListener('click', () => { sfx.beep(); goPit(); });
$('#btn-race').addEventListener('click', () => { sfx.beep(); goDiff(); });
$('#btn-garage-open').addEventListener('click', () => { sfx.tick(); goCustom(); });
$('#btn-diff-back').addEventListener('click', goMenu);
$('#btn-diff-next').addEventListener('click', () => { sfx.tick(); goTrack(); });
$('#btn-track-back').addEventListener('click', goDiff);
$('#set-level').addEventListener('click', (e) => { const t = e.target.closest('[data-i]'); if (!t) return; G.level = clamp(+t.dataset.i, 1, 3); save(); sfx.tick(); syncSet(); });
const onCu = (id, fn) => $(id).addEventListener('click', (e) => { const t = e.target.closest('[data-i]'); if (!t) return; fn(t.dataset.i); save(); sfx.tick(); mountCar('p', mySpec()); renderCustom(); });
onCu('#cu-g', (v) => { G.char.g = v === 'girl' ? 'girl' : 'boy'; });
onCu('#cu-hat', (v) => { G.char.hat = clamp(+v, 0, 5); });
onCu('#cu-hs', (v) => { G.char.hs = clamp(+v, 0, 2); });
onCu('#cu-shirt', (v) => { G.char.shirt = clamp(+v, 0, 5); });
onCu('#cu-col', (v) => { G.cust[G.carIdx].col = clamp(+v, 0, 3); setupPreview(); });
onCu('#cu-acc', (v) => { G.cust[G.carIdx].acc = +v ? 1 : 0; });
onCu('#cu-lv', (v) => { G.cust[G.carIdx].lv = clamp(+v, 0, 3); });
$('#btn-cu-ok').addEventListener('click', () => { sfx.beep(); goMenu(); });
$('#btn-wd-ok').addEventListener('click', () => { sfx.beep(); goMenu(); });
$('#btn-hero-ok').addEventListener('click', () => {
  G.name = ($('#hero-name').value || '').trim().slice(0, 12) || 'Pembalap'; G.charSet = true; save(); sfx.beep();
  if (SKIP_INTRO) goMenu(); else startIntro();
});
$('#btn-wardrobe-open').addEventListener('click', () => { sfx.tick(); goWardrobe(); });
$('#pit-tank').addEventListener('click', (e) => {
  const t = e.target.closest('[data-i]'); if (!t) return;
  const n = +t.dataset.i + 1;
  pitSet(n === G.fill ? n - 1 : n);
});
$('#btn-plus').addEventListener('click', () => pitSet(G.fill + 1));
$('#btn-minus').addEventListener('click', () => pitSet(G.fill - 1));
$('#btn-say').addEventListener('click', () => {
  const N = G.R.N;
  speak(G.level === 1 ? 'Hitung benderanya, lalu isi bensin sebanyak itu.' : G.level === 2 ? 'Hitung jarinya, lalu isi bensin sebanyak itu.' : 'Hitung titik di dadu, lalu isi bensin sebanyak itu.');
});
$('#btn-pay').addEventListener('click', () => { if (G.fill >= 1) startRace(); });
$('#btn-back').addEventListener('click', goMenu);
$('#btn-again').addEventListener('click', goPit);
$('#btn-garage').addEventListener('click', goMenu);
$('#btn-quit').addEventListener('click', () => { if (G.state === 'race') goMenu(); });
$('#btn-mute').addEventListener('click', () => {
  G.mute = !G.mute; applyAudioPrefs(); syncSys(); save();
  if (G.mute) { try { speechSynthesis.cancel(); } catch (e) { /* abaikan */ } }
});
$('#btn-set').addEventListener('click', () => { if (G.state === 'race') return; confirmKey = ''; syncSet(); EZUI.show('scr-set'); sfx.tick(); });
$('#btn-set-close').addEventListener('click', () => { confirmKey = ''; EZUI.hide('scr-set'); });
$('#set-music').addEventListener('click', () => { G.musicOff = !G.musicOff; applyAudioPrefs(); syncSys(); syncSet(); save(); });
$('#set-sound').addEventListener('click', () => { G.mute = !G.mute; applyAudioPrefs(); syncSys(); syncSet(); save(); });
$('#set-delchar').addEventListener('click', () => {
  if (confirmKey !== 'char') { confirmKey = 'char'; syncSet(); return; }
  G.char = { g: 'boy', hat: 0, hs: 0, shirt: 1 }; G.charSet = false; confirmKey = ''; save(); sfx.lose(); goHero();
});
$('#set-reset').addEventListener('click', () => {
  if (confirmKey !== 'all') { confirmKey = 'all'; syncSet(); return; }
  G.coins = START_COINS; G.owned = KARTS.map((_, i) => i === 0); G.carIdx = 0;
  G.cust = KARTS.map((_, i) => ({ col: i % 4, acc: 0, lv: 0 })); G.char = { g: 'boy', hat: 0, hs: 0, shirt: 1 }; G.charSet = false;
  confirmKey = ''; save(); sfx.lose(); goHero();
});
$('#btn-music').addEventListener('click', () => { G.musicOff = !G.musicOff; applyAudioPrefs(); syncSys(); save(); });

['#btn-left', '#btn-right'].forEach((id, i) => {
  const el = $(id), dir = i ? 1 : -1;
  el.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    try { el.setPointerCapture(e.pointerId); } catch (err) { /* abaikan */ }
    press(dir, true);
  });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((ev) => el.addEventListener(ev, () => press(dir, false)));
});
addEventListener('keydown', (e) => {
  if (e.repeat) return;
  if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') press(-1, true);
  if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') press(1, true);
});
addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') press(-1, false);
  if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') press(1, false);
});
let dragX = null;
canvas.addEventListener('pointerdown', (e) => { dragX = e.clientX; });
canvas.addEventListener('pointermove', (e) => {
  if (dragX === null) return;
  const R = G.R;
  if (G.state === 'race' && R && R.hard) IN.drag = clamp((e.clientX - dragX) / 70, -1, 1);
});
const endDrag = (e) => {
  if (dragX === null) return;
  const dx = e.clientX - dragX; dragX = null; IN.drag = 0;
  if (G.state === 'race' && G.R && !G.R.hard && Math.abs(dx) > 40) steer(dx > 0 ? 1 : -1);
};
canvas.addEventListener('pointerup', endDrag);
canvas.addEventListener('pointercancel', endDrag);

/* audio baru boleh mulai setelah sentuhan pertama; berhenti saat tab disembunyikan */
/* kunci landscape: di APK / PWA terpasang lewat manifest; di browser dicoba lewat layar penuh + orientation.lock, kalau gagal tampil layar "putar HP" */
const needRotate = () => matchMedia('(orientation:portrait) and (pointer:coarse)').matches;
let lockTried = false;
function lockLandscape() {
  try {
    const so = screen.orientation;
    if (!so || !so.lock) return;
    const go = () => so.lock('landscape').catch(() => {});
    if (matchMedia('(display-mode:fullscreen),(display-mode:standalone)').matches || document.fullscreenElement) go();
    else if (matchMedia('(pointer:coarse)').matches && document.documentElement.requestFullscreen)
      document.documentElement.requestFullscreen().then(go).catch(() => {});
  } catch (e) {}
}
lockLandscape();
const unlock = () => { if (!lockTried) { lockTried = true; lockLandscape(); } if (audioInit()) applyMode(); };
addEventListener('pointerdown', unlock, { passive: true });
addEventListener('keydown', unlock);
document.addEventListener('visibilitychange', () => {
  if (!A.ctx || A.offline) return;
  if (document.hidden) A.ctx.suspend(); else A.ctx.resume();
});

/* ======================= MULAI ======================= */
loadSave();
syncSys();
{
  const bm = document.querySelector('meta[name=gembalap-build]');
  $('#ver').textContent = 'Gembalap v0.5 · build ' + (bm && bm.content.indexOf('__') < 0 ? bm.content : 'dev');
}
/* ======================= PEMBUKA ======================= */
const SKIP_INTRO = /skipintro/.test(location.search + location.hash);
let introTimers = [];
const later = (fn, ms) => { introTimers.push(setTimeout(fn, ms)); };
function runSplash(done) {            // putih → "presented by Learnersfam" → putih
  const sp = $('#splash'), inn = sp.firstElementChild;
  audioInit();                                   // dicoba lebih awal (di aplikasi terpasang biasanya diizinkan)
  later(() => { inn.classList.add('on'); sfx.chime(); }, 400);
  later(() => inn.classList.remove('on'), 2600);
  later(() => { sp.classList.add('hide'); done(); }, 3700);
  later(() => sp.classList.add('gone'), 4800);
}
function startIntro() {               // animasi balapan → judul → "Selamat datang"
  G.state = 'intro'; G.introT = 0;
  clearOverlays(); showScreen('none');
  { const d0 = G.diff; G.diff = 'curvy'; setupPreview(); G.diff = d0; }      // jalan berkelok untuk pembuka
  $('#fx').style.setProperty('--glow', COLORS[G.cust[G.carIdx].col].css + 'cc'); boostFx(true);
  const tc = $('#titlecard'); tc.className = '';
  const wo = $('#whiteout'); wo.classList.remove('on');
  audioInit(); setMusic('race'); A.boostTarget = 0.8;
  [500, 1300, 2000, 2900].forEach((ms) => later(() => sfx.swoosh(), ms));
  later(() => { tc.className = 'show'; sfx.title(); }, 2300);
  later(() => { tc.className = 'out'; }, 5200);
  later(finishIntro, 5700);
}
function finishIntro() {
  if (G.state !== 'intro') return;
  introTimers.forEach(clearTimeout); introTimers = [];
  const wo = $('#whiteout'); wo.classList.add('on');
  later(() => {
    $('#titlecard').className = '';
    boostFx(false); A.boostTarget = 0; engineUpdate(0, false, false);
    goMenu();
    wo.classList.remove('on');
  }, 480);
}
function updateIntro(dt) {
  G.introT += dt;
  const t = G.introT, sp = [27, 26, 25], s0 = [14, 8, 0], lx = [LANE_X[1], LANE_X[2], LANE_X[0]];
  [CAR.p, CAR.a, CAR.b].forEach((o, i) => {
    if (!o) return;
    const x = lx[i] + Math.sin(t * 1.4 + i * 2) * 0.9;
    placeCar(o, x, s0[i] + t * sp[i], -Math.cos(t * 1.4 + i * 2) * 0.08, Math.sin(t * 18 + i) * 0.04);
    o.boost = i === 0 || (i === 1 && t > 1.2);
  });
  engineUpdate(sp[0], false, true);
  // kamera: dari belakang, turun rendah & dekat, lalu menjauh sambil bergoyang
  const lead = s0[0] + t * sp[0], k = t < 1.8 ? 0 : t < 3.6 ? 1 : 2;
  VIEW.carD = [5.4, 3.0, 7.5][k] + Math.sin(t * 1.3) * 0.4;
  VIEW.h = [3.8, 1.5, 5.2][k];
  VIEW.camS = lead - VIEW.carD;
  VIEW.camX += (lx[0] * 0.8 + Math.sin(t * 0.9) * 1.6 - VIEW.camX) * Math.min(1, dt * 3);
  VIEW.shift = 0;
}
// ketuk = lewati, kecuali ketukan pertama yang baru membuka suara
addEventListener('pointerdown', () => { if (G.state === 'intro' && G.introT > 0.8 && A.ctx && A.ctx.state === 'running') finishIntro(); }, true);

resize();
G.state = 'boot'; showScreen('none'); setupPreview();
const afterSplash = () => { if (!G.charSet || !G.name) goHero(); else startIntro(); };
if (SKIP_INTRO) { $('#splash').classList.add('gone'); if (!G.charSet || !G.name) goHero(); else goMenu(); } else runSplash(afterSplash);
let last = performance.now();
function frame(now) {
  requestAnimationFrame(frame);
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  if (!needRotate()) update(dt);   // jeda saat HP tegak
  renderFrame(dt);
}
requestAnimationFrame(frame);

// untuk pengujian / debug
window.__balap = { startIntro, finishIntro, collide, ROAD, curvAt, roadXZ, goCustom, G, A, IN, update, steer, press, prepareRace, startRace, goPit, goMenu, pitSet, padUnder, nextPad, audioTest, SEG, LANE_X, TRACKS, PAD_W };
