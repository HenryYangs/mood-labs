import type { Mood } from './mood';

export interface MovieInfo {
  url: string;
  rating: number;
  tag: string[];
}

export type Movie = {
  title: string;
  date?: string;
  rating?: string | number;
  source?: MovieInfo;
  duration?: string;
  reason?: string;
  id?: string;
  year?: number;
  genre?: string;
  poster?: string;
  description?: string;
  mood?: Mood;
};

export type RecommendResponse =
  | Movie[]
  | {
      movies: Movie[];
      reason?: string;
    }
  | {
      movie: Movie;
      reason: string;
    };
