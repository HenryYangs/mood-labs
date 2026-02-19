"use client";

import MoodCard from "@/components/MoodCard";
import { moodLabels, type Mood } from "@/types/mood";
import { useRouter } from "next/navigation";

export default function MoviePage(): React.JSX.Element {
  const router = useRouter();

  const onSelectMood = (mood: Mood): void => {
    router.push(`/movie/${mood}`);
  };

  return (
    <main className="relative mx-auto min-h-screen w-full max-w-4xl px-4 py-10">
      <div className="pointer-events-none absolute left-10 top-16 h-44 w-44 rounded-full bg-emerald-200/35 blur-3xl" />
      <div className="pointer-events-none absolute right-6 top-28 h-52 w-52 rounded-full bg-indigo-200/35 blur-3xl" />
      <section className="relative space-y-8">
        <div className="mx-auto max-w-2xl space-y-3 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
            Discover top-rated movies based on your mood
          </h1>
          <p className="text-sm text-zinc-500">
            Choose the emotion that best matches your current vibe.
          </p>
        </div>

        <div className="mx-auto max-w-3xl space-y-8 p-6 sm:p-8">
          <div className="grid grid-cols-3 justify-items-center gap-3">
            {moodLabels.map((option) => (
              <MoodCard
                key={option.mood}
                option={option}
                selected={false}
                onSelect={onSelectMood}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
