'use server';

import { fetchRecommendationFromDeepSeek } from '@/lib/deepseek';
import type { Movie } from '@/types/movie';
import type { Mood } from '@/types/mood';

export async function getDeepSeekRecommendationAction(
  mood: Mood,
  language: 'en' | 'zh' = 'en',
): Promise<Movie[]> {
  return fetchRecommendationFromDeepSeek(mood, language);
}
