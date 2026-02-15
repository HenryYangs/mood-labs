"use client";

import MovieCard from "@/components/MovieCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { RecommendResponse } from "@/types/movie";
import { moodOptions, type Mood } from "@/types/mood";
import Link from "next/link";
import { useEffect, useState } from "react";

function isMood(input: string | null): input is Mood {
  if (!input) {
    return false;
  }
  return moodOptions.includes(input as Mood);
}

export default function ResultPage(): React.JSX.Element {
  const [data, setData] = useState<RecommendResponse | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const moodParam = new URLSearchParams(window.location.search).get("mood");

    async function loadRecommendation(mood: Mood): Promise<void> {
      try {
        setLoading(true);
        const response = await fetch("/api/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mood })
        });

        if (!response.ok) {
          setError("推荐服务暂时不可用，请稍后再试。");
          return;
        }

        const payload = (await response.json()) as RecommendResponse;
        setData(payload);
      } catch (_error) {
        setError("请求失败，请检查网络后重试。");
      } finally {
        setLoading(false);
      }
    }

    if (!isMood(moodParam)) {
      setError("心情参数无效，请返回重新选择。");
      setLoading(false);
      return;
    }

    void loadRecommendation(moodParam);
  }, []);

  return (
    <main className="relative mx-auto min-h-screen w-full max-w-4xl px-4 py-10">
      <div className="pointer-events-none absolute left-10 top-16 h-44 w-44 rounded-full bg-sky-200/35 blur-3xl" />
      <div className="pointer-events-none absolute right-8 top-28 h-52 w-52 rounded-full bg-violet-200/35 blur-3xl" />
      <section className="relative mx-auto max-w-2xl space-y-8">
        <div className="space-y-3 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900">Your movie match</h1>
          <p className="text-sm text-zinc-500">Curated by your current emotion and viewing rhythm.</p>
          {data ? <Badge className="bg-white/85 text-zinc-700">{data.movie.mood}</Badge> : null}
        </div>

        {loading ? (
          <Card className="bg-white/65 backdrop-blur-2xl">
            <CardContent className="space-y-4 p-6 sm:p-8">
              <Skeleton className="h-56 w-full" />
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </CardContent>
          </Card>
        ) : null}

        {!loading && error ? (
          <Card className="bg-white/65 backdrop-blur-2xl">
            <CardContent className="p-6 sm:p-8">
              <p className="text-sm text-zinc-600">{error}</p>
            </CardContent>
          </Card>
        ) : null}

        {!loading && !error && data ? (
          <div className="space-y-6">
            <MovieCard movie={data.movie} reason={data.reason} />
            <Card className="bg-zinc-100/85 backdrop-blur">
              <CardContent className="space-y-3 p-6 sm:p-8">
                <div className="flex items-center gap-2">
                  <span aria-hidden="true">✨</span>
                  <p className="text-base font-medium text-zinc-900">推荐理由</p>
                </div>
                <Separator />
                <p className="text-sm leading-relaxed text-zinc-700">{data.reason}</p>
              </CardContent>
            </Card>
          </div>
        ) : null}

        <Button asChild variant="ghost" className="w-full bg-white/70 backdrop-blur-xl">
          <Link href="/">重选情绪</Link>
        </Button>
      </section>
    </main>
  );
}
