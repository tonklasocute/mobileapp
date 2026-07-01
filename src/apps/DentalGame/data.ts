import type { Achievement, ClinicState, Condition, Difficulty, Mood, Patient } from "./types";

export const conditionInfo: Record<
  Condition,
  { label: string; room: string; symptom: string; icon: string }
> = {
  plaque: {
    label: "Plaque Buildup",
    room: "Cleaning Room",
    symptom: "Complains of a fuzzy feeling on the teeth after meals.",
    icon: "🪥",
  },
  cavity: {
    label: "Cavity",
    room: "Restoration Room",
    symptom: "Sharp pain when eating anything sweet or cold.",
    icon: "🕳️",
  },
  whitening: {
    label: "Teeth Whitening",
    room: "Whitening Studio",
    symptom: "Wants a brighter smile before a big event.",
    icon: "✨",
  },
  braces: {
    label: "Braces Adjustment",
    room: "Orthodontics Room",
    symptom: "Braces feel loose and need retightening.",
    icon: "🦴",
  },
  wisdom: {
    label: "Wisdom Tooth",
    room: "Surgery Room",
    symptom: "Swollen jaw and pain in the back of the mouth.",
    icon: "😖",
  },
  xray: {
    label: "Mystery Pain",
    room: "Diagnostic Room",
    symptom: "Can't pinpoint which tooth hurts — needs an X-ray.",
    icon: "🩻",
  },
};

const difficultyCoins: Record<Difficulty, number> = {
  Easy: 40,
  Medium: 70,
  Hard: 110,
};

export function coinsFor(difficulty: Difficulty, stars: number): number {
  return Math.round(difficultyCoins[difficulty] * (stars / 3));
}

export interface DifficultyConfig {
  /** total teeth tiles shown in grid-based games */
  teeth: number;
  /** how many of those teeth need treatment */
  problems: number;
  /** seconds allotted for the whole treatment */
  timeLimit: number;
  /** width (out of 100) of the success zone in timing games */
  zoneWidth: number;
  /** ms the extract button must be held for the wisdom-tooth game */
  holdMs: number;
  /** ms the anesthesia wait bar takes to fill */
  waitMs: number;
}

export const difficultyConfig: Record<Difficulty, DifficultyConfig> = {
  Easy: { teeth: 6, problems: 3, timeLimit: 35, zoneWidth: 34, holdMs: 900, waitMs: 1200 },
  Medium: { teeth: 9, problems: 5, timeLimit: 25, zoneWidth: 24, holdMs: 1300, waitMs: 1800 },
  Hard: { teeth: 12, problems: 8, timeLimit: 18, zoneWidth: 16, holdMs: 1700, waitMs: 2400 },
};

export function reputationFor(stars: number): number {
  return stars === 3 ? 0.15 : stars === 2 ? 0.05 : -0.05;
}

const moods: Mood[] = ["calm", "nervous", "cheerful", "grumpy"];
export const moodEmoji: Record<Mood, string> = {
  calm: "😌",
  nervous: "😬",
  cheerful: "😄",
  grumpy: "😤",
};

const avatars = ["🧑", "👩", "👨", "🧓", "👧", "🧑‍🦱", "👩‍🦰", "🧑‍🦳", "👨‍🦲", "👩‍🦳", "🧑‍🎤", "👨‍🌾"];
const names = [
  "Milo",
  "Ruby",
  "Theo",
  "Nadia",
  "Kai",
  "Suki",
  "Owen",
  "Lena",
  "Arlo",
  "Maya",
  "Finn",
  "Iris",
];
const conditions: Condition[] = ["plaque", "cavity", "whitening", "braces", "wisdom", "xray"];
const difficulties: Difficulty[] = ["Easy", "Medium", "Hard"];
const slots: Patient["slot"][] = ["Morning", "Afternoon", "Evening"];

export function generatePatients(count = 12): Patient[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `pt${i + 1}`,
    name: names[i % names.length],
    age: 6 + ((i * 7) % 60),
    avatar: avatars[i % avatars.length],
    mood: moods[i % moods.length],
    condition: conditions[i % conditions.length],
    difficulty: difficulties[(i + Math.floor(i / conditions.length)) % difficulties.length],
    slot: slots[i % slots.length],
  }));
}

export const achievements: Achievement[] = [
  {
    id: "first-patient",
    name: "First Patient",
    description: "Treat your very first patient.",
    emoji: "🎉",
    isUnlocked: (s) => s.stats.patientsTreated >= 1,
  },
  {
    id: "hundred-teeth",
    name: "100 Clean Teeth",
    description: "Fix 100 teeth across all patients.",
    emoji: "🦷",
    isUnlocked: (s) => s.stats.teethFixed >= 100,
  },
  {
    id: "perfect-treatment",
    name: "Perfect Treatment",
    description: "Complete a treatment with zero mistakes.",
    emoji: "💯",
    isUnlocked: (s) => s.stats.perfectTreatments >= 1,
  },
  {
    id: "no-mistakes-streak",
    name: "Steady Hands",
    description: "Three perfect treatments in a row.",
    emoji: "🖐️",
    isUnlocked: (s) => s.stats.mistakeStreak >= 3,
  },
  {
    id: "five-star-clinic",
    name: "Five-Star Clinic",
    description: "Reach maximum clinic reputation.",
    emoji: "⭐",
    isUnlocked: (s) => s.reputation >= 5,
  },
  {
    id: "master-dentist",
    name: "Master Dentist",
    description: "Treat 20 patients.",
    emoji: "🏆",
    isUnlocked: (s) => s.stats.patientsTreated >= 20,
  },
];

export function clinicTitle(reputation: number): string {
  if (reputation >= 5) return "Five-Star Clinic";
  if (reputation >= 3.5) return "Renowned Clinic";
  if (reputation >= 2) return "Trusted Clinic";
  if (reputation >= 1) return "Growing Clinic";
  return "New Clinic";
}

export const initialClinicState: ClinicState = {
  coins: 0,
  reputation: 0,
  stats: { patientsTreated: 0, teethFixed: 0, perfectTreatments: 0, mistakeStreak: 0 },
  records: [],
};
