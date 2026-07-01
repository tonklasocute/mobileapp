import { useMemo, useState } from "react";
import { AppShell } from "../../components/AppShell";
import { Dashboard } from "./Dashboard";
import { Schedule } from "./Schedule";
import { PatientInfo } from "./PatientInfo";
import { Records } from "./Records";
import { Achievements } from "./Achievements";
import { Result } from "./Result";
import { CavityGame, CleaningGame, BracesGame, WhiteningGame, WisdomGame, XrayGame, type MinigameProps } from "./minigames";
import { useClinicState } from "./useClinicState";
import { generatePatients } from "./data";
import type { Condition, Patient, TreatmentResult } from "./types";

const minigameByCondition: Record<Condition, (props: MinigameProps) => React.ReactElement> = {
  plaque: CleaningGame,
  cavity: CavityGame,
  whitening: WhiteningGame,
  braces: BracesGame,
  wisdom: WisdomGame,
  xray: XrayGame,
};

type Screen = "dashboard" | "schedule" | "patient" | "treatment" | "result" | "records" | "achievements";

const screenTitle: Record<Screen, string> = {
  dashboard: "Dada Dental",
  schedule: "Today's Schedule",
  patient: "Patient Chart",
  treatment: "Treatment",
  result: "Treatment Complete",
  records: "Patient Records",
  achievements: "Achievements",
};

export function DentalGame({ onClose }: { onClose: () => void }) {
  const patients = useMemo(() => generatePatients(), []);
  const { state, recordTreatment } = useClinicState();
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [selected, setSelected] = useState<Patient | null>(null);
  const [treatedIds, setTreatedIds] = useState<Set<string>>(new Set());
  const [lastResult, setLastResult] = useState<{ stars: number; coins: number } | null>(null);

  const todayCount = patients.filter((p) => !treatedIds.has(p.id)).length;

  const handleTreatmentDone = (result: TreatmentResult) => {
    if (!selected) return;
    const { coins } = recordTreatment(selected, result);
    setTreatedIds((prev) => new Set(prev).add(selected.id));
    setLastResult({ stars: result.stars, coins });
    setScreen("result");
  };

  const goBack = () => {
    if (screen === "dashboard") onClose();
    else if (screen === "patient" || screen === "treatment") setScreen("schedule");
    else setScreen("dashboard");
  };

  const MinigameComponent = selected ? minigameByCondition[selected.condition] : null;

  return (
    <div className="absolute inset-0">
      <AppShell title={screenTitle[screen]} onBack={goBack}>
        {screen === "dashboard" && (
          <Dashboard
            state={state}
            todayCount={todayCount}
            onOpenSchedule={() => setScreen("schedule")}
            onOpenRecords={() => setScreen("records")}
            onOpenAchievements={() => setScreen("achievements")}
          />
        )}

        {screen === "schedule" && (
          <Schedule
            patients={patients}
            treatedIds={treatedIds}
            onSelect={(p) => {
              setSelected(p);
              setScreen("patient");
            }}
          />
        )}

        {screen === "patient" && selected && (
          <PatientInfo patient={selected} onBegin={() => setScreen("treatment")} />
        )}

        {screen === "treatment" && selected && MinigameComponent && (
          <MinigameComponent patient={selected} onDone={handleTreatmentDone} />
        )}

        {screen === "result" && selected && lastResult && (
          <Result
            patient={selected}
            stars={lastResult.stars}
            coins={lastResult.coins}
            onBackToLobby={() => {
              setSelected(null);
              setLastResult(null);
              setScreen("dashboard");
            }}
          />
        )}

        {screen === "records" && <Records records={state.records} />}
        {screen === "achievements" && <Achievements state={state} />}
      </AppShell>
    </div>
  );
}
