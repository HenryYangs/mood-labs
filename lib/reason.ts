import type { Mood } from "@/types/mood";

const reasonMap: Record<Mood, string> = {
  happy: "你现在状态很好，这部片会继续放大你的轻盈和好奇心。",
  sad: "这部片温柔但不沉重，适合在低落时给自己一点陪伴。",
  romantic: "你想感受连接与心动，这部片的情感浓度刚刚好。",
  excited: "你有很多能量，这部高节奏电影能让情绪继续释放。",
  anxious: "你需要安全感和稳定节奏，这部片会帮你慢下来。",
  calm: "你想维持平静，这部电影细腻克制，不会打破你的状态。"
};

export function buildReason(mood: Mood): string {
  return reasonMap[mood];
}
