import { motion } from "framer-motion";
import { conditionInfo, moodEmoji } from "./data";
import type { Patient } from "./types";

const slots: Patient["slot"][] = ["Morning", "Afternoon", "Evening"];

export function Schedule({
  patients,
  treatedIds,
  onSelect,
}: {
  patients: Patient[];
  treatedIds: Set<string>;
  onSelect: (patient: Patient) => void;
}) {
  return (
    <div className="px-5 py-5 flex flex-col gap-6">
      {slots.map((slot) => {
        const group = patients.filter((p) => p.slot === slot);
        if (group.length === 0) return null;
        return (
          <div key={slot}>
            <p className="text-[12px] font-semibold text-white/50 mb-2 uppercase tracking-wide">{slot}</p>
            <div className="flex flex-col gap-2.5">
              {group.map((p) => {
                const done = treatedIds.has(p.id);
                return (
                  <motion.button
                    key={p.id}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => !done && onSelect(p)}
                    disabled={done}
                    className={`glass rounded-2xl p-3.5 flex items-center gap-3 text-left ${
                      done ? "opacity-40" : ""
                    }`}
                  >
                    <span className="text-2xl">{p.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[14px]">{p.name}</p>
                      <p className="text-[11px] text-white/50">
                        {conditionInfo[p.condition].label} · {p.difficulty}
                      </p>
                    </div>
                    <span className="text-lg">{done ? "✅" : moodEmoji[p.mood]}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
