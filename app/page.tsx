"use client";

import MoodCard from "@/components/MoodCard";
import { moodLabels, type Mood } from "@/types/mood";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomePage(): React.JSX.Element {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const router = useRouter();

  const onContinue = (): void => {
    if (!selectedMood) {
      return;
    }
    router.push(`/result?mood=${selectedMood}`);
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-4 py-8">
      <h1 className="text-2xl font-bold">你现在是什么心情？</h1>
      <p className="mt-2 text-sm text-gray-600">选择一个情绪，我们会给你一部电影推荐。</p>

      <section className="mt-6 grid grid-cols-2 gap-3">
        {moodLabels.map((option) => (
          <MoodCard
            key={option.mood}
            option={option}
            selected={selectedMood === option.mood}
            onSelect={setSelectedMood}
          />
        ))}
      </section>

      <button
        type="button"
        onClick={onContinue}
        disabled={!selectedMood}
        className="mt-6 w-full rounded-3xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
      >
        获取推荐
      </button>
    </main>
  );
}
