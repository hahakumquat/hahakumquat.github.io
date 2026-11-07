// Plucked-string synth (Karplus–Strong) with a soft echo.
// Audio is created lazily on the first user gesture.

let ctx = null;
let master = null;
let send = null;
const buffers = new Map();

function init() {
  ctx = new (window.AudioContext || window.webkitAudioContext)();

  const comp = ctx.createDynamicsCompressor();
  comp.connect(ctx.destination);

  master = ctx.createGain();
  master.gain.value = 0.7;
  master.connect(comp);

  // Feedback echo, low-passed so repeats get darker.
  send = ctx.createGain();
  send.gain.value = 0.35;
  const delay = ctx.createDelay(1.0);
  delay.delayTime.value = 0.32;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.38;
  const tone = ctx.createBiquadFilter();
  tone.type = 'lowpass';
  tone.frequency.value = 2200;
  send.connect(delay);
  delay.connect(tone);
  tone.connect(feedback);
  feedback.connect(delay);
  tone.connect(comp);
}

export function unlock() {
  if (!ctx) init();
  if (ctx.state === 'suspended') ctx.resume();
}

function stringBuffer(freq) {
  const sr = ctx.sampleRate;
  const len = Math.floor(sr * 3.0);
  const period = Math.max(2, Math.round(sr / freq));
  const data = new Float32Array(len);

  // Excite with smoothed noise for a warmer, nylon-ish attack.
  for (let i = 0; i < period; i++) data[i] = Math.random() * 2 - 1;
  for (let i = 1; i < period; i++) data[i] = 0.5 * (data[i] + data[i - 1]);

  const decay = 0.996;
  for (let i = period; i < len; i++) {
    data[i] = decay * 0.5 * (data[i - period] + data[i - period + 1]);
  }

  // Normalise and fade the tail to avoid a click.
  let peak = 0;
  for (let i = 0; i < len; i++) peak = Math.max(peak, Math.abs(data[i]));
  const fade = Math.floor(sr * 0.3);
  for (let i = 0; i < len; i++) {
    const tail = i > len - fade ? (len - i) / fade : 1;
    data[i] = (data[i] / (peak || 1)) * tail;
  }

  const buf = ctx.createBuffer(1, len, sr);
  buf.copyToChannel(data, 0);
  return buf;
}

// Major pentatonic from C3 across three octaves (+ top C).
const DEGREES = [0, 2, 4, 7, 9];
const BASE = 130.81; // C3
export const NOTES = [];
for (let oct = 0; oct < 3; oct++) {
  for (const d of DEGREES) NOTES.push(BASE * Math.pow(2, oct + d / 12));
}
NOTES.push(BASE * 8);

// t in [0, 1] picks a note left→right; velocity in [0, 1].
export function pluck(t, velocity) {
  unlock();
  const idx = Math.min(NOTES.length - 1, Math.max(0, Math.round(t * (NOTES.length - 1))));
  const freq = NOTES[idx];
  let buf = buffers.get(idx);
  if (!buf) { buf = stringBuffer(freq); buffers.set(idx, buf); }

  const src = ctx.createBufferSource();
  src.buffer = buf;
  const gain = ctx.createGain();
  gain.gain.value = 0.12 + 0.55 * Math.min(1, velocity);
  src.connect(gain);
  gain.connect(master);
  gain.connect(send);
  src.start();
  return idx;
}
