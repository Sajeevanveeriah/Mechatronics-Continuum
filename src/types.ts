export type MasteryState =
  | "Not-started"
  | "Learning"
  | "Practising"
  | "Review-due"
  | "Demonstrated"
  | "Needs-repair";
export type MistakeType =
  | "concept gap"
  | "recall-latency problem"
  | "incorrect formula or method selection"
  | "algebra or calculus error"
  | "unit or dimensional error"
  | "sign, direction or coordinate error"
  | "assumption or boundary-condition error"
  | "implementation or debugging error"
  | "communication error"
  | "careless transcription";
export interface Progress {
  schemaVersion: 1;
  name: string;
  goal: string;
  theme: "system" | "light" | "dark";
  states: Record<string, MasteryState>;
  notes: Record<string, string>;
  bookmarks: string[];
  mistakes: {
    id: string;
    lesson: string;
    type: MistakeType;
    note: string;
    created: string;
  }[];
  reviews: { lesson: string; due: string; interval: number }[];
  session: { duration: number; paused: boolean; index: number } | null;
}
