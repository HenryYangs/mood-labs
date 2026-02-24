"use client";

import MoodCard from "@/components/MoodCard";
import { moodLabels, type Mood } from "@/types/mood";
import Image from "next/image";
import { useRouter } from "next/navigation";
import logo from "../assets/images/logo-movie.png";
import "./theme.css";

export default function MoviePage(): React.JSX.Element {
  const router = useRouter();

  const onSelectMood = (mood: Mood): void => {
    router.push(`/movie/${mood}`);
  };

  return (
    <main className="movie-theme relative mx-auto min-h-screen w-full max-w-4xl px-4 py-10">
      <header className="relative mb-8 h-16 rounded-2xl bg-(--movie-surface) px-5 shadow-sm backdrop-blur-sm">
        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl">
          <Image src={logo} alt="MoodLabs" width={32} height={32} />
        </span>
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <span className="text-xl font-semibold text-white">
            MoodLabs/Movie
          </span>
        </div>
      </header>
      
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
