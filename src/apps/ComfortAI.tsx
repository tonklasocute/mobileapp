import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AppShell } from "../components/AppShell";
import { GlassCard } from "../components/GlassCard";
import { Button } from "../components/Button";
import comfortReplies from "../data/comfortReplies.json";
import type { ComfortEntry, Mood } from "../types";

const moods: { id: Mood; emoji: string; label: string }[] = [
  { id: "great", emoji: "🙂", label: "Great" },
  { id: "okay", emoji: "😐", label: "Okay" },
  { id: "sad", emoji: "🥺", label: "Sad" },
  { id: "crying", emoji: "😭", label: "Overwhelmed" },
];

function MoodSelector({ onSelect }: { onSelect: (mood: Mood) => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-8 text-center">
      <p className="text-white/70 text-sm">How are you feeling right now?</p>
      <div className="grid grid-cols-2 gap-4">
        {moods.map((m) => (
          <motion.button
            key={m.id}
            whileTap={{ scale: 0.92 }}
            onClick={() => onSelect(m.id)}
            className="glass rounded-2xl w-28 h-28 flex flex-col items-center justify-center gap-2"
          >
            <span className="text-4xl">{m.emoji}</span>
            <span className="text-[12px] text-white/70">{m.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function BreathingScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"in" | "out">("in");

  useEffect(() => {
    const id = setInterval(() => setPhase((p) => (p === "in" ? "out" : "in")), 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      <motion.div
        animate={{ scale: phase === "in" ? 1.4 : 0.8 }}
        transition={{ duration: 4, ease: "easeInOut" }}
        className="w-32 h-32 rounded-full"
        style={{ background: "radial-gradient(circle,#8b7bff,#0d0b18)" }}
      />
      <p className="text-white/70 text-sm">{phase === "in" ? "Breathe in…" : "Breathe out…"}</p>
      <Button variant="glass" onClick={onDone}>
        Done
      </Button>
    </div>
  );
}

function ResponseScreen({
  entry,
  onBreathe,
}: {
  entry: ComfortEntry;
  onBreathe: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 px-5 py-5">
      <GlassCard className="p-4 flex flex-col gap-2">
        {entry.responses.map((r, i) => (
          <p key={i} className="text-[14px] text-white/90 leading-snug">
            {r}
          </p>
        ))}
      </GlassCard>
      <GlassCard className="p-4">
        <p className="text-[11px] uppercase tracking-wide text-white/40 mb-1">
          Affirmation
        </p>
        <p className="text-[14px] italic text-white/85">"{entry.affirmation}"</p>
      </GlassCard>
      <GlassCard className="p-4 flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-white/40 mb-1">
            Soft suggestion
          </p>
          <p className="text-[13px] text-white/85">🎵 {entry.songSuggestion}</p>
        </div>
      </GlassCard>
      <Button onClick={onBreathe}>Try a breathing exercise</Button>
    </div>
  );
}

export function ComfortAI({ onClose }: { onClose: () => void }) {
  const [mood, setMood] = useState<Mood | null>(null);
  const [breathing, setBreathing] = useState(false);

  const entry = mood ? (comfortReplies as Record<Mood, ComfortEntry>)[mood] : null;

  return (
    <div className="absolute inset-0">
      <AppShell
        title="Comfort AI"
        onBack={() => {
          if (breathing) setBreathing(false);
          else if (mood) setMood(null);
          else onClose();
        }}
      >
        {!mood && <MoodSelector onSelect={setMood} />}
        {mood && entry && !breathing && (
          <ResponseScreen entry={entry} onBreathe={() => setBreathing(true)} />
        )}
        {breathing && <BreathingScreen onDone={() => setBreathing(false)} />}
      </AppShell>
    </div>
  );
}
