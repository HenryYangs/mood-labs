import type { Movie } from "@/types/movie";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type MovieCardProps = {
  movie: Movie;
  reason: string;
};

export default function MovieCard({ movie }: MovieCardProps): React.JSX.Element {
  return (
    <Card className="overflow-hidden bg-white/70 backdrop-blur-xl shadow-md transition-all duration-200 hover:scale-[1.01] hover:shadow-lg">
      <CardContent className="space-y-5 p-6">
        <div className="overflow-hidden rounded-2xl bg-zinc-100/80">
          <img src={movie.poster} alt={movie.title} className="h-56 w-full object-cover" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-white/80">{movie.genre}</Badge>
          <Badge className="bg-white/80">{movie.year}</Badge>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-zinc-900">{movie.title}</h2>
          <p className="text-sm text-zinc-600">{movie.description}</p>
        </div>
        <Separator />
      </CardContent>
    </Card>
  );
}
