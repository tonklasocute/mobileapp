import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { difficultyConfig } from "./data";
import type { Patient, TreatmentResult } from "./types";

export interface MinigameProps {
  patient: Patient;
  onDone: (result: TreatmentResult) => void;
}

function stars(mistakes: number) {
  return Math.max(1, 3 - mistakes);
}

/** guards against double-firing onDone (e.g. a timeout racing a completion) */
function useFinish(onDone: (result: TreatmentResult) => void) {
  const doneRef = useRef(false);
  return (result: TreatmentResult) => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone(result);
  };
}

/** counts down from `seconds`, firing onExpire once when it hits zero */
function useCountdown(seconds: number, onExpire: () => void) {
  const [remaining, setRemaining] = useState(seconds);
  const expiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining((r) => Math.max(0, r - 0.1));
    }, 100);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (remaining <= 0 && !expiredRef.current) {
      expiredRef.current = true;
      onExpireRef.current();
    }
  }, [remaining]);

  return remaining;
}

function shuffledMask(total: number, marked: number): boolean[] {
  const idx = Array.from({ length: total }, (_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  const chosen = new Set(idx.slice(0, marked));
  return Array.from({ length: total }, (_, i) => chosen.has(i));
}

function TimerBar({ remaining, total }: { remaining: number; total: number }) {
  const pct = (remaining / total) * 100;
  const color = pct > 50 ? "#34d399" : pct > 20 ? "#facc15" : "#f87171";
  return (
    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mb-3 shrink-0">
      <motion.div
        className="h-full"
        animate={{ width: `${pct}%`, background: color }}
        transition={{ duration: 0.15, ease: "linear" }}
      />
    </div>
  );
}

function MiniHeader({ patient, mistakes, hint }: { patient: Patient; mistakes?: number; hint: string }) {
  return (
    <div className="text-center mb-3">
      <p className="text-sm text-white/60">
        Treating {patient.name}
        {mistakes !== undefined ? ` · mistakes: ${mistakes}` : ""}
      </p>
      <p className="text-[12px] text-white/40 mt-0.5">{hint}</p>
    </div>
  );
}

function ToothTile({
  color,
  emoji,
  shake,
  onClick,
  onPointerDown,
  onPointerUp,
  holdProgress,
  disabled,
}: {
  color: string;
  emoji: string;
  shake: boolean;
  onClick?: () => void;
  onPointerDown?: () => void;
  onPointerUp?: () => void;
  holdProgress?: number;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      onPointerDown={(e) => {
        if (onPointerDown) e.preventDefault();
        onPointerDown?.();
      }}
      onPointerUp={(e) => {
        if (onPointerUp) e.preventDefault();
        onPointerUp?.();
      }}
      onPointerLeave={onPointerUp}
      disabled={disabled}
      className={`relative aspect-square rounded-2xl flex items-center justify-center text-2xl shadow-inner overflow-hidden touch-none ${
        shake ? "animate-shake-once" : ""
      }`}
      style={{ background: color }}
    >
      {emoji}
      {holdProgress !== undefined && holdProgress > 0 && (
        <div
          className="absolute inset-x-0 bottom-0 bg-white/40 pointer-events-none"
          style={{ height: `${holdProgress}%` }}
        />
      )}
    </button>
  );
}

function ToolBar<T extends string>({
  tools,
  active,
  onSelect,
}: {
  tools: { id: T; label: string; emoji: string }[];
  active: T;
  onSelect: (id: T) => void;
}) {
  return (
    <div className="flex justify-center gap-3 mt-4 shrink-0">
      {tools.map((t) => (
        <button
          key={t.id}
          onClick={() => onSelect(t.id)}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl ${
            active === t.id ? "bg-white/20" : "glass"
          }`}
        >
          <span className="text-xl">{t.emoji}</span>
          <span className="text-[10px] text-white/70">{t.label}</span>
        </button>
      ))}
    </div>
  );
}

function useShake() {
  const [shakeIndex, setShakeIndex] = useState<number | null>(null);
  const trigger = (i: number) => {
    setShakeIndex(i);
    setTimeout(() => setShakeIndex(null), 300);
  };
  return { shakeIndex, trigger };
}

/* 1. Cleaning — drag the scaler back and forth to scrub the grime off plaque teeth, beat the clock */
const SCRUB_DISTANCE = 240;

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

export function CleaningGame({ patient, onDone }: MinigameProps) {
  const cfg = difficultyConfig[patient.difficulty];
  const finish = useFinish(onDone);
  const [grime, setGrime] = useState<number[]>(() =>
    shuffledMask(cfg.teeth, cfg.problems).map((plaque) => (plaque ? 1 : 0)),
  );
  const settledRef = useRef(false);
  const remaining = useCountdown(cfg.timeLimit, () => finish({ mistakes: 3, stars: 1 }));

  const scrub = (i: number, dist: number) => {
    setGrime((g) => {
      const next = g.map((v, idx) => (idx === i ? Math.max(0, v - dist / SCRUB_DISTANCE) : v));
      if (!settledRef.current && next.every((v) => v <= 0)) {
        settledRef.current = true;
        const frac = remaining / cfg.timeLimit;
        const finalStars = frac >= 0.55 ? 3 : frac >= 0.25 ? 2 : 1;
        setTimeout(() => finish({ mistakes: 0, stars: finalStars }), 350);
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col h-full px-5 pt-4 pb-6">
      <MiniHeader patient={patient} hint="Drag the scaler back and forth to scrub off the plaque" />
      <TimerBar remaining={remaining} total={cfg.timeLimit} />
      <div className="flex-1 grid grid-cols-3 gap-4 place-content-center">
        {grime.map((g, i) => (
          <ScrubTooth key={i} grime={g} onScrub={(dist) => scrub(i, dist)} />
        ))}
      </div>
    </div>
  );
}

/* 2. Cavity fill — drill, fill, polish each cavity tooth in order, beat the clock */
type CavityState = "healthy" | "cavity" | "drilled" | "filled";
type CavityTool = "drill" | "fill" | "polish";

export function CavityGame({ patient, onDone }: MinigameProps) {
  const cfg = difficultyConfig[patient.difficulty];
  const finish = useFinish(onDone);
  const [teeth, setTeeth] = useState<CavityState[]>(() =>
    shuffledMask(cfg.teeth, cfg.problems).map((cavity) => (cavity ? "cavity" : "healthy")),
  );
  const [tool, setTool] = useState<CavityTool>("drill");
  const [mistakes, setMistakes] = useState(0);
  const [drillIndex, setDrillIndex] = useState<number | null>(null);
  const [drillProgress, setDrillProgress] = useState(0);
  const drillIndexRef = useRef<number | null>(null);
  const drillProgressRef = useRef(0);
  const drillStart = useRef(0);
  const rafRef = useRef<number | null>(null);
  const { shakeIndex, trigger } = useShake();
  const remaining = useCountdown(cfg.timeLimit, () => finish({ mistakes: 3, stars: 1 }));

  const advance = (i: number, next: CavityState) => {
    setTeeth((arr) => arr.map((tt, idx) => (idx === i ? next : tt)));
    if (next === "healthy") {
      const willComplete = teeth.every((tt, idx) => (idx === i ? true : tt === "healthy"));
      if (willComplete) setTimeout(() => finish({ mistakes, stars: stars(mistakes) }), 400);
    }
  };

  const startDrill = (i: number) => {
    if (teeth[i] !== "cavity") return;
    if (tool !== "drill") {
      setMistakes((m) => m + 1);
      trigger(i);
      return;
    }
    drillIndexRef.current = i;
    setDrillIndex(i);
    drillProgressRef.current = 0;
    drillStart.current = performance.now();
    const tick = (now: number) => {
      const pct = Math.min(100, ((now - drillStart.current) / cfg.holdMs) * 100);
      drillProgressRef.current = pct;
      setDrillProgress(pct);
      if (pct < 100) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const endDrill = (i: number) => {
    if (drillIndexRef.current !== i) return;
    drillIndexRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (drillProgressRef.current >= 100) {
      advance(i, "drilled");
    } else {
      setMistakes((m) => m + 1);
      trigger(i);
    }
    setDrillIndex(null);
    setDrillProgress(0);
  };

  const tapInstant = (i: number) => {
    const t = teeth[i];
    const step: Partial<Record<CavityState, { tool: CavityTool; next: CavityState }>> = {
      drilled: { tool: "fill", next: "filled" },
      filled: { tool: "polish", next: "healthy" },
    };
    const expected = step[t];
    if (expected && expected.tool === tool) {
      advance(i, expected.next);
    } else if (t !== "healthy") {
      setMistakes((m) => m + 1);
      trigger(i);
    }
  };

  // routed entirely through pointer events (no onClick) so a tooth that flips from
  // "cavity" to "drilled" mid-gesture can't pick up a trailing native click as a stray tap
  const handleDown = (i: number) => {
    if (teeth[i] === "cavity") startDrill(i);
    else tapInstant(i);
  };

  const colors: Record<CavityState, string> = {
    healthy: "#ffffff",
    cavity: "#7a4d3a",
    drilled: "#e5d8c8",
    filled: "#cfd8ff",
  };
  const emoji: Record<CavityState, string> = { healthy: "✨", cavity: "🕳️", drilled: "🔧", filled: "🧪" };

  return (
    <div className="flex flex-col h-full px-5 pt-4 pb-6">
      <MiniHeader
        patient={patient}
        mistakes={mistakes}
        hint="Hold to drill each cavity, then fill → polish"
      />
      <TimerBar remaining={remaining} total={cfg.timeLimit} />
      <div className="flex-1 grid grid-cols-3 gap-4 place-content-center">
        {teeth.map((t, i) => (
          <ToothTile
            key={i}
            color={colors[t]}
            emoji={emoji[t]}
            shake={shakeIndex === i}
            holdProgress={t === "cavity" ? (drillIndex === i ? drillProgress : 0) : undefined}
            onPointerDown={() => handleDown(i)}
            onPointerUp={() => endDrill(i)}
          />
        ))}
      </div>
      <ToolBar
        tools={[
          { id: "drill", label: "Drill", emoji: "🔧" },
          { id: "fill", label: "Fill", emoji: "🧪" },
          { id: "polish", label: "Polish", emoji: "🪄" },
        ]}
        active={tool}
        onSelect={setTool}
      />
    </div>
  );
}

/* 3. Whitening — apply gel, then release the UV timer inside a moving, narrowing zone */
function randomZone(width: number): [number, number] {
  const center = 20 + width / 2 + Math.random() * (60 - width);
  return [center - width / 2, center + width / 2];
}

export function WhiteningGame({ patient, onDone }: MinigameProps) {
  const cfg = difficultyConfig[patient.difficulty];
  const finish = useFinish(onDone);
  const [round, setRound] = useState(0);
  const [zone, setZone] = useState<[number, number]>(() => randomZone(cfg.zoneWidth));
  const [gelApplied, setGelApplied] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const [holding, setHolding] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef(0);
  const remaining = useCountdown(cfg.timeLimit, () => finish({ mistakes: 3, stars: 1 }));

  useEffect(() => {
    if (!holding) return;
    startRef.current = performance.now();
    const tick = (now: number) => {
      const elapsed = (now - startRef.current) % 1200;
      const pct = elapsed < 600 ? (elapsed / 600) * 100 : 100 - ((elapsed - 600) / 600) * 100;
      progressRef.current = pct;
      setProgress(pct);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [holding]);

  const release = () => {
    setHolding(false);
    const hit = progressRef.current >= zone[0] && progressRef.current <= zone[1];
    if (hit) {
      const nextRound = round + 1;
      setGelApplied(false);
      setProgress(0);
      if (nextRound >= 3) {
        setTimeout(() => finish({ mistakes, stars: stars(mistakes) }), 400);
      } else {
        setRound(nextRound);
        setZone(randomZone(cfg.zoneWidth));
      }
    } else {
      setMistakes((m) => m + 1);
      setProgress(0);
    }
  };

  const brightness = 60 + round * 13;

  return (
    <div className="flex flex-col h-full px-5 pt-4 pb-6">
      <MiniHeader patient={patient} mistakes={mistakes} hint="Apply gel, then release in the glowing zone" />
      <TimerBar remaining={remaining} total={cfg.timeLimit} />
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <motion.div
          animate={{ filter: `brightness(${brightness}%)` }}
          className="w-28 h-28 rounded-full flex items-center justify-center text-6xl bg-white/90"
        >
          🦷
        </motion.div>
        {!gelApplied ? (
          <button onClick={() => setGelApplied(true)} className="glass rounded-full px-5 py-2.5 text-sm font-semibold">
            💧 Apply Gel
          </button>
        ) : (
          <div className="w-full flex flex-col items-center gap-3">
            <div className="w-full h-4 rounded-full bg-white/10 overflow-hidden relative">
              <div
                className="absolute inset-y-0 bg-emerald-400/40"
                style={{ left: `${zone[0]}%`, right: `${100 - zone[1]}%` }}
              />
              <motion.div className="h-full bg-dada-pink" style={{ width: `${progress}%` }} />
            </div>
            <button
              onPointerDown={() => setHolding(true)}
              onPointerUp={release}
              onPointerLeave={() => holding && release()}
              className="glass rounded-full px-5 py-2.5 text-sm font-semibold"
            >
              🔆 Hold UV Light
            </button>
          </div>
        )}
        <p className="text-[11px] text-white/40">Round {round + 1} of 3</p>
      </div>
    </div>
  );
}

/* 4. Braces — attach brackets in order, then drag tension into a hidden target zone */
export function BracesGame({ patient, onDone }: MinigameProps) {
  const cfg = difficultyConfig[patient.difficulty];
  const finish = useFinish(onDone);
  const [attached, setAttached] = useState<boolean[]>(Array(cfg.teeth).fill(false));
  const [mistakes, setMistakes] = useState(0);
  const [phase, setPhase] = useState<"brackets" | "tension">("brackets");
  const [tension, setTension] = useState(50);
  const [zone] = useState<[number, number]>(() => {
    const offset = 25 + Math.random() * 20;
    const center = 50 + (Math.random() < 0.5 ? -offset : offset);
    const clamped = Math.min(88, Math.max(12, center));
    return [clamped - cfg.zoneWidth / 2, clamped + cfg.zoneWidth / 2];
  });
  const { shakeIndex, trigger } = useShake();
  const remaining = useCountdown(cfg.timeLimit, () => finish({ mistakes: 3, stars: 1 }));

  const nextIndex = attached.findIndex((a) => !a);

  const tapTooth = (i: number) => {
    if (i !== nextIndex) {
      setMistakes((m) => m + 1);
      trigger(i);
      return;
    }
    const next = attached.map((a, idx) => (idx === i ? true : a));
    setAttached(next);
    if (next.every(Boolean)) setPhase("tension");
  };

  const setWire = () => {
    if (tension < zone[0] || tension > zone[1]) {
      setMistakes((m) => m + 1);
      return;
    }
    finish({ mistakes, stars: stars(mistakes) });
  };

  return (
    <div className="flex flex-col h-full px-5 pt-4 pb-6">
      <MiniHeader
        patient={patient}
        mistakes={mistakes}
        hint={phase === "brackets" ? "Attach brackets left to right" : "Find the sweet spot for wire tension"}
      />
      <TimerBar remaining={remaining} total={cfg.timeLimit} />
      {phase === "brackets" ? (
        <div className="flex-1 grid grid-cols-3 gap-4 place-content-center">
          {attached.map((a, i) => (
            <ToothTile
              key={i}
              color={a ? "#cfd8ff" : "#ffffff"}
              emoji={a ? "🔩" : ""}
              shake={shakeIndex === i}
              onClick={() => tapTooth(i)}
            />
          ))}
        </div>
      ) : (
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
      )}
    </div>
  );
}

/* 5. Wisdom tooth — inject, wait, hold to extract for the required duration, apply gauze */
type WisdomStep = "inject" | "waiting" | "extract" | "gauze" | "done";

export function WisdomGame({ patient, onDone }: MinigameProps) {
  const cfg = difficultyConfig[patient.difficulty];
  const finish = useFinish(onDone);
  const [step, setStep] = useState<WisdomStep>("inject");
  const [waitProgress, setWaitProgress] = useState(0);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdProgressRef = useRef(0);
  const [mistakes, setMistakes] = useState(0);
  const rafRef = useRef<number | null>(null);
  const holdStart = useRef(0);
  const remaining = useCountdown(cfg.timeLimit, () => finish({ mistakes: 3, stars: 1 }));

  useEffect(() => {
    if (step !== "waiting") return;
    const start = performance.now();
    const tick = (now: number) => {
      const pct = Math.min(100, ((now - start) / cfg.waitMs) * 100);
      setWaitProgress(pct);
      if (pct >= 100) setStep("extract");
      else rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [step, cfg.waitMs]);

  const startHold = () => {
    holdProgressRef.current = 0;
    holdStart.current = performance.now();
    const tick = (now: number) => {
      const pct = Math.min(100, ((now - holdStart.current) / cfg.holdMs) * 100);
      holdProgressRef.current = pct;
      setHoldProgress(pct);
      if (pct < 100) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const releaseHold = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (holdProgressRef.current >= 100) {
      setStep("gauze");
    } else {
      setMistakes((m) => m + 1);
    }
    setHoldProgress(0);
  };

  const finishUp = () => {
    setStep("done");
    setTimeout(() => finish({ mistakes, stars: stars(mistakes) }), 400);
  };

  return (
    <div className="flex flex-col h-full px-5 pt-4 pb-6">
      <MiniHeader patient={patient} mistakes={mistakes} hint="Inject, wait, then extract carefully" />
      <TimerBar remaining={remaining} total={cfg.timeLimit} />
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <span className="text-6xl">🦷</span>
        {step === "inject" && (
          <button
            onClick={() => setStep("waiting")}
            className="glass rounded-full px-5 py-2.5 text-sm font-semibold"
          >
            💉 Inject Anesthesia
          </button>
        )}
        {step === "waiting" && (
          <div className="w-full flex flex-col items-center gap-2">
            <p className="text-[12px] text-white/50">Waiting for numbness…</p>
            <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-dada-blue" style={{ width: `${waitProgress}%` }} />
            </div>
          </div>
        )}
        {step === "extract" && (
          <div className="w-full flex flex-col items-center gap-3">
            <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-dada-pink" style={{ width: `${holdProgress}%` }} />
            </div>
            <button
              onPointerDown={startHold}
              onPointerUp={releaseHold}
              onPointerLeave={() => holdProgress > 0 && releaseHold()}
              className="glass rounded-full px-5 py-2.5 text-sm font-semibold"
            >
              🦿 Hold to Extract
            </button>
          </div>
        )}
        {step === "gauze" && (
          <button onClick={finishUp} className="glass rounded-full px-5 py-2.5 text-sm font-semibold">
            🩹 Apply Gauze
          </button>
        )}
      </div>
    </div>
  );
}

/* 6. X-ray diagnosis — find the damaged tooth in a growing grid, then name the diagnosis */
export function XrayGame({ patient, onDone }: MinigameProps) {
  const cfg = difficultyConfig[patient.difficulty];
  const finish = useFinish(onDone);
  const [damagedIndex] = useState(() => Math.floor(Math.random() * cfg.teeth));
  const [diagnosis] = useState<"Cavity" | "Broken Tooth">(Math.random() < 0.5 ? "Cavity" : "Broken Tooth");
  const [found, setFound] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const { shakeIndex, trigger } = useShake();
  const remaining = useCountdown(cfg.timeLimit, () => finish({ mistakes: 3, stars: 1 }));

  const tapTooth = (i: number) => {
    if (found) return;
    if (i === damagedIndex) setFound(true);
    else {
      setMistakes((m) => m + 1);
      trigger(i);
    }
  };

  const pick = (choice: string) => {
    if (choice === diagnosis) {
      finish({ mistakes, stars: stars(mistakes) });
    } else {
      setMistakes((m) => m + 1);
    }
  };

  return (
    <div className="flex flex-col h-full px-5 pt-4 pb-6">
      <MiniHeader
        patient={patient}
        mistakes={mistakes}
        hint={found ? "Choose the correct diagnosis" : "Tap the damaged tooth on the X-ray"}
      />
      <TimerBar remaining={remaining} total={cfg.timeLimit} />
      <div className="flex-1 grid grid-cols-3 gap-4 place-content-center">
        {Array.from({ length: cfg.teeth }).map((_, i) => (
          <motion.button
            key={i}
            onClick={() => tapTooth(i)}
            animate={shakeIndex === i ? { x: [-6, 6, -6, 0] } : {}}
            transition={{ duration: 0.3 }}
            className="relative aspect-square rounded-2xl flex items-center justify-center text-2xl shadow-inner"
            style={{ background: i === damagedIndex && found ? "#7a4d3a" : "#1c2b4a" }}
          >
            🦷
            {i === damagedIndex && (
              <span className="absolute bottom-1.5 right-1.5 text-[10px] opacity-30">
                {diagnosis === "Cavity" ? "⚫" : "〰️"}
              </span>
            )}
          </motion.button>
        ))}
      </div>
      {found && (
        <div className="flex justify-center gap-3 mt-4 shrink-0">
          {["Cavity", "Broken Tooth", "Healthy"].map((choice) => (
            <button key={choice} onClick={() => pick(choice)} className="glass rounded-xl px-3 py-2 text-[12px]">
              {choice}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
