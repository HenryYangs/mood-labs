"use client";

import MovieCard from "@/components/MovieCard";
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
    <main className="mx-auto min-h-screen w-full max-w-md px-4 py-8">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold">你的电影推荐</h1>
        <Link href="/" className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700">
          重选情绪
        </Link>
      </div>

      {loading ? <p className="text-sm text-gray-600">正在生成推荐...</p> : null}
      {!loading && error ? <p className="text-sm text-red-500">{error}</p> : null}
      {!loading && !error && data ? <MovieCard movie={data.movie} reason={data.reason} /> : null}
    </main>
  );
}
