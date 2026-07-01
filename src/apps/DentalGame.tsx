import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppShell } from "../components/AppShell";
import { Button } from "../components/Button";

type Stage = "intro" | "smash" | "vacuum" | "decorate" | "reveal";

interface Chunk {
  id: number;
  x: number;
  y: number;
  size: number;
  rot: number;
}

interface Dust {
  id: number;
  x: number;
  y: number;
}

const DUST_RADIUS = 42;

function randomChunks(count: number): Chunk[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    x: 15 + Math.random() * 70,
    y: 15 + Math.random() * 65,
    size: 26 + Math.random() * 20,
    rot: Math.random() * 40 - 20,
  }));
}

function randomDust(count: number): Dust[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    x: 10 + Math.random() * 80,
    y: 15 + Math.random() * 70,
  }));
}

const decorations = [
  { id: "gold", label: "Gold", swatch: "linear-gradient(135deg,#ffd76a,#c9922a)" },
  { id: "diamond", label: "Diamond", swatch: "linear-gradient(135deg,#d6f3ff,#7bc9e8)" },
  { id: "rainbow", label: "Rainbow", swatch: "linear-gradient(135deg,#ff9ac2,#8b7bff,#6ea8ff)" },
  { id: "classic", label: "Classic", swatch: "linear-gradient(135deg,#ffffff,#e8e8ee)" },
] as const;

export function DentalGame({ onClose }: { onClose: () => void }) {
  const [stage, setStage] = useState<Stage>("intro");
  const [chunks, setChunks] = useState<Chunk[]>(() => randomChunks(7));
  const [dust, setDust] = useState<Dust[]>(() => randomDust(12));
  const [shakeKey, setShakeKey] = useState(0);
  const [decoration, setDecoration] = useState<(typeof decorations)[number] | null>(null);
  const dragging = useRef(false);
  const vacuumAreaRef = useRef<HTMLDivElement | null>(null);

  function reset() {
    setStage("intro");
    setChunks(randomChunks(7));
    setDust(randomDust(12));
    setDecoration(null);
  }

  const smashChunk = (id: number) => {
    setShakeKey((k) => k + 1);
    setChunks((prev) => {
      const next = prev.filter((c) => c.id !== id);
      if (next.length === 0) setTimeout(() => setStage("vacuum"), 500);
      return next;
    });
  };

  const suckNearbyDust = (clientX: number, clientY: number) => {
    const area = vacuumAreaRef.current;
    if (!area) return;
    const rect = area.getBoundingClientRect();
    const px = ((clientX - rect.left) / rect.width) * 100;
    const py = ((clientY - rect.top) / rect.height) * 100;
    setDust((prev) => {
      let changed = false;
      const next = prev.filter((d) => {
        const dx = ((d.x - px) / 100) * rect.width;
        const dy = ((d.y - py) / 100) * rect.height;
        const hit = Math.hypot(dx, dy) < DUST_RADIUS;
        if (hit) changed = true;
        return !hit;
      });
      if (changed && next.length === 0) setTimeout(() => setStage("decorate"), 500);
      return changed ? next : prev;
    });
  };

  const pickDecoration = (d: (typeof decorations)[number]) => {
    setDecoration(d);
    setTimeout(() => setStage("reveal"), 500);
  };

  return (
    <div className="absolute inset-0">
      <AppShell title={stage === "intro" ? "Dada Dental" : "Titan Tooth"} onBack={onClose}>
        {stage === "intro" && (
          <div className="flex flex-col items-center justify-center h-full gap-6 px-8 text-center">
            <span className="text-7xl">🦷</span>
            <div>
              <p className="text-lg font-semibold">A titan's tooth needs your help</p>
              <p className="text-sm text-white/50 mt-2">
                Smash away the decay, vacuum the mess, then give it some bling.
              </p>
            </div>
            <Button onClick={() => setStage("smash")}>Start</Button>
          </div>
        )}

        {stage === "smash" && (
          <div className="flex flex-col h-full px-5 pt-4 pb-6">
            <p className="text-center text-sm text-white/60 mb-4">🪓 Tap the decay to smash it off</p>
            <motion.div
              key={shakeKey}
              animate={{ x: [0, -8, 8, -4, 0] }}
              transition={{ duration: 0.25 }}
              className="relative flex-1 flex items-center justify-center"
            >
              <span className="text-[150px] leading-none select-none">🦷</span>
              <AnimatePresence>
                {chunks.map((c) => (
                  <motion.button
                    key={c.id}
                    onClick={() => smashChunk(c.id)}
                    initial={{ opacity: 1, scale: 1, rotate: c.rot }}
                    exit={{ opacity: 0, scale: 0.2, y: -40, rotate: c.rot + 90 }}
                    whileTap={{ scale: 1.15 }}
                    transition={{ duration: 0.25 }}
                    className="absolute rounded-full bg-[#6b4a2e] shadow-lg"
                    style={{
                      left: `${c.x}%`,
                      top: `${c.y}%`,
                      width: c.size,
                      height: c.size,
                    }}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        )}

        {stage === "vacuum" && (
          <div className="flex flex-col h-full px-5 pt-4 pb-6">
            <p className="text-center text-sm text-white/60 mb-4">🌀 Drag the vacuum over the leftover dust</p>
            <div
              ref={vacuumAreaRef}
              onPointerDown={(e) => {
                (e.target as Element).setPointerCapture(e.pointerId);
                dragging.current = true;
                suckNearbyDust(e.clientX, e.clientY);
              }}
              onPointerMove={(e) => {
                if (!dragging.current) return;
                suckNearbyDust(e.clientX, e.clientY);
              }}
              onPointerUp={() => {
                dragging.current = false;
              }}
              className="relative flex-1 rounded-3xl glass overflow-hidden touch-none select-none"
            >
              <AnimatePresence>
                {dust.map((d) => (
                  <motion.span
                    key={d.id}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute text-lg -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${d.x}%`, top: `${d.y}%` }}
                  >
                    🦠
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {stage === "decorate" && (
          <div className="flex flex-col h-full px-5 pt-4 pb-6">
            <p className="text-center text-sm text-white/60 mb-8">✨ Pick some bling for the smile</p>
            <div className="flex-1 flex items-center justify-center">
              <span className="text-[130px] leading-none">🦷</span>
            </div>
            <div className="grid grid-cols-4 gap-3 shrink-0">
              {decorations.map((d) => (
                <button
                  key={d.id}
                  onClick={() => pickDecoration(d)}
                  className="flex flex-col items-center gap-1.5"
                >
                  <span
                    className="w-12 h-12 rounded-2xl shadow-lg"
                    style={{ background: d.swatch }}
                  />
                  <span className="text-[10px] text-white/70">{d.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {stage === "reveal" && (
          <div className="relative flex flex-col items-center justify-center h-full gap-5 px-8 text-center overflow-hidden">
            {["✨", "🎉", "⭐", "💫"].map((e, i) => (
              <motion.span
                key={i}
                className="absolute text-2xl top-1/3"
                initial={{ opacity: 1, x: 0, y: 0, scale: 0.6 }}
                animate={{ opacity: 0, x: (i - 1.5) * 70, y: -90 - i * 10, scale: 1.3, rotate: 180 }}
                transition={{ duration: 1.1, ease: "easeOut" }}
              >
                {e}
              </motion.span>
            ))}
            <p className="text-white/60 text-sm">One happy titan ✨</p>
            <motion.span
              initial={{ scale: 0.4, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 14 }}
              className="text-[110px] leading-none rounded-full"
              style={{
                filter: decoration ? "drop-shadow(0 0 18px rgba(255,255,255,0.5))" : undefined,
              }}
            >
              🦷
            </motion.span>
            {decoration && (
              <span
                className="rounded-full px-4 py-1.5 text-xs font-semibold"
                style={{ background: decoration.swatch, color: "#241a10" }}
              >
                {decoration.label} finish
              </span>
            )}
            <Button onClick={reset}>Treat Another Titan</Button>
          </div>
        )}
      </AppShell>
    </div>
  );
}
