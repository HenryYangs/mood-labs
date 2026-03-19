"use client";

import MovieCard from "@/components/MovieCard";
import MovieHeader from "@/components/MovieHeader";
import logoMovie from "@/app/assets/images/logo-movie.png";
import MovieNotFound from "../not-found";
import { useLanguage } from "@/app/i18n/language-context";
import { moodLabelsEn } from "@/lib/moodLabelsEn";
import { Skeleton } from "@/components/ui/skeleton";
import type { Movie, RecommendResponse } from "@/types/movie";
import { moodLabels, moodOptions, type Mood } from "@/types/mood";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import "../theme.css";

function isMood(input: string | null): input is Mood {
  if (!input) {
    return false;
  }
  return moodOptions.includes(input as Mood);
}

export default function MovieResultPage(): React.JSX.Element {
  const { language, isLoaded } = useLanguage();
  const params = useParams<{ mood?: string }>();
  const routeMood = params?.mood ?? null;
  const isInvalidMood = !isMood(routeMood);

  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const hasInitializedRef = useRef<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  function normalizeMovies(payload: RecommendResponse): Movie[] {
    if (Array.isArray(payload)) {
      return payload;
    }
    if ("movies" in payload) {
      return payload.movies;
    }
    return [{ ...payload.movie, reason: payload.reason }];
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

      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Language": language ?? "en",
        },
        body: JSON.stringify({ mood }),
        signal: controller.signal,
      });

      if (!response.ok) {
        if (!append) {
          const error = await response.json();

          setError(
            error.error ||
            (language === "zh"
              ? "推荐服务暂时不可用，请稍后再试。"
              : "Recommendation service is unavailable. Please try again later.")
          );
        }
        return;
      }

      const payload = (await response.json()) as RecommendResponse;
      const parsedMovies = normalizeMovies(payload);
      if (!parsedMovies.length) {
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
        setMovies((prev) => [...prev, ...parsedMovies]);
      } else {
        setMovies(parsedMovies);
        setCurrentIndex(0);
      }
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

  const currentMovie = movies[currentIndex];
  const headerMoodLabel = isMood(routeMood)
    ? moodLabels.find((item) => item.mood === routeMood)
    : null;
  const headerTitle = headerMoodLabel
    ? language === "zh"
      ? `感觉 ${headerMoodLabel.emoji} ${headerMoodLabel.label}`
      : `Feeling ${headerMoodLabel.emoji} ${moodLabelsEn[headerMoodLabel.mood]}`
    : "MoodLabs/Movie";

  const showPrevMovie = (): void => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const showNextMovie = async (): Promise<void> => {
    if (currentIndex >= movies.length - 1) {
      return;
    }

    const nextIndex = Math.min(movies.length - 1, currentIndex + 1);
    setCurrentIndex(nextIndex);

    const remainingCount = movies.length - (nextIndex + 1);
    const remainingRatio = movies.length === 0 ? 0 : remainingCount / movies.length;

    if (remainingRatio < 0.2 && selectedMood && !loadingMore) {
      await loadRecommendation(selectedMood, true);
    }
  };

  if (isInvalidMood) {
    return <MovieNotFound />;
  }

  return (
    <div className="movie-theme">
      <main className="relative mx-auto min-h-screen w-full max-w-4xl px-4 py-10">
        <MovieHeader
          logo={logoMovie}
          showChangeMoodButton
          title={headerTitle}
          changeMoodButtonClassName="from-[#b13a47] to-[#c9464f] hover:from-[#ff0030] hover:to-[#ff1a3d]"
        />
        
        <section className="relative mx-auto space-y-8">
          {loading ? (
            <div className="space-y-4 rounded-2xl bg-white/65 p-6 shadow-md backdrop-blur-2xl sm:p-8">
              <Skeleton className="h-56 w-full" />
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ) : null}

          {!loading && error ? (
            <div className="rounded-2xl bg-white/65 p-6 shadow-md backdrop-blur-2xl sm:p-8">
              <p className="text-sm text-zinc-600">{error}</p>
            </div>
          ) : null}

          {!loading && !error && movies.length ? (
            <div className="space-y-6">
              <MovieCard
                movie={currentMovie}
                currentIndex={currentIndex}
                total={movies.length}
                onPrev={showPrevMovie}
                onNext={(): void => {
                  void showNextMovie();
                }}
                disablePrev={currentIndex === 0}
                disableNext={currentIndex === movies.length - 1 || loadingMore}
              />
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
