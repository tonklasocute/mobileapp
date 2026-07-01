import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { AppShell } from "../components/AppShell";
import { Button } from "../components/Button";
import { GlassCard } from "../components/GlassCard";

const TEETH_COUNT = 8;
const SCRUB_DISTANCE = 200;
const TENSION_ZONE_WIDTH = 22;

type Stage = "intro" | "clean" | "attach" | "tension" | "brush" | "reveal";

function randomTensionZone(): [number, number] {
  const offset = 25 + Math.random() * 20;
  const center = Math.min(88, Math.max(12, 50 + (Math.random() < 0.5 ? -offset : offset)));
  return [center - TENSION_ZONE_WIDTH / 2, center + TENSION_ZONE_WIDTH / 2];
}

/* Step 1: scrub the tartar off each tooth by dragging back and forth over it */
function ScrubTooth({ grime, onScrub }: { grime: number; onScrub: (dist: number) => void }) {
  const last = useRef<{ x: number; y: number } | null>(null);
  const clean = grime <= 0;

  return (
    <motion.div
      onPointerDown={(e) => {
        if (clean) return;
        (e.target as Element).setPointerCapture(e.pointerId);
        last.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerMove={(e) => {
        if (!last.current || clean) return;
        const dist = Math.hypot(e.clientX - last.current.x, e.clientY - last.current.y);
        last.current = { x: e.clientX, y: e.clientY };
        if (dist > 0) onScrub(dist);
      }}
      onPointerUp={() => {
        last.current = null;
      }}
      animate={{ scale: clean ? [1, 1.08, 1] : 1 }}
      transition={{ duration: 0.3 }}
      className="relative aspect-square rounded-2xl flex items-center justify-center text-2xl shadow-inner overflow-hidden bg-white touch-none select-none"
    >
      <span>{clean ? "✨" : "🦷"}</span>
      {!clean && <div className="absolute inset-0 bg-[#c9a24a]" style={{ opacity: grime }} />}
    </motion.div>
  );
}

export function DentalGame({ onClose }: { onClose: () => void }) {
  const [stage, setStage] = useState<Stage>("intro");
  const [grime, setGrime] = useState<number[]>(() => Array(TEETH_COUNT).fill(1));
  const [attached, setAttached] = useState<boolean[]>(() => Array(TEETH_COUNT).fill(false));
  const [tension, setTension] = useState(50);
  const [tensionZone] = useState<[number, number]>(() => randomTensionZone());
  const [freshness, setFreshness] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const brushLast = useRef<{ x: number; y: number } | null>(null);

  function reset() {
    setStage("intro");
    setGrime(Array(TEETH_COUNT).fill(1));
    setAttached(Array(TEETH_COUNT).fill(false));
    setTension(50);
    setFreshness(0);
    setMistakes(0);
  }

  const scrub = (i: number, dist: number) => {
    setGrime((g) => {
      const next = g.map((v, idx) => (idx === i ? Math.max(0, v - dist / SCRUB_DISTANCE) : v));
      if (next.every((v) => v <= 0)) setTimeout(() => setStage("attach"), 500);
      return next;
    });
  };

  const nextBracket = attached.findIndex((a) => !a);
  const attachBracket = (i: number) => {
    if (i !== nextBracket) {
      setMistakes((m) => m + 1);
      return;
    }
    const next = attached.map((a, idx) => (idx === i ? true : a));
    setAttached(next);
    if (next.every(Boolean)) setStage("tension");
  };

  const setWire = () => {
    if (tension < tensionZone[0] || tension > tensionZone[1]) {
      setMistakes((m) => m + 1);
      return;
    }
    setStage("brush");
  };

  const brush = (dist: number) => {
    setFreshness((f) => {
      const next = Math.min(100, f + dist / 6);
      if (next >= 100) setTimeout(() => setStage("reveal"), 500);
      return next;
    });
  };

  const stars = Math.max(1, 3 - Math.floor(mistakes / 2));

  return (
    <div className="absolute inset-0">
      <AppShell
        title={stage === "intro" ? "Dada Dental" : "Smile Makeover"}
        onBack={onClose}
      >
        {stage === "intro" && (
          <div className="flex flex-col items-center justify-center h-full gap-6 px-8 text-center">
            <span className="text-6xl">🦷</span>
            <div>
              <p className="text-lg font-semibold">Give this smile a full makeover</p>
              <p className="text-sm text-white/50 mt-2">
                Scrub away the tartar, straighten with braces, then brush for a fresh finish.
              </p>
            </div>
            <Button onClick={() => setStage("clean")}>Start</Button>
          </div>
        )}

        {stage === "clean" && (
          <div className="flex flex-col h-full px-5 pt-4 pb-6">
            <p className="text-center text-sm text-white/60 mb-4">
              Drag the scaler back and forth to scrub off the tartar
            </p>
            <div className="flex-1 grid grid-cols-4 gap-3 place-content-center">
              {grime.map((g, i) => (
                <ScrubTooth key={i} grime={g} onScrub={(dist) => scrub(i, dist)} />
              ))}
            </div>
          </div>
        )}

        {stage === "attach" && (
          <div className="flex flex-col h-full px-5 pt-4 pb-6">
            <p className="text-center text-sm text-white/60 mb-4">
              Tap each tooth left to right to attach a bracket
            </p>
            <div className="flex-1 grid grid-cols-4 gap-3 place-content-center">
              {attached.map((a, i) => (
                <button
                  key={i}
                  onClick={() => attachBracket(i)}
                  className="aspect-square rounded-2xl flex items-center justify-center text-2xl shadow-inner"
                  style={{ background: a ? "#cfd8ff" : "#ffffff" }}
                >
                  {a ? "🔩" : ""}
                </button>
              ))}
            </div>
          </div>
        )}

        {stage === "tension" && (
          <div className="flex flex-col h-full px-5 pt-4 pb-6">
            <p className="text-center text-sm text-white/60 mb-8">Find the sweet spot for wire tension</p>
            <div className="flex-1 flex flex-col items-center justify-center gap-6">
              <span className="text-5xl">🦷🔗🦷</span>
              <input
                type="range"
                min={0}
                max={100}
                value={tension}
                onChange={(e) => setTension(Number(e.target.value))}
                className="w-full accent-dada-pink"
                aria-label="Wire tension"
              />
              <button onClick={setWire} className="glass rounded-full px-5 py-2.5 text-sm font-semibold">
                Set Tension
              </button>
            </div>
          </div>
        )}

        {stage === "brush" && (
          <div className="flex flex-col h-full px-5 pt-4 pb-6">
            <p className="text-center text-sm text-white/60 mb-4">Brush back and forth for a fresh finish</p>
            <div className="flex-1 flex items-center justify-center">
              <motion.div
                onPointerDown={(e) => {
                  (e.target as Element).setPointerCapture(e.pointerId);
                  brushLast.current = { x: e.clientX, y: e.clientY };
                }}
                onPointerMove={(e) => {
                  if (!brushLast.current) return;
                  const dist = Math.hypot(e.clientX - brushLast.current.x, e.clientY - brushLast.current.y);
                  brushLast.current = { x: e.clientX, y: e.clientY };
                  if (dist > 0) brush(dist);
                }}
                onPointerUp={() => {
                  brushLast.current = null;
                }}
                animate={{ filter: `brightness(${100 + freshness * 0.4}%)` }}
                className="w-40 h-40 rounded-full flex items-center justify-center text-7xl bg-white/90 touch-none select-none shadow-inner"
              >
                🦷
              </motion.div>
            </div>
            <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden mt-4 shrink-0">
              <motion.div
                className="h-full bg-gradient-to-r from-dada-blue to-dada-pink"
                animate={{ width: `${freshness}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>
        )}

        {stage === "reveal" && (
          <div className="flex flex-col items-center justify-center h-full gap-5 px-8 text-center">
            <p className="text-white/60 text-sm">Makeover complete ✨</p>
            <span className="text-7xl">😁</span>
            <div className="flex gap-2 text-4xl">
              {[1, 2, 3].map((n) => (
                <motion.span
                  key={n}
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: n * 0.15, type: "spring", stiffness: 260, damping: 14 }}
                >
                  {n <= stars ? "⭐" : "☆"}
                </motion.span>
              ))}
            </div>
            <GlassCard className="p-4 w-full">
              <p className="text-sm text-white/70">A brand new, sparkling smile — ready for anything.</p>
            </GlassCard>
            <Button onClick={reset}>Play Again</Button>
          </div>
        )}
      </AppShell>
    </div>
  );
}
