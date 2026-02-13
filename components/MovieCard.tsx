import type { Movie } from "@/types/movie";

type MovieCardProps = {
  movie: Movie;
  reason: string;
};

export default function MovieCard({ movie, reason }: MovieCardProps): React.JSX.Element {
  return (
    <article className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="overflow-hidden rounded-2xl bg-gray-100">
        <img src={movie.poster} alt={movie.title} className="h-56 w-full object-cover" />
      </div>

      <h2 className="mt-4 text-xl font-semibold">{movie.title}</h2>
      <p className="mt-1 text-sm text-gray-500">
        {movie.year} · {movie.genre}
      </p>
      <p className="mt-3 text-sm text-gray-700">{movie.description}</p>

      <div className="mt-4 rounded-2xl bg-softBlue p-3">
        <p className="text-sm text-gray-700">{reason}</p>
      </div>
    </article>
  );
}
