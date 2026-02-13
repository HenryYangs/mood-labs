import { moodMovieMap } from "@/lib/moodMap";
import { buildReason } from "@/lib/reason";
import type { RecommendResponse } from "@/types/movie";
import type { Mood } from "@/types/mood";

export function getRecommendation(mood: Mood): RecommendResponse {
  const movies = moodMovieMap[mood];
  const randomIndex = Math.floor(Math.random() * movies.length);
  const movie = movies[randomIndex];

  return {
    movie,
    reason: buildReason(mood)
  };
}
