"use client";

import MovieHeader from "@/components/MovieHeader";
import logoBook from "@/app/assets/images/logo-book.png";
import MovieNotFound from "@/app/movie/not-found";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/app/i18n/language-context";
import { moodLabelsEn } from "@/lib/moodLabelsEn";
import { moodLabels, moodOptions, type Mood } from "@/types/mood";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import "../theme.css";

type BookRecommendation = {
  title: string;
  author: string;
  year: number;
  tags: string[];
  description: string;
  reason: string;
  ISBNCode: string;
};

function isMood(input: string | null): input is Mood {
  if (!input) {
    return false;
  }
  return moodOptions.includes(input as Mood);
}

export default function BookResultPage(): React.JSX.Element {
  const { language, isLoaded } = useLanguage();
  const params = useParams<{ mood?: string }>();
  const routeMood = params?.mood ?? null;
  const isInvalidMood = !isMood(routeMood);

  type CoverStatus = "loading" | "loaded" | "error";

  const [books, setBooks] = useState<BookRecommendation[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [coverStatuses, setCoverStatuses] = useState<Record<string, CoverStatus>>({});
  const hasInitializedRef = useRef<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const headerMoodLabel = isMood(routeMood)
    ? moodLabels.find((item) => item.mood === routeMood)
    : null;
  const headerTitle = headerMoodLabel
    ? language === "zh"
      ? `感觉 ${headerMoodLabel.emoji} ${headerMoodLabel.label}`
      : `Feeling ${headerMoodLabel.emoji} ${moodLabelsEn[headerMoodLabel.mood]}`
    : "MoodLabs/Book";

  function preloadCovers(payload: BookRecommendation[]): void {
    const newStatuses: Record<string, CoverStatus> = {};
    payload.forEach((book) => {
      if (book.ISBNCode) {
        newStatuses[book.ISBNCode] = "loading";
      }
    });
    setCoverStatuses((prev) => ({ ...prev, ...newStatuses }));

    payload.forEach((book) => {
      if (!book.ISBNCode) return;
      const img = new Image();
      img.src = `https://covers.openlibrary.org/b/isbn/${book.ISBNCode}-L.jpg`;
      img.onload = () =>
        setCoverStatuses((prev) => ({ ...prev, [book.ISBNCode]: "loaded" }));
      img.onerror = () =>
        setCoverStatuses((prev) => ({ ...prev, [book.ISBNCode]: "error" }));
    });
  }

  async function loadRecommendation(mood: Mood, append: boolean): Promise<void> {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setError("");
      }

      const history = books.map((b) => b.ISBNCode).filter(Boolean);
      const response = await fetch("/api/book-recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Language": language ?? "en",
        },
        body: JSON.stringify({ mood, ...(history.length > 0 && { history }) }),
        signal: controller.signal,
      });

      if (!response.ok) {
        if (!append) {
          const err = await response.json();
          setError(
            err.error ||
              (language === "zh"
                ? "推荐服务暂时不可用，请稍后再试。"
                : "Recommendation service is unavailable. Please try again later.")
          );
        }
        return;
      }

      const payload = (await response.json()) as BookRecommendation[];
      if (!payload.length) {
        if (!append) {
          setError(
            language === "zh"
              ? "暂无推荐结果，请稍后再试。"
              : "No recommendations found. Please try again later."
          );
        }
        return;
      }

      if (append) {
        setBooks((prev) => [...prev, ...payload]);
      } else {
        setBooks(payload);
        setCurrentIndex(0);
      }

      preloadCovers(payload);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }
      if (!append) {
        setError(
          language === "zh"
            ? "请求失败，请检查网络后重试。"
            : "Request failed. Please check your network and try again."
        );
      }
    } finally {
      if (controller.signal.aborted) {
        return;
      }
      if (append) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    if (isInvalidMood || !isLoaded) {
      return;
    }
    if (hasInitializedRef.current) {
      return;
    }
    hasInitializedRef.current = true;
    setSelectedMood(routeMood);
    void loadRecommendation(routeMood, false);
  }, [isInvalidMood, routeMood, isLoaded]);

  const currentBook = books[currentIndex];

  const showPrevBook = (): void => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const showNextBook = async (): Promise<void> => {
    if (currentIndex >= books.length - 1) return;

    const nextIndex = Math.min(books.length - 1, currentIndex + 1);
    setCurrentIndex(nextIndex);

    const remainingCount = books.length - (nextIndex + 1);
    const remainingRatio = books.length === 0 ? 0 : remainingCount / books.length;

    if (remainingRatio < 0.2 && selectedMood && !loadingMore) {
      await loadRecommendation(selectedMood, true);
    }
  };

  if (isInvalidMood) {
    return <MovieNotFound />;
  }

  return (
    <div className="book-theme">
      <main className="relative mx-auto min-h-screen w-full max-w-4xl px-4 py-10">
        <MovieHeader
          logo={logoBook}
          showChangeMoodButton
          title={headerTitle}
          changeMoodHref="/book"
          changeMoodButtonClassName="from-[#3d6e78] to-[#4e8490] hover:from-[#2f5f69] hover:to-[#3f7480]"
        />

        <section className="relative mx-auto space-y-8">
          {loading ? (
            <div className="space-y-4 rounded-2xl bg-white/65 p-6 shadow-md backdrop-blur-2xl sm:p-8">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-full" />
            </div>
          ) : null}

          {!loading && error ? (
            <div className="rounded-2xl bg-white/65 p-6 shadow-md backdrop-blur-2xl sm:p-8">
              <p className="text-sm text-zinc-600">{error}</p>
            </div>
          ) : null}

          {!loading && !error && currentBook ? (
            <div className="overflow-hidden rounded-2xl">
              <div className="space-y-5 bg-(--movie-surface) p-5">
                {currentBook.ISBNCode && coverStatuses[currentBook.ISBNCode] !== "error" ? (
                  <div className="flex justify-center">
                    {coverStatuses[currentBook.ISBNCode] === "loading" ? (
                      <Skeleton className="h-52 w-36 rounded-lg" />
                    ) : (
                      <img
                        src={`https://covers.openlibrary.org/b/isbn/${currentBook.ISBNCode}-L.jpg`}
                        alt={currentBook.title}
                        className="h-52 w-auto rounded-lg object-cover shadow-lg"
                      />
                    )}
                  </div>
                ) : null}

                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-white">{currentBook.title}</h2>
                  <div className="space-y-1 text-sm text-white/85">
                    <p>
                      {language === "zh" ? "作者" : "Author"}: {currentBook.author}
                    </p>
                    <p>
                      {language === "zh" ? "出版年份" : "Year"}: {currentBook.year}
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
                  <p className="text-sm leading-relaxed text-zinc-300">{currentBook.description}</p>
                </div>

                <div className="rounded-xl bg-white/10 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-white/50">
                    {language === "zh" ? "为什么适合你" : "Why it fits"}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-white/80">{currentBook.reason}</p>
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
                    onClick={(): void => { void showNextBook(); }}
                    disabled={currentIndex === books.length - 1 && !loadingMore || currentIndex === books.length - 1 && loadingMore}
                    className="h-12 cursor-pointer rounded-xl bg-linear-to-r from-[#3d6e78] to-[#4e8490] px-6 text-base text-white shadow-sm transition-all duration-300 hover:bg-linear-to-r hover:from-[#2f5f69] hover:to-[#3f7480] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {language === "zh" ? "下一本" : "Next"}
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
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
    </div>
  );
}
