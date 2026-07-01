import { useEffect, useState } from "react";
import { coinsFor, initialClinicState, reputationFor } from "./data";
import type { ClinicState, Patient, TreatmentRecord, TreatmentResult } from "./types";

const STORAGE_KEY = "dada-dental-state";

function loadState(): ClinicState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialClinicState;
    return { ...initialClinicState, ...JSON.parse(raw) };
  } catch {
    return initialClinicState;
  }
}

export function useClinicState() {
  const [state, setState] = useState<ClinicState>(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  function recordTreatment(patient: Patient, result: TreatmentResult) {
    const coins = coinsFor(patient.difficulty, result.stars);
    const reputation = Math.min(5, Math.max(0, state.reputation + reputationFor(result.stars)));
    const record: TreatmentRecord = {
      patientId: patient.id,
      patientName: patient.name,
      avatar: patient.avatar,
      condition: patient.condition,
      stars: result.stars,
      coins,
      date: new Date().toLocaleDateString(),
    };

    setState((prev) => ({
      coins: prev.coins + coins,
      reputation,
      stats: {
        patientsTreated: prev.stats.patientsTreated + 1,
        teethFixed: prev.stats.teethFixed + 6,
        perfectTreatments: prev.stats.perfectTreatments + (result.mistakes === 0 ? 1 : 0),
        mistakeStreak: result.mistakes === 0 ? prev.stats.mistakeStreak + 1 : 0,
      },
      records: [record, ...prev.records],
    }));

    return { coins, reputation };
  }

  return { state, recordTreatment };
}
