import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AppShell } from "../components/AppShell";
import { Button } from "../components/Button";

type ToothState = "healthy" | "plaque" | "cavity" | "drilled";
type Tool = "clean" | "drill" | "fill" | "air";

interface Patient {
  id: string;
  name: string;
  difficulty: "Easy" | "Medium" | "Hard";
  teeth: ToothState[];
}

const patients: Patient[] = [
  {
    id: "pt1",
    name: "Milo",
    difficulty: "Easy",
    teeth: ["healthy", "plaque", "healthy", "plaque", "healthy", "healthy"],
  },
  {
    id: "pt2",
    name: "Ruby",
    difficulty: "Medium",
    teeth: ["plaque", "cavity", "healthy", "plaque", "cavity", "healthy"],
  },
  {
    id: "pt3",
    name: "Theo",
    difficulty: "Hard",
    teeth: ["cavity", "cavity", "plaque", "cavity", "plaque", "cavity"],
  },
];

const tools: { id: Tool; label: string; emoji: string }[] = [
  { id: "clean", label: "Clean", emoji: "🪥" },
  { id: "drill", label: "Drill", emoji: "🔧" },
  { id: "fill", label: "Fill", emoji: "🧪" },
  { id: "air", label: "Air", emoji: "💨" },
];

function applyTool(tool: Tool, tooth: ToothState): { next: ToothState; mistake: boolean } {
  if (tool === "clean" && tooth === "plaque") return { next: "healthy", mistake: false };
  if (tool === "drill" && tooth === "cavity") return { next: "drilled", mistake: false };
  if (tool === "fill" && tooth === "drilled") return { next: "healthy", mistake: false };
  if (tool === "air" && tooth === "healthy") return { next: "healthy", mistake: false };
  return { next: tooth, mistake: tooth !== "healthy" };
}

const toothColor: Record<ToothState, string> = {
  healthy: "#ffffff",
  plaque: "#c9a24a",
  cavity: "#7a4d3a",
  drilled: "#e5d8c8",
};

function Treatment({ patient, onDone }: { patient: Patient; onDone: (stars: number) => void }) {
  const [teeth, setTeeth] = useState(patient.teeth);
  const [tool, setTool] = useState<Tool>("clean");
  const [mistakes, setMistakes] = useState(0);
  const [shakeIndex, setShakeIndex] = useState<number | null>(null);

  const complete = teeth.every((t) => t === "healthy");

  const tapTooth = (i: number) => {
    const { next, mistake } = applyTool(tool, teeth[i]);
    setTeeth((t) => t.map((tt, idx) => (idx === i ? next : tt)));
    if (mistake) {
      setMistakes((m) => m + 1);
      setShakeIndex(i);
      setTimeout(() => setShakeIndex(null), 300);
    } else if (next === "healthy" && teeth[i] !== "healthy") {
      const willComplete = teeth.every((t, idx) => (idx === i ? true : t === "healthy"));
      if (willComplete) {
        setTimeout(() => onDone(Math.max(1, 3 - mistakes)), 400);
      }
    }
  };

  return (
    <div className="flex flex-col h-full px-5 pt-4 pb-6">
      <p className="text-center text-sm text-white/60 mb-4">
        Treating {patient.name} · mistakes: {mistakes}
      </p>
      <div className="flex-1 grid grid-cols-3 gap-4 place-content-center">
        {teeth.map((t, i) => (
          <motion.button
            key={i}
            onClick={() => tapTooth(i)}
            animate={shakeIndex === i ? { x: [-6, 6, -6, 0] } : {}}
            transition={{ duration: 0.3 }}
            className="aspect-square rounded-2xl flex items-center justify-center text-3xl shadow-inner"
            style={{ background: toothColor[t] }}
          >
            {t === "healthy" ? "✨" : ""}
          </motion.button>
        ))}
      </div>
      {complete ? (
        <p className="text-center text-white/60 text-sm mt-4">All done ✨</p>
      ) : (
        <div className="flex justify-center gap-3 mt-4 shrink-0">
          {tools.map((t) => (
            <button
              key={t.id}
              onClick={() => setTool(t.id)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl ${
                tool === t.id ? "bg-white/20" : "glass"
              }`}
            >
              <span className="text-xl">{t.emoji}</span>
              <span className="text-[10px] text-white/70">{t.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ResultScreen({
  stars,
  onBackToLobby,
}: {
  stars: number;
  onBackToLobby: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-5 px-8 text-center">
      <p className="text-white/60 text-sm">Treatment complete</p>
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
      <Button onClick={onBackToLobby}>Back to lobby</Button>
    </div>
  );
}

export function DentalGame({ onClose }: { onClose: () => void }) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [stars, setStars] = useState<number | null>(null);

  const patientState = useMemo(() => patient, [patient]);

  return (
    <div className="absolute inset-0">
      <AppShell
        title={patient ? patient.name : "Dental Clinic"}
        onBack={() => {
          if (stars !== null || patient) {
            setPatient(null);
            setStars(null);
          } else onClose();
        }}
      >
        {!patientState && (
          <div className="px-5 py-5 flex flex-col gap-3">
            {patients.map((p) => (
              <button
                key={p.id}
                onClick={() => setPatient(p)}
                className="glass rounded-2xl p-4 flex items-center justify-between text-left"
              >
                <div>
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-[12px] text-white/50">{p.difficulty}</p>
                </div>
                <span className="text-2xl">🦷</span>
              </button>
            ))}
          </div>
        )}

        {patientState && stars === null && (
          <Treatment patient={patientState} onDone={setStars} />
        )}

        {patientState && stars !== null && (
          <ResultScreen
            stars={stars}
            onBackToLobby={() => {
              setPatient(null);
              setStars(null);
            }}
          />
        )}
      </AppShell>
    </div>
  );
}
