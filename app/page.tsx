"use client";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";

const FractalHeart = dynamic(
  () => import("../components/FractalHeart"),
  { ssr: false }
);

const TRANSMISSIONS = [
  "The old systems end when enough of us stop running them.",
  "This is not a movement. It's a new way for presence to create collective results.",
  "Sovereignty is always available. Everything else is optional.",
  "The conscious economy begins where personal bypass ends.",
  "You don't have to believe anything new. You just stop running the same loops.",
  "Presence is the new leverage. Collective results are the new norm.",
  "Whatever path brought you here, this is one place to build something different.",
  "The field responds to presence.",
];

function useSimulatedCoherence() {
  const [coherence, setCoherence] = useState(0.4);
  const t = useRef(0);
  useEffect(() => {
    const id = setInterval(() => {
      t.current += 0.006;
      const v = 0.48 + Math.sin(t.current * 0.22) * 0.25 + Math.sin(t.current * 0.55) * 0.1 + Math.sin(t.current * 1.1) * 0.04;
      setCoherence(Math.max(0.1, Math.min(1, v)));
    }, 50);
    return () => clearInterval(id);
  }, []);
  return coherence;
}

function useTypewriter(text: string, speed = 24) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return displayed;
}

function PlanetaryOrb({ coherence }: { coherence: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cohRef = useRef(coherence);
  useEffect(() => { cohRef.current = coherence; }, [coherence]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let frameId: number;
    let t = 0;
    function draw() {
      frameId = requestAnimationFrame(draw);
      t += 0.0018;
      const coh = cohRef.current;
      const W = canvas!.width, H = canvas!.height;
      const cx = W / 2, cy = H / 2, R = W * 0.34;
      ctx!.clearRect(0, 0, W, H);
      for (let layer = 4; layer >= 0; layer--) {
        const gr = R * (1.5 + layer * 0.35 + coh * 0.18);
        const a = (0.015 + coh * 0.025) / (layer + 1);
        const g = ctx!.createRadialGradient(cx, cy, R * 0.4, cx, cy, gr);
        g.addColorStop(0, `rgba(200,130,30,${a * 3})`);
        g.addColorStop(0.4, `rgba(160,80,15,${a})`);
        g.addColorStop(1, "rgba(80,30,5,0)");
        ctx!.fillStyle = g;
        ctx!.beginPath();
        ctx!.arc(cx, cy, gr, 0, Math.PI * 2);
        ctx!.fill();
      }
      for (let i = 1; i < 11; i++) {
        const lat = (i / 11) * Math.PI - Math.PI / 2;
        const r2 = R * Math.cos(lat);
        const y = cy + R * Math.sin(lat);
        const d = Math.abs(i - 5.5) / 5.5;
        ctx!.strokeStyle = `rgba(210,155,55,${(0.035 + coh * 0.055) * (1 - d * 0.4)})`;
        ctx!.lineWidth = 0.7;
        ctx!.beginPath();
        ctx!.ellipse(cx, y, r2, r2 * 0.26, 0, 0, Math.PI * 2);
        ctx!.stroke();
      }
      for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI + t;
        const cosA = Math.cos(angle);
        const a = Math.max(0, cosA) * (0.045 + coh * 0.065);
        ctx!.strokeStyle = `rgba(210,155,55,${a})`;
        ctx!.lineWidth = 0.7;
        ctx!.beginPath();
        ctx!.ellipse(cx, cy, R * Math.abs(cosA), R, 0, 0, Math.PI * 2);
        ctx!.stroke();
      }
      ctx!.strokeStyle = `rgba(230,175,65,${0.07 + coh * 0.09})`;
      ctx!.lineWidth = 1.2;
      ctx!.beginPath();
      ctx!.ellipse(cx, cy, R, R * 0.26, 0, 0, Math.PI * 2);
      ctx!.stroke();
      ctx!.strokeStyle = `rgba(230,175,65,${0.09 + coh * 0.11})`;
      ctx!.lineWidth = 1.2;
      ctx!.beginPath();
      ctx!.arc(cx, cy, R, 0, Math.PI * 2);
      ctx!.stroke();
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 + t * 0.4;
        const px = cx + Math.cos(a) * R * 0.52;
        const py = cy + Math.sin(a) * R * 0.32;
        const pr = R * (0.055 + i * 0.018);
        const g2 = ctx!.createRadialGradient(px, py, 0, px, py, pr);
        g2.addColorStop(0, `rgba(190,120,40,${0.045 + coh * 0.04})`);
        g2.addColorStop(1, "rgba(190,120,40,0)");
        ctx!.fillStyle = g2;
        ctx!.beginPath();
        ctx!.arc(px, py, pr, 0, Math.PI * 2);
        ctx!.fill();
      }
    }
    draw();
    return () => cancelAnimationFrame(frameId);
  }, []);
  return <canvas ref={canvasRef} width={800} height={800} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.75, pointerEvents: "none" }} />;
}

function CoherenceParticles({ coherence }: { coherence: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cohRef = useRef(coherence);
  useEffect(() => { cohRef.current = coherence; }, [coherence]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let frameId: number;
    type P = { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number; hue: number };
    const particles: P[] = [];
    function spawn() {
      const W = canvas!.width, H = canvas!.height;
      const cx = W / 2, cy = H / 2;
      const angle = Math.random() * Math.PI * 2;
      const r = 25 + Math.random() * 55;
      const spd = 0.18 + Math.random() * 0.38;
      const oa = angle + (Math.random() - 0.5) * 1.4;
      particles.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r, vx: Math.cos(oa) * spd, vy: Math.sin(oa) * spd - 0.12, life: 0, maxLife: 180 + Math.random() * 140, size: 0.5 + Math.random() * 1.6, hue: 32 + Math.random() * 28 });
    }
    function draw() {
      frameId = requestAnimationFrame(draw);
      const coh = cohRef.current;
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      if (Math.random() < 0.05 + coh * 0.2) spawn();
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        if (p.life >= p.maxLife) { particles.splice(i, 1); continue; }
        p.x += p.vx; p.y += p.vy;
        p.vx += (Math.random() - 0.5) * 0.025;
        const prog = p.life / p.maxLife;
        const alpha = Math.sin(prog * Math.PI) * (0.55 + coh * 0.35);
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size * (1 + prog * 0.6), 0, Math.PI * 2);
        ctx!.fillStyle = `hsla(${p.hue},88%,68%,${alpha})`;
        ctx!.fill();
      }
    }
    draw();
    return () => cancelAnimationFrame(frameId);
  }, []);
  return <canvas ref={canvasRef} width={1000} height={1000} style={{ position: "absolute", inset: "-15%", width: "130%", height: "130%", pointerEvents: "none" }} />;
}

function RippleCanvas({ triggered }: { triggered: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripples = useRef<{ r: number; maxR: number; alpha: number }[]>([]);
  const prev = useRef(false);
  useEffect(() => {
    if (triggered && !prev.current) {
      ripples.current.push({ r: 0, maxR: 340, alpha: 0.65 });
      setTimeout(() => ripples.current.push({ r: 0, maxR: 260, alpha: 0.4 }), 180);
      setTimeout(() => ripples.current.push({ r: 0, maxR: 180, alpha: 0.25 }), 360);
    }
    prev.current = triggered;
  }, [triggered]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let frameId: number;
    function draw() {
      frameId = requestAnimationFrame(draw);
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      const cx = canvas!.width / 2, cy = canvas!.height / 2;
      for (let i = ripples.current.length - 1; i >= 0; i--) {
        const rip = ripples.current[i];
        rip.r += 2.8; rip.alpha *= 0.968;
        if (rip.r > rip.maxR || rip.alpha < 0.008) { ripples.current.splice(i, 1); continue; }
        ctx!.strokeStyle = `rgba(255,148,55,${rip.alpha})`;
        ctx!.lineWidth = 1.8;
        ctx!.beginPath();
        ctx!.arc(cx, cy, rip.r, 0, Math.PI * 2);
        ctx!.stroke();
      }
    }
    draw();
    return () => cancelAnimationFrame(frameId);
  }, []);
  return <canvas ref={canvasRef} width={800} height={800} style={{ position: "absolute", inset: "-22%", width: "144%", height: "144%", pointerEvents: "none", zIndex: 20 }} />;
}

function FieldDot({ delay = "0s" }: { delay?: string }) {
  return <span aria-hidden="true" className="animate-pulse" style={{ display: "inline-block", width: "5px", height: "5px", borderRadius: "9999px", backgroundColor: "#FF6B3D", animationDuration: "2.5s", animationDelay: delay, flexShrink: 0 }} />;
}

function SignalForm({ coherence }: { coherence: number }) {
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);
  const [transmitted, setTransmitted] = useState(false);
  const maxChars = 320;

  function handleTransmit() {
    if (!text.trim()) return;
    console.log("[RESONANT EARTH SIGNAL]", { text, coherence, timestamp: new Date().toISOString() });
    setTransmitted(true);
    setTimeout(() => { setTransmitted(false); setText(""); }, 5000);
  }

  if (transmitted) {
    return (
      <div style={{ width: "100%", maxWidth: "min(520px, 88vw)", textAlign: "center", padding: "2rem 1rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
        <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "clamp(0.9rem, 2vw, 1.05rem)", color: `rgba(212,160,60,${0.7 + coherence * 0.25})`, lineHeight: 1.8 }}>
          Signal received.
        </p>
        <p style={{ fontFamily: "monospace", fontSize: "clamp(0.5rem, 1vw, 0.6rem)", color: "rgba(232,221,208,0.3)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
          The field holds what you brought.
        </p>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", maxWidth: "min(520px, 88vw)", display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "center" }}>
      <p style={{ fontFamily: "monospace", fontSize: "clamp(0.5rem, 1vw, 0.62rem)", letterSpacing: "0.28em", textTransform: "uppercase", color: `rgba(212,160,60,${0.3 + coherence * 0.25})`, textAlign: "center" }}>
        What are you bringing into the field today?
      </p>
      <div style={{ width: "100%", position: "relative", border: `1px solid ${focused ? `rgba(193,68,14,${0.5 + coherence * 0.3})` : "rgba(232,221,208,0.08)"}`, transition: "border-color 0.4s ease", backgroundColor: "rgba(232,221,208,0.02)" }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, maxChars))}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Speak honestly. This space holds what you bring."
          rows={4}
          style={{ width: "100%", backgroundColor: "transparent", border: "none", outline: "none", resize: "none", padding: "1rem", fontFamily: "Georgia, serif", fontSize: "clamp(0.85rem, 1.8vw, 0.95rem)", lineHeight: 1.75, color: "rgba(232,221,208,0.78)", cursor: "crosshair" }}
        />
        <span style={{ position: "absolute", bottom: "0.5rem", right: "0.75rem", fontFamily: "monospace", fontSize: "0.55rem", color: text.length > maxChars * 0.85 ? "rgba(193,68,14,0.6)" : "rgba(232,221,208,0.18)" }}>
          {maxChars - text.length}
        </span>
      </div>
      <button
        onClick={handleTransmit}
        disabled={!text.trim()}
        style={{ alignSelf: "flex-end", padding: "0.65rem 1.8rem", border: `1px solid ${text.trim() ? `rgba(193,68,14,${0.4 + coherence * 0.3})` : "rgba(232,221,208,0.08)"}`, backgroundColor: "transparent", color: text.trim() ? "rgba(232,221,208,0.75)" : "rgba(232,221,208,0.2)", fontFamily: "monospace", fontSize: "clamp(0.55rem, 1vw, 0.65rem)", letterSpacing: "0.24em", textTransform: "uppercase", cursor: text.trim() ? "crosshair" : "default", transition: "all 0.4s ease" }}
        onMouseEnter={(e) => { if (!text.trim()) return; e.currentTarget.style.backgroundColor = "rgba(193,68,14,0.12)"; e.currentTarget.style.borderColor = "#C1440E"; e.currentTarget.style.color = "rgba(232,221,208,1)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.borderColor = text.trim() ? `rgba(193,68,14,${0.4 + coherence * 0.3})` : "rgba(232,221,208,0.08)"; e.currentTarget.style.color = text.trim() ? "rgba(232,221,208,0.75)" : "rgba(232,221,208,0.2)"; }}
      >
        Transmit
      </button>
    </div>
  );
}

export default function HomePage() {
  const coherence = useSimulatedCoherence();
  const coherencePct = Math.round(coherence * 100);
  const [txIndex, setTxIndex] = useState(0);
  const [txVisible, setTxVisible] = useState(true);
  const [txText, setTxText] = useState(TRANSMISSIONS[0]);
  const displayed = useTypewriter(txVisible ? txText : "", 24);
  const [hovered, setHovered] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [heartOffset, setHeartOffset] = useState({ x: 0, y: 0 });
  const [earthOffset, setEarthOffset] = useState({ x: 0, y: 0 });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { const t = setTimeout(() => setLoaded(true), 200); return () => clearTimeout(t); }, []);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      mouseRef.current = { x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2 };
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    let frameId: number;
    let hx = 0, hy = 0, ex = 0, ey = 0;
    function tick() {
      frameId = requestAnimationFrame(tick);
      const { x, y } = mouseRef.current;
      hx += (-x * 16 - hx) * 0.045; hy += (-y * 12 - hy) * 0.045;
      ex += (x * 6 - ex) * 0.018; ey += (y * 4 - ey) * 0.018;
      setHeartOffset({ x: hx, y: hy });
      setEarthOffset({ x: ex, y: ey });
    }
    tick();
    return () => cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setTxVisible(false);
      setTimeout(() => {
        const next = (txIndex + 1) % TRANSMISSIONS.length;
        setTxIndex(next);
        setTxText(TRANSMISSIONS[next]);
        setTxVisible(true);
      }, 1400);
    }, 14000);
    return () => clearInterval(id);
  }, [txIndex]);

  return (
    <div style={{ backgroundColor: "#090705", minHeight: "100vh", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
      <div aria-hidden="true" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, background: "radial-gradient(ellipse 90% 85% at 50% 46%, rgba(150,55,10,0.24) 0%, rgba(90,28,5,0.12) 38%, rgba(9,7,5,0) 68%)" }} />
      <div aria-hidden="true" style={{ position: "fixed", width: "min(780px, 95vw)", height: "min(780px, 95vw)", top: "50%", left: "50%", transform: `translate(calc(-50% + ${earthOffset.x}px), calc(-50% + ${earthOffset.y}px))`, pointerEvents: "none", zIndex: 1, opacity: loaded ? 1 : 0, transition: "opacity 3.5s ease" }}>
        <PlanetaryOrb coherence={coherence} />
      </div>
      <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: "100vw", display: "flex", flexDirection: "column", alignItems: "center", padding: "clamp(2rem, 5vh, 5rem) 1rem clamp(2rem, 4vh, 4rem)" }}>
        <p style={{ fontFamily: "monospace", fontSize: "clamp(0.5rem, 1.1vw, 0.68rem)", letterSpacing: "0.12em", textTransform: "uppercase", color: `rgba(212,160,60,${0.38 + coherence * 0.3})`, marginBottom: "clamp(0.8rem, 2vh, 1.4rem)", textAlign: "center", maxWidth: "min(600px, 88vw)", lineHeight: 1.7, opacity: loaded ? 1 : 0, transition: "opacity 2.5s ease 0.3s" }}>
          A shared system where individual presence creates collective results — on your own path.
        </p>
        <header style={{ textAlign: "center", marginBottom: "clamp(0.8rem, 2vh, 1.5rem)", opacity: loaded ? 1 : 0, transition: "opacity 2.5s ease 0.5s" }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <div aria-hidden="true" style={{ position: "absolute", inset: "-30px -60px", borderRadius: "9999px", background: `radial-gradient(ellipse 100% 100% at 50% 50%, rgba(200,100,14,${0.05 + coherence * 0.09}) 0%, transparent 65%)`, filter: "blur(24px)", pointerEvents: "none" }} />
            <h1 style={{ fontFamily: "Georgia, serif", fontWeight: 300, lineHeight: 1.0, position: "relative", margin: 0 }}>
              <span style={{ display: "block", fontSize: "clamp(3rem, 10vw, 8rem)", color: `rgba(222,188,75,${0.72 + coherence * 0.22})`, letterSpacing: "-0.01em" }}>Resonant</span>
              <span style={{ display: "block", fontSize: "clamp(3rem, 10vw, 8rem)", fontStyle: "italic", color: `rgba(193,68,14,${0.78 + coherence * 0.2})`, marginTop: "-0.12em", letterSpacing: "-0.01em" }}>Earth</span>
            </h1>
          </div>
        </header>
        <div style={{ position: "relative", width: "min(640px, 92vw)", height: "min(640px, 92vw)", flexShrink: 0, opacity: loaded ? 1 : 0, transition: "opacity 3s ease 0.8s" }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onTouchStart={() => setHovered(true)} onTouchEnd={() => setHovered(false)}>
          <RippleCanvas triggered={hovered} />
          <CoherenceParticles coherence={coherence} />
          {[1.7, 1.38, 1.15].map((scale, i) => (
            <div key={i} aria-hidden="true" style={{ position: "absolute", inset: 0, borderRadius: "9999px", background: `radial-gradient(ellipse 65% 65% at 50% 50%, rgba(255,${95 + i * 22},35,${(0.045 + coherence * 0.09) / (i + 1)}) 0%, transparent 68%)`, transform: `scale(${scale + coherence * 0.18 + (hovered ? 0.12 : 0)})`, transition: "transform 2.5s ease", pointerEvents: "none" }} />
          ))}
          <div style={{ position: "absolute", inset: 0, transform: `translate(${heartOffset.x}px, ${heartOffset.y}px)`, transition: "transform 0.06s linear" }}>
            <FractalHeart coherence={coherence} className="w-full h-full" />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.55rem", marginTop: "clamp(1rem, 2.5vh, 2rem)", opacity: loaded ? 1 : 0, transition: "opacity 2s ease 1.4s" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FieldDot />
            <span style={{ color: `rgba(232,221,208,${0.22 + coherence * 0.22})`, fontFamily: "monospace", fontSize: "clamp(0.52rem, 1vw, 0.63rem)", letterSpacing: "0.32em", textTransform: "uppercase" }}>FIELD COHERENCE: LIVE</span>
            <FieldDot delay="0.9s" />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
            <div style={{ width: "clamp(7rem, 15vw, 12rem)", height: "1px", backgroundColor: "rgba(232,221,208,0.07)", borderRadius: "9999px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${coherencePct}%`, background: "linear-gradient(to right, #6B1800, #C1440E, #FFB347)", transition: "width 1.2s ease", boxShadow: `0 0 10px rgba(255,179,71,${coherence * 0.65})` }} />
            </div>
            <span style={{ color: `rgba(212,136,74,${0.55 + coherence * 0.35})`, fontFamily: "monospace", fontSize: "0.72rem", width: "2.8rem" }}>{coherencePct}%</span>
          </div>
          <p style={{ color: "rgba(232,221,208,0.13)", fontFamily: "monospace", fontSize: "clamp(0.5rem, 0.9vw, 0.58rem)" }}>hover the heart — the field responds when presence is given</p>
        </div>
        <div style={{ minHeight: "clamp(4rem, 8vh, 6rem)", maxWidth: "min(560px, 88vw)", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", margin: "clamp(1.5rem, 4vh, 3rem) 0 clamp(1rem, 2.5vh, 2rem)", opacity: loaded ? 1 : 0, transition: "opacity 2s ease 2s" }}>
          <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "clamp(0.95rem, 2.4vw, 1.22rem)", lineHeight: 1.9, color: "rgba(232,221,208,0.58)", whiteSpace: "pre-line", opacity: txVisible ? 1 : 0, transition: "opacity 1.4s ease" }}>
            {displayed}{txVisible && <span style={{ opacity: 0.28, fontStyle: "normal" }}>▎</span>}
          </p>
        </div>
        <div style={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: "clamp(1.5rem, 4vh, 3rem)", opacity: loaded ? 1 : 0, transition: "opacity 2s ease 2.2s" }}>
          <SignalForm coherence={coherence} />
        </div>
        <div style={{ display: "flex", gap: "clamp(0.5rem, 2vw, 1.2rem)", flexWrap: "wrap", justifyContent: "center", marginBottom: "clamp(2rem, 5vh, 4rem)", opacity: loaded ? 1 : 0, transition: "opacity 2s ease 2.5s" }}>
          <button style={{ padding: "clamp(0.7rem, 1.5vh, 0.9rem) clamp(1.4rem, 3vw, 2.4rem)", border: `1px solid rgba(193,68,14,${0.28 + coherence * 0.32})`, backgroundColor: "transparent", color: "rgba(232,221,208,0.72)", fontFamily: "monospace", fontSize: "clamp(0.58rem, 1.1vw, 0.68rem)", letterSpacing: "0.24em", textTransform: "uppercase", cursor: "crosshair", transition: "all 0.4s ease" }} onMouseEnter={(e) => { const el = e.currentTarget; el.style.backgroundColor = "rgba(193,68,14,0.13)"; el.style.borderColor = "#C1440E"; el.style.color = "rgba(232,221,208,1)"; }} onMouseLeave={(e) => { const el = e.currentTarget; el.style.backgroundColor = "transparent"; el.style.borderColor = `rgba(193,68,14,${0.28 + coherence * 0.32})`; el.style.color = "rgba(232,221,208,0.72)"; }}>
            Step Into the System
          </button>
          <button style={{ padding: "clamp(0.7rem, 1.5vh, 0.9rem) clamp(1.4rem, 3vw, 2.4rem)", backgroundColor: "transparent", border: "none", color: "rgba(232,221,208,0.28)", fontFamily: "monospace", fontSize: "clamp(0.58rem, 1.1vw, 0.68rem)", letterSpacing: "0.24em", textTransform: "uppercase", cursor: "crosshair", transition: "color 0.4s ease" }} onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(232,221,208,0.62)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(232,221,208,0.28)"; }}>
            What Is This?
          </button>
        </div>
        <footer style={{ width: "100%", borderTop: "1px solid rgba(193,68,14,0.09)", padding: "clamp(1.5rem, 4vh, 2.8rem) 1rem", textAlign: "center" }}>
          <div style={{ maxWidth: "min(620px, 90vw)", margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(0.6rem, 1.5vh, 1rem)" }}>
            <p style={{ color: `rgba(212,136,74,${0.3 + coherence * 0.2})`, fontFamily: "monospace", fontSize: "clamp(0.52rem, 0.95vw, 0.62rem)", letterSpacing: "0.32em", textTransform: "uppercase" }}>Resonant Earth · A shared system for conscious results</p>
            <p style={{ color: "rgba(232,221,208,0.26)", fontFamily: "monospace", fontSize: "clamp(0.52rem, 0.95vw, 0.62rem)", lineHeight: 2.1 }}>
              This is not a wellness platform. This is not a spiritual bypass.<br />
              It offers a space where presence can meet what is already here.
            </p>
            <p style={{ color: "rgba(232,221,208,0.14)", fontFamily: "monospace", fontSize: "clamp(0.48rem, 0.88vw, 0.58rem)", lineHeight: 1.95 }}>
              Resonant Earth offers a new way for presence to create collective results — on your own path.
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", paddingTop: "0.4rem" }}>
              <FieldDot />
              <span style={{ color: "rgba(232,221,208,0.1)", fontFamily: "monospace", fontSize: "0.52rem" }}>field coherence: live — through your own presence</span>
              <FieldDot delay="0.5s" />
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
