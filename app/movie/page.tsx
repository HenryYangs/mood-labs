"use client";

import MoodCard from "@/components/MoodCard";
import MovieHeader from "@/components/MovieHeader";
import { moodLabels, type Mood } from "@/types/mood";
import { useRouter } from "next/navigation";
import "./theme.css";

export default function MoviePage(): React.JSX.Element {
  const router = useRouter();

  const onSelectMood = (mood: Mood): void => {
    router.push(`/movie/${mood}`);
  };

  return (
    <main className="movie-theme relative mx-auto min-h-screen w-full max-w-4xl px-4 py-10">
      <MovieHeader title="MoodLabs/Movie" />
      
      <section className="relative">
        <div className="text-center mb-10">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl nunito">
            跟随你的心情，邂逅高分佳片
          </h1>
          <p className="text-xl text-white/85">
            你今天心情如何？
          </p>
        </div>

        <div className="mx-auto space-y-8">
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
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
