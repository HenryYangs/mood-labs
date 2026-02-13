import type { Mood } from "./mood";

export type Movie = {
  id: string;
  title: string;
  year: number;
  genre: string;
  poster: string;
  description: string;
  mood: Mood;
};

export type RecommendResponse = {
  movie: Movie;
  reason: string;
};
