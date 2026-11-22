import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import type { ShowcaseProduct } from '../../showcase/products';

/**
 * Behind the whole case study: smoke in the product's accent — thin, curling wisps rising slowly through
 * the dark, gathered in loose plumes with clear black between them (the dense cloud it replaced was too
 * heavy behind the page). Two layers of wisps at different scales for depth; it drifts on its own and a
 * little with the scroll. Drawn at half the screen's resolution and at most ~30 frames a second; one still frame for reduced motion; a plain glow without WebGL.
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
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = r * p * 2.02; a *= 0.5; }
  return v;
}

/** Thin threads where a field crosses its middle value: smoke's filaments rather than a cloud. */
float wisps(vec2 p, float t) {
  // The field rises and curls: it is bent by a slower field of its own, drifting the other way.
  vec2 bend = vec2(fbm(p * 0.7 + vec2(0.0, -t * 0.6)), fbm(p * 0.7 + vec2(4.1, 2.7) + t * 0.3));
  float f = fbm(p + 1.6 * bend + vec2(0.0, -t));
  float thread = 1.0 - abs(f - 0.5) * 2.0;
  return pow(thread, 6.0);
}

void main() {
  vec2 frag = gl_FragCoord.xy / uRes;
  vec2 uv = gl_FragCoord.xy / uRes.y + vec2(0.0, uScroll);
  float t = uTime * 0.05;

  // Two layers of wisps, a broad slow one and a finer quicker one, for depth.
  float near = wisps(uv * 1.3, t);
  float far = wisps(uv * 2.4 + vec2(7.3, 1.9), t * 1.4);
  // Smoke comes in plumes, not everywhere: a slow mask leaves most of the page clear.
  float plume = smoothstep(0.3, 0.68, fbm(uv * 0.55 + vec2(t * 0.25, -t * 0.4)));
  float smoke = (near * 0.9 + far * 0.45) * plume;

  // Soft colour around the threads, a brighter core along them.
  vec3 col = cBase;
  col += cDeep * plume * 0.4;
  col += cAccent * smoke * 0.5;
  col += vec3(1.0) * pow(smoke, 3.0) * 0.12;
  // Thins out toward the edges.
  float v = smoothstep(1.1, 0.2, length((frag - vec2(0.55, 0.5)) * vec2(1.1, 1.3)));
  col = mix(cBase, col, 0.3 + 0.7 * v);
  gl_FragColor = vec4(col, 1.0);
}
`;

/** "#rrggbb" as 0…1 channels. */
const rgb = (hex: string): [number, number, number] => {
  const n = parseInt(hex.replace('#', ''), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};
const scaled = (c: [number, number, number], k: number) => c.map((v) => Math.min(1, v * k)) as [number, number, number];
/** The page's background (index.css: hsl(240 12% 3%)). */
const BASE: [number, number, number] = [0.027, 0.027, 0.034];
/** Half the screen's resolution: smoke's threads are finer than the old cloud, and blurred away at a third. */
const SCALE = 1 / 2;

export default function CaseBackdrop({ product }: { product: ShowcaseProduct }) {
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
    const deep = rgb(product.accentDeep);
    gl.uniform3fv(u('cBase'), BASE);
    gl.uniform3fv(u('cDeep'), deep);
    gl.uniform3fv(u('cGlow'), scaled(deep, 2.2));
    gl.uniform3fv(u('cAccent'), rgb(product.accent));
    const uRes = u('uRes'), uTime = u('uTime'), uScroll = u('uScroll');

    const resize = () => {
      el.width = Math.max(1, Math.round(window.innerWidth * SCALE));
      el.height = Math.max(1, Math.round(window.innerHeight * SCALE));
      gl.viewport(0, 0, el.width, el.height);
      gl.uniform2f(uRes, el.width, el.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = (ms: number) => {
      gl.uniform1f(uTime, ms / 1000);
      gl.uniform1f(uScroll, (window.scrollY / window.innerHeight) * 0.12);
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
    if (reduce) draw(20000);
    else raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
    };
  }, [product, reduce]);

  return (
    <div aria-hidden className="fixed inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 70% 60% at 60% 45%, ${product.accentDeep}, #070709 75%)` }}>
      <canvas ref={canvas} className="w-full h-full" />
    </div>
  );
}
