import * as THREE from 'three';
import { pluck, unlock } from './audio.js';

// ---- Tunables -------------------------------------------------------------
const BG_COLOR   = 0xf5f4f0; // keep in sync with --bg in style.css
const LINE_COLOR = 0x9a978f;
const LINE_ALPHA = 0.4;
const WIDTH      = 56;       // plane width (x) in world units
const NEAR_Z     = 8;        // plane starts just in front of the camera...
const FAR_Z      = -32;      // ...and ends past the fog
// Vertices per world unit. ~10 keeps max-pull bumps smooth; lighter on touch devices.
const DENSITY    = window.matchMedia('(pointer: coarse)').matches ? 6 : 10;
const CELL       = 0.6;      // grid cell size (world units)
const AMPLITUDE  = 0.35;     // ambient wave height
const SPEED      = 0.5;      // ambient time multiplier
const PARALLAX   = 0.35;     // camera sway from pointer

const MAX_RIPPLES = 8;       // must match #define in shader
const RIPPLE_LIFE = 6.0;     // seconds
const PULL_MAX    = 1.6;     // max pull height
const PULL_GAIN   = 6.0;     // screen-height fraction → pull height
const TAP_AMP     = 0.5;     // amplitude for a click without a drag
const PITCH_SPAN  = 10;      // world-x range [-SPAN, SPAN] mapped low→high
// ---------------------------------------------------------------------------

const canvas = document.getElementById('bg');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setClearColor(BG_COLOR, 1);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
const camBase = new THREE.Vector3(0, 2.2, 7);
const lookTarget = new THREE.Vector3(0, 0, -6);
camera.position.copy(camBase);

const DEPTH = NEAR_Z - FAR_Z;
const geometry = new THREE.PlaneGeometry(WIDTH, DEPTH, Math.round(WIDTH * DENSITY), Math.round(DEPTH * DENSITY));
geometry.rotateX(-Math.PI / 2);
geometry.translate(0, 0, (NEAR_Z + FAR_Z) / 2);

const ripples = Array.from({ length: MAX_RIPPLES }, () => new THREE.Vector4(0, 0, -1e3, 0));
let rippleIdx = 0;

const material = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: false,
  side: THREE.DoubleSide,
  uniforms: {
    uTime:    { value: 0 },
    uNow:     { value: 0 },
    uAmp:     { value: AMPLITUDE },
    uCell:    { value: CELL },
    uLine:    { value: new THREE.Color(LINE_COLOR) },
    uAlpha:   { value: LINE_ALPHA },
    uFogNear: { value: 6 },
    uFogFar:  { value: 30 },
    uRip:     { value: ripples },                     // x, z, startTime, amplitude
    uPull:    { value: new THREE.Vector4(0, 0, 0, 0) }, // x, z, height, unused
  },
  vertexShader: /* glsl */ `
    #define MAX_R ${MAX_RIPPLES}
    #define LIFE ${RIPPLE_LIFE.toFixed(1)}
    uniform float uTime;
    uniform float uNow;
    uniform float uAmp;
    uniform vec4 uRip[MAX_R];
    uniform vec4 uPull;
    varying vec2 vWorld;
    varying float vDepth;
    varying vec3 vRainbow;
    varying float vGlow;

    vec3 hsv2rgb(vec3 c) {
      vec3 p = abs(fract(c.xxx + vec3(0.0, 2.0 / 3.0, 1.0 / 3.0)) * 6.0 - 3.0);
      return c.z * mix(vec3(1.0), clamp(p - 1.0, 0.0, 1.0), c.y);
    }

    float ambient(vec2 p, float t) {
      float h = 0.0;
      h += sin(p.x * 0.35 + t * 0.9) * 0.55;
      h += sin(p.y * 0.45 - t * 0.7) * 0.45;
      h += sin((p.x + p.y) * 0.22 + t * 0.5) * 0.6;
      h += sin(length(p - vec2(4.0, -8.0)) * 0.55 - t * 1.1) * 0.35;
      return h;
    }

    void main() {
      vec3 pos = position;
      vec2 p = pos.xz;
      float h = ambient(p, uTime) * uAmp;

      vec3 rainbow = vec3(0.0);
      float glow = 0.0;

      // Held pull: a smooth bump under the pointer.
      if (uPull.z != 0.0) {
        float d2 = dot(p - uPull.xy, p - uPull.xy);
        h += uPull.z * exp(-d2 / 2.5);
        float g = clamp(abs(uPull.z), 0.0, 1.0) * exp(-d2 * 0.2);
        vec2 q = p - uPull.xy;
        rainbow += g * hsv2rgb(vec3(fract(atan(q.y, q.x) / 6.2832 + uNow * 0.3), 0.85, 0.95));
        glow += g;
      }

      // Released plucks: a central "string" oscillation + an outgoing ring.
      for (int i = 0; i < MAX_R; i++) {
        vec4 r = uRip[i];
        float age = uNow - r.z;
        if (r.w == 0.0 || age < 0.0 || age > LIFE) continue;
        float d = distance(p, r.xy);
        float front = age * 3.5;
        float width = 2.5 + age * 1.5;
        float ring = exp(-pow(d - front, 2.0) / width);
        float decay = exp(-age * 0.8);
        float atten = 1.0 / (1.0 + d * 0.12);

        float centre = exp(-d * d / 2.5) * cos(age * 14.0) * exp(-age * 3.0);
        float wave = ring * cos((d - front) * 2.0) * decay * atten;
        h += r.w * (0.6 * centre + 0.6 * wave);

        float g = ring * exp(-age * 0.9) * min(abs(r.w), 1.0) + abs(centre) * 0.5;
        vec2 q = p - r.xy;
        float hue = fract(atan(q.y, q.x) / 6.2832 + d * 0.04 - age * 0.25 + r.z * 0.137);
        rainbow += g * hsv2rgb(vec3(hue, 0.85, 0.95));
        glow += g;
      }

      pos.y += h;
      vWorld = p;
      vRainbow = rainbow;
      vGlow = glow;
      vec4 mv = modelViewMatrix * vec4(pos, 1.0);
      vDepth = -mv.z;
      gl_Position = projectionMatrix * mv;
    }
  `,
  fragmentShader: /* glsl */ `
    uniform float uCell;
    uniform vec3 uLine;
    uniform float uAlpha;
    uniform float uFogNear;
    uniform float uFogFar;
    varying vec2 vWorld;
    varying float vDepth;
    varying vec3 vRainbow;
    varying float vGlow;

    void main() {
      float glow = clamp(vGlow, 0.0, 1.0);
      vec2 g = vWorld / uCell;
      vec2 d = abs(fract(g - 0.5) - 0.5) / fwidth(g);
      float line = 1.0 - min(min(d.x, d.y) / (1.0 + glow * 0.8), 1.0);
      float fade = 1.0 - smoothstep(uFogNear, uFogFar, vDepth);
      vec3 rainbow = vGlow > 0.0001 ? vRainbow / vGlow : uLine;
      vec3 col = mix(uLine, rainbow, glow);
      float a = line * fade * (uAlpha + glow * 0.6);
      if (a < 0.003) discard;
      gl_FragColor = vec4(col, a);
    }
  `,
});

scene.add(new THREE.Mesh(geometry, material));

// ---- Sizing ---------------------------------------------------------------
function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

// ---- Pointer: parallax + pluck --------------------------------------------
const pointer = new THREE.Vector2(0, 0);
const raycaster = new THREE.Raycaster();
const ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const hit = new THREE.Vector3();
const pull = material.uniforms.uPull.value;
let drag = null; // { id, startY }

window.addEventListener('pointermove', (e) => {
  pointer.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
});

function worldAt(e) {
  const ndc = new THREE.Vector2((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
  raycaster.setFromCamera(ndc, camera);
  return raycaster.ray.intersectPlane(ground, hit);
}

canvas.addEventListener('pointerdown', (e) => {
  if (e.button !== 0 || !worldAt(e)) return;
  unlock(); // create/resume audio inside the user gesture
  canvas.setPointerCapture(e.pointerId);
  drag = { id: e.pointerId, startY: e.clientY };
  pull.set(hit.x, hit.z, 0.0001, 0);
  document.body.classList.add('plucking');
  kick();
});

canvas.addEventListener('pointermove', (e) => {
  if (!drag || e.pointerId !== drag.id) return;
  const h = ((drag.startY - e.clientY) / window.innerHeight) * PULL_GAIN;
  pull.z = THREE.MathUtils.clamp(h, -PULL_MAX, PULL_MAX) || 0.0001;
});

function release(e, play) {
  if (!drag || e.pointerId !== drag.id) return;
  drag = null;
  document.body.classList.remove('plucking');
  let amp = pull.z;
  if (Math.abs(amp) < 0.08) amp = TAP_AMP;
  pull.z = 0;
  if (!play) return;

  ripples[rippleIdx].set(pull.x, pull.y, now, amp);
  rippleIdx = (rippleIdx + 1) % MAX_RIPPLES;

  const t = THREE.MathUtils.clamp((pull.x + PITCH_SPAN) / (2 * PITCH_SPAN), 0, 1);
  pluck(t, Math.abs(amp) / PULL_MAX);
  kick();
}
canvas.addEventListener('pointerup', (e) => release(e, true));
canvas.addEventListener('pointercancel', (e) => release(e, false));

// ---- Loop -----------------------------------------------------------------
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const clock = new THREE.Clock();
let elapsed = 8; // ambient time; start mid-wave so the first frame isn't flat
let now = 0;     // real time for plucks
let running = false;

function busy() {
  if (drag) return true;
  return ripples.some((r) => r.w !== 0 && now - r.z < RIPPLE_LIFE);
}

function render() {
  material.uniforms.uTime.value = elapsed * SPEED;
  material.uniforms.uNow.value = now;
  camera.lookAt(lookTarget);
  renderer.render(scene, camera);
}

function frame() {
  const dt = Math.min(clock.getDelta(), 0.1);
  now += dt;
  if (!reducedMotion.matches) {
    elapsed += dt;
    const tx = camBase.x + pointer.x * PARALLAX;
    const ty = camBase.y - pointer.y * PARALLAX * 0.5;
    camera.position.x += (tx - camera.position.x) * 0.03;
    camera.position.y += (ty - camera.position.y) * 0.03;
  }
  render();
  if (!document.hidden && (!reducedMotion.matches || busy())) {
    requestAnimationFrame(frame);
  } else {
    running = false;
  }
}

// Start the loop if it isn't already running.
function kick() {
  if (running || document.hidden) return;
  running = true;
  clock.getDelta();
  requestAnimationFrame(frame);
}

window.addEventListener('resize', () => { resize(); if (!running) render(); });
document.addEventListener('visibilitychange', () => { if (!document.hidden && !reducedMotion.matches) kick(); });
reducedMotion.addEventListener('change', () => { if (!reducedMotion.matches) kick(); });

resize();
render();
if (!reducedMotion.matches) kick();
