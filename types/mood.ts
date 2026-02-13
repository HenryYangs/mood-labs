export const moodOptions = [
  "happy",
  "sad",
  "romantic",
  "excited",
  "anxious",
  "calm"
] as const;

export type Mood = (typeof moodOptions)[number];

export type MoodLabel = {
  mood: Mood;
  label: string;
  emoji: string;
};

export const moodLabels: readonly MoodLabel[] = [
  { mood: "happy", label: "开心", emoji: "😄" },
  { mood: "sad", label: "低落", emoji: "😢" },
  { mood: "romantic", label: "想恋爱", emoji: "🥰" },
  { mood: "excited", label: "很兴奋", emoji: "🤩" },
  { mood: "anxious", label: "有点焦虑", emoji: "😰" },
  { mood: "calm", label: "想放松", emoji: "😌" }
] as const;
