import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { PRODUCTS } from '../../showcase/products';
import { backdropTarget } from './backdrop';

/**
 * Behind the whole home page: liquid silk. One slow, domain-warped field, broad and soft, lit like satin —
 * its folds take a sheen from a light above, so it reads as cloth catching the light rather than smoke.
 * Its colours are the product on screen (see backdrop.ts): they melt from one product into the next as
 * the hero changes phones and as the line-up turns, and settle to a neutral graphite past the line-up.
 * Drawn at a third of the screen's resolution, ≤30 fps; one still frame for reduced motion.
 */

const VERTEX = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAGMENT = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform float uScroll;
uniform vec3 cBase;
uniform vec3 cDeep;
uniform vec3 cGlow;
uniform vec3 cAccent;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 r = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = r * p * 2.03; a *= 0.5; }
  return v;
}

void main() {
  vec2 frag = gl_FragCoord.xy / uRes;
  // Broad folds: a large scale, stretched sideways like draped cloth.
  vec2 p = gl_FragCoord.xy / uRes.y * vec2(0.55, 0.85) + vec2(0.0, uScroll);
  float t = uTime * 0.022;
  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p + 2.2 * q + vec2(1.7, 9.2) + 0.6 * t), fbm(p + 2.2 * q + vec2(8.3, 2.8) - 0.45 * t));
  vec2 w = p + 2.4 * r;
  float f = fbm(w);
  // The cloth's slope, for its sheen.
  float e = 0.012;
  float fx = fbm(w + vec2(e, 0.0));
  float fy = fbm(w + vec2(0.0, e));
  vec3 n = normalize(vec3((f - fx) / e * 0.28, (f - fy) / e * 0.28, 1.0));
  vec3 light = normalize(vec3(-0.35, 0.75, 0.6));
  float diffuse = clamp(dot(n, light), 0.0, 1.0);
  float sheen = pow(clamp(dot(reflect(-light, n), vec3(0.0, 0.0, 1.0)), 0.0, 1.0), 14.0);

  vec3 col = mix(cBase, cDeep, smoothstep(0.18, 0.82, f));
  col *= 0.55 + 0.75 * diffuse;
  col += cGlow * sheen * 0.42;
  col += cAccent * pow(sheen, 3.0) * 0.06;
  // Pooled toward the middle, where the phone stands; the edges and the top bar settle into black.
  float v = smoothstep(1.1, 0.2, length((frag - vec2(0.5, 0.48)) * vec2(1.05, 1.3)));
  col = mix(cBase, col, 0.25 + 0.75 * v);
  gl_FragColor = vec4(col, 1.0);
}
`;

type RGB = [number, number, number];
const rgb = (hex: string): RGB => {
  const n = parseInt(hex.replace('#', ''), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};
const scaled = (c: RGB, k: number) => c.map((v) => Math.min(1, v * k)) as RGB;
const mix = (a: RGB, b: RGB, t: number) => a.map((v, i) => v + (b[i] - v) * t) as RGB;
/** The page's background (index.css: hsl(240 12% 3%)). */
const BASE: RGB = [0.027, 0.027, 0.034];
const SCALE = 1 / 3;

interface Palette { deep: RGB; glow: RGB; accent: RGB }
const PALETTES: Palette[] = PRODUCTS.map((p) => {
  const deep = rgb(p.accentDeep);
  return { deep, glow: scaled(deep, 2.6), accent: rgb(p.accent) };
});
/** Past the line-up: graphite silk, no product's colour. */
const NEUTRAL: Palette = { deep: rgb('#1a1a20'), glow: rgb('#4a4a55'), accent: rgb('#9a9aa8') };

const smooth = (x: number) => x * x * (3 - 2 * x);
function paletteAt(pos: number, neutral: number): Palette {
  const i = Math.max(0, Math.min(PALETTES.length - 1, Math.floor(pos)));
  const j = Math.min(PALETTES.length - 1, i + 1);
  const t = smooth(Math.max(0, Math.min(1, pos - i)));
  const a = PALETTES[i], b = PALETTES[j];
  const at = (k: keyof Palette) => mix(mix(a[k], b[k], t), NEUTRAL[k], neutral);
  return { deep: at('deep'), glow: at('glow'), accent: at('accent') };
}

export default function HomeBackdrop() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const reduce = !!useReducedMotion();

  useEffect(() => {
    const el = canvas.current;
    const gl = el?.getContext('webgl', { antialias: false, depth: false, alpha: false, powerPreference: 'low-power' });
    if (!el || !gl) return;

    const shader = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAGMENT));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(prog, name);
    gl.uniform3fv(u('cBase'), BASE);
    const uRes = u('uRes'), uTime = u('uTime'), uScroll = u('uScroll');
    const uDeep = u('cDeep'), uGlow = u('cGlow'), uAccent = u('cAccent');

    const resize = () => {
      el.width = Math.max(1, Math.round(window.innerWidth * SCALE));
      el.height = Math.max(1, Math.round(window.innerHeight * SCALE));
      gl.viewport(0, 0, el.width, el.height);
      gl.uniform2f(uRes, el.width, el.height);
    };
    resize();
    window.addEventListener('resize', resize);

    // Where among the products the colour is, eased: slowly for the hero's changes of phone (they're
    // instant), closely for the line-up's (already as smooth as the scroll).
    let pos = backdropTarget()?.value ?? 0;
    let neutral = 0;
    let lastMs = 0;
    const draw = (ms: number) => {
      const dt = lastMs ? Math.min(0.1, (ms - lastMs) / 1000) : 0;
      lastMs = ms;
      const target = backdropTarget();
      if (target) {
        const rate = target.id === 'lineup' ? 10 : 1.8;
        if (target.value !== null) pos += (target.value - pos) * (reduce ? 1 : 1 - Math.exp(-dt * rate));
        neutral += ((target.value === null ? 1 : 0) - neutral) * (reduce ? 1 : 1 - Math.exp(-dt * 2));
      }
      const pal = paletteAt(pos, neutral);
      gl.uniform3fv(uDeep, pal.deep);
      gl.uniform3fv(uGlow, pal.glow);
      gl.uniform3fv(uAccent, pal.accent);
      gl.uniform1f(uTime, reduce ? 20 : ms / 1000);
      gl.uniform1f(uScroll, (window.scrollY / window.innerHeight) * 0.08);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    let raf = 0;
    let last = 0;
    const tick = (ms: number) => {
      raf = requestAnimationFrame(tick);
      if (document.hidden || ms - last < 33) return;
      last = ms;
      draw(ms);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
    };
  }, [reduce]);

  return (
    <div aria-hidden className="fixed inset-0 pointer-events-none bg-[#070709]">
      <canvas ref={canvas} className="w-full h-full" />
    </div>
  );
}
