"use client";

import MovieCard from "@/components/MovieCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Movie, RecommendResponse } from "@/types/movie";
import { moodOptions, type Mood } from "@/types/mood";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function isMood(input: string | null): input is Mood {
  if (!input) {
    return false;
  }
  return moodOptions.includes(input as Mood);
}

export default function MovieResultPage(): React.JSX.Element {
  const params = useParams<{ mood?: string }>();
  const routeMood = params?.mood ?? null;

  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const hasInitializedRef = useRef<boolean>(false);

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
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setError("");
      }

      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood })
      });

      if (!response.ok) {
        if (!append) {
          setError("推荐服务暂时不可用，请稍后再试。");
        }
        return;
      }

      const payload = (await response.json()) as RecommendResponse;
      const parsedMovies = normalizeMovies(payload);
      if (!parsedMovies.length) {
        if (!append) {
          setError("暂无推荐结果，请稍后再试。");
        }
        return;
      }

      if (append) {
        setMovies((prev) => [...prev, ...parsedMovies]);
      } else {
        setMovies(parsedMovies);
        setCurrentIndex(0);
      }
    } catch (_error) {
      if (!append) {
        setError("请求失败，请检查网络后重试。");
      }
    } finally {
      if (append) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    if (hasInitializedRef.current) {
      return;
    }
    hasInitializedRef.current = true;

    if (!isMood(routeMood)) {
      setError("心情参数无效，请返回重新选择。");
      setLoading(false);
      return;
    }

    setSelectedMood(routeMood);
    void loadRecommendation(routeMood, false);
  }, [routeMood]);

  const currentMovie = movies[currentIndex];

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

  return (
    <main className="relative mx-auto min-h-screen w-full max-w-4xl px-4 py-10">
      <div className="pointer-events-none absolute left-10 top-16 h-44 w-44 rounded-full bg-sky-200/35 blur-3xl" />
      <div className="pointer-events-none absolute right-8 top-28 h-52 w-52 rounded-full bg-violet-200/35 blur-3xl" />
      <section className="relative mx-auto max-w-2xl space-y-8">
        <div className="space-y-3 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900">Your movie match</h1>
          <p className="text-sm text-zinc-500">Curated by your current emotion and viewing rhythm.</p>
          {selectedMood ? <Badge className="bg-white/85 text-zinc-700">{selectedMood}</Badge> : null}
        </div>

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

        <Button asChild variant="ghost" className="w-full bg-white/70 backdrop-blur-xl">
          <Link href="/movie">重选情绪</Link>
        </Button>
      </section>
    </main>
  );
}
