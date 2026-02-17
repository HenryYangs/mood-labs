'use server';

import { fetchRecommendationFromDeepSeek } from '@/lib/deepseek';
import type { Movie } from '@/types/movie';
import type { Mood } from '@/types/mood';

export async function getDeepSeekRecommendationAction(
  mood: Mood,
): Promise<Movie[]> {
  return fetchRecommendationFromDeepSeek(mood);
}
