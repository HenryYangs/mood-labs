import type { Mood } from './mood';

export interface MovieInfo {
  url: string;
  rating: number;
  tag: string[];
}

export type Movie = {
  title: string;
  date: number;
  rating: string;
  source: MovieInfo;
  duration: string;
  reason: string;
};

export type RecommendResponse = {
  movies: Movie[];
  reason: string;
};
