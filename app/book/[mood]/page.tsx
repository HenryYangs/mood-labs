"use client";

import MovieHeader from "@/components/MovieHeader";
import logoBook from "@/app/assets/images/logo-book.png";
import MovieNotFound from "@/app/movie/not-found";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/app/i18n/language-context";
import { moodLabelsEn } from "@/lib/moodLabelsEn";
import { moodLabels, moodOptions, type Mood } from "@/types/mood";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import "../theme.css";

type BookRecommendation = {
  title: string;
  author: string;
  tags: string[];
  reasonZh: string;
  reasonEn: string;
};

function isMood(input: string | null): input is Mood {
  if (!input) {
    return false;
  }
  return moodOptions.includes(input as Mood);
}

function buildMockBooks(mood: Mood, language: "zh" | "en"): BookRecommendation[] {
  const moodLabel = moodLabels.find((item) => item.mood === mood);
  const displayMood = moodLabel
    ? language === "zh"
      ? `${moodLabel.emoji} ${moodLabel.label}`
      : `${moodLabel.emoji} ${moodLabelsEn[moodLabel.mood]}`
    : mood;

  return [
    {
      title: language === "zh" ? "夜航西飞" : "West with the Night",
      author: language === "zh" ? "柏瑞尔·马卡姆" : "Beryl Markham",
      tags: language === "zh" ? ["文学", "成长", "冒险"] : ["Literature", "Growth", "Adventure"],
      reasonZh: `这本书的节奏和情绪与你当前的${displayMood}状态很贴近，适合慢慢沉浸。`,
      reasonEn: `Its pacing and tone match your current ${displayMood} mood and invite a slow immersive read.`
    },
    {
      title: language === "zh" ? "小王子" : "The Little Prince",
      author: language === "zh" ? "圣埃克苏佩里" : "Antoine de Saint-Exupery",
      tags: language === "zh" ? ["经典", "治愈"] : ["Classic", "Comfort"],
      reasonZh: "轻盈但不浅薄，适合在当下情绪里找到一点温柔和清晰。",
      reasonEn: "Light yet meaningful, it helps you find warmth and clarity in this moment."
    },
    {
      title: language === "zh" ? "人类群星闪耀时" : "Decisive Moments in History",
      author: language === "zh" ? "茨威格" : "Stefan Zweig",
      tags: language === "zh" ? ["非虚构", "历史"] : ["Non-fiction", "History"],
      reasonZh: "如果你想把情绪转化成思考，这本书会给你很好的视角。",
      reasonEn: "If you want to turn emotion into reflection, this is a strong perspective builder."
    }
  ];
}

export default function BookResultPage(): React.JSX.Element {
  const { language } = useLanguage();
  const params = useParams<{ mood?: string }>();
  const routeMood = params?.mood ?? null;
  const isInvalidMood = !isMood(routeMood);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const headerMoodLabel = isMood(routeMood)
    ? moodLabels.find((item) => item.mood === routeMood)
    : null;
  const headerTitle = headerMoodLabel
    ? language === "zh"
      ? `感觉 ${headerMoodLabel.emoji} ${headerMoodLabel.label}`
      : `Feeling ${headerMoodLabel.emoji} ${moodLabelsEn[headerMoodLabel.mood]}`
    : "MoodLabs/Book";

  const books = useMemo(() => {
    if (!isMood(routeMood)) {
      return [];
    }
    return buildMockBooks(routeMood, language);
  }, [routeMood, language]);

  const currentBook = books[currentIndex];

  const showPrevBook = (): void => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const showNextBook = (): void => {
    setCurrentIndex((prev) => Math.min(books.length - 1, prev + 1));
  };

  if (isInvalidMood) {
    return <MovieNotFound />;
  }

  return (
    <main className="book-theme relative min-h-screen w-full px-4 py-10">
      <MovieHeader
        logo={logoBook}
        showChangeMoodButton
        title={headerTitle}
        changeMoodHref="/book"
        changeMoodButtonClassName="from-[#3d6e78] to-[#4e8490] hover:from-[#2f5f69] hover:to-[#3f7480]"
      />

      <section className="relative mx-auto space-y-8">
        {!currentBook ? (
          <div className="rounded-2xl bg-white/65 p-6 shadow-md backdrop-blur-2xl sm:p-8">
            <p className="text-sm text-zinc-600">
              {language === "zh"
                ? "暂时没有书籍推荐结果。"
                : "No book recommendations are available yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl">
            <div className="space-y-5 bg-(--movie-surface) p-5">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-white">{currentBook.title}</h2>
                <div className="space-y-1 text-sm text-white/85">
                  <p>
                    {language === "zh" ? "作者" : "Author"}: {currentBook.author}
                  </p>
                  <p>
                    {language === "zh" ? "进度" : "Progress"}: {currentIndex + 1}/{books.length}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {currentBook.tags.map((item) => (
                  <Badge
                    key={`${currentBook.title}-${item}`}
                    variant="outline"
                    className="border-zinc-200 bg-zinc-100 text-zinc-700"
                  >
                    {item}
                  </Badge>
                ))}
              </div>

              <div>
                <p className="text-sm leading-relaxed text-zinc-300">
                  {language === "zh" ? currentBook.reasonZh : currentBook.reasonEn}
                </p>
              </div>

              <div className="flex items-center justify-between gap-3">
                <Button
                  onClick={showPrevBook}
                  disabled={currentIndex === 0}
                  className="h-12 cursor-pointer rounded-xl bg-linear-to-r from-[#3d6e78] to-[#4e8490] px-6 text-base text-white shadow-sm transition-all duration-300 hover:bg-linear-to-r hover:from-[#2f5f69] hover:to-[#3f7480] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {language === "zh" ? "上一本" : "Previous"}
                </Button>

                <Button
                  onClick={showNextBook}
                  disabled={currentIndex === books.length - 1}
                  className="h-12 cursor-pointer rounded-xl bg-linear-to-r from-[#3d6e78] to-[#4e8490] px-6 text-base text-white shadow-sm transition-all duration-300 hover:bg-linear-to-r hover:from-[#2f5f69] hover:to-[#3f7480] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {language === "zh" ? "下一本" : "Next"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>

      <footer className="mt-10 text-center text-sm text-white/75">
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
  );
}
