// Soft handpan/kalimba-like tone: sine partials, gentle attack, long decay,
// low-passed, through a warm generated reverb. Audio starts on the first
// user gesture.

let ctx = null;
let master = null;
let reverbSend = null;

// ---- Tunables -------------------------------------------------------------
const MASTER_GAIN = 0.5;
const REVERB_MIX  = 0.45;   // send level into the reverb
const REVERB_TIME = 3.5;    // seconds
const ATTACK      = 0.015;  // seconds; > ~10ms avoids a click/"tick"
const DECAY       = 2.8;    // seconds for the fundamental to fade out
const MAX_NOTE_GAIN = 0.28; // loudest pluck
// Partials: [frequency ratio, relative level, decay fraction]
const PARTIALS = [
  [1.0,   1.0,  1.0],   // fundamental
  [1.003, 0.35, 0.9],   // slight detune for warmth/chorus
  [2.0,   0.18, 0.45],  // octave
  [3.0,   0.05, 0.25],  // compound fifth, very faint
];
// ---------------------------------------------------------------------------

function makeImpulse(seconds) {
  const sr = ctx.sampleRate;
  const len = Math.floor(sr * seconds);
  const buf = ctx.createBuffer(2, len, sr);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    let lp = 0;
    for (let i = 0; i < len; i++) {
      // Low-passed noise with an exponential tail = soft, dark room.
      lp += 0.25 * ((Math.random() * 2 - 1) - lp);
      d[i] = lp * Math.pow(1 - i / len, 3);
    }
  }
  return buf;
}

function init() {
  ctx = new (window.AudioContext || window.webkitAudioContext)();

  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -18;
  comp.ratio.value = 3;
  comp.connect(ctx.destination);

  // Gentle overall roll-off of the highs.
  const tone = ctx.createBiquadFilter();
  tone.type = 'lowpass';
  tone.frequency.value = 2400;
  tone.Q.value = 0.4;
  tone.connect(comp);

  master = ctx.createGain();
  master.gain.value = MASTER_GAIN;
  master.connect(tone);

  const reverb = ctx.createConvolver();
  reverb.buffer = makeImpulse(REVERB_TIME);
  const wet = ctx.createGain();
  wet.gain.value = 0.6;
  reverb.connect(wet);
  wet.connect(tone);

  reverbSend = ctx.createGain();
  reverbSend.gain.value = REVERB_MIX;
  reverbSend.connect(reverb);
}

export function unlock() {
  if (!ctx) init();
  if (ctx.state === 'suspended') ctx.resume();
}

// Major pentatonic, C3 → C5.
const DEGREES = [0, 2, 4, 7, 9];
const BASE = 130.81; // C3
export const NOTES = [];
for (let oct = 0; oct < 2; oct++) {
  for (const d of DEGREES) NOTES.push(BASE * Math.pow(2, oct + d / 12));
}
NOTES.push(BASE * 4);

// t in [0, 1] picks a note left→right; velocity in [0, 1].
export function pluck(t, velocity) {
  unlock();
  const idx = Math.min(NOTES.length - 1, Math.max(0, Math.round(t * (NOTES.length - 1))));
  const freq = NOTES[idx];
  const now = ctx.currentTime;
  const v = Math.min(1, Math.max(0, velocity));
  const peak = MAX_NOTE_GAIN * (0.35 + 0.65 * v);

  // Per-note low-pass: softer plucks are darker.
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = Math.min(2000, freq * (2.5 + 2 * v));
  lp.Q.value = 0.3;
  lp.connect(master);
  lp.connect(reverbSend);

  const end = now + DECAY + 0.2;
  for (const [ratio, level, decayFrac] of PARTIALS) {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq * ratio;

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(peak * level, now + ATTACK);
    g.gain.exponentialRampToValueAtTime(0.0001, now + ATTACK + DECAY * decayFrac);

    osc.connect(g);
    g.connect(lp);
    osc.start(now);
    osc.stop(end);
  }
  return idx;
}
