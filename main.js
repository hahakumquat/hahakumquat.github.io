import * as THREE from 'three';

// ---- Tunables -------------------------------------------------------------
const BG_COLOR   = 0xf5f4f0; // keep in sync with --bg in style.css
const LINE_COLOR = 0x9a978f;
const LINE_ALPHA = 0.4;
const SIZE       = 60;       // plane width/depth in world units
const SEGMENTS   = 160;      // geometry resolution
const CELL       = 0.6;      // grid cell size (world units)
const AMPLITUDE  = 0.35;     // wave height
const SPEED      = 0.5;      // time multiplier
const PARALLAX   = 0.35;     // camera sway from pointer
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

const geometry = new THREE.PlaneGeometry(SIZE, SIZE, SEGMENTS, SEGMENTS);
geometry.rotateX(-Math.PI / 2);

const material = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: false,
  side: THREE.DoubleSide,
  uniforms: {
    uTime:    { value: 0 },
    uAmp:     { value: AMPLITUDE },
    uCell:    { value: CELL },
    uLine:    { value: new THREE.Color(LINE_COLOR) },
    uAlpha:   { value: LINE_ALPHA },
    uFogNear: { value: 6 },
    uFogFar:  { value: 30 },
  },
  vertexShader: /* glsl */ `
    uniform float uTime;
    uniform float uAmp;
    varying vec2 vWorld;
    varying float vDepth;

    float wave(vec2 p, float t) {
      float h = 0.0;
      h += sin(p.x * 0.35 + t * 0.9) * 0.55;
      h += sin(p.y * 0.45 - t * 0.7) * 0.45;
      h += sin((p.x + p.y) * 0.22 + t * 0.5) * 0.6;
      h += sin(length(p - vec2(4.0, -8.0)) * 0.55 - t * 1.1) * 0.35;
      return h;
    }

    void main() {
      vec3 pos = position;
      pos.y += wave(pos.xz, uTime) * uAmp;
      vWorld = pos.xz;
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

    void main() {
      vec2 g = vWorld / uCell;
      vec2 d = abs(fract(g - 0.5) - 0.5) / fwidth(g);
      float line = 1.0 - min(min(d.x, d.y), 1.0);
      float fade = 1.0 - smoothstep(uFogNear, uFogFar, vDepth);
      float a = line * fade * uAlpha;
      if (a < 0.003) discard;
      gl_FragColor = vec4(uLine, a);
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

// ---- Pointer parallax -----------------------------------------------------
const pointer = new THREE.Vector2(0, 0);
window.addEventListener('pointermove', (e) => {
  pointer.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
});

// ---- Loop -----------------------------------------------------------------
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const clock = new THREE.Clock();
let elapsed = 8; // start mid-wave so the first frame isn't flat
let running = false;

function render() {
  material.uniforms.uTime.value = elapsed * SPEED;
  camera.lookAt(lookTarget);
  renderer.render(scene, camera);
}

function frame() {
  if (!running) return;
  elapsed += Math.min(clock.getDelta(), 0.1);
  const tx = camBase.x + pointer.x * PARALLAX;
  const ty = camBase.y - pointer.y * PARALLAX * 0.5;
  camera.position.x += (tx - camera.position.x) * 0.03;
  camera.position.y += (ty - camera.position.y) * 0.03;
  render();
  requestAnimationFrame(frame);
}

function start() {
  if (running || reducedMotion.matches || document.hidden) return;
  running = true;
  clock.getDelta();
  requestAnimationFrame(frame);
}

function stop() { running = false; }

window.addEventListener('resize', () => { resize(); if (!running) render(); });
document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) { stop(); render(); } else start();
});

resize();
render();
start();
