import * as THREE from 'three';

/* ======================= KONFIGURASI ======================= */
const LANE_X = [-4.5, -1.5, 1.5, 4.5];
const SEG = 100;                 // panjang 1 bendera (= 1 kotak bensin)
const BASE = 20, BOOST = 1.45, TOW_SPEED = 17;
const AI_BASE = 19.5, AI_SKILL = 0.55;      // makin kecil skill = AI makin sering salah jalur
const FUEL_PRICE = 2, TANK_MAX = 10, START_COINS = 20, MIN_COINS = 10;
const ROAD_HALF = 5.6, STEER_SPEED = 9, AI_STEER = 6.5, PAD_W = 3.6, PAD_LEN = 24, LINGER = 0.7;
const BONUS_1ST = 10, BONUS_2ND = 4, BONUS_EXACT = 5;

const COLORS = [
  { name: 'Merah',  hex: 0xe53935, css: '#e53935' },
  { name: 'Biru',   hex: 0x1e88e5, css: '#1e88e5' },
  { name: 'Kuning', hex: 0xfdd835, css: '#fdd835' },
  { name: 'Hijau',  hex: 0x43a047, css: '#43a047' },
];
// index mobil == index warna
const CARS = [
  { short: 'Sport', name: 'Mobil Sport',  emoji: '🏎️' },
  { short: 'Polisi', name: 'Mobil Polisi', emoji: '🚓' },
  { short: 'Taksi', name: 'Taksi',        emoji: '🚕' },
  { short: 'Jip', name: 'Jip Hijau',    emoji: '🚙' },
];
const TRACKS = [
  { name: 'Desa',   emoji: '🌾', len: 'Pendek', flags: 4, sky: 0x9ad8ff, ground: 0x6dbf4b, theme: 'desa' },
  { name: 'Pantai', emoji: '🏖️', len: 'Sedang', flags: 6, sky: 0x8fe0ff, ground: 0xf0d9a0, theme: 'pantai' },
  { name: 'Kota',   emoji: '🏙️', len: 'Panjang', flags: 9, sky: 0xb7d3ee, ground: 0x8d9399, theme: 'kota' },
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
function shade(hex, f) { const c = new THREE.Color(hex); c.multiplyScalar(f); return c.getHex(); }

/* ======================= STATE & SAVE ======================= */
const SAVE_KEY = 'balap-voxel-v1';
const G = { coins: START_COINS, carIdx: 0, trackIdx: 0, level: 1, mute: false, musicOff: false, diff: 'easy', state: 'menu', fill: 0, R: null, t: 0 };
function loadSave() {
  try {
    const j = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
    if (typeof j.coins === 'number') G.coins = j.coins;
    if (j.carIdx >= 0 && j.carIdx < CARS.length) G.carIdx = j.carIdx;
    if (j.trackIdx >= 0 && j.trackIdx < TRACKS.length) G.trackIdx = j.trackIdx;
    if (j.level === 1 || j.level === 2) G.level = j.level;
    if (typeof j.mute === 'boolean') G.mute = j.mute;
    if (typeof j.musicOff === 'boolean') G.musicOff = j.musicOff;
    if (j.diff === 'easy' || j.diff === 'hard') G.diff = j.diff;
  } catch (e) { /* abaikan */ }
}
function save() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ coins: G.coins, carIdx: G.carIdx, trackIdx: G.trackIdx, level: G.level, mute: G.mute, musicOff: G.musicOff, diff: G.diff }));
  } catch (e) { /* abaikan */ }
}

/* ======================= AUDIO: MUSIK + EFEK (semua dibuat lewat kode, tanpa file) ======================= */
const A = { ctx: null, mus: null, sfx: null, noise: null, eng: null, wind: null,
  want: null, mode: null, step: 0, nextT: 0, timer: 0, boostI: 0, boostTarget: 0, offline: false };
const MN = (m) => 440 * Math.pow(2, (m - 69) / 12);
// 8 bar: C Am F G | Em Am F G  -> [nada dasar relatif C3, isi akor]
const PROG = [[0, [0, 4, 7]], [-3, [0, 3, 7]], [-7, [0, 4, 7]], [-5, [0, 4, 7]],
              [4, [0, 3, 7]], [-3, [0, 3, 7]], [-7, [0, 4, 7]], [-5, [0, 4, 7]]];
// melodi lead (MIDI) saat boost, 8 nada per bar
const LEAD = [[76, 79, 84, 79, 76, 74, 72, 74], [81, 79, 76, 79, 81, 84, 81, 79],
              [81, 79, 76, 74, 72, 74, 76, 79], [79, 76, 74, 76, 79, 81, 79, 74],
              [83, 79, 76, 79, 83, 79, 76, 71], [81, 84, 81, 79, 76, 79, 81, 76],
              [84, 81, 79, 76, 74, 76, 79, 81], [79, 83, 79, 76, 74, 76, 79, 83]];
const BPM = { menu: 96, race: 142 };

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
  A.mus.gain.value = G.musicOff ? 0 : 0.55;
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
  A.eng = { g, lp, o1, o2, o3 }; A.wind = { wg, bp };
}
function engineUpdate(speed, boosting, running) {
  if (!A.eng || A.offline) return;
  const t = A.ctx.currentTime, k = clamp(speed / (BASE * BOOST), 0, 1.1);
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
    if (s % 4 === 0) kick(t, 0.55); else if (s === 10) kick(t, 0.35);
    if (s === 4 || s === 12) snare(t);
    if (s % 2 === 0) hat(t, false, 0.07); else if (boost) hat(t, false, 0.045);
    if (s === 14) hat(t, true, 0.06);
    if (boost && s === 0) noiseHit(t, 0.6, 'highpass', 5000, 0, 0.06, 0.7, A.mus);   // cymbal tiap bar saat boost
    if (s % 2 === 0) {
      const bn = MN(root - 12 + (s % 4 === 2 ? 12 : 0));
      oscHit('triangle', bn, 0, t, sd * 1.8, 0.2, A.mus, 0.004);
      oscHit('square', bn, 0, t, sd * 1.6, 0.035, A.mus, 0.004);
    }
    const ch = [tri[0], tri[1], tri[2], tri[0] + 12][[0, 1, 2, 3, 2, 1, 2, 1][s % 8]];
    oscHit('square', MN(root + 12 + ch + (boost ? 12 : 0)), 0, t, sd * 0.85, boost ? 0.07 : 0.04, A.mus, 0.003);
    if (boost && s % 2 === 0) oscHit('sawtooth', MN(LEAD[bar][s / 2]), 0, t, sd * 1.8, 0.05, A.mus, 0.01);
  } else {
    if (s === 0) tri.forEach((n) => oscHit('triangle', MN(root + 12 + n), 0, t, sd * 15, 0.045, A.mus, 0.25));
    if (s % 8 === 0) oscHit('sine', MN(root - 12), 0, t, sd * 7, 0.2, A.mus, 0.02);
    if (s % 2 === 0) oscHit('triangle', MN(root + 24 + tri[(s / 2) % 3]), 0, t, sd * 3, 0.05, A.mus, 0.005);
    if (s % 4 === 2) hat(t, false, 0.03);
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

/* ======================= THREE: DASAR ======================= */
const canvas = $('#c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(62, 1, 0.1, 420);
scene.add(new THREE.HemisphereLight(0xffffff, 0x8a9bb0, 1.7));
const sun = new THREE.DirectionalLight(0xffffff, 1.9);
sun.position.set(-30, 50, 25);
scene.add(sun);

const boxGeo = new THREE.BoxGeometry(1, 1, 1);
const matCache = new Map();
function mat(hex) {
  let m = matCache.get(hex);
  if (!m) { m = new THREE.MeshLambertMaterial({ color: hex }); matCache.set(hex, m); }
  return m;
}
function vox(parent, x, y, z, sx, sy, sz, hex) {
  const m = new THREE.Mesh(boxGeo, mat(hex));
  m.position.set(x, y, z); m.scale.set(sx, sy, sz);
  parent.add(m);
  return m;
}

/* satu InstancedMesh untuk semua kubus statis = 1 draw call */
class Batch {
  constructor() { this.items = []; }
  box(x, y, z, sx, sy, sz, color) { this.items.push([x, y, z, sx, sy, sz, color]); }
  build() {
    const mt = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const m = new THREE.InstancedMesh(boxGeo, mt, Math.max(1, this.items.length));
    const d = new THREE.Object3D(), c = new THREE.Color();
    this.items.forEach((it, i) => {
      d.position.set(it[0], it[1], it[2]); d.scale.set(it[3], it[4], it[5]); d.updateMatrix();
      m.setMatrixAt(i, d.matrix); m.setColorAt(i, c.setHex(it[6]));
    });
    m.count = this.items.length;
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
    m.frustumCulled = false;
    return m;
  }
}

/* huruf voxel 3x5 */
const FONT = {
  '0': ['111', '101', '101', '101', '111'], '1': ['010', '110', '010', '010', '111'],
  '2': ['111', '001', '111', '100', '111'], '3': ['111', '001', '111', '001', '111'],
  '4': ['101', '101', '111', '001', '001'], '5': ['111', '100', '111', '001', '111'],
  '6': ['111', '100', '111', '101', '111'], '7': ['111', '001', '010', '010', '010'],
  '8': ['111', '101', '111', '101', '111'], '9': ['111', '101', '111', '001', '111'],
  'F': ['111', '100', '110', '100', '100'], 'I': ['111', '010', '010', '010', '111'],
  'N': ['101', '111', '111', '111', '101'], 'S': ['111', '100', '111', '001', '111'],
  'H': ['101', '101', '111', '101', '101'],
};
function voxText(b, str, cx, cy, z, cell, color) {
  const chars = [...str];
  const w = chars.length * 4 - 1;
  const ox = cx - (w * cell) / 2 + cell / 2;
  chars.forEach((ch, ci) => {
    const g = FONT[ch]; if (!g) return;
    for (let r = 0; r < 5; r++) for (let c = 0; c < 3; c++)
      if (g[r][c] === '1') b.box(ox + (ci * 4 + c) * cell, cy + (2 - r) * cell, z, cell * 0.95, cell * 0.95, 0.3, color);
  });
}

/* ======================= MODEL MOBIL (VOXEL) ======================= */
function buildCar(type) {
  const g = new THREE.Group();
  const hex = COLORS[type].hex, dk = shade(hex, 0.7);
  const dark = 0x263238, glass = 0x9fd8f5, white = 0xffffff, headl = 0xfff59d, tail = 0xff1744;
  const lights = (y, z) => {
    [-0.7, 0.7].forEach((x) => { vox(g, x, y, z, 0.45, 0.3, 0.1, headl); vox(g, x, y, -z, 0.45, 0.3, 0.1, tail); });
  };
  if (type === 0) {            // sport merah
    [-1, 1].forEach((sx) => [-1.35, 1.45].forEach((z) => vox(g, sx * 1.1, 0.45, z, 0.55, 0.9, 0.9, dark)));
    vox(g, 0, 0.85, 0, 2.1, 0.7, 4.3, hex);
    vox(g, 0, 1.4, -0.35, 1.7, 0.5, 1.9, glass);
    vox(g, 0, 1.72, -0.35, 1.7, 0.12, 1.5, hex);
    vox(g, 0, 1.23, 1.35, 0.5, 0.06, 1.6, white);
    [-0.8, 0.8].forEach((x) => vox(g, x, 1.4, -1.95, 0.15, 0.6, 0.15, dark));
    vox(g, 0, 1.75, -1.95, 2.3, 0.15, 0.6, dk);
    lights(0.95, 2.17);
  } else if (type === 1) {     // polisi biru
    [-1, 1].forEach((sx) => [-1.35, 1.45].forEach((z) => vox(g, sx * 1.15, 0.45, z, 0.55, 0.9, 0.9, dark)));
    vox(g, 0, 0.9, 0, 2.2, 0.8, 4.3, hex);
    vox(g, 0, 1.55, -0.2, 1.9, 0.7, 2.2, white);
    vox(g, 0, 1.6, -0.2, 1.95, 0.35, 2.0, glass);
    vox(g, 0, 1.95, -0.2, 1.9, 0.12, 2.2, white);
    vox(g, -0.45, 2.15, -0.2, 0.7, 0.3, 0.5, 0xff1744);
    vox(g, 0.45, 2.15, -0.2, 0.7, 0.3, 0.5, 0x2979ff);
    vox(g, 0, 1.0, 0, 2.24, 0.14, 1.6, white);
    lights(1.0, 2.17);
  } else if (type === 2) {     // taksi kuning
    [-1, 1].forEach((sx) => [-1.35, 1.45].forEach((z) => vox(g, sx * 1.15, 0.45, z, 0.55, 0.9, 0.9, dark)));
    vox(g, 0, 0.9, 0, 2.2, 0.8, 4.3, hex);
    vox(g, 0, 1.55, -0.2, 1.9, 0.7, 2.4, hex);
    vox(g, 0, 1.6, -0.2, 1.95, 0.35, 2.2, glass);
    vox(g, 0, 2.0, -0.2, 1.9, 0.12, 2.4, hex);
    vox(g, 0, 2.25, -0.2, 0.9, 0.35, 0.5, white);
    vox(g, 0, 2.25, -0.2, 0.92, 0.1, 0.52, dark);
    vox(g, 0, 0.95, 0, 2.24, 0.12, 3.6, dark);
    lights(1.0, 2.17);
  } else {                     // jip hijau
    [-1, 1].forEach((sx) => [-1.3, 1.3].forEach((z) => vox(g, sx * 1.2, 0.55, z, 0.6, 1.1, 1.1, dark)));
    vox(g, 0, 1.1, 0, 2.3, 1.0, 4.0, hex);
    vox(g, 0, 1.95, -0.5, 2.1, 0.9, 2.1, hex);
    vox(g, 0, 2.0, 0.58, 1.9, 0.55, 0.1, glass);
    vox(g, 0, 2.0, -0.5, 2.14, 0.45, 1.7, glass);
    vox(g, 0, 2.45, -0.5, 2.1, 0.12, 2.1, dk);
    vox(g, 0, 1.3, -2.1, 1.0, 1.0, 0.4, dark);
    [-1, 1].forEach((sx) => vox(g, sx * 0.9, 2.55, 0.45, 0.1, 0.5, 0.1, dark));
    lights(1.15, 2.03);
  }
  return g;
}
function buildTruck() {
  const g = new THREE.Group();
  const dark = 0x263238, white = 0xffffff, orange = 0xff9800;
  [-1, 1].forEach((sx) => [-2.0, 0.2, 1.7].forEach((z) => vox(g, sx * 1.15, 0.55, z, 0.6, 1.1, 1.1, dark)));
  vox(g, 0, 1.0, -0.4, 2.3, 0.5, 4.6, 0x546e7a);
  vox(g, 0, 1.7, 1.5, 2.3, 1.5, 1.8, orange);
  vox(g, 0, 2.0, 2.45, 1.9, 0.6, 0.1, 0x9fd8f5);
  vox(g, 0, 2.6, 1.5, 0.8, 0.3, 0.5, 0xffeb3b);
  vox(g, 0, 1.9, -2.9, 0.3, 1.8, 0.3, dark);
  vox(g, 0, 2.7, -3.6, 0.3, 0.3, 1.8, dark);
  vox(g, 0, 1.4, -4.4, 0.4, 1.0, 0.3, 0xfdd835);
  vox(g, 0, 1.1, 2.4, 2.3, 0.4, 0.2, white);
  return g;
}
function makeCarObject(idx) {
  const outer = new THREE.Group();
  const inner = buildCar(idx);
  inner.rotation.y = Math.PI;       // model dibangun menghadap +z, game maju ke -z
  outer.add(inner);
  const shadow = new THREE.Mesh(boxGeo, new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.25 }));
  shadow.scale.set(2.5, 0.02, 4.6); shadow.position.y = 0.04;
  outer.add(shadow);
  return outer;
}
const CAR = { p: null, a: null };
function mountCar(which, idx) {
  if (CAR[which]) scene.remove(CAR[which]);
  CAR[which] = makeCarObject(idx);
  scene.add(CAR[which]);
}

/* ======================= DUNIA / LINTASAN ======================= */
let world = null;
function disposeWorld() {
  if (!world) return;
  scene.remove(world.group);
  world.group.traverse((o) => { if (o.isInstancedMesh) { o.material.dispose(); o.dispose(); } });
  world = null;
}
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

function tree(b, x, z, rng) {
  const g = [0x2e7d32, 0x388e3c, 0x43a047][Math.floor(rng() * 3)];
  const h = 1 + rng() * 0.5;
  b.box(x, 1.1 * h, z, 0.9, 2.2 * h, 0.9, 0x6d4c41);
  b.box(x, 2.9 * h, z, 3.4, 1.4, 3.4, g);
  b.box(x, 4.1 * h, z, 2.6, 1.4, 2.6, shade(g, 1.1));
  b.box(x, 5.2 * h, z, 1.6, 1.2, 1.6, shade(g, 1.2));
}
function house(b, x, z, rng, side) {
  const wall = [0xfff3e0, 0xffe0b2, 0xe1f5fe, 0xf8bbd0][Math.floor(rng() * 4)];
  b.box(x, 1.7, z, 6, 3.4, 6, wall);
  b.box(x, 3.8, z, 6.8, 0.8, 6.8, 0xc62828);
  b.box(x, 4.6, z, 5, 0.8, 5, 0xd32f2f);
  b.box(x, 5.4, z, 3, 0.8, 3, 0xe53935);
  b.box(x - side * 3.05, 1.0, z, 0.2, 2, 1.2, 0x5d4037);
  b.box(x - side * 3.05, 2.2, z + 1.8, 0.2, 1, 1, 0x81d4fa);
  b.box(x - side * 3.05, 2.2, z - 1.8, 0.2, 1, 1, 0x81d4fa);
}
function bush(b, x, z) {
  b.box(x, 0.6, z, 2.2, 1.2, 2.2, 0x558b2f);
  b.box(x, 1.4, z, 1.4, 0.8, 1.4, 0x689f38);
}
function palm(b, x, z, rng) {
  const lean = (rng() - 0.5) * 0.25, n = 6 + Math.floor(rng() * 2);
  for (let i = 0; i < n; i++) b.box(x + lean * i, 0.55 + i * 1.1, z, 0.7, 1.1, 0.7, i % 2 ? 0x8d6e63 : 0x795548);
  const tx = x + lean * n, ty = n * 1.1 + 0.3;
  b.box(tx, ty, z, 5.4, 0.35, 1.1, 0x2e7d32);
  b.box(tx, ty, z, 1.1, 0.35, 5.4, 0x388e3c);
  b.box(tx + 2.4, ty - 0.5, z, 1.8, 0.3, 0.9, 0x43a047);
  b.box(tx - 2.4, ty - 0.5, z, 1.8, 0.3, 0.9, 0x43a047);
  b.box(tx, ty - 0.5, z + 2.4, 0.9, 0.3, 1.8, 0x43a047);
  b.box(tx, ty - 0.5, z - 2.4, 0.9, 0.3, 1.8, 0x43a047);
  b.box(tx + 0.4, ty - 0.5, z + 0.4, 0.6, 0.6, 0.6, 0x5d4037);
}
function umbrella(b, x, z, rng) {
  const c = rng() < 0.5 ? 0xe53935 : 0x1e88e5;
  b.box(x, 1.5, z, 0.2, 3, 0.2, 0xeeeeee);
  b.box(x, 3.1, z, 3.2, 0.35, 3.2, c);
  b.box(x, 3.4, z, 1.8, 0.3, 1.8, 0xffffff);
  b.box(x + 2.2, 0.1, z, 1.2, 0.1, 2.4, 0xffca28);
}
function hut(b, x, z, side) {
  b.box(x, 1.3, z, 4.4, 2.6, 4.4, 0xbcaaa4);
  b.box(x, 3.0, z, 5.4, 0.8, 5.4, 0xd7b46a);
  b.box(x, 3.8, z, 3.4, 0.8, 3.4, 0xe0c27a);
  b.box(x - side * 2.25, 1.0, z, 0.2, 2, 1.1, 0x5d4037);
}
function building(b, x, z, rng, side) {
  const w = 6 + rng() * 4, d = 6 + rng() * 4, h = 10 + rng() * 22;
  const cols = [0x90a4ae, 0xb0bec5, 0x78909c, 0xcfd8dc, 0x8d6e63, 0xa1887f, 0x7986cb][Math.floor(rng() * 7)];
  const cx = x + side * w / 2;
  b.box(cx, h / 2, z, w, h, d, cols);
  b.box(cx, h + 0.4, z, w * 0.6, 0.8, d * 0.6, shade(cols, 0.8));
  const faceX = cx - side * (w / 2 + 0.05);
  const nc = Math.max(1, Math.floor(d / 2.4)), nr = Math.max(2, Math.floor((h - 2) / 2.6));
  for (let r = 0; r < nr; r++) for (let c = 0; c < nc; c++) {
    const lit = rng() < 0.55;
    b.box(faceX, 2.2 + r * 2.6, z - d / 2 + 1.2 + c * 2.4, 0.2, 1.2, 1.3, lit ? (rng() < 0.7 ? 0xfff59d : 0x90caf9) : 0x37474f);
  }
}
function lamp(b, x, z, side) {
  b.box(x, 3, z, 0.3, 6, 0.3, 0x546e7a);
  b.box(x - side * 0.8, 6.1, z, 1.6, 0.3, 0.5, 0x546e7a);
  b.box(x - side * 1.4, 5.9, z, 0.6, 0.2, 0.4, 0xfff176);
}
function cloud(b, x, y, z, rng) {
  const n = 3 + Math.floor(rng() * 3);
  for (let i = 0; i < n; i++) b.box(x + i * 5 - n * 2.5, y + (rng() - 0.5) * 2, z + (rng() - 0.5) * 4, 7 + rng() * 5, 2.4 + rng() * 1.5, 4 + rng() * 3, 0xffffff);
}

function buildWorld(ti, layout, hard) {
  disposeWorld();
  const T = TRACKS[ti], N = T.flags, len = N * SEG;
  const group = new THREE.Group();
  const b = new Batch();
  const rng = mulberry32(1337 + ti * 101);
  scene.background = new THREE.Color(T.sky);
  scene.fog = new THREE.Fog(T.sky, 80, 270);

  const sA = -40, sB = len + 130, L = sB - sA, zc = -(sA + sB) / 2;
  b.box(0, -0.8, zc, 420, 1, L, T.ground);                 // tanah
  b.box(0, -0.3, zc, 13.6, 0.4, L, 0x37474f);              // aspal
  [-1, 1].forEach((sd) => {                                // trotoar
    for (let s = sA; s < sB; s += 6) b.box(sd * 7.0, 0.05, -(s + 3), 0.6, 0.3, 6, (Math.floor(s / 6) % 2) ? 0xffffff : 0xe53935);
  });
  if (!hard) {
    // MUDAH: jalur warna penuh per segmen + marka putus-putus
    for (let k = 0; k < N; k++) for (let l = 0; l < 4; l++)
      b.box(LANE_X[l], -0.05, -(k * SEG + SEG / 2), 2.85, 0.1, SEG - 0.1, COLORS[layout[k][l]].hex);
    for (let s = 0; s < len; s += 8) [-3, 0, 3].forEach((x) => b.box(x, 0.02, -(s + 2), 0.18, 0.1, 3, 0xffffff));
  } else {
    // SULIT: aspal polos, hanya beberapa petak warna
    for (const pd of layout) {
      const zc2 = -(pd.s0 + pd.s1) / 2, col = COLORS[pd.color].hex;
      b.box(pd.x, -0.05, zc2, PAD_W, 0.1, PAD_LEN, col);
      for (let q = 2; q < PAD_LEN; q += 4) b.box(pd.x, 0.01, -(pd.s0 + q), PAD_W - 0.5, 0.08, 1.2, shade(col, 1.25));
      b.box(pd.x - PAD_W / 2, 0.0, zc2, 0.18, 0.12, PAD_LEN, 0xffffff);
      b.box(pd.x + PAD_W / 2, 0.0, zc2, 0.18, 0.12, PAD_LEN, 0xffffff);
    }
  }
  // garis start & garis tiap bendera
  for (let k = 0; k <= N; k++) b.box(0, 0.03, -k * SEG, 13.6, 0.12, 0.8, 0xffffff);
  // garis finish kotak-kotak
  for (let i = 0; i < 14; i++) for (let r = 0; r < 2; r++)
    b.box(-6.5 + i, 0.08, -len + (r ? 0.5 : -0.5), 1, 0.1, 1, (i + r) % 2 ? 0x111111 : 0xffffff);

  // tiang bendera + angka di tiap checkpoint
  for (let k = 1; k <= N; k++) {
    const z = -k * SEG;
    if (k < N) {
      [-1, 1].forEach((sd) => {
        const x = sd * 9.2;
        b.box(x, 3.5, z - 0.4, 0.4, 7, 0.4, 0x90a4ae);
        b.box(x, 4.6, z, 3.4, 3.8, 0.3, 0x263238);
        voxText(b, String(k), x, 4.6, z + 0.25, 0.55, 0xffffff);
        b.box(x + 0.9, 7.2, z - 0.4, 1.8, 1.0, 0.15, 0xff5252);
        b.box(x + 0.9, 7.2, z - 0.4, 0.5, 1.0, 0.18, 0xffffff);
      });
    } else {
      [-1, 1].forEach((sd) => {
        b.box(sd * 7.8, 5.5, z, 0.7, 11, 0.7, 0x90a4ae);
        b.box(sd * 7.8 + sd * 1.0, 11.4, z, 1.8, 1.0, 0.15, 0xff5252);
      });
      b.box(0, 8.9, z, 16.4, 3.6, 0.6, 0x111111);
      for (let i = 0; i < 16; i++) b.box(-7.5 + i, 7.3, z + 0.35, 1, 0.5, 0.15, i % 2 ? 0x111111 : 0xffffff);
      voxText(b, 'FINISH', 0, 9.2, z + 0.4, 0.5, 0xffffff);
    }
  }

  // pemandangan
  const end = len + 120;
  if (T.theme === 'desa') {
    for (let s = -30; s < end; s += 8 + rng() * 6) [-1, 1].forEach((sd) => {
      const x = sd * (12 + rng() * 28), z = -s, r = rng();
      if (r < 0.55) tree(b, x, z, rng); else if (r < 0.75) house(b, x, z, rng, sd);
      else if (r < 0.9) bush(b, x, z); else b.box(x, 0.9, z, 2.4, 1.8, 2.4, 0xf2c14e);
    });
    for (let i = 0; i < 40; i++) {            // petak sawah
      const sd = rng() < 0.5 ? -1 : 1, x = sd * (16 + rng() * 60), s = -20 + rng() * (end + 20);
      b.box(x, -0.28, -s, 8 + rng() * 14, 0.05, 10 + rng() * 14, [0x7cb342, 0x9ccc65, 0x558b2f][Math.floor(rng() * 3)]);
    }
    [-1, 1].forEach((sd) => { for (let s = -60; s < end + 60; s += 70 + rng() * 30) {   // gunung jauh
      const x = sd * (120 + rng() * 50), z = -s, w0 = 36 + rng() * 14;
      for (let i = 0; i < 5; i++) b.box(x, 4 + i * 8, z, w0 - i * 7, 8, w0 - i * 7, i === 4 ? 0xffffff : (i === 3 ? 0xbdbdbd : 0x6b8e5a));
    } });
  } else if (T.theme === 'pantai') {
    b.box(-122, -0.3, zc, 200, 0.2, L, 0x29b6f6);          // laut
    b.box(-22.5, -0.28, zc, 1.4, 0.2, L, 0xffffff);         // buih
    for (let s = -30; s < end; s += 9 + rng() * 6) {
      const r = rng();
      if (r < 0.5) palm(b, -(12 + rng() * 8), -s, rng); else umbrella(b, -(11 + rng() * 9), -s, rng);
      const x = 12 + rng() * 26, r2 = rng();
      if (r2 < 0.5) palm(b, x, -s, rng); else if (r2 < 0.75) hut(b, x, -s, 1); else bush(b, x, -s);
    }
    for (let s = 0; s < end; s += 90 + rng() * 60) {        // perahu layar
      const x = -(50 + rng() * 60), z = -s;
      b.box(x, 0.2, z, 4, 1, 10, 0x6d4c41); b.box(x, 4, z, 0.3, 8, 0.3, 0x5d4037); b.box(x, 4.5, z + 1, 0.2, 6, 4, 0xffffff);
    }
  } else {
    for (let s = -30; s < end; s += 13 + rng() * 5) [-1, 1].forEach((sd) => building(b, sd * (13 + rng() * 8), -s, rng, sd));
    for (let s = 0; s < end; s += 30) [-1, 1].forEach((sd) => lamp(b, sd * 8.4, -s, sd));
    for (let s = -40; s < end + 40; s += 14) [-1, 1].forEach((sd) => {          // gedung latar jauh
      const h = 40 + rng() * 40, x = sd * (70 + rng() * 40);
      b.box(x, h / 2, -s, 12 + rng() * 6, h, 12, [0x90a4ae, 0xb0bec5, 0x9fa8da][Math.floor(rng() * 3)]);
    });
  }
  for (let s = -40; s < end + 60; s += 35 + rng() * 20) cloud(b, (rng() - 0.5) * 220, 48 + rng() * 22, -s, rng);

  group.add(b.build());
  const dyn = new THREE.Group();
  group.add(dyn);
  scene.add(group);
  world = { group, dyn, N, len, layout, ti };
}

/* ======================= KAMERA ======================= */
function camParams() {
  const aspect = innerWidth / innerHeight;
  const fov = aspect < 1 ? 80 : 62;
  const dist = clamp(7 / (Math.tan(fov * Math.PI / 360) * aspect), 9.5, 16);
  return { fov, dist, height: 5 + (dist - 9.5) * 0.55 };
}
function resize() {
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
addEventListener('resize', resize);

/* ======================= UI (standar EZUI dari Ezventure) ======================= */
const SCREEN_IDS = { menu: 'scr-menu', pit: 'scr-pit', result: 'scr-result' };
function showScreen(name) {
  Object.entries(SCREEN_IDS).forEach(([k, id]) => EZUI.show(id, k === name));
  $('#hud').classList.toggle('on', name === 'hud');
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

function renderMenu() {
  $('#menu-coins').textContent = G.coins;
  const card = (sel, i, e, label, small, extra = '') =>
    `<button class="ccard ${sel ? 'sel' : ''}" data-i="${i}"><span class="e">${e}</span>${label}${small ? `<small>${small}</small>` : ''}${extra}</button>`;
  $('#menu-cars').innerHTML = CARS.map((c, i) => card(i === G.carIdx, i, c.emoji, c.short, COLORS[i].name, `<i class="cb" style="background:${COLORS[i].css}"></i>`)).join('');
  $('#menu-tracks').innerHTML = TRACKS.map((t, i) => card(i === G.trackIdx, i, t.emoji, t.name, t.len)).join('');
  $('#menu-diffs').innerHTML = [['easy', '😊', 'Mudah', 'ikuti jalur'], ['hard', '🔥', 'Sulit', 'setir bebas']]
    .map(([v, e, l, s]) => card(G.diff === v, v, e, l, s)).join('');
  $('#menu-levels').innerHTML = [[1, '🚩', 'Gambar'], [2, '🔢', 'Angka']].map(([v, e, l]) => card(G.level === v, v, e, l, '')).join('');
}
function renderPit() {
  const R = G.R, N = R.N;
  $('#pit-info').innerHTML = G.level === 1
    ? `<div class="flags">${'🚩'.repeat(N)}</div><p>Hitung benderanya!<br>1 bendera = 1 kotak bensin</p>`
    : `<div class="bignum">Jarak: ${N}</div><p>Isi bensin sebanyak angkanya!</p>`;
  const slots = [];
  for (let i = 0; i < TANK_MAX; i++) slots.push(`<button class="slot ${i < G.fill ? 'full' : ''}" data-i="${i}">${i + 1}</button>`);
  $('#pit-tank').innerHTML = slots.join('');
  $('#pit-count').textContent = G.fill;
  const cost = G.fill * FUEL_PRICE;
  $('#pit-cost').textContent = G.fill ? `${G.fill} kotak × ${FUEL_PRICE} koin = ${cost} koin` : 'Isi bensinnya dulu ya!';
  $('#pit-wallet').textContent = `🪙 ${G.coins}  →  sisa ${G.coins - cost}`;
  $('#btn-pay').disabled = G.fill < 1;
  $('#btn-plus').disabled = G.fill >= TANK_MAX;
  $('#btn-minus').disabled = G.fill <= 0;
}
function pitSet(n) {
  n = clamp(n, 0, TANK_MAX);
  const afford = Math.floor(G.coins / FUEL_PRICE);
  if (n > afford) {
    n = afford;
    const w = $('#pit-wallet'); w.classList.remove('shake'); void w.offsetWidth; w.classList.add('shake');
    toast('Uangmu kurang! 🪙', 900); sfx.lose();
  }
  if (n !== G.fill) { G.fill = n; sfx.tick(); if (n > 0) speak(NUM_WORDS[n]); }
  renderPit();
}

function buildHud() {
  const R = G.R;
  $('#h-ticks').innerHTML = Array.from({ length: R.N }, (_, i) => `<i style="left:${((i + 1) / R.N) * 100}%">🚩</i>`).join('');
  $('#h-pm').style.background = COLORS[R.p.color].css;
  $('#h-am').style.background = COLORS[R.a.color].css;
  $('#h-sw').style.background = COLORS[R.p.color].css;
  $('#h-hintx').textContent = R.hard ? 'Lewati petak warna ini = BOOST! 🔥' : 'Jalur warna ini = BOOST! 🔥';
  $('#h-fuel').innerHTML = Array.from({ length: R.F }, () => '<div class="fs"><i></i></div>').join('');
  $('#fx').style.setProperty('--glow', COLORS[R.p.color].css + 'cc');
  R.hudRem = -1;
}
function updateHud() {
  const R = G.R, p = R.p, a = R.a;
  $('#h-pm').style.left = (clamp(p.s / R.len, 0, 1) * 100) + '%';
  $('#h-am').style.left = (clamp(a.s / R.len, 0, 1) * 100) + '%';
  const pos = p.s >= a.s ? 1 : 2;
  if (R.hudPos !== pos) { R.hudPos = pos; $('#h-pos').textContent = pos + '/2'; }
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
function placeCar(o, x, s, yaw, bob) { o.position.set(x, bob, -s); o.rotation.y = yaw; }

function makePads(N, rng, pc, ac) {
  const pads = [];
  let lastX = 0;
  for (let k = 0; k < N; k++) {
    const cols = shuffle([pc, ac, Math.floor(rng() * 4)], rng);   // tiap segmen: warna pemain, warna lawan, 1 acak
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
  return G.diff === 'hard' ? makePads(T.flags, rng, G.carIdx, (G.carIdx + 1) % 4) : makePerms(T.flags, rng);
}

function respawnStreak(m, cz) {
  const side = Math.random() < 0.75;
  m.position.set(
    side ? (Math.random() < 0.5 ? -1 : 1) * (5.5 + Math.random() * 12) : (Math.random() - 0.5) * 8,
    side ? 0.4 + Math.random() * 7 : 8 + Math.random() * 6,
    cz - (Math.random() * 130));
}

function prepareRace() {
  const T = TRACKS[G.trackIdx];
  const rng = mulberry32((Math.random() * 2147483647) | 0);
  const hard = G.diff === 'hard';
  let ac; do { ac = Math.floor(rng() * 4); } while (ac === G.carIdx);
  const perms = makePerms(T.flags, rng);
  const pads = hard ? makePads(T.flags, rng, G.carIdx, ac) : null;
  if (hard) { pads[0].color = G.carIdx; pads[0].x = LANE_X[1]; }      // petak pertama pas di depan mobil pemain
  buildWorld(G.trackIdx, hard ? pads : perms, hard);
  mountCar('p', G.carIdx); mountCar('a', ac);
  const R = {
    N: T.flags, len: T.flags * SEG, hard, perms, pads, rng, F: 0, t: 0, cd: 3.2, lastN: 4, phase: 'wait',
    p: { s: 0, lane: 1, x: LANE_X[1], vx: 0, speed: 0, boost: false, boostT: 0, color: G.carIdx, obj: CAR.p },
    a: { s: 0, lane: 2, x: LANE_X[2], vx: 0, speed: 0, boost: false, boostT: 0, tx: LANE_X[2], color: ac, obj: CAR.a, timer: 0.6, finished: false },
    got: 0, lastSeg: 0, coinList: [], parts: [], fx: 0, towed: false, truck: null, truckS: 0, boostToast: -9, doneT: 0,
    hudPos: 0, hudRem: -1, fxOn: false, streaks: [], streakMat: null,
  };
  // koin: 1 baris (3 koin) per segmen
  const coinGeo = new THREE.BoxGeometry(0.9, 0.9, 0.25);
  const coinMat = new THREE.MeshLambertMaterial({ color: 0xffd600, emissive: 0x6b4f00 });
  for (let k = 0; k < R.N; k++) {
    const lane = Math.floor(rng() * 4), s0 = k * SEG + 15 + rng() * 55;
    const cx = hard ? (rng() * 2 - 1) * 4.5 : LANE_X[lane];
    for (let j = 0; j < 3; j++) {
      const m = new THREE.Mesh(coinGeo, coinMat), s = s0 + j * 5;
      m.position.set(cx, 1.3, -s);
      world.dyn.add(m);
      R.coinList.push({ m, s, x: cx, got: false });
    }
  }
  // partikel api boost (oranye, kuning, warna mobil)
  const mats = [new THREE.MeshBasicMaterial({ color: 0xff9800 }), new THREE.MeshBasicMaterial({ color: 0xffeb3b }), new THREE.MeshBasicMaterial({ color: COLORS[G.carIdx].hex })];
  for (let i = 0; i < 40; i++) {
    const m = new THREE.Mesh(boxGeo, mats[i % 3]); m.visible = false; world.dyn.add(m);
    R.parts.push({ m, life: 0, max: 0.35, vz: 0 });
  }
  // garis kecepatan di sekitar jalan
  R.streakMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false });
  for (let i = 0; i < 46; i++) {
    const m = new THREE.Mesh(boxGeo, R.streakMat); m.scale.set(0.07, 0.07, 3);
    respawnStreak(m, camera.position.z); world.dyn.add(m); R.streaks.push(m);
  }
  R.truck = buildTruck(); R.truck.visible = false; world.dyn.add(R.truck);
  G.R = R;
}

function startRace() {
  const R = G.R;
  R.F = G.fill;
  G.coins -= G.fill * FUEL_PRICE;
  save();
  R.phase = 'count';
  G.state = 'race';
  resetInput();
  setMusic(null);
  showScreen('hud');
  buildHud(); updateHud();
  $('#h-coins').textContent = G.coins;
  sfx.pay();
}

function segIdx(R, s) { return clamp(Math.floor(s / SEG), 0, R.N - 1); }

function finishPlayer() {
  const R = G.R;
  R.phase = 'done'; R.doneT = 0;
  R.place = R.a.finished ? 2 : 1;
  R.p.boost = false;
  setMusic(null); A.boostTarget = 0; boostFx(false); R.fxOn = false;
  (R.place === 1 && !R.towed) ? sfx.win() : sfx.lose();
}

function spawnFlame(R, o) {
  const pr = R.parts.find((q) => q.life <= 0); if (!pr) return;
  pr.life = pr.max = 0.3 + Math.random() * 0.15;
  pr.m.visible = true;
  pr.m.position.set(o.position.x + (Math.random() - 0.5) * 1.0, 0.6 + Math.random() * 0.5, o.position.z + 2.5);
  pr.vz = 3 + Math.random() * 4;
}

function stepRace(dt) {
  const R = G.R, p = R.p, a = R.a;
  R.t += dt;

  if (R.phase === 'count') {
    R.cd -= dt;
    const n = Math.ceil(R.cd);
    if (n !== R.lastN && n > 0) { R.lastN = n; showCount(String(n)); sfx.beep(); }
    if (R.cd <= 0) { R.phase = 'go'; showCount('GO!', 800); sfx.go(); setMusic('race'); }
    return;
  }

  /* --- gerak samping pemain --- */
  const canSteer = R.phase === 'go' || R.phase === 'tow';
  if (R.hard) {
    const ax = canSteer ? inputAxis() : 0;
    p.vx += (ax * STEER_SPEED - p.vx) * Math.min(1, dt * 10);
    p.x = clamp(p.x + p.vx * dt, -ROAD_HALF, ROAD_HALF);
  } else {
    p.x += (LANE_X[p.lane] - p.x) * Math.min(1, dt * 11);
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
      R.truckS = p.s + 32; R.truck.visible = true; sfx.horn();
      toast('Mobil derek datang! 🚛', 2200);
    }
  } else if (R.phase === 'towin') {
    R.truckS = Math.max(p.s + 6.8, R.truckS - 38 * dt);
    if (R.truckS <= p.s + 6.8 + 0.001) { R.phase = 'tow'; R.truck.position.x = p.x; }
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
    c.m.rotation.y += dt * 4;
    if (Math.abs(c.s - p.s) < 2 && Math.abs(c.x - p.x) < 1.6 && R.phase !== 'done') {
      c.got = true; c.m.visible = false; R.got++; sfx.coin();
      $('#h-coins').textContent = G.coins + R.got;
    }
  }

  /* --- komputer --- */
  if (!a.finished) {
    a.timer -= dt;
    let inZone;
    if (R.hard) {
      if (a.timer <= 0) {
        a.timer = 0.5 + R.rng() * 0.9;
        const nx = nextPad(R, a.s, a.color, 70);
        if (nx && R.rng() < AI_SKILL) a.tx = nx.x; else a.tx = clamp(a.tx + (R.rng() - 0.5) * 7, -4.6, 4.6);
      }
      a.vx += (clamp((a.tx - a.x) * 3, -AI_STEER, AI_STEER) - a.vx) * Math.min(1, dt * 6);
      a.x = clamp(a.x + a.vx * dt, -ROAD_HALF, ROAD_HALF);
      if (padUnder(R, a.s, a.x, a.color)) a.boostT = LINGER; else a.boostT = Math.max(0, a.boostT - dt);
      inZone = a.boostT > 0;
    } else {
      const gl = R.perms[segIdx(R, a.s)].indexOf(a.color);
      if (a.timer <= 0) { a.lane = R.rng() < AI_SKILL ? gl : Math.floor(R.rng() * 4); a.timer = 0.5 + R.rng() * 0.9; }
      a.x += (LANE_X[a.lane] - a.x) * Math.min(1, dt * 6);
      inZone = Math.abs(a.x - LANE_X[gl]) < 1.1;
    }
    a.boost = inZone;
    let target = AI_BASE * (inZone ? BOOST : 1);
    if (a.s < p.s - 40) target *= 1.05; else if (a.s > p.s + 40) target *= 0.93;
    a.speed += (target - a.speed) * Math.min(1, dt * 3);
    a.s += a.speed * dt;
    if (a.s >= R.len) { a.finished = true; a.s = R.len; }
  } else {
    a.speed *= Math.exp(-dt * 1.5); a.s += a.speed * dt; a.boost = false;
  }

  /* --- efek boost: api, vignette, suara mesin --- */
  const bo = R.phase === 'go' && p.boost;
  if (bo !== R.fxOn) { R.fxOn = bo; boostFx(bo); A.boostTarget = bo ? 1 : 0; }
  engineUpdate(p.speed, bo, p.speed > 0.8);
  R.fx += dt;
  while (R.fx > 0.03) {
    R.fx -= 0.03;
    if (bo) spawnFlame(R, p.obj);
    if (a.boost) spawnFlame(R, a.obj);
  }
  for (const q of R.parts) {
    if (q.life <= 0) continue;
    q.life -= dt; q.m.position.z += q.vz * dt;
    const k = Math.max(0, q.life / q.max);
    q.m.scale.setScalar(0.18 + 0.5 * k);
    if (q.life <= 0) q.m.visible = false;
  }
  updateHud();
}

function updateStreaks(R) {
  if (!R.streaks.length) return;
  const p = R.p, k = clamp((p.speed - 12) / 20, 0, 1) * (R.phase === 'done' ? 0 : 1);
  R.streakMat.opacity = G.state === 'race' ? 0.05 + 0.5 * k : 0;
  const L = 1.5 + p.speed * 0.28, cz = camera.position.z;
  for (const m of R.streaks) {
    if (m.position.z > cz - 1) respawnStreak(m, cz - 25);
    m.scale.z = L;
  }
}

function showResult() {
  const R = G.R;
  G.state = 'result';
  const exact = !R.towed && R.F === R.N;
  const bonusPlace = R.towed ? 0 : (R.place === 1 ? BONUS_1ST : BONUS_2ND);
  const bonusExact = exact ? BONUS_EXACT : 0;
  const earned = R.got + bonusPlace + bonusExact;
  G.coins += earned;
  save();
  let title;
  if (R.towed) title = '🚛 Diderek ke finish';
  else title = R.place === 1 ? '🥇 Juara 1!' : '🥈 Juara 2';
  let fuelLine;
  if (R.towed) fuelLine = `⛽ Bensin kurang! Kamu isi ${R.F} kotak, padahal butuh ${R.N} kotak.`;
  else if (exact) fuelLine = `⭐ Pas banget! Bensinmu ${R.N} kotak, sesuai jaraknya.`;
  else fuelLine = `⛽ Kelebihan ${R.F - R.N} kotak. ${R.F - R.N} × ${FUEL_PRICE} = ${(R.F - R.N) * FUEL_PRICE} koin terbuang.`;
  $('#res-title').textContent = title;
  $('#res-lines').innerHTML =
    `<p>${R.hard ? '🔥 Mode Sulit' : '😊 Mode Mudah'} · ${TRACKS[G.trackIdx].name}</p>` +
    `<p class="${exact ? 'good' : 'bad'}">${fuelLine}</p>` +
    `<table><tr><td>🪙 Koin di jalan</td><td>+${R.got}</td></tr>` +
    `<tr><td>🏆 Bonus juara</td><td>+${bonusPlace}</td></tr>` +
    `<tr><td>⭐ Bonus bensin pas</td><td>+${bonusExact}</td></tr>` +
    `<tr class="tot"><td>Uangmu sekarang</td><td>🪙 ${G.coins}</td></tr></table>`;
  clearOverlays();
  resetInput();
  boostFx(false); A.boostTarget = 0; engineUpdate(0, false, false);
  setMusic('menu');
  showScreen('result');
  $('#h-coins').textContent = G.coins;
}

function updatePreview(dt) {
  G.t += dt;
  const ang = G.t * 0.35 + 0.6, r = G.state === 'pit' ? 12 : 11;
  camera.position.set(Math.sin(ang) * r, 3.6, Math.cos(ang) * r);
  camera.lookAt(0, 1.1, -1.5);
  if (G.state === 'menu' && innerWidth > innerHeight) camera.translateX(-3.6);   // mobil muncul di kanan panel
  if (camera.fov !== 55) { camera.fov = 55; camera.updateProjectionMatrix(); }
  const bob = Math.sin(G.t * 3) * 0.03;
  if (CAR.p) placeCar(CAR.p, LANE_X[1], 0, 0, bob);
  if (CAR.a) placeCar(CAR.a, LANE_X[2], 0, 0, bob);
}
function updateChase(dt) {
  const R = G.R, p = R.p, cp = camParams();
  const f = 1 - Math.exp(-dt * 6);
  camera.fov += (cp.fov + (p.boost ? 12 : 0) - camera.fov) * f;
  camera.updateProjectionMatrix();
  const tx = p.x * 0.55, tz = -p.s + cp.dist;
  camera.position.x += (tx - camera.position.x) * f;
  camera.position.y += (cp.height - camera.position.y) * f;
  camera.position.z += (tz - camera.position.z) * (1 - Math.exp(-dt * 10));
  camera.lookAt(p.x * 0.6, 1.6, -p.s - 14);
  camera.rotateZ((Math.random() - 0.5) * 0.014 * A.boostI);      // goyang halus saat boost
}
function syncCars() {
  const R = G.R;
  for (const c of [R.p, R.a]) {
    const bob = Math.sin(R.t * 18 + (c === R.a ? 1.7 : 0)) * 0.04 * Math.min(1, c.speed / BASE);
    const yaw = R.hard ? -c.vx * 0.03 : -(LANE_X[c.lane] - c.x) * 0.08;
    placeCar(c.obj, c.x, c.s, yaw, bob);
  }
  if (R.truck && R.truck.visible) {
    R.truck.position.set(R.p.x, 0, -R.truckS);
    R.truck.rotation.y = Math.PI;
  }
}

function update(dt) {
  A.boostI += (A.boostTarget - A.boostI) * Math.min(1, dt * 4);
  if (G.state === 'race' || G.state === 'result') {
    const R = G.R;
    if (G.state === 'race') stepRace(dt);
    else {
      R.p.speed *= Math.exp(-dt * 1.8); R.p.s += R.p.speed * dt;
      R.a.speed *= Math.exp(-dt * 1.5); R.a.s += R.a.speed * dt;
    }
    syncCars();
    updateStreaks(R);
    if (G.state === 'race') updateChase(dt);
    else {    // orbit pelan di garis finish
      G.t += dt;
      const ang = G.t * 0.5;
      camera.position.set(R.p.x + Math.sin(ang) * 11, 4.2, -R.p.s + Math.cos(ang) * 11);
      camera.lookAt(R.p.x, 1.2, -R.p.s);
    }
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
  buildWorld(G.trackIdx, previewLayout(), G.diff === 'hard');
  mountCar('p', G.carIdx); mountCar('a', (G.carIdx + 1) % 4);
  renderMenu(); showScreen('menu');
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
  G.carIdx = +t.dataset.i; save(); sfx.tick();
  mountCar('p', G.carIdx); mountCar('a', (G.carIdx + 1) % 4);
  buildWorld(G.trackIdx, previewLayout(), G.diff === 'hard');
  renderMenu();
});
$('#menu-tracks').addEventListener('click', (e) => {
  const t = e.target.closest('[data-i]'); if (!t) return;
  G.trackIdx = +t.dataset.i; save(); sfx.tick();
  buildWorld(G.trackIdx, previewLayout(), G.diff === 'hard');
  renderMenu();
});
$('#menu-diffs').addEventListener('click', (e) => {
  const t = e.target.closest('[data-i]'); if (!t) return;
  G.diff = t.dataset.i === 'hard' ? 'hard' : 'easy'; save(); sfx.tick();
  buildWorld(G.trackIdx, previewLayout(), G.diff === 'hard');
  renderMenu();
});
$('#menu-levels').addEventListener('click', (e) => {
  const t = e.target.closest('[data-i]'); if (!t) return;
  G.level = +t.dataset.i; save(); sfx.tick(); renderMenu();
});
$('#btn-play').addEventListener('click', () => { sfx.beep(); goPit(); });
$('#pit-tank').addEventListener('click', (e) => {
  const t = e.target.closest('[data-i]'); if (!t) return;
  const n = +t.dataset.i + 1;
  pitSet(n === G.fill ? n - 1 : n);
});
$('#btn-plus').addEventListener('click', () => pitSet(G.fill + 1));
$('#btn-minus').addEventListener('click', () => pitSet(G.fill - 1));
$('#btn-say').addEventListener('click', () => {
  const N = G.R.N;
  speak(G.level === 1 ? 'Hitung benderanya, lalu isi bensin sebanyak itu.' : `Jarak, ${NUM_WORDS[N]}. Isi bensin sesuai angkanya.`);
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
const unlock = () => { if (audioInit()) applyMode(); };
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
  $('#ver').textContent = 'Gembalap v0.2 · build ' + (bm && bm.content.indexOf('__') < 0 ? bm.content : 'dev');
}
resize();
goMenu();
let last = performance.now();
function frame(now) {
  requestAnimationFrame(frame);
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  update(dt);
  renderer.render(scene, camera);
}
requestAnimationFrame(frame);

// untuk pengujian / debug
window.__balap = { G, A, IN, update, steer, press, prepareRace, startRace, goPit, goMenu, pitSet, padUnder, nextPad, audioTest, SEG, LANE_X, TRACKS, PAD_W };
