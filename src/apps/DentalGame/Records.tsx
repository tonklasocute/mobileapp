import { GlassCard } from "../../components/GlassCard";
import { conditionInfo } from "./data";
import type { TreatmentRecord } from "./types";

export function Records({ records }: { records: TreatmentRecord[] }) {
  if (records.length === 0) {
    return (
      <div className="px-5 py-10 text-center text-white/40 text-sm">
        No visits yet — treat a patient to start building records.
      </div>
    );
  }

  return (
    <div className="px-5 py-5 flex flex-col gap-3">
      {records.map((r, i) => (
        <GlassCard key={i} className="p-4 flex items-center gap-3">
          <span className="text-2xl">{r.avatar}</span>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[14px]">{r.patientName}</p>
            <p className="text-[11px] text-white/50">
              {conditionInfo[r.condition].label} · {r.date}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[13px]">{"⭐".repeat(r.stars)}</p>
            <p className="text-[11px] text-dada-rose">+{r.coins}🪙</p>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
