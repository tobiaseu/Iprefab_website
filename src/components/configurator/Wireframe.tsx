"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { COLORS, type Studio } from "./model";

type P = number[];
const H = 2.8; // storey height, m

function seg(p: P, a: number[], b: number[]) {
  p.push(a[0], a[1], a[2], b[0], b[1], b[2]);
}
function rect(p: P, x0: number, z0: number, x1: number, z1: number, y: number) {
  seg(p, [x0, y, z0], [x1, y, z0]);
  seg(p, [x1, y, z0], [x1, y, z1]);
  seg(p, [x1, y, z1], [x0, y, z1]);
  seg(p, [x0, y, z1], [x0, y, z0]);
}
function box(p: P, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number) {
  rect(p, x0, z0, x1, z1, y0);
  rect(p, x0, z0, x1, z1, y1);
  for (const [x, z] of [[x0, z0], [x1, z0], [x1, z1], [x0, z1]]) seg(p, [x, y0, z], [x, y1, z]);
}

type Opening = { a: number; b: number; sill: number; head: number };

/** A framed wall from `from` to `to` (horizontal), between heights y0 and y0+h, with studs and openings. */
function wall(p: P, from: [number, number], to: [number, number], y0: number, h: number, openings: Opening[], spacing = 1.2) {
  const L = Math.hypot(to[0] - from[0], to[1] - from[1]);
  const at = (u: number, y: number) => [from[0] + ((to[0] - from[0]) * u) / L, y, from[1] + ((to[1] - from[1]) * u) / L];
  const y1 = y0 + h;
  seg(p, at(0, y0 + 0.05), at(L, y0 + 0.05));
  seg(p, at(0, y1), at(L, y1));
  seg(p, at(0, y1 - 0.09), at(L, y1 - 0.09));
  const n = Math.max(1, Math.round(L / spacing));
  for (let i = 0; i <= n; i++) {
    const u = (L * i) / n;
    const o = openings.find((w) => u > w.a - 0.05 && u < w.b + 0.05);
    if (!o) seg(p, at(u, y0 + 0.05), at(u, y1 - 0.09));
    else {
      if (o.sill > 0) seg(p, at(u, y0 + 0.05), at(u, y0 + o.sill));
      seg(p, at(u, y0 + o.head), at(u, y1 - 0.09));
    }
  }
  for (const o of openings) {
    seg(p, at(o.a, y0 + 0.05), at(o.a, y1 - 0.09));
    seg(p, at(o.b, y0 + 0.05), at(o.b, y1 - 0.09));
    seg(p, at(o.a, y0 + o.head), at(o.b, y0 + o.head));
    seg(p, at(o.a, y0 + o.head + 0.18), at(o.b, y0 + o.head + 0.18));
    if (o.sill > 0) seg(p, at(o.a, y0 + o.sill), at(o.b, y0 + o.sill));
  }
}

function windowsAlong(L: number, width: number, door = false): Opening[] {
  const n = Math.max(1, Math.floor(L / 3.4));
  const out: Opening[] = [];
  for (let i = 0; i < n; i++) {
    const c = (L * (i + 0.5)) / n;
    const isDoor = door && i === Math.floor(n / 2);
    const w = isDoor ? 1.0 : width;
    out.push(isDoor ? { a: c - w / 2, b: c + w / 2, sill: 0, head: 2.1 } : { a: c - w / 2, b: c + w / 2, sill: 0.85, head: 2.15 });
  }
  return out;
}

export type Dims = { W: number; D: number; top: number; peak: number };

export function dims(s: Studio): Dims {
  const fp = s.area / s.floors;
  const D = Math.min(9.5, Math.max(6, Math.sqrt(fp / 1.6)));
  const W = fp / D;
  const top = s.floors * H;
  const peak = top + (s.roof === "gable" ? D * 0.3 : s.roof === "shed" ? D * 0.25 + 0.3 : 0.6);
  return { W, D, top, peak };
}

function build(s: Studio) {
  const { W, D, top } = dims(s);
  const x0 = -W / 2, x1 = W / 2, z0 = -D / 2, z1 = D / 2;
  const foundation: P = [], walls: P = [], roof: P = [], extras: P = [];

  // Foundation: slab with footings and a few ground beams.
  box(foundation, x0 - 0.2, -0.35, z0 - 0.2, x1 + 0.2, 0, z1 + 0.2);
  for (let i = 1; i < 4; i++) seg(foundation, [x0 - 0.2 + ((W + 0.4) * i) / 4, 0, z0 - 0.2], [x0 - 0.2 + ((W + 0.4) * i) / 4, 0, z1 + 0.2]);

  // Walls, storey by storey.
  for (let f = 0; f < s.floors; f++) {
    const y = f * H;
    wall(walls, [x0, z1], [x1, z1], y, H, windowsAlong(W, f === 0 ? 2.2 : 1.4, f === 0));
    wall(walls, [x1, z0], [x0, z0], y, H, windowsAlong(W, 1.2));
    wall(walls, [x0, z0], [x0, z1], y, H, [{ a: D / 2 - 0.6, b: D / 2 + 0.6, sill: 0.85, head: 2.15 }]);
    wall(walls, [x1, z1], [x1, z0], y, H, [{ a: D / 2 - 0.6, b: D / 2 + 0.6, sill: 0.85, head: 2.15 }]);
    if (f > 0) for (let x = x0 + 0.6; x < x1; x += 0.6) seg(walls, [x, y, z0], [x, y, z1]);
  }

  // Roof
  const o = 0.5;
  let roofY: (z: number) => number;
  if (s.roof === "gable") {
    const R = D * 0.3;
    roofY = (z) => top + R * (1 - Math.abs(z) / (D / 2));
    for (let x = x0; x <= x1 + 0.01; x += Math.max(0.9, W / Math.round(W / 1.2))) {
      seg(roof, [x, top, z0], [x, top, z1]);
      seg(roof, [x, roofY(z0 - o), z0 - o], [x, top + R, 0]);
      seg(roof, [x, roofY(z1 + o), z1 + o], [x, top + R, 0]);
      seg(roof, [x, top, 0], [x, top + R, 0]);
      seg(roof, [x, top, -D / 4], [x, roofY(-D / 4), -D / 4]);
      seg(roof, [x, top, D / 4], [x, roofY(D / 4), D / 4]);
      seg(roof, [x, top, -D / 4], [x, top + R, 0]);
      seg(roof, [x, top, D / 4], [x, top + R, 0]);
    }
    for (const z of [z0 - o, -D / 3, -D / 6, 0, D / 6, D / 3, z1 + o]) seg(roof, [x0 - 0.4, roofY(z), z], [x1 + 0.4, roofY(z), z]);
  } else if (s.roof === "shed") {
    const R = D * 0.25;
    roofY = (z) => top + 0.3 + (R * (D / 2 - z)) / D;
    for (let x = x0; x <= x1 + 0.01; x += Math.max(0.9, W / Math.round(W / 1.2))) {
      seg(roof, [x, top, z0], [x, top, z1]);
      seg(roof, [x, roofY(z1 + o), z1 + o], [x, roofY(z0 - o), z0 - o]);
      for (const z of [z0, 0, z1]) seg(roof, [x, top, z], [x, roofY(z), z]);
      seg(roof, [x, top, z1], [x, roofY(0), 0]);
    }
    for (const z of [z0 - o, -D / 4, 0, D / 4, z1 + o]) seg(roof, [x0 - 0.4, roofY(z), z], [x1 + 0.4, roofY(z), z]);
  } else {
    roofY = () => top + 0.35;
    rect(roof, x0 - 0.15, z0 - 0.15, x1 + 0.15, z1 + 0.15, top + 0.35);
    rect(roof, x0 - 0.15, z0 - 0.15, x1 + 0.15, z1 + 0.15, top + 0.6);
    for (let x = x0; x <= x1 + 0.01; x += 0.9) seg(roof, [x, top + 0.35, z0], [x, top + 0.35, z1]);
    for (let x = x0 - 0.15; x <= x1 + 0.2; x += (W + 0.3) / Math.round((W + 0.3) / 2.4)) {
      seg(roof, [x, top, z0 - 0.15], [x, top + 0.6, z0 - 0.15]);
      seg(roof, [x, top, z1 + 0.15], [x, top + 0.6, z1 + 0.15]);
    }
  }

  // Extras
  if (s.extras.includes("terrace")) {
    const tx0 = x0 + W * 0.08, tx1 = x0 + W * 0.7, ty = 0.35, tz = z1 + 2.8;
    rect(extras, tx0, z1, tx1, tz, ty);
    for (let z = z1 + 0.3; z < tz; z += 0.3) seg(extras, [tx0, ty, z], [tx1, ty, z]);
    for (const x of [tx0, (tx0 + tx1) / 2, tx1]) seg(extras, [x, -0.2, tz], [x, ty, tz]);
    for (const x of [tx0, tx1]) seg(extras, [x, ty, tz], [x, ty + 0.9, tz]);
    seg(extras, [tx0, ty + 0.9, tz], [tx1, ty + 0.9, tz]);
  }
  if (s.extras.includes("sauna")) {
    const ax0 = x1, ax1 = x1 + 3.4, az0 = z0 + 0.4, az1 = z0 + 3.6, ah = 2.5;
    box(extras, ax0, -0.25, az0, ax1, 0, az1);
    wall(extras, [ax1, az1], [ax1, az0], 0, ah, [{ a: 1.2, b: 2.0, sill: 1.2, head: 1.8 }], 0.8);
    wall(extras, [ax0, az1], [ax1, az1], 0, ah, [{ a: 1.4, b: 2.2, sill: 0, head: 2.0 }], 0.8);
    wall(extras, [ax1, az0], [ax0, az0], 0, ah, [], 0.8);
    for (let z = az0; z <= az1 + 0.01; z += 0.8) seg(extras, [ax0, ah + 0.6, z], [ax1 + 0.4, ah, z]);
    seg(extras, [ax0, ah + 0.6, az0], [ax0, ah + 0.6, az1]);
    seg(extras, [ax1 + 0.4, ah, az0], [ax1 + 0.4, ah, az1]);
  }
  if (s.extras.includes("carport")) {
    const cx1 = x0 - 0.8, cx0 = cx1 - 3.4, cz1 = z1, cz0 = Math.max(z0, z1 - 5.6), ch = 2.5;
    for (const x of [cx0, cx1]) for (const z of [cz0, (cz0 + cz1) / 2, cz1]) seg(extras, [x, 0, z], [x, ch, z]);
    rect(extras, cx0 - 0.2, cz0 - 0.2, cx1 + 0.2, cz1 + 0.2, ch);
    rect(extras, cx0 - 0.2, cz0 - 0.2, cx1 + 0.2, cz1 + 0.2, ch + 0.25);
    for (let z = cz0; z <= cz1 + 0.01; z += 0.7) seg(extras, [cx0 - 0.2, ch + 0.25, z], [cx1 + 0.2, ch + 0.25, z]);
  }
  if (s.extras.includes("fireplace")) {
    const fx = x0 + W * 0.68, fz = -D * 0.18;
    box(extras, fx - 0.35, 0, fz - 0.35, fx + 0.35, roofY(fz) + 0.9, fz + 0.35);
    rect(extras, fx - 0.45, fz - 0.45, fx + 0.45, fz + 0.45, roofY(fz) + 0.9);
  }
  if (s.extras.includes("solar")) {
    const cols = Math.max(3, Math.floor((W * 0.6) / 1.1));
    const px0 = x0 + W * 0.12;
    const [za, zb] = s.roof === "flat" ? [-D * 0.3, D * 0.3] : [D * 0.06, D * 0.4];
    const rows = s.roof === "flat" ? 3 : 2;
    const lift = 0.1;
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        const ax = px0 + c * 1.1, bx = ax + 1.0;
        const az = za + ((zb - za) * r) / rows, bz = za + ((zb - za) * (r + 0.92)) / rows;
        const ya = roofY(az) + lift + (s.roof === "flat" ? 0.35 : 0), yb = roofY(bz) + lift;
        seg(extras, [ax, ya, az], [bx, ya, az]);
        seg(extras, [bx, ya, az], [bx, yb, bz]);
        seg(extras, [bx, yb, bz], [ax, yb, bz]);
        seg(extras, [ax, yb, bz], [ax, ya, az]);
        seg(extras, [(ax + bx) / 2, ya, az], [(ax + bx) / 2, yb, bz]);
      }
  }
  return { foundation, walls, roof, extras };
}

const PHASES = ["foundation", "walls", "roof", "extras"] as const;
const SLOTS: Record<(typeof PHASES)[number], [number, number]> = { foundation: [0, 0.2], walls: [0.15, 0.6], roof: [0.55, 0.85], extras: [0.8, 1] };

type Part = { line: THREE.LineSegments; base: number; slot: [number, number]; count: number };

function makeGroup(s: Studio) {
  const g = new THREE.Group();
  const data = build(s);
  const accent = new THREE.Color("#ffffff").lerp(new THREE.Color(COLORS[s.color]), 0.65);
  const parts: Part[] = PHASES.map((k) => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(data[k], 3));
    const base = k === "foundation" ? 0.45 : k === "walls" ? 0.8 : 0.85;
    const color = k === "roof" || k === "extras" ? accent : new THREE.Color("#ffffff");
    const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: base, depthWrite: false });
    const line = new THREE.LineSegments(geo, mat);
    g.add(line);
    return { line, base, slot: SLOTS[k], count: data[k].length / 3 };
  });
  return { g, parts };
}

function reveal(parts: Part[], t: number, fade: number) {
  for (const p of parts) {
    const [a, b] = p.slot;
    const k = Math.min(1, Math.max(0, (t - a) / (b - a)));
    const n = Math.floor((p.count * k) / 2) * 2;
    p.line.geometry.setDrawRange(0, n);
    (p.line.material as THREE.LineBasicMaterial).opacity = p.base * fade;
  }
}

function dispose(g: THREE.Group) {
  g.traverse((o) => {
    if (o instanceof THREE.LineSegments) {
      o.geometry.dispose();
      (o.material as THREE.Material).dispose();
    }
  });
}

export default function Wireframe({ studio, lift = 0, onCanvas, label }: { studio: Studio; lift?: number; onCanvas?: (c: HTMLCanvasElement) => void; label: string }) {
  const host = useRef<HTMLDivElement>(null);
  const api = useRef<{ set: (s: Studio) => void; lift: (l: number) => void } | null>(null);

  useEffect(() => {
    const el = host.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.touchAction = "pan-y";
    onCanvas?.(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 400);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.autoRotate = !reduced;
    controls.autoRotateSpeed = 0.6;
    controls.minPolarAngle = 0.5;
    controls.maxPolarAngle = 1.45;

    const grid = new THREE.GridHelper(80, 80, 0x9fb4ff, 0x9fb4ff);
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.07;
    (grid.material as THREE.Material).depthWrite = false;
    grid.position.y = -0.36;
    scene.add(grid);
    const fine = new THREE.GridHelper(80, 320, 0x9fb4ff, 0x9fb4ff);
    (fine.material as THREE.Material).transparent = true;
    (fine.material as THREE.Material).opacity = 0.03;
    fine.position.y = -0.37;
    scene.add(fine);

    let cur = makeGroup(studio);
    scene.add(cur.g);
    let old: { g: THREE.Group; parts: Part[] } | null = null;
    let built = reduced ? 1 : 0;
    let fadeT = 1;
    let liftV = lift;

    let framed = false;
    let curS = studio;
    const frame = (s: Studio) => {
      curS = s;
      const d = dims(s);
      const span = Math.max(d.W + 4, d.D + 5, d.peak * 1.6);
      const dist = span * 3.1;
      controls.target.set(0, d.peak * 0.42 - liftV * span * 0.55, 0);
      if (!framed) {
        camera.position.set(dist * 0.72, dist * 0.42, dist * 0.62);
        framed = true;
      } else {
        const dir = camera.position.clone().sub(controls.target).normalize();
        camera.position.copy(controls.target).addScaledVector(dir, dist);
      }
    };
    frame(studio);

    api.current = {
      set: (s) => {
        if (old) {
          scene.remove(old.g);
          dispose(old.g);
        }
        old = cur;
        cur = makeGroup(s);
        scene.add(cur.g);
        fadeT = reduced ? 1 : 0;
        frame(s);
        if (reduced) {
          scene.remove(old.g);
          dispose(old.g);
          old = null;
        }
      },
      lift: (l) => {
        liftV = l;
        frame(curS);
      },
    };

    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = w + "px";
      renderer.domElement.style.height = h + "px";
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (built < 1) built = Math.min(1, built + dt / 2.6);
      if (fadeT < 1) fadeT = Math.min(1, fadeT + dt / 0.5);
      const e = 1 - Math.pow(1 - fadeT, 3);
      reveal(cur.parts, built, e);
      if (old) {
        reveal(old.parts, 1, 1 - e);
        if (fadeT >= 1) {
          scene.remove(old.g);
          dispose(old.g);
          old = null;
        }
      }
      controls.update();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.dispose();
      dispose(cur.g);
      if (old) dispose(old.g);
      renderer.dispose();
      renderer.domElement.remove();
      api.current = null;
    };
    // Mount once; later changes go through api.current.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    api.current?.set(studio);
  }, [studio]);
  useEffect(() => {
    api.current?.lift(lift);
  }, [lift]);

  return <div ref={host} role="img" aria-label={label} className="absolute inset-0 cursor-grab active:cursor-grabbing" />;
}
