import { motion } from "framer-motion";
import { GlassCard } from "../../components/GlassCard";
import { Button } from "../../components/Button";
import { clinicTitle } from "./data";
import type { ClinicState } from "./types";

function StatCard({
  emoji,
  label,
  value,
  onClick,
}: {
  emoji: string;
  label: string;
  value: string;
  onClick: () => void;
}) {
  return (
    <motion.button whileTap={{ scale: 0.96 }} onClick={onClick} className="text-left">
      <GlassCard className="p-4 flex flex-col gap-2 h-full">
        <span className="text-2xl">{emoji}</span>
        <div>
          <p className="text-[12px] text-white/50">{label}</p>
          <p className="font-semibold">{value}</p>
        </div>
      </GlassCard>
    </motion.button>
  );
}

export function Dashboard({
  state,
  todayCount,
  onOpenSchedule,
  onOpenRecords,
  onOpenAchievements,
}: {
  state: ClinicState;
  todayCount: number;
  onOpenSchedule: () => void;
  onOpenRecords: () => void;
  onOpenAchievements: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-4 pb-2">
        <p className="text-[12px] text-white/50">{clinicTitle(state.reputation)}</p>
      </div>
      <div className="flex-1 px-5 pb-5 grid grid-cols-2 gap-3 content-start">
        <StatCard emoji="🦷" label="Today's Patients" value={`${todayCount} waiting`} onClick={onOpenSchedule} />
        <StatCard emoji="📅" label="Schedule" value="View day" onClick={onOpenSchedule} />
        <StatCard emoji="📂" label="Patient Records" value={`${state.records.length} visits`} onClick={onOpenRecords} />
        <StatCard emoji="🏆" label="Achievements" value="View all" onClick={onOpenAchievements} />
        <StatCard emoji="💰" label="Earnings" value={`${state.coins} coins`} onClick={onOpenRecords} />
        <StatCard emoji="⭐" label="Reputation" value={state.reputation.toFixed(1)} onClick={onOpenAchievements} />
      </div>
      <div className="px-5 pb-8 shrink-0">
        <Button onClick={onOpenSchedule} className="w-full py-3.5 text-base">
          Start Clinic
        </Button>
      </div>
    </div>
  );
}
