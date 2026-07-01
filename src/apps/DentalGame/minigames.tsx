import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Patient, TreatmentResult } from "./types";

export interface MinigameProps {
  patient: Patient;
  onDone: (result: TreatmentResult) => void;
}

function stars(mistakes: number) {
  return Math.max(1, 3 - mistakes);
}

function MiniHeader({ patient, mistakes, hint }: { patient: Patient; mistakes: number; hint: string }) {
  return (
    <div className="text-center mb-4">
      <p className="text-sm text-white/60">
        Treating {patient.name} · mistakes: {mistakes}
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
  disabled,
}: {
  color: string;
  emoji: string;
  shake: boolean;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      animate={shake ? { x: [-6, 6, -6, 0] } : {}}
      transition={{ duration: 0.3 }}
      className="aspect-square rounded-2xl flex items-center justify-center text-2xl shadow-inner"
      style={{ background: color }}
    >
      {emoji}
    </motion.button>
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

/* 1. Cleaning — tap plaque teeth with the scaler, avoid healthy gums */
export function CleaningGame({ patient, onDone }: MinigameProps) {
  const [teeth, setTeeth] = useState<("healthy" | "plaque")[]>(() =>
    Array.from({ length: 6 }, (_, i) => (i % 2 === 0 ? "plaque" : "healthy")),
  );
  const [mistakes, setMistakes] = useState(0);
  const { shakeIndex, trigger } = useShake();

  const tap = (i: number) => {
    if (teeth[i] === "plaque") {
      setTeeth((t) => t.map((tt, idx) => (idx === i ? "healthy" : tt)));
      const willComplete = teeth.every((t, idx) => (idx === i ? true : t === "healthy"));
      if (willComplete) setTimeout(() => onDone({ mistakes, stars: stars(mistakes) }), 400);
    } else {
      setMistakes((m) => m + 1);
      trigger(i);
    }
  };

  return (
    <div className="flex flex-col h-full px-5 pt-4 pb-6">
      <MiniHeader patient={patient} mistakes={mistakes} hint="Tap the scaler on plaque, avoid clean teeth" />
      <div className="flex-1 grid grid-cols-3 gap-4 place-content-center">
        {teeth.map((t, i) => (
          <ToothTile
            key={i}
            color={t === "plaque" ? "#c9a24a" : "#ffffff"}
            emoji={t === "healthy" ? "✨" : "🪥"}
            shake={shakeIndex === i}
            onClick={() => tap(i)}
          />
        ))}
      </div>
    </div>
  );
}

/* 2. Cavity fill — drill, fill, polish each cavity tooth in order */
type CavityState = "healthy" | "cavity" | "drilled" | "filled";
type CavityTool = "drill" | "fill" | "polish";

export function CavityGame({ patient, onDone }: MinigameProps) {
  const [teeth, setTeeth] = useState<CavityState[]>(() =>
    Array.from({ length: 6 }, (_, i) => (i % 2 === 0 ? "cavity" : "healthy")),
  );
  const [tool, setTool] = useState<CavityTool>("drill");
  const [mistakes, setMistakes] = useState(0);
  const { shakeIndex, trigger } = useShake();

  const tap = (i: number) => {
    const t = teeth[i];
    const step: Partial<Record<CavityState, { tool: CavityTool; next: CavityState }>> = {
      cavity: { tool: "drill", next: "drilled" },
      drilled: { tool: "fill", next: "filled" },
      filled: { tool: "polish", next: "healthy" },
    };
    const expected = step[t];
    if (expected && expected.tool === tool) {
      const next = expected.next;
      setTeeth((arr) => arr.map((tt, idx) => (idx === i ? next : tt)));
      if (next === "healthy") {
        const willComplete = teeth.every((tt, idx) => (idx === i ? true : tt === "healthy"));
        if (willComplete) setTimeout(() => onDone({ mistakes, stars: stars(mistakes) }), 400);
      }
    } else if (t !== "healthy") {
      setMistakes((m) => m + 1);
      trigger(i);
    }
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
      <MiniHeader patient={patient} mistakes={mistakes} hint="Drill → fill → polish each cavity" />
      <div className="flex-1 grid grid-cols-3 gap-4 place-content-center">
        {teeth.map((t, i) => (
          <ToothTile key={i} color={colors[t]} emoji={emoji[t]} shake={shakeIndex === i} onClick={() => tap(i)} />
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

/* 3. Whitening — apply gel, then release the UV timer inside the green zone */
const UV_ZONE: [number, number] = [55, 80];

export function WhiteningGame({ patient, onDone }: MinigameProps) {
  const [round, setRound] = useState(0);
  const [gelApplied, setGelApplied] = useState(false);
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef(0);

  useEffect(() => {
    if (!holding) return;
    startRef.current = performance.now();
    const tick = (now: number) => {
      const elapsed = (now - startRef.current) % 1200;
      const pct = elapsed < 600 ? (elapsed / 600) * 100 : 100 - ((elapsed - 600) / 600) * 100;
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
    const hit = progress >= UV_ZONE[0] && progress <= UV_ZONE[1];
    if (hit) {
      const nextRound = round + 1;
      setGelApplied(false);
      setProgress(0);
      if (nextRound >= 3) {
        setTimeout(() => onDone({ mistakes, stars: stars(mistakes) }), 400);
      } else {
        setRound(nextRound);
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
                style={{ left: `${UV_ZONE[0]}%`, right: `${100 - UV_ZONE[1]}%` }}
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

/* 4. Braces — attach brackets in order, then set tension in the target zone */
export function BracesGame({ patient, onDone }: MinigameProps) {
  const [attached, setAttached] = useState<boolean[]>(Array(6).fill(false));
  const [mistakes, setMistakes] = useState(0);
  const [phase, setPhase] = useState<"brackets" | "tension">("brackets");
  const [tension, setTension] = useState(50);
  const { shakeIndex, trigger } = useShake();

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
    if (tension < 40 || tension > 60) {
      setMistakes((m) => m + 1);
      return;
    }
    setTimeout(() => onDone({ mistakes, stars: stars(mistakes) }), 300);
  };

  return (
    <div className="flex flex-col h-full px-5 pt-4 pb-6">
      <MiniHeader
        patient={patient}
        mistakes={mistakes}
        hint={phase === "brackets" ? "Attach brackets left to right" : "Set wire tension to the middle"}
      />
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

/* 5. Wisdom tooth — inject, wait, hold to extract, apply gauze */
type WisdomStep = "inject" | "waiting" | "extract" | "gauze" | "done";

export function WisdomGame({ patient, onDone }: MinigameProps) {
  const [step, setStep] = useState<WisdomStep>("inject");
  const [waitProgress, setWaitProgress] = useState(0);
  const [holdProgress, setHoldProgress] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const rafRef = useRef<number | null>(null);
  const holdStart = useRef(0);

  useEffect(() => {
    if (step !== "waiting") return;
    const start = performance.now();
    const tick = (now: number) => {
      const pct = Math.min(100, ((now - start) / 1800) * 100);
      setWaitProgress(pct);
      if (pct >= 100) setStep("extract");
      else rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [step]);

  const startHold = () => {
    holdStart.current = performance.now();
    const tick = (now: number) => {
      const pct = Math.min(100, ((now - holdStart.current) / 1200) * 100);
      setHoldProgress(pct);
      if (pct < 100) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const releaseHold = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (holdProgress >= 100) {
      setStep("gauze");
    } else {
      setMistakes((m) => m + 1);
    }
    setHoldProgress(0);
  };

  const finish = () => {
    setStep("done");
    setTimeout(() => onDone({ mistakes, stars: stars(mistakes) }), 400);
  };

  return (
    <div className="flex flex-col h-full px-5 pt-4 pb-6">
      <MiniHeader patient={patient} mistakes={mistakes} hint="Inject, wait, then extract carefully" />
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
          <button onClick={finish} className="glass rounded-full px-5 py-2.5 text-sm font-semibold">
            🩹 Apply Gauze
          </button>
        )}
      </div>
    </div>
  );
}

/* 6. X-ray diagnosis — find the damaged tooth, then name the diagnosis */
export function XrayGame({ patient, onDone }: MinigameProps) {
  const [damagedIndex] = useState(() => Math.floor(Math.random() * 6));
  const [diagnosis] = useState<"Cavity" | "Broken Tooth">(Math.random() < 0.5 ? "Cavity" : "Broken Tooth");
  const [found, setFound] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const { shakeIndex, trigger } = useShake();

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
      setTimeout(() => onDone({ mistakes, stars: stars(mistakes) }), 300);
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
      <div className="flex-1 grid grid-cols-3 gap-4 place-content-center">
        {Array.from({ length: 6 }).map((_, i) => (
          <ToothTile
            key={i}
            color={i === damagedIndex && found ? "#7a4d3a" : "#1c2b4a"}
            emoji="🦷"
            shake={shakeIndex === i}
            onClick={() => tapTooth(i)}
          />
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
