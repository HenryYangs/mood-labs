export const moodOptions = [
  "cheerful",
  "reflective",
  "gloomy",
  "humorous",
  "melancholy",
  "idyllic",
  "chill",
  "romantic",
  "weird",
  "horny",
  "sleepy",
  "angry",
  "fearful",
  "lonely",
  "tense",
  "thoughtful",
  "thrill-seeking",
  "playful"
] as const;

export type Mood = (typeof moodOptions)[number];

export type MoodLabel = {
  mood: Mood;
  label: string;
  emoji: string;
};

export const moodLabels: readonly MoodLabel[] = [
  { mood: "cheerful", label: "开心到飞", emoji: "😁" },
  { mood: "reflective", label: "想很多", emoji: "🤔" },
  { mood: "gloomy", label: "emo了", emoji: "☹️" },
  { mood: "humorous", label: "太好笑了", emoji: "🤣" },
  { mood: "melancholy", label: "淡淡忧伤", emoji: "😶" },
  { mood: "idyllic", label: "这也太美好", emoji: "🤩" },
  { mood: "chill", label: "今天很 chill", emoji: "😎" },
  { mood: "romantic", label: "想恋爱", emoji: "🥰" },
  { mood: "weird", label: "你不对劲", emoji: "🤨" },
  { mood: "horny", label: "有点上头", emoji: "😏" },
  { mood: "sleepy", label: "快睡着了", emoji: "😪" },
  { mood: "angry", label: "别惹我", emoji: "😡" },
  { mood: "fearful", label: "有点慌", emoji: "😨" },
  { mood: "lonely", label: "一个人待着", emoji: "😢" },
  { mood: "tense", label: "压力拉满", emoji: "😬" },
  { mood: "thoughtful", label: "认真搞事", emoji: "🤓" },
  { mood: "thrill-seeking", label: "整点刺激", emoji: "🤪" },
  { mood: "playful", label: "想玩", emoji: "🙂" }
] as const;
