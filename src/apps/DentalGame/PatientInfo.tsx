import { GlassCard } from "../../components/GlassCard";
import { Button } from "../../components/Button";
import { conditionInfo, moodEmoji } from "./data";
import type { Patient } from "./types";

export function PatientInfo({ patient, onBegin }: { patient: Patient; onBegin: () => void }) {
  const info = conditionInfo[patient.condition];

  return (
    <div className="px-5 py-5 flex flex-col gap-4">
      <GlassCard className="p-5 flex flex-col items-center gap-2 text-center">
        <span className="text-5xl">{patient.avatar}</span>
        <p className="text-lg font-semibold">{patient.name}</p>
        <p className="text-[12px] text-white/50">
          Age {patient.age} · {moodEmoji[patient.mood]} {patient.mood}
        </p>
      </GlassCard>

      <GlassCard className="p-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{info.icon}</span>
          <div>
            <p className="font-semibold text-[14px]">{info.label}</p>
            <p className="text-[11px] text-white/50">{info.room}</p>
          </div>
        </div>
        <p className="text-[13px] text-white/70 leading-relaxed">{info.symptom}</p>
        <div className="flex items-center justify-between text-[12px] text-white/50 pt-2 border-t border-white/10">
          <span>Difficulty</span>
          <span className="font-semibold text-white/80">{patient.difficulty}</span>
        </div>
      </GlassCard>

      <Button onClick={onBegin} className="w-full py-3.5 text-base mt-2">
        Begin Treatment
      </Button>
    </div>
  );
}
