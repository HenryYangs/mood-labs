"use client";

import MoodCard from "@/components/MoodCard";
import MovieHeader from "@/components/MovieHeader";
import logoBook from "@/app/assets/images/logo-book.png";
import { useLanguage } from "@/app/i18n/language-context";
import { moodLabelsEn } from "@/lib/moodLabelsEn";
import { moodLabels, type Mood } from "@/types/mood";
import { useRouter } from "next/navigation";
import "./theme.css";

export default function BookPage(): React.JSX.Element {
  const { language } = useLanguage();
  const router = useRouter();

  const onSelectMood = (mood: Mood): void => {
    router.push(`/book/${mood}`);
  };

  return (
    <div className="book-theme">
      <main className="relative mx-auto min-h-screen w-full max-w-4xl px-4 py-10">
        <MovieHeader logo={logoBook} title="MoodLabs/Book" />

        <section className="relative">
          <div className="text-center mb-10">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-800 md:text-5xl nunito">
              {language === "zh"
                ? "跟随你的心情，邂逅宝藏书籍"
                : "Discover great books based on your mood"}
            </h1>
            <p className="text-xl text-slate-700">
              {language === "zh"
                ? "你今天心情如何？"
                : "How are you feeling right now?"}
            </p>
          </div>

          <div className="mx-auto space-y-8">
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
              {moodLabels.map((option) => (
                <MoodCard
                  key={option.mood}
                  option={option}
                  onSelect={onSelectMood}
                  displayLabel={
                    language === "zh" ? option.label : moodLabelsEn[option.mood]
                  }
                />
              ))}
            </div>
          </div>
        </section>

        <footer className="mt-10 text-center text-sm text-slate-700/90">
          Created By{" "}
          <a
            href="https://x.com/shuzai_dd"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            shuzai_daydreaming
          </a>
          , Inspired By{" "}
          <a
            href="https://mood2movie.com"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            mood2movie.com
          </a>
          .
        </footer>
      </main>
    </div>
  );
}
