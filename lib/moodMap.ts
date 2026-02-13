import type { Movie } from "@/types/movie";
import type { Mood } from "@/types/mood";

type MoodMovieMap = Record<Mood, readonly Movie[]>;

export const moodMovieMap: MoodMovieMap = {
  happy: [
    {
      id: "the-secret-life-of-walter-mitty",
      title: "The Secret Life of Walter Mitty",
      year: 2013,
      genre: "Adventure / Comedy",
      poster: "https://image.tmdb.org/t/p/w500/tYI9rU4qYw3M6D0Q1fPC6NfS4l8.jpg",
      description: "一部轻松治愈的冒险电影，适合继续放大好心情。",
      mood: "happy"
    }
  ],
  sad: [
    {
      id: "little-miss-sunshine",
      title: "Little Miss Sunshine",
      year: 2006,
      genre: "Drama / Comedy",
      poster: "https://image.tmdb.org/t/p/w500/wKn7AJf5fKsP5v9nQx6ZJ5lQ4e2.jpg",
      description: "温柔又有力量，帮你把情绪慢慢拉回来。",
      mood: "sad"
    }
  ],
  romantic: [
    {
      id: "about-time",
      title: "About Time",
      year: 2013,
      genre: "Romance / Drama",
      poster: "https://image.tmdb.org/t/p/w500/igQabm9N0aN5q8X3NQ3f6f6r6p8.jpg",
      description: "温暖浪漫，适合想感受亲密关系氛围时观看。",
      mood: "romantic"
    }
  ],
  excited: [
    {
      id: "mad-max-fury-road",
      title: "Mad Max: Fury Road",
      year: 2015,
      genre: "Action / Adventure",
      poster: "https://image.tmdb.org/t/p/w500/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg",
      description: "高能节奏一路拉满，和兴奋状态非常匹配。",
      mood: "excited"
    }
  ],
  anxious: [
    {
      id: "the-intern",
      title: "The Intern",
      year: 2015,
      genre: "Comedy / Drama",
      poster: "https://image.tmdb.org/t/p/w500/9U7YHoR5x4FX3wM1P3VQwJjM9x2.jpg",
      description: "平稳温和，帮你从紧绷状态里慢慢松开。",
      mood: "anxious"
    }
  ],
  calm: [
    {
      id: "paterson",
      title: "Paterson",
      year: 2016,
      genre: "Drama",
      poster: "https://image.tmdb.org/t/p/w500/6Sxw8XqM6xg8m7gZ0uM6R4D8qJ1.jpg",
      description: "安静细腻，和想放松时的节奏非常契合。",
      mood: "calm"
    }
  ]
};
