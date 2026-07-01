import { GlassCard } from "../../components/GlassCard";
import { achievements } from "./data";
import type { ClinicState } from "./types";

export function Achievements({ state }: { state: ClinicState }) {
  return (
    <div className="px-5 py-5 grid grid-cols-2 gap-3">
      {achievements.map((a) => {
        const unlocked = a.isUnlocked(state);
        return (
          <GlassCard
            key={a.id}
            className={`p-4 flex flex-col items-center text-center gap-1.5 ${unlocked ? "" : "opacity-40"}`}
          >
            <span className="text-3xl">{unlocked ? a.emoji : "🔒"}</span>
            <p className="font-semibold text-[13px]">{a.name}</p>
            <p className="text-[11px] text-white/50">{a.description}</p>
          </GlassCard>
        );
      })}
    </div>
  );
}
