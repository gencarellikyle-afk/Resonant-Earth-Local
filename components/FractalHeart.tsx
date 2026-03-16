"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export interface FractalHeartProps {
  coherence?: number;
  className?: string;
}

export default function FractalHeart({
  coherence = 0.4,
  className = "",
}: FractalHeartProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  // Pass live values into the animation loop via refs
  const coherenceRef = useRef(coherence);
  const hoveredRef   = useRef(hovered);
  useEffect(() => { coherenceRef.current = coherence; }, [coherence]);
  useEffect(() => { hoveredRef.current   = hovered;   }, [hovered]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── Scene setup ──────────────────────────────────────────────────────
    const W = mount.clientWidth  || 400;
    const H = mount.clientHeight || 400;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
    camera.position.set(0, 0, 3.5);

    // ── Heart geometry — parametric point cloud ───────────────────────
    const LAYERS      = 6;
    const PTS         = 160;
    const SCALE       = 0.065;
    const pointGroups: THREE.Points[] = [];

    for (let l = 0; l < LAYERS; l++) {
      const layerDepth = 0.4 + (l / LAYERS) * 0.6;
      const positions  = new Float32Array(PTS * 3);

      for (let i = 0; i < PTS; i++) {
        const t = (i / PTS) * Math.PI * 2;
        const s = SCALE * layerDepth;
        positions[i * 3]     = s * 16 * Math.pow(Math.sin(t), 3);
        positions[i * 3 + 1] = s * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
        positions[i * 3 + 2] = s * 2 * Math.sin(t * 2.5) * Math.cos(t) + l * 0.04;
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

      const hue = 0.04 + l * 0.012;
      const col = new THREE.Color().setHSL(hue, 0.85, 0.45 + l * 0.03);

      const mat = new THREE.PointsMaterial({
        color:         col,
        size:          0.025 + l * 0.003,
        transparent:   true,
        opacity:       0.6,
        depthWrite:    false,
        blending:      THREE.AdditiveBlending,
        sizeAttenuation: true,
      });

      const points = new THREE.Points(geo, mat);
      scene.add(points);
      pointGroups.push(points);
    }

    // ── Animation loop ────────────────────────────────────────────────
    let frameId: number;
    let time = 0;
    const currentScale = new Array(LAYERS).fill(1);

    function animate() {
      frameId = requestAnimationFrame(animate);
      time += 0.016;

      const coh = coherenceRef.current;
      const hov = hoveredRef.current;

      pointGroups.forEach((pts, l) => {
        // Heart dilation trigger
        const target = hov
          ? 1.0 + coh * 0.35 + 0.25
          : 1.0 + coh * 0.18;

        currentScale[l] += (target - currentScale[l]) * 0.04;

        const breath      = Math.sin(time * 0.7  + l * 0.4) * 0.03;
        const layerBreath = Math.sin(time * (0.5 + l * 0.1) + l) * 0.015;
        pts.scale.setScalar(currentScale[l] + breath + layerBreath);
        pts.rotation.z = Math.sin(time * 0.15 + l * 0.3) * 0.08;

        const mat = pts.material as THREE.PointsMaterial;
        mat.opacity =
          0.3 + coh * 0.5 +
          Math.sin(time * 1.2 + l) * 0.08 +
          (hov ? 0.2 : 0);
      });

      renderer.render(scene, camera);
    }

    animate();

    // ── Resize handler ────────────────────────────────────────────────
    function onResize() {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", onResize);

    // ── Cleanup ───────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: "crosshair" }}
    />
  );
}