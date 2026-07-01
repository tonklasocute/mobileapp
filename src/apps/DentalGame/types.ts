export type Difficulty = "Easy" | "Medium" | "Hard";

export type Condition =
  | "plaque"
  | "cavity"
  | "whitening"
  | "braces"
  | "wisdom"
  | "xray";

export type Mood = "calm" | "nervous" | "cheerful" | "grumpy";

export interface Patient {
  id: string;
  name: string;
  age: number;
  avatar: string;
  mood: Mood;
  condition: Condition;
  difficulty: Difficulty;
  slot: "Morning" | "Afternoon" | "Evening";
}

export interface TreatmentResult {
  mistakes: number;
  stars: number;
}

export interface TreatmentRecord {
  patientId: string;
  patientName: string;
  avatar: string;
  condition: Condition;
  stars: number;
  coins: number;
  date: string;
}

export interface ClinicStats {
  patientsTreated: number;
  teethFixed: number;
  perfectTreatments: number;
  mistakeStreak: number;
}

export interface ClinicState {
  coins: number;
  reputation: number;
  stats: ClinicStats;
  records: TreatmentRecord[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  isUnlocked: (state: ClinicState) => boolean;
}
