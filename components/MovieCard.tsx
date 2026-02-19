import type { Movie } from "@/types/movie";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type MovieCardProps = {
  movie: Movie;
};

function getYoutubeEmbedUrl(url: string | undefined): string {
  if (!url) {
    return "";
  }

  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }
    return url;
  } catch {
    return url;
  }
}

export default function MovieCard({ movie }: MovieCardProps): React.JSX.Element {
  const embedUrl = getYoutubeEmbedUrl(movie.source?.url);
  const displayRating = movie.source?.rating ?? movie.rating ?? "N/A";
  const displayDuration = movie.duration ? `${movie.duration} min` : "N/A";
  const displayDate = movie.date ?? (movie.year ? String(movie.year) : "N/A");

  return (
    <Card className="overflow-hidden bg-white/70 backdrop-blur-xl shadow-md transition-all duration-200 hover:scale-[1.01] hover:shadow-lg">
      <CardContent className="space-y-5 p-6">
        {embedUrl ? (
          <div className="mx-auto w-full max-w-[640px] h-[380px] overflow-hidden rounded-2xl bg-zinc-100/80">
            <iframe
              src={embedUrl}
              title={`${movie.title} trailer`}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        ) : null}

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-zinc-900">{movie.title}</h2>
          <div className="space-y-1 text-sm text-zinc-600">
            <p>上映时间: {displayDate}</p>
            <p>时长: {displayDuration}</p>
            <p>评分: {displayRating}</p>
          </div>
        </div>

        {movie.source?.tag?.length ? (
          <div className="flex flex-wrap items-center gap-2">
            {movie.source.tag.map((item) => (
              <Badge key={`${movie.title}-${item}`} className="bg-zinc-100 text-zinc-700">
                {item}
              </Badge>
            ))}
          </div>
        ) : null}

        {movie.reason ? (
          <div className="rounded-2xl bg-zinc-100/85 p-4">
            <p className="text-sm leading-relaxed text-zinc-700">{movie.reason}</p>
          </div>
        ) : null}
        <Separator />
      </CardContent>
    </Card>
  );
}
